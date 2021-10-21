/**
 * Describes an occurred validation error for a constructor's field
 */
interface CtorEnsureArgError {
  // Displayname of field
  field: string;

  // Description of failed ensure
  description: string;

  // Value that caused the issue
  value: any;
}

export default CtorEnsureArgError;