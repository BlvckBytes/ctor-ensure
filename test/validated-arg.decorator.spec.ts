import { expect } from 'chai';
import { Constructable, META_KEY_VALIDATION, ValidatedArg, ValidationConfig, ValidationControl } from '../src';

describe('@ValidatedArg', () => {
  const callWith = (clazz: Constructable, index: number, confs = 1, isArray = false) => {
    // Create single or multiple configs, based on confs
    const mkConfs: () => ValidationConfig | ValidationConfig[] = () => {
      if (confs === 1)
        return { description: `description${index}` };

      return [...Array(confs).keys()].map((_, ind) => ({
        description: `description${index}-${ind}`,
      }));
    };

    // Call decorator as function on clazz
    ValidatedArg(`field${index}`, mkConfs(), isArray)(clazz, `field${index}`, index);
  };

  const expectMetadata = (control: ValidationControl, index: number, subs = 1, isArray = false) => {
    // Validate control
    expect(control?.ctorInd).to.equal(index);
    expect(control?.displayName).to.equal(`field${index}`);
    expect(control?.isArray).to.equal(isArray);
  
    // Only one sub-config, validate without suffix
    if (subs === 1) {
      expect(control?.configs[0]?.description).to.equal(`description${index}`);
      return;
    }
   
    // Validate multiple sub-configs with suffixes
    for (let i = 0; i < subs; i += 1)
      expect(control?.configs[i]?.description).to.equal(`description${index}-${i}`);
  };

  it('should add control initial metadata', () => {
    // Call once on class
    class TestClass {}
    callWith(TestClass, 0);

    // Should have one matching metadata entry
    const metadata: ValidationControl[] = Reflect.getMetadata(META_KEY_VALIDATION, TestClass);
    expectMetadata(metadata[0], 0);
 });

  it('should extend control metadata', () => {
    // Call twice on class
    class TestClass {}
    callWith(TestClass, 0);
    callWith(TestClass, 1);

    // Should have two matching metadata entries
    const metadata: ValidationControl[] = Reflect.getMetadata(META_KEY_VALIDATION, TestClass);
    expectMetadata(metadata[0], 0);
    expectMetadata(metadata[1], 1);
  });

  it('should apply multiple configs at once', () => {
    // Call once with 5 configs
    class TestClass {}
    callWith(TestClass, 0, 5);

    // Should have one matching metadata entry with 5 configs
    const metadata: ValidationControl[] = Reflect.getMetadata(META_KEY_VALIDATION, TestClass);
    expectMetadata(metadata[0], 0, 5);
  });

  it('should work without configs', () => {
    // Call once with 0 configs
    class TestClass {}
    callWith(TestClass, 0, 0);
    
    // Should have one matching metadata entry with 5 configs
    const metadata: ValidationControl[] = Reflect.getMetadata(META_KEY_VALIDATION, TestClass);
    expectMetadata(metadata[0], 0, 0);
  });
});