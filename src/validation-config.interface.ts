import { FieldType } from './field-type.enum';

/**
 * Configuration of a validation chain element
 */
export interface ValidationConfig {
  // Regex pattern to run against string representation
  pattern?: RegExp;

  // Type validation
  type?: FieldType;

  // Description of this validator
  description: string;

  // Negate validation result
  negate?: boolean;

  // Own value equals to every provided field's value
  equalsToFields?: string[];
}
