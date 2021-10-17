import { Constructable } from './constructable.type';
import CtorEnsureArgError from './ctor-ensure-arg-error.interface';
import CtorEnsureException from './ctor-ensure.exception';
import STAGE_ISARRAY from './stage/isarray.validation-stage';
import STAGE_ISEQUAL from './stage/isequal.validation-stage';
import STAGE_ISPATTERN from './stage/ispattern.validation-stage';
import { STAGE_ISTYPE } from './stage/istype.validation-stage';
import { ValidationControl } from './validation-control.interface';
import { ValidationStage } from './validation-stage.type';

// Key used for metadata regarding validation
export const META_KEY_VALIDATION = 'CTOR_ENSURE:VALIDATION';
export const META_KEY_DISPLAYNAME = 'CTOR_ENSURE:DISPLAYNAME';

// Register all known validation stages here
const VALIDATION_STAGES = [
  STAGE_ISARRAY,
  STAGE_ISEQUAL,
  STAGE_ISPATTERN,
  STAGE_ISTYPE,
];

/**
 * Register a new validation stage
 * @param stage Custom validation stage
 */
export const registerValidationStage = (stage: ValidationStage): void => {
  VALIDATION_STAGES.push(stage);
};

/**
 * Fetch all validation stages
 * @returns A copy of all currently registered validation stages
 */
export const getRegisteredValidationStages = (): ValidationStage[] => VALIDATION_STAGES.slice();

/**
 * Decorator signalling that the following class' constructor will be validated
 * using {@link ValidatedArg} decorators on members in constructor.
 * All validation errors will be thrown using a single {@link CtorEnsureException}
 * @param displayname Displayname of class
 * @param multipleErrorsPerField Whether or not to display multiple errors per field, default false
 */
export const CtorEnsure = (
  displayname: string,
  multipleErrorsPerField = false,
) => (Clazz: Constructable): Constructable => {
    // Define display-name
    Reflect.defineMetadata(META_KEY_DISPLAYNAME, displayname, Clazz);

    // Intercept constructor call
    // eslint-disable-next-line func-names
    const interceptor: any = function (...ctorArgs: any[]) {
      // Get controls from class
      const controls: ValidationControl[] = Reflect.getOwnMetadata(
        META_KEY_VALIDATION,
        Clazz,
      ) || [];

      // List of errors that occurred
      const errors: CtorEnsureArgError[] = [];
      controls
        // Iterate every control
        .forEach(currControl => {
          // Get target value from constructor args
          const currArg = ctorArgs[currControl.ctorInd];

          // Validate whole config chain from top to bottom
          for (let i = 0; i < currControl.configs.length; i += 1) {
            const currConfig = currControl.configs[i];

            // Validate all values individually (to support arrays)
            const values: any[] = currControl.isArray ? currArg : [currArg];

            for (let j = 0; j < values.length; j += 1) {
              const currValue = values[j];

              // Iterate every stage
              let passed = true;
              for (let k = 0; k < VALIDATION_STAGES.length; k += 1) {
                const stage = VALIDATION_STAGES[k];

                // Call stage with all dependencies
                const res = stage(
                  controls,
                  ctorArgs,
                  currConfig,
                  currControl,
                  currArg,
                  currValue,
                );

                // An error occurred in a stage
                if (res !== null) {
                  errors.push(res);
                  passed = false;

                  // Skip all remaining stages if flag is not set
                  if (!multipleErrorsPerField) break;
                }
              }

              // An element of the array didn't pass, skip all remaining elements
              if (!passed) break;
            }
          }
        });

      // Errors occurred
      if (errors.length > 0) throw new CtorEnsureException(interceptor, errors);

      // Try calling the constructor
      try {
        return new Clazz(ctorArgs);
      } 
      
      // An error occurred!
      catch (e) {
        // Change the displayname to current context (re-construct)
        // if the error occurred in a superclass (super() call)
        if (e instanceof CtorEnsureException && e.clazz !== Clazz)
          throw new CtorEnsureException(Clazz, e.errors);
       
        // Rethrow other errors
        throw e;
      }
    };

    // Copy prototype and existing metadata
    interceptor.prototype = Clazz.prototype;
    Reflect.getMetadataKeys(Clazz).forEach(key => {
      Reflect.defineMetadata(key, Reflect.getMetadata(key, Clazz), interceptor);
    });

    // This will be the new constructor
    return interceptor;
  };
