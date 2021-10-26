/**
 * Result of calling process() on a {@link ValidationConfig}
 */
export interface ValidationResult {
  // True if it didn't pass validation, false on success
  error: boolean;

  // Specific value that caused this error
  value?: any;
}
