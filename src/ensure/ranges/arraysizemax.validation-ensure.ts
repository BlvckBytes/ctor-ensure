import { ValidationConfig } from '../../validation-config.interface';
import ENSURE_ARRAYSIZE from './arraysize.validation-ensure';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field has a max length, if it's an array, ignore otherwise
 * @param max Maximum amount of elements inside array
 */
const ENSURE_ARRAYSIZEMAX = (max: number): ValidationConfig => ENSURE_ARRAYSIZE(-1, max);

export default ENSURE_ARRAYSIZEMAX;