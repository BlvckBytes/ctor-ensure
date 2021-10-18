import { META_KEY_VALIDATION } from './ctor-ensure.decorator';
import { ValidationConfig } from './validation-config.interface';
import { ValidationControl } from './validation-control.interface';
import { ValidationFlags } from './validation-flags.interface';

/**
 * Apply one or more validations to a constructor property
 * @param displayName Name of the field to validate
 * @param config Validation config
 * @param flags Flags for this control
 */
const ValidatedArg = (
  displayName: string,
  config: ValidationConfig | ValidationConfig[],
  flags: Partial<ValidationFlags> | null = null,
): ParameterDecorator => (clazz: any, _: string | symbol, index: number) => {
    // Ensure existence of array
    if (!Reflect.hasOwnMetadata(META_KEY_VALIDATION, clazz))
      Reflect.defineMetadata(META_KEY_VALIDATION, [], clazz);

    // Find entry for current field name and index
    const meta: ValidationControl[] = Reflect.getOwnMetadata(
      META_KEY_VALIDATION,
      clazz,
    );

    // Find control by ctor parameter index
    let control = meta.find(
      it => it.ctorInd === index,
    );

    // Ensure existence of control for field
    if (!control) {
      control = {
        displayName,
        ctorInd: index,
        configs: [],
        flags: {
          isArray: false,
          isUnique: false,
          ignoreCasing: false,
          ...flags,
        },
      } as ValidationControl;
      meta.push(control);
    }

    // Add configs to control
    const configs = Array.isArray(config) ? config : [config];
    control.configs.push(...configs);
  };

export default ValidatedArg;