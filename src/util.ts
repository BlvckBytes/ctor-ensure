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
 * Evaluates a string thunk bei either calling it, if it's a
 * function, or returning it's immediate value
 * @param thunk Either a thunk returning a string or a string value
 * @param args Arguments to be passed to the thunk
 * @returns Evaluated string value
 */
export const evalStrThunk = (thunk: ((...args: any[]) => string) | string, ...args: any[]): string => typeof thunk === 'function' ? thunk(...args) : thunk;

/**
 * Escape a string to be used within a regular expression safely
 * @param val String to escape
 * @returns Regex-safe string
 */
export const escapeRegExp = (val: string) => val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
