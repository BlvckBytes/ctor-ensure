import { template } from '..';
import CtorEnsureArgError from '../ctor-ensure-arg-error.interface';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationControl } from '../validation-control.interface';

/**
 * Find duplicate strings in an array
 * @param input Input string array to check
 * @param ignoreCase Whether or not to ignore casing
 * @returns First duplicate word or null
 */
export const findArrayDuplicate = (input: string[], ignoreCase: boolean) => {
  // Check for duplicates
  const list: string[] = [];
  for (let i = 0; i < input.length; i += 1) {
    let curr = input[i];
    if (ignoreCase) curr = curr.toLocaleLowerCase();
    if (list.includes(curr)) return input[i];
    list.push(curr);
  }

  return null;
};

/**
 * Validates that there are no duplicate values
 */
export const STAGE_ISUNIQUE = (
  _controls: ValidationControl[],
  _ctorArgs: any[],
  _currConfig: ValidationConfig,
  currControl: ValidationControl,
  currArg: any,
): CtorEnsureArgError | null => {
  // Nothing to validate
  if (!currControl.flags.isUnique)
    return null;

  // Is an array and there are duplicates
  // Or is a string and there are duplicates
  const strDup = currControl.flags.isArray ? null : findArrayDuplicate(currArg.split(' '), currControl.flags.ignoreCasing);
  const arrDup = currControl.flags.isArray ? findArrayDuplicate(currArg, currControl.flags.ignoreCasing) : null;
  if (arrDup || strDup) {
    return {
      field: currControl.displayName,
      description: template('STAGE_ISUNIQUE', {
        isArr: currControl.flags.isArray,
        dup: arrDup || strDup,
      }),
      value: currArg,
    };
  }

  // No errors
  return null;
};