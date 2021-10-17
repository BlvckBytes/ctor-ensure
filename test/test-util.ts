import { CtorEnsureArgError, ValidationConfig, ValidationControl, ValidationStage } from '../src';

/**
 * Helper routine to run a stage with a passed config for
 * testing purposes only
 * @param stages Reference to stage(s) function
 * @param config Config to use with stage
 * @param value Value to validate
 * @param isArray Whether or not the value's an array
 * @returns Result and Control in an object
 */
export const runStageTesting = (
  stages: ValidationStage | ValidationStage[],
  config: ValidationConfig,
  value: any,
  isArray = false,
) => {
  const control: ValidationControl = {
    isArray,
    displayName: 'test',
    ctorInd: 0,
    configs: [config],
  };

  const items = Array.isArray(stages) ? stages : [stages];
  for (let i = 0; i < items.length; i += 1) {
    const result = items[i](
      [control], [value], config, control, value, value,
    );

    if (result) return { result, control };
  }

  return { result: null, control };
};