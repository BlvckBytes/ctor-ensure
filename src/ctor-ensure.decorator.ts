import { evalStrThunk } from '.';
import { Constructable } from './constructable.type';
import CtorEnsureArgError from './ctor-ensure-arg-error.interface';
import CtorEnsureConfig from './ctor-ensure-config.interface';
import { CtorEnsureException } from './ctor-ensure.exception';
import { getLastSuperclassProto } from './util';
import { ValidationControl } from './validation-control.interface';

// Key used for metadata regarding validation
export const META_KEY_VALIDATION = 'CTOR_ENSURE:VALIDATION';
export const META_KEY_DISPLAYNAME = 'CTOR_ENSURE:DISPLAYNAME';

// Unique metadata valiation key
const META_KEY_VALIDATION_UNIQUE = (displayname: string) => `CTOR_ENSURE:${displayname}:VALIDATION`;

// Key used to store blocked field information in class prototypes
const META_KEY_BLOCKED_FIELDS = 'CTOR_ENSURE:BLOCKED_FIELDS';

/**
 * Validate an array of constructor arguments based on an array of controls which
 * define the requested validation schema, then collect and return those errors
 * @param args Constructor arguments to validate
 * @param controls Controls to use for the schema
 * @param multipleErrorsPerField Whether or not to exit after one error per field
 * @returns List of occurred errors
 */
const validateCtorArgs = (args: any[], controls: ValidationControl[], multipleErrorsPerField: boolean) => {
  const errors: CtorEnsureArgError[] = [];

  // Iterate every control
  controls.forEach(currControl => {
    // Get target value from constructor args
    const currArg = args[currControl.ctorInd];

    // Validate whole config chain from top to bottom
    for (let i = 0; i < currControl.configs.length; i += 1) {
      const currConfig = currControl.configs[i];

      // Flag, marks if this field has passed validation
      let passed = true;

      // Validate all values individually (to support arrays)
      const values: any[] = Array.isArray(currArg) ? currArg : [currArg];
      for (let j = 0; j < values.length; j += 1) {
        const currValue = values[j];

        // Call ensure process callback with all dependencies
        const res = currConfig.process(currValue, controls, args, currControl, currArg);

        // Validation error occurred, push and set flag
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

  return errors;
};

/**
 * Decorator signalling that the following class' constructor will be validated
 * using {@link ValidatedArg} decorators on members in constructor.
 * All validation errors will be thrown using a single {@link CtorEnsureException}
 * @param displayname Displayname of class
 * @param multipleErrorsPerField Whether or not to display multiple errors per field, default false
 */
export const CtorEnsure = (
  config: CtorEnsureConfig,
) => (Clazz: Constructable): Constructable => {

  // Buffer original clazz and it's prototype before interception
  const OrigClazz = Clazz;
  const origProto = OrigClazz.prototype;

  // Intercept constructor call
  // eslint-disable-next-line func-names
  const interceptor: any = function (...ctorArgs: any[]) {

    // Most base-class will define blocked fields on most super-class' prototype
    const sC = getLastSuperclassProto(origProto);
    if (!Reflect.hasMetadata(META_KEY_BLOCKED_FIELDS, sC))
      Reflect.defineMetadata(META_KEY_BLOCKED_FIELDS, config.blockInheritanceForFields || [], sC);

    // Retrieve blocked fields
    const blockedFields = Reflect.getMetadata(META_KEY_BLOCKED_FIELDS, sC) as string[];

    // Arrived at most super-class, remove definition
    if (sC === origProto)
      Reflect.deleteMetadata(META_KEY_BLOCKED_FIELDS, sC);

    // Get controls from this class
    const controls = ((Reflect.getOwnMetadata(
      META_KEY_VALIDATION_UNIQUE(config.displayname),
      interceptor,
    ) || []) as ValidationControl[])
    // Filter out controls (fields) that are on the block-list
      .filter(ctl => !blockedFields.some(blk => blk.toLowerCase() === ctl.displayName.toLowerCase()));

    // Validate args based on defined controls
    const errors = validateCtorArgs(ctorArgs, controls, config.multipleErrorsPerField || false);

    try {
      // Call ctor, this will possibly throw super-call ensure-exceptions
      // Pass invocation information as last argument, that will be caught and removed later on
      const inst = new OrigClazz(...ctorArgs);

      // No super-errors occurred, throw own errors, if any
      if (errors.length > 0) throw new CtorEnsureException(interceptor, errors);

      // Return instance
      return inst;
    } 
    
    catch (e) {
      // Listen for exceptions of super-classes
      if (e instanceof CtorEnsureException && e.clazz !== interceptor)
        // Throw exception with changed class and merged errors
        throw new CtorEnsureException(interceptor, config.inheritValidation ? [...e.errors, ...errors] : e.errors);

      // Just rethrow others
      throw e;
    }
  };

  // Unique-ify validation based on displayname
  // Used keep apart validation schemes, since inner decorators
  // don't know the displayname at their time of execution yet
  Reflect.defineMetadata(META_KEY_VALIDATION_UNIQUE(config.displayname), Reflect.getMetadata(META_KEY_VALIDATION, Clazz), interceptor);
  Reflect.deleteMetadata(META_KEY_VALIDATION, Clazz);

  // Copy prototype and existing metadata
  interceptor.prototype = Clazz.prototype;
  Reflect.getMetadataKeys(Clazz).forEach(key => Reflect.defineMetadata(key, Reflect.getMetadata(key, Clazz), interceptor));

  // (Re-)Define display-name
  Reflect.defineMetadata(META_KEY_DISPLAYNAME, config.displayname, interceptor);

  // This will be the new constructor
  return interceptor;
};
