import { template } from '..';
import { escapeRegExp } from '../util';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Find all string keys of a provided enum and make them regex safe
 * @param values Enum type
 * @returns All string keys of this enum, escaped
 */
export const enumValues = (values: { [key: string]: any }) => Object.keys(values).filter(it => Number.isNaN(Number(it))).map(it => escapeRegExp(it));

export const enumKeys = (values: { [key: string]: any }) => Object.keys(values).filter(it => !Number.isNaN(Number(it))).map(it => Number.parseInt(it, 10));

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a member of an enum
 * @param values Enum to be checked against
 * @param useKey If true, the enum keys (numeric) will be used, otherwise it'll be the string values
 */
export const ENSURE_ENUM = (values: { [key: string]: any }, useKey = false): ValidationConfig => {
  const vals = useKey ? enumKeys(values) : enumValues(values);

  return {
    pattern: new RegExp(`^${vals.join('|')}$`),
    description: template('ENSURE_ENUM', {
      numValues: vals.length,
      multiple: vals.length > 1,
      values: vals.join(', '),
    }),
  };
};