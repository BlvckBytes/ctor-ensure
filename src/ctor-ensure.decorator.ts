import { evalDesc, template } from '.';
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

export const classRegistry = <{ [ key: string ]: {
  clazz: Constructable,
  proto: any,
  config: CtorEnsureConfig,
} }>{};

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
 * @param argMap Argument map of field displayname to constructor value
 * @returns List of occurred errors
 */
const validateCtorArgs = (
  args: any[],
  controls: ValidationControl[],
  multipleErrorsPerField: boolean,
  argMap: { [ key: string ]: any },
): CtorEnsureArgError[] => {
  const errors: CtorEnsureArgError[] = [];

  // Iterate every control
  for (let k = 0; k < controls.length; k += 1) {
    const currControl = controls[k];

    // Skip this control if callback returns with true
    if (currControl.skipOn) {
      const skip = currControl.skipOn(argMap);
      if (skip) continue;
    }

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

    // Always execute the ensures at least once
    let j = 0;
    do {
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
            description: evalDesc(currConfig.description),
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
      j += 1;
    } while (j < values.length);
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
export const getActiveControls = (clazz: Constructable, displayname: string, blockedFields: string[]): ValidationControl[] => {
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
 * Validate a registered class' constructor arguments
 * @param displayname Unique name of known class
 * @param ctorArgs Constructor arguments
 * @returns List of occurred errors
 */
export const validateClassCtor = (
  displayname: string,
  ctorArgs: any[],
): CtorEnsureArgError[] => {
  const { proto, config, clazz } = classRegistry[displayname];

  // Create argument map, mapping displayname to actual value
  const argMap = getActiveControls(clazz, config.displayname, [])
    .reduce((acc, curr) => {
      acc[curr.displayName] = ctorArgs[curr.ctorInd];
      return acc;
    }, <{ [ key: string ]: any}>{});

  // Evaluate skip callback if set
  const skip = config.skipOn ? config.skipOn(argMap) : false;

  // Most base-class will define blocked fields on most super-class' prototype
  const sC = getLastSuperclassProto(proto);
  if (!Reflect.hasMetadata(META_KEY_BLOCKED_FIELDS, sC)) {
    Reflect.defineMetadata(
      META_KEY_BLOCKED_FIELDS,
      // If inherited errors are also skipped, put * as blocklist
      (skip && config.skipOnSkipsInherited) ? ['*'] : config.blockInheritanceForFields || [],
      sC,
    );
  }

  // Retrieve blocked fields
  const blockedFields = Reflect.getMetadata(META_KEY_BLOCKED_FIELDS, sC) as string[];

  // Block all fields for classes higher up the chain if inheritance has been broken
  if (!config.inheritValidation && !blockedFields.includes('*'))
    Reflect.defineMetadata(META_KEY_BLOCKED_FIELDS, [...blockedFields, '*'], sC);

  // Arrived at most super-class, remove definition
  if (sC === proto)
    Reflect.deleteMetadata(META_KEY_BLOCKED_FIELDS, sC);

  // Get all currently active controls
  const controls = getActiveControls(clazz, config.displayname, blockedFields);

  // Validate args based on defined controls
  // Skip validation if skip resulted in true
  return skip ? [] : validateCtorArgs(ctorArgs, controls, config.multipleErrorsPerField || false, argMap);
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
) => (Clazz: Constructable) => {

  const Constructor = Clazz;

  // Intercept constructor call
  // eslint-disable-next-line func-names
  const interceptor: any = function (...ctorArgs: any[]) {

    // Validate class constructor
    const errors = validateClassCtor(config.displayname, ctorArgs);

    try {
      // Call ctor, this will possibly throw super-call ensure-exceptions
      // Pass invocation information as last argument, that will be caught and removed later on
      const inst = new Constructor(...ctorArgs);

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

  // Copy prototype and static members
  Object.getOwnPropertyNames(Clazz)
    .filter(it => Object.getOwnPropertyDescriptor(Clazz, it)?.writable)
    .forEach(it => {
      (interceptor as any)[it] = (Clazz as any)[it];
    });

  // Copy existing metadata
  Reflect.getMetadataKeys(Clazz).forEach(key => Reflect.defineMetadata(key, Reflect.getMetadata(key, Clazz), interceptor));

  // (Re-)Define display-name
  Reflect.defineMetadata(META_KEY_DISPLAYNAME, config.displayname, interceptor);

  // Check for displayname collisions
  if (classRegistry[config.displayname])
    throw new Error(`The displayname ${config.displayname} is already taken!`);

  classRegistry[config.displayname] = {
    clazz: interceptor,
    proto: Clazz.prototype,
    config,
  };

  // This will be the new constructor
  return interceptor;
};
