import { pluralize, strOpt } from './util';

// Helper formatter to get the full env key from a template name
export const key = (name: string): string => `CTOR_ENSURE_${name.toUpperCase()}_DESC`;

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
 * Fetch all currently registered template functions
 * @returns A copy of the current function map
 */
export const getRegisteredTemplateFunctions = (): FunctionMap => ({ ...PREDEFINED_FUNCTIONS });

/**
 * Find function invocations within the template, only search for known functions
 * @param template Template to query
 * @param funcs Known functions to check for
 * @returns List of indices where function calls begin
 */
export const findFunctionCalls = (template: string, funcs: FunctionMap): number[] => {
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
export const replaceVariables = (template: string, vars: VariableMap) => {
  let result = template.slice();
  Object.keys(vars).forEach(varName => {
    // Replace all known variables
    result = result.slice();
    result = result.replace(new RegExp(`(?<!\\\\)\\{${varName}\\}`, 'g'), vars[varName]);
  });
  return result;
};

/**
 * Strip known escape sequences away
 * @param template Template string to substitute in
 * @param funcs Known functions to check for colon escape
 * @param vars Known variables to un-escape
 * @returns Output string with stripped escapes for colons or curly brackets
 */
export const stripEscapes = (template: string, funcs: FunctionMap, vars: VariableMap) => {
  let result = template.slice();

  // Strip all colon (arg-separator) escapes right after a function invocation
  Object.keys(funcs).forEach(func => {
    result = result.replace(new RegExp(`(?<=${func})\\\\:`, 'g'), ':');
  });

  // Strip all known variable escapes
  Object.keys(vars).forEach(varName => {
    // Remove all known variable escapes (also partial ones)
    result = result.replace(new RegExp(`\\\\\\{${varName}\\\\\\}`, 'g'), `{${varName}}`);
    result = result.replace(new RegExp(`\\{${varName}\\\\\\}`, 'g'), `{${varName}}`);
    result = result.replace(new RegExp(`\\\\\\{${varName}\\}`, 'g'), `{${varName}}`);
  });

  return result;
};

/**
 * Escape a string's critical symbols so that it can be used
 * within another function
 * @param input Input string to be escaped
 * @returns String safe to be used within another function
 */
export const escapeFunctionResult = (input: string, funcs: FunctionMap, vars: VariableMap) => {
  let result = input.slice();

  // Escape colon (arg-separator) right after a function invocation
  Object.keys(funcs).forEach(func => {
    result = result.replace(new RegExp(`(?<=${func}):`, 'g'), '\\:');
  });

  // Escape unescaped quotes
  result = result.replace(new RegExp('(?<!\\\\)"', 'g'), '\\"');

  // Escape curly brackets from variables
  Object.keys(vars).forEach(varName => {
    result = result.replace(new RegExp(`(?<!\\\\)\\{${varName}(?!\\\\)\\}`, 'g'), `\\{${varName}\\}`);
  });

  return result;
};

/**
 * Process a function on the template string and return the result
 * @param defInd Index within template where the function starts
 * @param template Current state of the template
 * @param vars Variables to be used as function parameters
 * @param funcs Functions that are available for this template
 * @returns New template, after evaluating this function
 */
export const processFunction = (defInd: number, template: string, vars: VariableMap, funcs: FunctionMap): string => {
  let result = template.slice();

  // Beginning of arguments is after first :, relative to definition
  const argsBegin = result.indexOf(':', defInd) + 1;

  // Figure out function name, between start and :
  const name = result.substring(defInd, argsBegin - 1);

  let argBuf = ''; // Argument buffer collecting characters over time
  const args = []; // List of arguments, filled by argBuf
  let inStr = false; // Whether or not currently within a string
  let varBegin = null; // Current variable begin, null means not within one
  let endInd = defInd; // Index of function completion, start=end for now
  let wasArgVar = false; // Flag if last substitution was a argument variable

  // Iterate till furthest possible point: EOL
  for (let i = argsBegin; i < result.length; i += 1) {
    const curr = result[i];
    
    const isEscaped = i !== 0 && result[i - 1] === '\\'; // Has current char been escaped? (prev was \)
    const isStrDelim = curr === '"' && !isEscaped; // Is current char a non-escaped string delimiter?
    const isVarBegin = curr === '{' && !isEscaped; // Is current char a non-escaped variable begin?

    // Set variable begin to current index
    if (isVarBegin)
      varBegin = i;

    // Filter out no longer needed string delimiters from arguments
    if (!isStrDelim)
      argBuf += curr;

    // Unescape symbols
    if (!inStr && (curr === ':' || curr === '"') && isEscaped)
      argBuf = argBuf.substring(0, argBuf.length - 2) + argBuf.substring(argBuf.length - 1, argBuf.length);

    if (
      // Ignore if within variable processing
      !varBegin &&

      // Argument separator reached that is not inside string or variable
      ((curr === ':' && !inStr && !isEscaped) ||

      // OR EOL and not in variable
      (i === result.length - 1))
    ) {
      // Remove separator from buffer if not EOL
      if (i !== result.length - 1)
        argBuf = argBuf.substring(0, argBuf.length - 1);

      // Set new possible end
      endInd = i;

      // Push and reset, if argument wasn't a variable
      if (!wasArgVar) {
        args.push(argBuf);
        argBuf = '';
      }
    }

    // A variable that has been started ends now
    if (varBegin !== null && curr === '}') {
      // Variable name is from begin + 1 to current - 1
      const varName = (result.substring(varBegin + 1, i));

      // Find the variable by it's name
      let val = vars[varName];

      // Unknown variable call, leave as is
      if (val === undefined)
        val = `{${varName}}`;

      // Escaped variable call, print escaped
      else if (isEscaped)
        val = `\\{${varName}}`;

      const strVal = String(val);

      // Substitute variable in input string
      result = result.substring(0, varBegin) + strVal + result.substring(i + 1, result.length);

      // Next iteration will pick up right after variable substitution
      i = varBegin + strVal.length - 1;

      // Variable done
      varBegin = null;

      // Variable as function-argument has been substituted
      if (!inStr) {
        // Clear argument buffer (holds placeholder)
        argBuf = '';

        // Push actual value
        args.push(val);

        // Set flag
        wasArgVar = true;
      }
      
      // Variable as plain text has been substituted, just replace in argument buffer
      else {
        argBuf = argBuf.substring(0, argBuf.length - (varName.length + 2)) + strVal;
      }

      // Set new possible end
      endInd = i;
      continue;
    }

    // Flip on string delim
    inStr = inStr !== isStrDelim;

    // Clear flags
    wasArgVar = false;
  }

  // Find the function by it's name
  const func = funcs[name];

  // This function is unknown, return untouched input
  if (!func)
    return template;

  // Return input, where function invocation is substituted for function result
  // Every function needs to escape it's own result, to avoid re-interpret
  return result.substring(0, defInd) + escapeFunctionResult(func(...args), funcs, vars) + result.substring(endInd + 1, result.length);
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
  findFunctionCalls(templateString, knownFunctions).forEach((defInd) => {
    templateString = processFunction(defInd, templateString, knownVariables, knownFunctions);
  });

  templateString = replaceVariables(templateString, knownVariables);
  templateString = stripEscapes(templateString, knownFunctions, knownVariables);

  // Return final template after replacing all non-function variables too
  return templateString;
};