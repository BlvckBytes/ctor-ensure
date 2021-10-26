import { evalStrThunk, template } from '.';
import { Constructable } from './constructable.type';
import CtorEnsureArgError from './ctor-ensure-arg-error.interface';
import CtorEnsureConfig from './ctor-ensure-config.interface';
import { CtorEnsureException } from './ctor-ensure.exception';
import Optionality from './optionality.enum';
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
 * Check wheter or not a value is conforming to it's optionality state
 * @param value Value to check
 * @param optionality Optionality-level to check against
 * @returns The error description if any, null if it passed and a
 * boolean, whether or not further validation is necessary
 */
const checkOptionality = (value: any, optionality: Optionality): [string | null, boolean] => {
  // Account for optionality
  switch (optionality) {
    case Optionality.NULLABLE:
      if (value === null) return [null, false];
      if (value !== undefined) return [null, true];
      break;

    case Optionality.OMITTABLE:
      if (value === undefined) return [null, false];
      if (value !== null) return [null, true];
      break;

    case Optionality.IRRELEVANT:
      return [null, !(value === null || value === undefined)];

    default:
      return [null, true];
  }

  return [template('OPTIONALITY', {
    nullable: optionality === Optionality.NULLABLE,
  }), false];
};

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
  for (let k = 0; k < controls.length; k += 1) {
    const currControl = controls[k];

    // Get target value from constructor args
    const currArg = args[currControl.ctorInd];

    // Check optionality
    const [optErr, needsValidation] = checkOptionality(currArg, currControl.optional);

    // Didn't pass optionality, raise error and continue
    // to next validated arg
    if (optErr) {
      errors.push({
        field: currControl.displayName,
        description: optErr,
        value: currArg,
      });
      continue;
    }

    // No further validation needed
    if (!needsValidation) continue;

    // Validate all values individually (to support arrays)
    const values: any[] = Array.isArray(currArg) ? currArg : [currArg];
    for (let j = 0; j < values.length; j += 1) {
      const currValue = values[j];

      // Flag, marks if the current value has passed validation
      let currValuePassed = true;

      // Validate whole config chain from top to bottom
      for (let i = 0; i < currControl.configs.length; i += 1) {
        const currConfig = currControl.configs[i];

        // Call ensure process callback with all dependencies
        const res = currConfig.process(currValue, controls, args, currControl, currArg);

        // Validation error occurred, push and set flag
        if (res.error) {
          const err = {
            field: currControl.displayName,
            description: evalStrThunk(currConfig.description),
            value: res.value,
          };

          errors.push(err);

          // Only one error per field is desired
          if (!multipleErrorsPerField) break;
          currValuePassed = false;
        }
      }

      // One of the array's values didn't pass, skip all other values
      if (!currValuePassed && Array.isArray(currArg)) break;
    }
  }

  return errors;
};

/**
 * Get all active controls from a class' metadata, taking block-lists into account
 * @param clazz Class to search in
 * @param displayname Displayname of the class to construct metadata key
 * @param blockedFields List of currently blocked fields
 * @returns List of validation-controls that are currently active
 */
const getActiveControls = (clazz: Constructable, displayname: string, blockedFields: string[]): ValidationControl[] => {
  // Get controls from this class
  const controls = ((Reflect.getOwnMetadata(
    META_KEY_VALIDATION_UNIQUE(displayname),
    clazz,
  ) || []) as ValidationControl[]);

  // All fields have been blocked (full disable)
  if (blockedFields.includes('*')) return [];

  // Return filtered list of controls
  return controls.filter(ctl => !blockedFields.some(blk => blk.toLowerCase() === ctl.displayName.toLowerCase()));
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

    // Block all fields for classes higher up the chain if inheritance has been broken
    if (!config.inheritValidation && !blockedFields.includes('*'))
      Reflect.defineMetadata(META_KEY_BLOCKED_FIELDS, [...blockedFields, '*'], sC);

    // Arrived at most super-class, remove definition
    if (sC === origProto)
      Reflect.deleteMetadata(META_KEY_BLOCKED_FIELDS, sC);

    // Get all currently active controls
    const controls = getActiveControls(interceptor, config.displayname, blockedFields);

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
        throw new CtorEnsureException(interceptor, [...e.errors, ...errors]);

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
