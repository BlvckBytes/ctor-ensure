import { CtorEnsureArgError, CtorEnsureException } from '.';
import { getActiveControls, registry } from './ctor-ensure.decorator';

const validateCtor = (className: string, value: any): CtorEnsureArgError[] | null => {
  // Find target class
  const Target = registry[className];
  if (!Target) return null;

  // Get all controls of this class and find the highest validated ctor index
  const ctls = getActiveControls(Target, className, []);
  const maxCtorInd = ctls.reduce((acc, curr) => (curr.ctorInd > acc ? curr.ctorInd : acc), 0);

  // Constructor arguments list, map value fields to their indices
  const ctorArgs = new Array(maxCtorInd + 1).fill(undefined);
  ctls.forEach(ctl => {
    const currValue = value[ctl.displayName];
    if (!currValue) return;
    ctorArgs[ctl.ctorInd] = currValue;
  });

  // Try to instantiate a class, return errors on throw
  try {
    // eslint-disable-next-line no-new
    new Target(...ctorArgs);
  } catch (err) {
    if (err instanceof CtorEnsureException)
      return err.errors;
  }

  // No errors occurred
  return [];
};

export default validateCtor;