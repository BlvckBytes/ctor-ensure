import { Constructable } from './constructable.type';
import CtorEnsureArgError from './ctor-ensure-arg-error.interface';
import { META_KEY_DISPLAYNAME } from './ctor-ensure.decorator';

/**
 * Thrown when a constructor didn't pass validation
 */
class CtorEnsureException extends Error {
  // Name of source class
  readonly displayName: string;

  constructor(
    // Source class
    public readonly clazz: Constructable,

    // Validation errors based on individual fields
    public readonly errors: CtorEnsureArgError[],
  ) {
    super('Could not validate constructor call!');
    this.displayName = Reflect.getOwnMetadata(META_KEY_DISPLAYNAME, this.clazz);
  }
}

export default CtorEnsureException;