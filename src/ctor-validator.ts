import { Constructable, CtorEnsureArgError, META_KEY_DISPLAYNAME } from '.';
import { getActiveControls, classRegistry, validateClassCtor } from './ctor-ensure.decorator';

/**
 * Extract all constructor arguments form a plain object
 * @param clazz Class to get constructor args from
 * @param value Plain object to extract from
 * @returns List of arguments in right order
 */
export const argsFromObj = (clazz: Constructable, value: any): any[] | null => {
  // Get all controls of this class and find the highest validated ctor index
  const className = Reflect.getOwnMetadata(META_KEY_DISPLAYNAME, clazz);

  // Not a @CtorEnsure class
  if (!className) return null;

  const ctls = getActiveControls(clazz, className, []);
  const maxCtorInd = ctls.reduce((acc, curr) => (curr.ctorInd > acc ? curr.ctorInd : acc), 0);

  // Constructor arguments list, map value fields to their indices
  const ctorArgs = new Array(maxCtorInd + 1).fill(undefined);
  ctls.forEach(ctl => {
    const currValue = value[ctl.displayName];
    ctorArgs[ctl.ctorInd] = currValue;
  });

  return ctorArgs;
};

/**
 * Validate a constructor from the k-v pairs of a plain object
 * @param className Schema name
 * @param value Plain object containing contructor fields
 * @param templateLang Language to use for rendering ensure templates
 * @returns List of errors
 */
export const validateCtor = (className: string, value: any, templateLang = ''): CtorEnsureArgError[] | null => {
  // Find target class
  const clazz = classRegistry[className]?.clazz;
  if (!clazz) return null;

  const args = argsFromObj(clazz, value);
  if (!args) return null;

  // Call validation
  return validateClassCtor(className, args, templateLang);
};