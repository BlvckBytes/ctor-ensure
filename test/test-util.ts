import { CtorEnsureArgError, CtorEnsureException, evalDesc, ValidationConfig, ValidationControl } from '../src';
import Optionality from '../src/optionality.enum';

/**
 * Execute a ensure and retrieve a list of it's ensure-arg errors
 * @param ensure Ensure to execute
 * @param value Value to execute it against
 * @param otherControls Neighbor controls, for real-case scenario mocks
 * @returns List of ensure-arg errors that occurred
 */
export const executeEnsure = (ensure: ValidationConfig, value: any, otherControls: { [key: string]: any} = {}) => {
  // Dummy controls, having ensure as first control, named test
  const controls: ValidationControl[] = [
    {
      displayName: 'test',
      ctorInd: 0,
      configs: [ensure],
      optional: Optionality.REQUIRED,
    },
  ];

  // Dummy constructor, having value as first key
  const ctor = [value];

  // Register other "dummy" controls with their values
  Object.keys(otherControls).forEach((key, i) => {
    controls.push({
      displayName: key,
      ctorInd: i + 1,
      configs: [],
      optional: Optionality.REQUIRED,
    });
    ctor.push(otherControls[key]);
  });

  // List of errors that occurred
  const errors: CtorEnsureArgError[] = [];

  // Validate whole config chain from top to bottom
  for (let i = 0; i < controls[0].configs.length; i += 1) {
    const currConfig = controls[0].configs[i];

    // Validate all values individually (to support arrays)
    // Call this loop at least once, even if the provided array is empty
    // In that case, the current value will be null, of course, but
    // ensures that just care about the array will be invoked
    const values: any[] = Array.isArray(value) ? value : [value];
    for (let j = 0; j < Math.max(1, values.length); j += 1) {
      const currValue = values.length > 0 ? values[j] : null;
      const res = currConfig.process(currValue, controls, ctor, controls[0], value);

      if (res.error) {
        const err = {
          field: controls[0].displayName,
          description: evalDesc(currConfig.description),
          value: res.value,
        };

        // Unique-ify list
        if (!errors.some(
          it => it.field === err.field && // Same field
          it.description === err.description && // Same description
          JSON.stringify(it.value) === JSON.stringify(err.value), // Same value
        ))
          errors.push(err);
      }
    }
  }

  return errors;
};

/**
 * To be used in conjunction with satisfy() from chai, to check the
 * valid existence of an ensure-arg error
 * @param description Expected description of the error
 * @param value Value that is causing this error
 * @param size Expected size of errors array, defaults to 1
 * @returns True if found, false otherwise
 */
export const checkEnsureArgErrors = (description: string, value: any, size = 1) => (errors: CtorEnsureArgError[]) => errors.length === size && errors?.some(it => it.description === description && it.value === value);

/**
 * To be used in conjunction with satisfy() from chai, to check if
 * the thrown exception contains all target fields
 * @param displayname Displayname of throwing model
 * @param fields Target fields to look for
 * @returns True if all are found, false otherwise
 */
export const checkExceptionHasFields = (displayname: string, fields: string[]) => (ex: CtorEnsureException) => 
  // Matching displayname
  ex.displayName === displayname &&
  // Check if there are as many different fields as provided in the fields array
  ex.errors.reduce((acc, curr) => acc.some(it => it.field === curr.field) ? acc : [...acc, curr], <CtorEnsureArgError[]>[]).length === fields.length &&
  // Fields occur
  fields.every(field => ex.errors.some(err => err.field === field));

let lastModel = 0;
/**
 * Generate a unique model name
 * @returns Unique model name
 */
export const genModelName = () => {
  lastModel += 1;
  return `test-model-${lastModel}`;
};