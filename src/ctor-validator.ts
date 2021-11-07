import { CtorEnsureArgError } from '.';
import { getActiveControls, classRegistry, validateClassCtor } from './ctor-ensure.decorator';

/**
 * Validate a constructor from the k-v pairs of a plain object
 * @param className Schema name
 * @param value Plain object containing contructor fields
 * @param templateLang Language to use for rendering ensure templates
 * @returns List of errors
 */
const validateCtor = (className: string, value: any, templateLang = ''): CtorEnsureArgError[] | null => {
  // Find target class
  const clazz = classRegistry[className]?.clazz;
  if (!clazz) return null;

  // Get all controls of this class and find the highest validated ctor index
  const ctls = getActiveControls(clazz, className, []);
  const maxCtorInd = ctls.reduce((acc, curr) => (curr.ctorInd > acc ? curr.ctorInd : acc), 0);

  // Constructor arguments list, map value fields to their indices
  const ctorArgs = new Array(maxCtorInd + 1).fill(undefined);
  ctls.forEach(ctl => {
    const currValue = value[ctl.displayName];
    ctorArgs[ctl.ctorInd] = currValue;
  });

  // Call validation
  return validateClassCtor(className, ctorArgs, templateLang);
};

export default validateCtor;