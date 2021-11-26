import { argsFromObj, Constructable, META_KEY_DISPLAYNAME, template } from '.';
import { TemplateParameters } from './description-template.factory';

/**
 * Make a string optional, which means it'll be empty when the
 * condition didin't evaluate to true
 * @param str String to optionalize
 * @param state Condition
 * @returns Original string or empty string
 */
export const strOpt = (str: string, state: boolean): string => state ? str : '';

/**
 * Pluralize a word, based on the corresponding count. Also
 * gets rid of all spaces on the right to properly append
 * @param word Word in singular form
 * @param num Count of type the word describes
 * @param suf Suffix for plural, defaults to s
 * @returns Pluralized word
 */
export const pluralize = (word: string, num: number, suf = 's'): string => `${word.trimRight()}${strOpt(suf, num !== 1)}`;

/**
 * Shorthand to use a ternary operator on two string parameters
 * @param state Boolean representing state
 * @param ifTrue String for true state
 * @param ifFalse String for false state
 * @returns Either one of the strings
 */
export const ternaryString = (state: boolean, ifTrue: string, ifFalse: string): string => state ? ifTrue : ifFalse;

/**
 * Evaluates an ensure's description to a string value
 * Input can be either a string thunk, an immediate string or a template
 * @param desc Input to evaluate
 * @param templateLang Language to evaluate the template in
 * @returns Evaluated string value
 */
export const evalDesc = (input: (() => string) | string | TemplateParameters, templateLang = ''): string => {
  // String thunk
  if (typeof input === 'function') return input();

  // Template
  if (typeof input === 'object')
    return template(
      input.name, input.vars, input.funcs, templateLang,
    );

  // Immediate value
  return input;
};

/**
 * Escape a string to be used within a regular expression safely
 * @param val String to escape
 * @returns Regex-safe string
 */
export const escapeRegExp = (val: string) => val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Find the last (highest) super-class prototype, starting from a
 * derived class constructor function
 * @param clazz Derived class to start from
 * @returns Prototype of superclass or undefined when there's no inheritance
 */
export const getLastSuperclassProto = (clazz: Constructable) => {
  const protos = [];
  let curr = clazz;

  // Crawl till' end
  do {
    protos.push(curr);
    curr = Object.getPrototypeOf(curr);
  } while (curr !== null);

  // Get the previous of last, since last is the
  // object prototype (last in chain)
  return protos[protos.length - 2];
};

/**
 * Create a validated class instance from a plain object's keys
 * @param Clazz Clazz to create
 * @param obj Object to extract from
 */
export const fromObj = (Clazz: Constructable, obj: any) => {
  const args = argsFromObj(Clazz, obj);
  if (!args) throw new Error('Class is not marked by @CtorEnsure!');
  return new Clazz(...args);
};

/**
 * Check whether or not a given class is marked by @CtorEnsure
 * @param Clazz Class to test
 */
export const isCtorEnsured = (Clazz: Constructable) => Reflect.getMetadata(META_KEY_DISPLAYNAME, Clazz) !== undefined;