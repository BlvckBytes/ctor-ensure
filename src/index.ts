import dotenv from 'dotenv';
import 'reflect-metadata';

// Load dotenv
dotenv.config();

// Predefined ensures
export { default as ENSURE_ALPHANUM } from './ensure/alphanum.validation-ensure';
export { default as ENSURE_EMAIL } from './ensure/email.validation-ensure';
export { default as ENSURE_EQUALS } from './ensure/equals.validation-ensure';
export { default as ENSURE_EXISTING } from './ensure/existing.validation-ensure';
export { ENSURE_FLOAT, isFloat } from './ensure/float.validation-ensure';
export { ENSURE_INT, isInt } from './ensure/int.validation-ensure';
export { default as ENSURE_MAXLEN } from './ensure/maxlen.validation-ensure';
export { default as ENSURE_MINLEN } from './ensure/minlen.validation-ensure';
export { default as ENSURE_MINMAXLEN } from './ensure/minmaxlen.validation-ensure';
export { default as ENSURE_NONEMPTY } from './ensure/nonempty.validation-ensure';
export { default as ENSURE_NONNULL } from './ensure/nonnull.validation-ensure';
export { default as ENSURE_PATTERN } from './ensure/pattern.validation-ensure';
export { default as ENSURE_STRDATE } from './ensure/strdate.validation-ensure';
export { default as ENSURE_STRFLOAT } from './ensure/strfloat.validation-ensure';
export { default as ENSURE_STRINT } from './ensure/strint.validation-ensure';
export { default as ENSURE_STRUUID } from './ensure/struuid.validation-ensure';
export { ENSURE_ENUM } from './ensure/enum.validation-ensure';
export { default as ENSURE_CONTAINS } from './ensure/contains.validation-ensure';
export { default as ENSURE_NOSPACES } from './ensure/nospaces.validator-ensure';
export { default as ENSURE_ASCII } from './ensure/ascii.validation-ensure';
export { default as ENSURE_ALPHA } from './ensure/alpha.validation-ensure';
export { default as ENSURE_BOOLEAN } from './ensure/boolean.validation-ensure';
export { ENSURE_BASEENCODED, Encoding } from './ensure/baseencoded.validation-ensure';
export { default as ENSURE_ISARRAY } from './ensure/isarray.validation-ensure';

// Decorators
export { default as ValidatedArg } from './validated-arg.decorator';
export { CtorEnsure } from './ctor-ensure.decorator';

// Types
export { default as CtorEnsureArgError } from './ctor-ensure-arg-error.interface';
export { CtorEnsureException } from './ctor-ensure.exception';
export { TemplateFunction, FunctionMap, VariableMap } from './description-template.factory';
export { ValidationConfig } from './validation-config.interface';
export { ValidationControl } from './validation-control.interface';
export { Constructable } from './constructable.type';

// Misc
export { META_KEY_VALIDATION, META_KEY_DISPLAYNAME } from './ctor-ensure.decorator';
export { registerTemplateFunction, getRegisteredTemplateFunctions, template } from './description-template.factory';
export { strOpt, pluralize, evalStrThunk } from './util';