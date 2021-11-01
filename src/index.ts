import dotenv from 'dotenv';
import 'reflect-metadata';

// Load dotenv
dotenv.config();

// Predefined ensures
export { default as ENSURE_ALPHANUM } from './ensure/strings/alphanum.validation-ensure';
export { default as ENSURE_EMAIL } from './ensure/strings/email.validation-ensure';
export { default as ENSURE_EQUALSFIELD } from './ensure/miscellaneous/equalsfield.validation-ensure';
export { default as ENSURE_EXISTING } from './ensure/datatypes/existing.validation-ensure';
export { ENSURE_FLOAT, isFloat } from './ensure/datatypes/float.validation-ensure';
export { ENSURE_INT, isInt } from './ensure/datatypes/int.validation-ensure';
export { default as ENSURE_MAXLEN } from './ensure/ranges/maxlen.validation-ensure';
export { default as ENSURE_MINLEN } from './ensure/ranges/minlen.validation-ensure';
export { default as ENSURE_MINMAXLEN } from './ensure/ranges/minmaxlen.validation-ensure';
export { default as ENSURE_NONEMPTY } from './ensure/strings/nonempty.validation-ensure';
export { default as ENSURE_NONNULL } from './ensure/datatypes/nonnull.validation-ensure';
export { default as ENSURE_PATTERN } from './ensure/strings/pattern.validation-ensure';
export { default as ENSURE_STRDATE } from './ensure/strings/strdate.validation-ensure';
export { default as ENSURE_STRFLOAT } from './ensure/strings/strfloat.validation-ensure';
export { default as ENSURE_STRINT } from './ensure/strings/strint.validation-ensure';
export { default as ENSURE_STRUUID } from './ensure/strings/struuid.validation-ensure';
export { ENSURE_ENUM } from './ensure/datatypes/enum.validation-ensure';
export { default as ENSURE_CONTAINS } from './ensure/strings/contains.validation-ensure';
export { default as ENSURE_NOSPACES } from './ensure/strings/nospaces.validator-ensure';
export { default as ENSURE_ASCII } from './ensure/strings/ascii.validation-ensure';
export { default as ENSURE_ALPHA } from './ensure/strings/alpha.validation-ensure';
export { default as ENSURE_BOOLEAN } from './ensure/datatypes/boolean.validation-ensure';
export { ENSURE_BASEENCODED, Encoding } from './ensure/strings/baseencoded.validation-ensure';
export { default as ENSURE_ISARRAY } from './ensure/datatypes/isarray.validation-ensure';
export { default as ENSURE_ARRAYSIZE } from './ensure/ranges/arraysize.validation-ensure';
export { default as ENSURE_ARRAYSIZEMIN } from './ensure/ranges/arraysizemin.validation-ensure';
export { default as ENSURE_ARRAYSIZEMAX } from './ensure/ranges/arraysizemax.validation-ensure';
export { default as ENSURE_ISDATE } from './ensure/datatypes/isdate.validation-ensure';
export { default as ENSURE_MINMAXDATE } from './ensure/ranges/minmaxdate.validation-ensure';
export { default as ENSURE_MINDATE } from './ensure/ranges/mindate.validation-ensure';
export { default as ENSURE_MAXDATE } from './ensure/ranges/maxdate.validation-ensure';
export { default as ENSURE_MINMAXNUMBER } from './ensure/ranges/minmaxnumber.validation-ensure';
export { default as ENSURE_MAXNUMBER } from './ensure/ranges/maxnumber.validation-ensure';
export { default as ENSURE_MINNUMBER } from './ensure/ranges/minnumber.validation-ensure';

// Decorators
export { default as ValidatedArg } from './validated-arg.decorator';
export { CtorEnsure } from './ctor-ensure.decorator';

// Types
export { default as CtorEnsureArgError } from './ctor-ensure-arg-error.interface';
export { CtorEnsureException } from './ctor-ensure.exception';
export { TemplateFunction, FunctionMap, VariableMap } from './description-template.factory';
export { ValidationConfig } from './validation-config.interface';
export { ValidationResult } from './validation-result.interface';
export { ValidationControl } from './validation-control.interface';
export { Constructable } from './constructable.type';

// Misc
export { META_KEY_VALIDATION, META_KEY_DISPLAYNAME } from './ctor-ensure.decorator';
export { registerTemplateFunction, getRegisteredTemplateFunctions, template } from './description-template.factory';
export { strOpt, pluralize, evalStrThunk } from './util';
export { default as validateCtor } from './ctor-validator';