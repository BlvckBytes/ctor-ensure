import { evalStrThunk } from '.';
import { Constructable } from './constructable.type';
import CtorEnsureArgError from './ctor-ensure-arg-error.interface';
import { CtorEnsureException } from './ctor-ensure.exception';
import { ValidationControl } from './validation-control.interface';

// Key used for metadata regarding validation
export const META_KEY_VALIDATION = 'CTOR_ENSURE:VALIDATION';
export const META_KEY_DISPLAYNAME = 'CTOR_ENSURE:DISPLAYNAME';

/**
 * Decorator signalling that the following class' constructor will be validated
 * using {@link ValidatedArg} decorators on members in constructor.
 * All validation errors will be thrown using a single {@link CtorEnsureException}
 * @param displayname Displayname of class
 * @param multipleErrorsPerField Whether or not to display multiple errors per field, default false
 * @param extendOverridenFields Whether or not to extend inherited validations from overriden fields of the parent
 */
export const CtorEnsure = (
  displayname: string,
  multipleErrorsPerField = false,
  extendOverridenFields = false,
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
            const values: any[] = Array.isArray(currArg) ? currArg : [currArg];

            let passed = true;
            for (let j = 0; j < values.length; j += 1) {
              const currValue = values[j];

              const res = currConfig.process(currValue, controls, ctorArgs, currControl, currArg);

              if (!res) {
                errors.push({
                  field: currControl.displayName,
                  description: evalStrThunk(currConfig.description),
                  value: currValue,
                });
                passed = false;
              }
            }

            // Config didn't pass, and only max. one error per field is desired
            if (!passed && !multipleErrorsPerField) break;
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

      // Merge validation metadata
      if (key === META_KEY_VALIDATION) {
        const self = Reflect.getMetadata(key, Clazz) as ValidationControl[];
        const other = Reflect.getMetadata(key, interceptor) as ValidationControl[];

        if (extendOverridenFields) {
          (other || []).forEach(otherControl => {
            const control = self.find(it => it.displayName === otherControl.displayName);
            control?.configs.push(...otherControl.configs);
          });
        }

        // Define merge result
        Reflect.defineMetadata(key, self, interceptor);
        return;
      }

      // Just copy (override) all other metadata
      Reflect.defineMetadata(key, Reflect.getMetadata(key, Clazz), interceptor);
    });

    // This will be the new constructor
    return interceptor;
  };
