import { ValidationConfig } from "./validation-config.interface";

// A validation ensure is a function that may take arguments
// and returns a validation config
export type ValidationEnsure = (...args: any[]) => ValidationConfig;