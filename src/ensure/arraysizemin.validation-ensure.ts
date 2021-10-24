import { ValidationConfig, ENSURE_ARRAYSIZE } from '..';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field has a min length, if it's an array, ignore otherwise
 * @param min Mininum amount of elements inside array
 */
const ENSURE_ARRAYSIZEMIN = (min: number): ValidationConfig => ENSURE_ARRAYSIZE(min, -1);

export default ENSURE_ARRAYSIZEMIN;