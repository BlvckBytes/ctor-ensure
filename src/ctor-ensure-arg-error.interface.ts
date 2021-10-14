/**
 * Describes an occurred validation error for a constructor's field
 */
interface CtorEnsureArgError {
  field: string;
  description: string;
}

export default CtorEnsureArgError;