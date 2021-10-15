/* eslint-disable max-classes-per-file */

import { expect } from 'chai'; 
import { ValidationStage, getRegisteredValidationStages, registerValidationStage, CtorEnsure, META_KEY_DISPLAYNAME, Constructable, ValidatedArg, ENSURE_NONEMPTY } from '../src';

describe('registerValidationStage()', () => {
  it('added stage should be registered', () => {
    // Create dummy stage
    const TEST_STAGE: ValidationStage = () => null;

    // Capture size before and after registration
    const sizeBefore = getRegisteredValidationStages().length;
    registerValidationStage(TEST_STAGE);
    const sizeAfter = getRegisteredValidationStages().length;

    // Except array to have grown
    expect(sizeBefore).to.be.lessThan(sizeAfter);
  });
});

describe('@CtorEnsure', () => {
  it('should apply the displayname metadata', () => {
    // Create test class and apply decorator
    @CtorEnsure('test-model')
    class TestClass {}

    // Get displayname from metadata
    const displayname = Reflect.getMetadata(META_KEY_DISPLAYNAME, TestClass);

    // Except displayname to equal applied value
    expect(displayname).to.equal('test-model');
  });

  it('should intercept the constructor call', () => {
    const ctors: Constructable[] = [];
    let ctorsPointer = 0;

    const ConstructorBufferer = () => (clazz: Constructable): Constructable => {
      ctors[ctorsPointer] = clazz;
      ctorsPointer += 1;
      return clazz;
    };

    @ConstructorBufferer() // Buffer constructor before change
    @CtorEnsure('test-model') // Make change
    @ConstructorBufferer() // Buffer constructor after change
    class TestClass {}

    // Expect the constructors to have been changed
    expect(ctors[0]).to.not.equal(ctors[1]);
  });

  it('should not remove existing metadata', () => {
    // Metadata to test for
    const testMetadata: { [key: string]: string } = {
      'test-key-1': 'test-value-1',
      'test-key-2': 'test-value-2',
    };

    // Decorator to define key-value pairs as metadata
    const TestMetadataDecorator = (metadata: { [key: string]: string }) => (clazz: Constructable): Constructable => {
      Object.keys(metadata).forEach(key => {
        Reflect.defineMetadata(key, metadata[key], clazz);
      });

      return clazz;
    };

    @TestMetadataDecorator(testMetadata) // Will be called first
    @CtorEnsure('test-model') // Will be called second
    class TestClass {}

    // Check that the metadata defined first is still there
    Object.keys(testMetadata).forEach(key => {
      const value = Reflect.getMetadata(key, TestClass);

      // Expect the value to be unchanged
      expect(value).to.equal(testMetadata[key]);
    });

    // The metadata defined secondly should be there too
    const displayname = Reflect.getMetadata(META_KEY_DISPLAYNAME, TestClass);
    expect(displayname).to.equal('test-model');
  });

  it('should throw an exception if errors occur', () => {
    // Create a model that only accepts non-empty names
    @CtorEnsure('test-model')
    class TestClass {
      constructor(
        @ValidatedArg('name', ENSURE_NONEMPTY())
        public name: string,
      ) {}
    }

    // Empty value - error
    expect(() => {
      new TestClass('');
    }).to.throw('Could not validate constructor call!');

    // Valid name - should not throw
    expect(() => {
      new TestClass('max');
    }).not.to.throw();
  });
});