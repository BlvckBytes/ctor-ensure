import { pluralize, strOpt } from './util';

// Helper formatter to get the full env key from a template name
const key = (name: string): string => `CTOR_ENSURE_${name.toUpperCase()}_DESC`;

// A template function is a function that takes any
// number of arguments and returns a string
export type TemplateFunction = (...args: any[]) => string;

// A map of functio name to function reference
export type FunctionMap = { [key: string]: TemplateFunction };

// A map of variable name to variable value
export type VariableMap = { [key: string]: any };

// Default functions that are always available
const PREDEFINED_FUNCTIONS: FunctionMap = {
  opt: strOpt,
  plur: pluralize,
};

/**
 * Register a new function to be available globally inside all templates
 * @param name Name of the function inside template
 * @param func Reference to function
 */
export const registerTemplateFunction = (name: string, func: TemplateFunction) => {
  PREDEFINED_FUNCTIONS[name] = func;
};

/**
 * Find function invocations within the template, only search for known functions
 * @param template Template to query
 * @param funcs Known functions to check for
 * @returns List of indices where function calls begin
 */
const findFunctionCalls = (template: string, funcs: FunctionMap): number[] => {
  const calls: number[] = [];

  // Function names sorted by length ascending to have shortest name as first element
  const funcNames = Object.keys(funcs).sort(it => it.length);

  // Iterate from tail to head, optimizing by subtracting shortest name form tail
  // adding two to it's length, because of arg separator and value delimiter
  for (let i = template.length - (funcNames[0].length + 2); i >= 0; i -= 1) {

    // Iterate all known functions
    for (let j = 0; j < funcNames.length; j += 1) {
      // Beginning of a function invocation is <name>:
      const funcBegin = `${funcNames[j]}:`;

      if (
        // Check if function name and arg separator are found in conjunction starting from i
        funcBegin.split('').every((v, ci) => template[i + ci] === v) &&
        // AND followed by either string delimiter " or var begin {
        (template[i + funcBegin.length] === '"' || template[i + funcBegin.length] === '{')
      ) {
        calls.push(i);
        break;
      }
    }
  }

  return calls;
};

/**
 * Substitute known variable placeholders or remove escape sequences
 * @param template Template string to substitute in
 * @param vars Known variables to apply
 * @returns Output string with changed placeholders
 */
const replaceVariables = (template: string, vars: VariableMap) => {
  let result = template.slice();
  Object.keys(vars).forEach(varName => {
    // Replace all known variables
    // Search: <no-backslash or linestart><{varname<no-backslash>}
    // Replace: <before><val><after>
    result = result.replace(new RegExp(`([^\\\\]+|^)\\{${varName}([^\\\\]*)\\}`), `$1${vars[varName]}$2`);

    // Remove all known variable escapes
    // Search: <backslash?>{varname<backslash?>}
    // Replace: {varname}
    result = result.replace(new RegExp(`\\\\*\\{${varName}\\\\*\\}`), `{${varName}}`);
  });

  return result;
};

/**
 * Strip known escape sequences away
 * @param template Template string to substitute in
 * @returns Output string with no more known escapes
 */
const stripEscapes = (template: string) => template.replace('\\:', ':');

/**
 * Process a function on the template string and return the result
 * @param defInd Index within template where the function starts
 * @param template Current state of the template
 * @param vars Variables to be used as function parameters
 * @param funcs Functions that are available for this template
 * @returns New template, after evaluating this function
 */
