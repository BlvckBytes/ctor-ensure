import { CtorEnsureArgError, CtorEnsureException, evalStrThunk, ValidationConfig } from '../src';

/**
 * Execute a ensure and retrieve a list of it's ensure-arg errors
 * @param ensure Ensure to execute
 * @param value Value to execute it against
 * @param otherControls Neighbor controls, for real-case scenario mocks
 * @returns List of ensure-arg errors that occurred
 */
export const executeEnsure = (ensure: ValidationConfig, value: any, otherControls: { [key: string]: any} = {} ) => {
  // Dummy controls, having ensure as first control, named test
  const controls = [
    {
      displayName: 'test',
      ctorInd: 0,
      configs: [ensure],
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
    });
    ctor.push(otherControls[key]);
  });

  // List of errors that occurred
  const errors: CtorEnsureArgError[] = [];

  // Validate whole config chain from top to bottom
  for (let i = 0; i < controls[0].configs.length; i += 1) {
    const currConfig = controls[0].configs[i];

    // Validate all values individually (to support arrays)
    const values: any[] = Array.isArray(value) ? value : [value];

    for (let j = 0; j < values.length; j += 1) {
      const currValue = values[j];
      const res = currConfig.process(currValue, controls, ctor, controls[0], value);

      if (!res) {
        errors.push({
          field: controls[0].displayName,
          description: evalStrThunk(currConfig.description),
          value: currValue,
        });
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
 * @returns True if found, false otherwise
 */
export const checkEnsureArgError = (description: string, value: any) => (errors: CtorEnsureArgError[]) => errors?.some(it => it.description === description && it.value === value);

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