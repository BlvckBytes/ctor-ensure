/**
 * Signals the state of optionality of a validated argument
 */
enum Optionality {
  // Needs to have a defined, non-null value
  REQUIRED = 1,

  // Can be omitted, thus undefined
  OMITTABLE,

  // Can be null
  NULLABLE,

  // Can be undefined, null, or an actual value
  IRRELEVANT,
}

export default Optionality;