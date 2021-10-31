/**
 * Configuration to be used with the {@link CtorEnsure} decorator
 */
interface CtorEnsureConfig {
  // Displayname of the class
  displayname: string;

  // Whether or not to display multiple errors per field
  // Default: false
  multipleErrorsPerField?: boolean;

  // Whether or not to inherit any validation from super-classes
  // Default: false
  inheritValidation?: boolean;

  // Fields for which inheritance of validation is blocked
  // This is only processed for the called class and does not
  // merge with super-classes. It has full access to all super-
  // class fields, including the most-base class
  // Default: empty
  blockInheritanceForFields?: string[];

  // Callback to check whether or not to
  // skip this class's validation
  skipOn?: (
    // Values of constructor, where the key is
    // is field's displayname
    values: { [ key: string ]: any }
  ) => boolean;

  // Whether or not the skipOn callback also skips
  // inherited errors
  skipOnSkipsInherited?: boolean;
}

export default CtorEnsureConfig;