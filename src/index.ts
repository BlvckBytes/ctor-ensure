import dotenv from 'dotenv';
import 'reflect-metadata';

// Load dotenv
dotenv.config();

// Predefined ensures
export { default as ENSURE_ALPHANUM } from './ensure/alphanum.validation-ensure';
export { default as ENSURE_EMAIL } from './ensure/email.validation-ensure';
export { default as ENSURE_EQUALS } from './ensure/equals.validation-ensure';
export { default as ENSURE_EXISTING } from './ensure/existing.validation-ensure';
export { default as ENSURE_FLOAT } from './ensure/float.validation-ensure';
export { default as ENSURE_INT } from './ensure/int.validation-ensure';
export { default as ENSURE_MAX } from './ensure/max.validation-ensure';
export { default as ENSURE_MIN } from './ensure/min.validation-ensure';
export { default as ENSURE_MINMAX } from './ensure/minmax.validation-ensure';
export { default as ENSURE_NONEMPTY } from './ensure/nonempty.validation-ensure';
export { default as ENSURE_NONNULL } from './ensure/nonnull.validation-ensure';
export { default as ENSURE_PATTERN } from './ensure/pattern.validation-ensure';
export { default as ENSURE_STRDATE } from './ensure/strdate.validation-ensure';
export { default as ENSURE_STRFLOAT } from './ensure/strfloat.validation-ensure';
export { default as ENSURE_STRINT } from './ensure/strint.validation-ensure';
export { ENSURE_STRUUID } from './ensure/struuid.validation-ensure';
export { ENSURE_ENUM } from './ensure/enum.validation-ensure';
export { default as ENSURE_CONTAINS } from './ensure/contains.validation-ensure';
export { default as ENSURE_NOSPACES } from './ensure/nospaces.validator-ensure';
export { default as ENSURE_ASCII } from './ensure/ascii.validation-ensure';
export { default as ENSURE_ALPHA } from './ensure/alpha.validation-ensure';
export { default as ENSURE_BOOLEAN } from './ensure/boolean.validation-ensure';
export { ENSURE_BASEENCODED, Encoding } from './ensure/baseencoded.validation-ensure';

// Predefined stages
export { default as STAGE_ISPATTERN } from './stage/ispattern.validation-stage';
export { STAGE_ISTYPE } from './stage/istype.validation-stage';
export { default as STAGE_ISEQUAL } from './stage/isequal.validation-stage';
export { default as STAGE_ISARRAY } from './stage/isarray.validation-stage';

// Decorators
export { default as ValidatedArg } from './validated-arg.decorator';
export { CtorEnsure } from './ctor-ensure.decorator';

// Types
export { default as CtorEnsureArgError } from './ctor-ensure-arg-error.interface';
export { default as CtorEnsureException } from './ctor-ensure.exception';
export { TemplateFunction, FunctionMap, VariableMap } from './description-template.factory';
export { FieldType } from './field-type.enum';
export { ValidationConfig } from './validation-config.interface';
export { ValidationControl } from './validation-control.interface';
export { ValidationStage } from './validation-stage.type';
export { ValidationEnsure } from './validation-ensure.type';
export { Constructable } from './constructable.type';

// Misc
export { META_KEY_VALIDATION, META_KEY_DISPLAYNAME, registerValidationStage, getRegisteredValidationStages } from './ctor-ensure.decorator';
export { registerTemplateFunction, getRegisteredTemplateFunctions, template } from './description-template.factory';
export { strOpt, pluralize, evalStrThunk } from './util';