const processFunction = (defInd: number, template: string, vars: VariableMap, funcs: FunctionMap): string => {
  let result = template.slice();

  // Beginning of arguments is after first :, relative to definition
  const argsBegin = result.indexOf(':', defInd) + 1;

  // Figure out function name, between start and :
  const name = result.substring(defInd, argsBegin - 1);

  let argBuf = ''; // Argument buffer collecting characters over time
  const args = []; // List of arguments, filled by argBuf
  let inStr = false; // Whether or not currently within a string
  let varBegin = null; // Current variable begin, null means not within one
  let wasVar = false; // Whether or not previous iteration has ended a variable
  let endInd = defInd; // Index of function completion, start=end for now

  // Iterate till furthest possible point: EOL
  for (let i = argsBegin; i < result.length; i += 1) {
    const curr = result[i];
    
    const isEscaped = i !== 0 && result[i - 1] === '\\'; // Has current char been escaped? (prev was \)
    const isStrDelim = curr === '"' && !isEscaped; // Is current char a non-escaped string delimiter?
    const isVarBegin = curr === '{' && !isEscaped; // Is current char a non-escaped variable begin?
    const isVarEnd = curr === '}' && !isEscaped; // Is current char a non-escaped variable end?

    // Set variable begin to current index
    if (isVarBegin)
      varBegin = i;

    // Escaped known delimiter, remove escape character from buffer
    if (isEscaped && (curr === '"' || curr === '{' || curr === '}' || curr === ':'))
      argBuf = argBuf.substring(0, argBuf.length - 1);

    // Filter out no longer needed string delimiters from arguments
    // If previous iteration was a variable end, don't append, since
    // the loop now has been set back to the last character of the substitution
    // and the substitution has already been pushed separately
    if (!isStrDelim && !wasVar)
      argBuf += curr;

    if (
      // About to exit a string or variable
      (inStr && isStrDelim || wasVar ) &&
      // AND not at EOL
      i !== result.length - 1 && 
      // AND next char is not an argument separator
      result[i + 1] !== ':' ||
      // OR the EOL has been reached, which wasn't a variable (because that's already pushed)
      (i === result.length - 1 && !isVarEnd)
    ) { 
      // Push last value from buffer
      if (argBuf !== '') args.push(argBuf);

      // Add one to function end for current known delimiter ("{}) if not EOL
      endInd = i + (i === result.length - 1 ? 0 : 1);

      // If EOL has been reched, add one to avoid substring leakage
      if (endInd === result.length - 1) endInd += 1;

      // Function is done
      break;
    }

    // Argument separator reached that is not inside string or variable and
    if (!inStr && !varBegin && curr === ':' && !isEscaped) {
      // Push only if not empty
      if (argBuf.length > 1)
        // Remove separator from buffer
        args.push(argBuf.substring(0, argBuf.length - 1));

      // Reset buffer
      argBuf = '';
    }

    // A variable that has been started ends now
    if (varBegin !== null && isVarEnd) {
      // Variable name is from begin + 1 to current - 1
      const varName = (result.substring(varBegin + 1, i));

      // Find the variable by it's name
      const val = vars[varName];
      if (!val) throw Error(`Could not find variable ${varName}!`);

      // Get string representation of it
      const strVal = String(val);

      // Substitute variable in input string
      result = result.substring(0, varBegin) + strVal + result.substring(i + 1, result.length);

      // Set the loop back to the variable begin, plus the substituted value length
      // minus 2, 1 because the variable started at varBegin and 1 to make the next
      // iteration occurr within no known delimiters (for all mechanisms to work)
      i = varBegin + strVal.length - 2;

      // Variable done
      varBegin = null;

      // Variable as function-argument has been substituted
      if (!inStr) {
        // Clear argument buffer (placeholder)
        argBuf = '';

        // Push actual value
        args.push(val);

        // Set flag
        wasVar = true;
      }
      
      // Variable as plain text has been substituted, just replace in argument buffer
      else {
        argBuf = argBuf.substring(0, argBuf.length - (varName.length + 2)) + strVal.substring(0, strVal.length - 1);
      }

      // Pick up at re-set i index
      continue;
    }

    // Flip on string delim
    inStr = inStr !== isStrDelim;

    // Clear flag, since it's just ment for one iteration
    wasVar = false;
  }

  // Loop done - all variables have been substituted and all arguments
  // as well as the end of function are known

  // Find the function by it's name
  const func = funcs[name];
  if (!func) throw Error("Could not find target function!");

  // Return input, where function invocation is substituted for function result
  return result.substring(0, defInd) + func(...args) + result.substring(endInd, result.length);
};

/**
 * Get the rendered template from a environment variable
 * @param name Name of the template
 * @param vars Variables that need to be available
 * @param funcs Custom added functions
 * @returns Rendered template with all functions and variables substituted
 */
export const template = (
  name: string,
  vars: VariableMap | null = null,
  funcs: FunctionMap | null = null,
): string => {
  let templateString = process.env[key(name)] as string;

  // Template unknown
  if (!templateString)
    throw new SyntaxError(`The template ${key(name)} is not registered as an ENV-VAR!`);

  // Add custom functions to predefined functions
  const knownFunctions = {
    ...funcs, ...PREDEFINED_FUNCTIONS,
  };

  const knownVariables = { ...vars };

  // Find all function calls and process them
  findFunctionCalls(templateString, knownFunctions).forEach(defInd => {
    templateString = processFunction(defInd, templateString, knownVariables, knownFunctions);
  });

  templateString = replaceVariables(templateString, knownVariables);
  templateString = stripEscapes(templateString);

  // Return final template after replacing all non-function variables too
  return templateString;
};