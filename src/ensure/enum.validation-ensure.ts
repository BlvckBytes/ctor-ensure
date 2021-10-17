import { template } from '..';
import { escapeRegExp } from '../util';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Find all string keys of a provided enum and make them regex safe
 * @param values Enum type
 * @returns All string keys of this enum, escaped
 */
export const enumValues = (values: { [key: string]: any }) => Object.keys(values).filter(it => Number.isNaN(Number(it))).map(it => escapeRegExp(it));

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Ensure this field is a number of type integer
 */
export const ENSURE_ENUM: ValidationEnsure = (values: { [key: string]: any }): ValidationConfig => {
  const vals = enumValues(values);

  return {
    pattern: new RegExp(`^${vals.join('|')}$`),
    description: template('ENSURE_ENUM', {
      numValues: vals.length,
      multiple: vals.length > 1,
      values: vals.join(', '),
    }),
  };
};