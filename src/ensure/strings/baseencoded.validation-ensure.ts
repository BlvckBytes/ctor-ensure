import { template } from '../../description-template.factory';
import { ValidationConfig } from '../../validation-config.interface';

// Known base encodings
export enum Encoding {
  BASE32 = 1,
  BASE58,
  BASE64,
}

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is only containing base X encoded data
 * @param encoding Encoding base to be allowed
 */
export const ENSURE_BASEENCODED = (encoding: Encoding): ValidationConfig => {
  let pattern: RegExp;
  switch (encoding) {
    case Encoding.BASE32:
      pattern = /^(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}={6}|[A-Z2-7]{4}={4}|[A-Z2-7]{5}={3}|[A-Z2-7]{7}=)?$/;
      break;

    case Encoding.BASE64:
      pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      break;

    case Encoding.BASE58:
      pattern = /^[A-HJ-NP-Za-km-z1-9]*$/;
      break;

    default:
      throw new Error('Unsupported base!');
  } 

  return {
    description: template('ENSURE_BASEENCODED', {
      base: (Encoding[encoding]).toUpperCase(),
    }),
    process: (value) => ({
      error: !pattern.test(value),
      value,
    }),
  };
};

