import { template } from '../../description-template.factory';
import { escapeRegExp } from '../../util';
import { ValidationConfig } from '../../validation-config.interface';

/**
 * Find all string values of a provided enum and make them regex safe
 * @param values Enum type
 * @returns All string values of this enum, escaped
 */
export const enumValues = (values: { [key: string]: any }) => Object.keys(values).filter(it => Number.isNaN(Number(it))).map(it => escapeRegExp(it));

/**
 * Find all number keys of a provided enum
 * @param values Enum type
 * @returns All number keys of this enum
 */
export const enumKeys = (values: { [key: string]: any }) => Object.keys(values).filter(it => !Number.isNaN(Number(it))).map(it => Number.parseInt(it, 10));

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a member of an enum
 * @param values Enum to be checked against
 * @param useKeys If true, the enum keys (numeric) will be used, otherwise it'll be the string values
 */
export const ENSURE_ENUM = (values: { [key: string]: string | number }, useKeys = false): ValidationConfig => {
  const vals: any[] = useKeys ? enumKeys(values) : enumValues(values);
  return {
    description: template('ENSURE_ENUM', {
      numValues: vals.length,
      multiple: vals.length > 1,
      values: vals.join(', '),
    }),
    process: (value) => ({
      error: !(vals.includes(value) || value === ''),
      value,
    }),
  };
};