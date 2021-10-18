
export interface ValidationFlags {
  // Is an array of elements
  isArray: boolean;

  // Values need to be unique
  isUnique: boolean;

  // Whether or not to completely ignore all casing
  ignoreCasing: boolean;
}