/**
 * Describes an occurred validation error for a constructor's field
 */
interface CtorEnsureArgError {
  field: string;
  description: string;
  value: any;
}

export default CtorEnsureArgError;