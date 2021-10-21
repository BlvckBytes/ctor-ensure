import { Constructable } from './constructable.type';
import CtorEnsureArgError from './ctor-ensure-arg-error.interface';
import { META_KEY_DISPLAYNAME } from './ctor-ensure.decorator';

/**
 * Thrown when a constructor didn't pass validation
 */
export interface CtorEnsureException {
  // Name of source class
  displayName: string;

  // Source class
  clazz: Constructable;

  // Validation errors based on individual fields
  errors: CtorEnsureArgError[];
}

export class CtorEnsureException extends Error {
  static message = 'Could not validate constructor call!';

  displayName: string;

  constructor (
    public clazz: Constructable,
    public errors: CtorEnsureArgError[],
  ) {
    super(CtorEnsureException.message);
    this.displayName = Reflect.getOwnMetadata(META_KEY_DISPLAYNAME, this.clazz);
  }
}