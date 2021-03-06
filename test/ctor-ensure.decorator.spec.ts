import { expect } from 'chai';
import { CtorEnsure, META_KEY_DISPLAYNAME, Constructable, ValidatedArg, ENSURE_NONEMPTY, CtorEnsureException, CtorEnsureArgError, ENSURE_MINLEN, ENSURE_ALPHA, strOpt } from '../src';
import Optionality from '../src/optionality.enum';
import { checkEnsureArgErrors, genModelName } from './test-util';

describe('@CtorEnsure', () => {

  const optionalityDesc = (nonNull: boolean, nonOmit: boolean) => `no ${strOpt('null', nonNull)}${strOpt(' or ', nonNull && nonOmit)}${strOpt('undefined', nonOmit)} values allowed`;

  it('should apply the displayname metadata', () => {
    // Create test class and apply decorator
    const displayname = genModelName();
    @CtorEnsure({ displayname })
    class TestClass { }

    // Get displayname from metadata
    const metaName = Reflect.getMetadata(META_KEY_DISPLAYNAME, TestClass);

    // Except displayname to equal applied value
    expect(metaName).to.equal(displayname);
  });

  it('should intercept the constructor call', () => {
    const ctors: Constructable[] = [];
    let ctorsPointer = 0;

    const ConstructorBufferer = () => (clazz: Constructable): Constructable => {
      ctors[ctorsPointer] = clazz;
      ctorsPointer += 1;
      return clazz;
    };

    const displayname = genModelName();
    @ConstructorBufferer() // Buffer constructor before change
    @CtorEnsure({ displayname }) // Make change
    @ConstructorBufferer() // Buffer constructor after change
    class TestClass { }

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

    const displayname = genModelName();
    @TestMetadataDecorator(testMetadata) // Will be called first
    @CtorEnsure({ displayname }) // Will be called second
    class TestClass { }

    // Check that the metadata defined first is still there
    Object.keys(testMetadata).forEach(key => {
      const value = Reflect.getMetadata(key, TestClass);

      // Expect the value to be unchanged
      expect(value).to.equal(testMetadata[key]);
    });

    // The metadata defined secondly should be there too
    const metaName = Reflect.getMetadata(META_KEY_DISPLAYNAME, TestClass);
    expect(metaName).to.equal(displayname);
  });

  it('should throw an exception if errors occur', () => {
    // Create a model that only accepts non-empty names
    @CtorEnsure({ displayname: genModelName() })
    class TestClass {
      constructor (
        @ValidatedArg('name', ENSURE_NONEMPTY())
        public name: string,
      ) { }
    }

    // Empty value - error
    expect(() => {
      new TestClass('');
    }).to.throw(CtorEnsureException.message);

    // Valid name - should not throw
    expect(() => {
      new TestClass('max');
    }).not.to.throw();
  });

  const optCaseDesc = 'at least 10 characters';
  const mkOptionalityCase = (optionality: Optionality, value: any, withEnsure = false) => {
    @CtorEnsure({
      displayname: genModelName(),
    })
    class TestClass {
      constructor (
        @ValidatedArg('val', withEnsure ? [ ENSURE_MINLEN(10) ] : [], optionality)
        public val: any,
      ) {}
    }
    return () => new TestClass(value);
  };

  it('should allow nullable optionality but disallow undefined', () => {
    expect(mkOptionalityCase(Optionality.NULLABLE, null)).not.to.throw;
    expect(mkOptionalityCase(Optionality.NULLABLE, undefined))
    .to.throw(CtorEnsureException.message)
    .property('errors').satisfy(checkEnsureArgErrors(optionalityDesc(false, true), undefined));
  });

  it('should allow undefined optionality but disallow null', () => {
    expect(mkOptionalityCase(Optionality.OMITTABLE, undefined)).not.to.throw;
    expect(mkOptionalityCase(Optionality.OMITTABLE, null))
    .to.throw(CtorEnsureException.message)
    .property('errors').satisfy(checkEnsureArgErrors(optionalityDesc(true, false), null));
  });

  it('should allow irrelevant optionality and pass values on to validation', () => {
    expect(mkOptionalityCase(Optionality.IRRELEVANT, null)).not.to.throw;
    expect(mkOptionalityCase(Optionality.IRRELEVANT, undefined)).not.to.throw;
    expect(mkOptionalityCase(Optionality.IRRELEVANT, 'value', true))
    .to.throw(CtorEnsureException.message)
    .property('errors').satisfy(checkEnsureArgErrors(optCaseDesc, 'value'));
  });

  it('shouldn\'t allow undefined or null on required field', () => {
    expect(mkOptionalityCase(Optionality.REQUIRED, undefined, true))
    .to.throw(CtorEnsureException.message)
    .property('errors').satisfy(checkEnsureArgErrors(optionalityDesc(true, true), undefined));

    expect(mkOptionalityCase(Optionality.REQUIRED, null, true))
    .to.throw(CtorEnsureException.message)
    .property('errors').satisfy(checkEnsureArgErrors(optionalityDesc(true, true), null));
  });

  it('should forward values to ensures', () => {
    expect(mkOptionalityCase(Optionality.REQUIRED, 'value', true))
    .to.throw(CtorEnsureException.message)
    .property('errors').satisfy(checkEnsureArgErrors(optCaseDesc, 'value'));

    expect(mkOptionalityCase(Optionality.NULLABLE, 'value', true))
    .to.throw(CtorEnsureException.message)
    .property('errors').satisfy(checkEnsureArgErrors(optCaseDesc, 'value'));

    expect(mkOptionalityCase(Optionality.OMITTABLE, 'value', true))
    .to.throw(CtorEnsureException.message)
    .property('errors').satisfy(checkEnsureArgErrors(optCaseDesc, 'value'));

    expect(mkOptionalityCase(Optionality.IRRELEVANT, 'value', true))
    .to.throw(CtorEnsureException.message)
    .property('errors').satisfy(checkEnsureArgErrors(optCaseDesc, 'value'));
  });

  it('should add a k-v map of all validated fields to the exception', () => {
    const displayname = genModelName();
    @CtorEnsure({
      displayname, 
      multipleErrorsPerField: true,
    })
    class TestClass {
      constructor (
        @ValidatedArg('name', ENSURE_MINLEN(5))
        public name: string,
        @ValidatedArg('name1', ENSURE_MINLEN(5))
        public name1: string,
        @ValidatedArg('name2', ENSURE_MINLEN(5))
        public name2: string,
        @ValidatedArg('name3', ENSURE_MINLEN(5))
        public name3: string,
      ) { }
    }

    const anyError = (errFn: (err: CtorEnsureArgError) => boolean) => (ex: CtorEnsureException) => ex.errors.some(errIt => errFn(errIt));

    expect(() => {
      new TestClass('0', '1', '2', '3');
    })
      .to.throw(CtorEnsureException.message)
      .satisfies(anyError(err => err.field === 'name' && err.value === '0'))
      .satisfies(anyError(err => err.field === 'name1' && err.value === '1'))
      .satisfies(anyError(err => err.field === 'name2' && err.value === '2'))
      .satisfies(anyError(err => err.field === 'name3' && err.value === '3'))
      .has.property('displayName', displayname);
  });

  it('should only keep the latest name on inheritance', () => {
    const displaynameA = genModelName();
    @CtorEnsure({ displayname: displaynameA })
    class TestClassA { }

    const displaynameB = genModelName();
    @CtorEnsure({ displayname: displaynameB })
    class TestClassB extends TestClassA { }

    // The metadata defined secondly should be there too
    const displayname = Reflect.getMetadata(META_KEY_DISPLAYNAME, TestClassB);
    expect(displayname).to.equal(displaynameB);
  });

  it('should throw errors properly with inheritance', () => {
    @CtorEnsure({ displayname: genModelName() })
    class TestClassA {
      constructor (
        @ValidatedArg('fieldA', ENSURE_NONEMPTY())
        public fieldA: string,
      ) {}
    }

    const displaynameB = genModelName();
    @CtorEnsure({ 
      displayname: displaynameB,
      inheritValidation: true,
    })
    class TestClassB extends TestClassA {
      constructor (
        // Just passed through to the super-call
        fieldA: string,

        @ValidatedArg('fieldB', ENSURE_NONEMPTY())
        public fieldB: string,
      ) {
        super(fieldA);
      }
    }

    expect(() => new TestClassB('', 'content'))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displaynameB &&
        e.errors[0]?.field === 'fieldA'
      ));

    expect(() => new TestClassB('content', ''))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displaynameB &&
        e.errors[0]?.field === 'fieldB'
      ));
  });

  it('should work on same-named inherited field with flag on', () => {
    @CtorEnsure({ displayname: genModelName() })
    class TestClassA {
      constructor (
        @ValidatedArg('field', ENSURE_ALPHA())
        public field: string,
      ) { }
    }


    const displaynameB = genModelName();
    @CtorEnsure({
      displayname: displaynameB, 
      multipleErrorsPerField: true,
      inheritValidation: true,
    })
    class TestClassB extends TestClassA {
      constructor (
        @ValidatedArg('field', ENSURE_MINLEN(5))
        public field: string,
      ) {
        super(field);
      }
    }

    expect(() => new TestClassB('1'))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displaynameB &&
        e.errors[0]?.field === 'field' &&
        e.errors[1]?.field === 'field'
      ));
  });

  it('shouldn\'t work on same-named inherited field with flag off', () => {
    @CtorEnsure({ displayname: genModelName() })
    class TestClassA {
      constructor (
        @ValidatedArg('field', ENSURE_ALPHA())
        public field: string,
      ) { }
    }

    const displaynameB = genModelName();
    @CtorEnsure({
      displayname: displaynameB, 
      multipleErrorsPerField: true, 
      inheritValidation: false,
    })
    class TestClassB extends TestClassA {
      constructor (
        @ValidatedArg('field', ENSURE_MINLEN(5))
        public field: string,
      ) {
        super(field);
      }
    }

    expect(() => new TestClassB('1'))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displaynameB &&
        e.errors[0]?.field === 'field' &&
        e.errors.length === 1
      ));
  });

  it('should throw errors for all fields on inheritance', () => {
    @CtorEnsure({ displayname: genModelName() })
    class TestClassA {
      constructor (
        @ValidatedArg('field1', ENSURE_MINLEN(5))
        public field1: string,
      ) { }
    }

    const displaynameB = genModelName();
    @CtorEnsure({
      displayname: displaynameB, 
      multipleErrorsPerField: true, 
      inheritValidation: true,
    })
    class TestClassB extends TestClassA {
      constructor (
        field1: string,
        @ValidatedArg('field2', ENSURE_ALPHA()) 
        public field2: string,
      ) {
        super(field1);
      }
    }

    expect(() => new TestClassB('1', '1'))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displaynameB &&
        e.errors.some(it => it.field === 'field1') &&
        e.errors.some(it => it.field === 'field2') &&
        e.errors.length === 2
    ));
  });

  it('should work on empty ctors', () => {
    @CtorEnsure({ displayname: genModelName() })
    class TestClass { }

    // Should create no worries
    expect(() => new TestClass()).not.to.throw;
  });

  it('should re-throw non-validation errors in ctor', () => {
    const errMsg = 'We don\'t do that here!';
    @CtorEnsure({ displayname: genModelName() })
    class TestClass {
      constructor () {
        throw new Error(errMsg);
      }
    }

    // Should re-throw exception
    expect(() => new TestClass()).to.throw(errMsg);
  });

  it('should skip self-validation using callback', () => {
    const displayname = genModelName();
    @CtorEnsure({
      displayname,
      skipOn: (vals => vals.a === 'skip it!'),
    })
    class TestClass {
      constructor (
        @ValidatedArg('a', [
          ENSURE_MINLEN(100),
        ])
        public a: string,
      ) {}
    }

    expect(() => new TestClass('1'))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displayname &&
        e.errors.some(it => it.field === 'a') &&
        e.errors.length === 1
    ));

    expect(() => new TestClass('skip it!')).not.to.throw;
  });

  it('should skip parent validation on callback', () => {
    let displaynameA = '';
    const mkCase = (paramA: string, paramB: string, skipParent = false) => {
      @CtorEnsure({
        displayname: genModelName(),
      })
      class TestClassB {
        constructor (
          @ValidatedArg('b', [
            ENSURE_MINLEN(100),
          ])
          public b: string,
        ) {}
      }

      displaynameA = genModelName();
      @CtorEnsure({
        displayname: displaynameA,
        skipOn: (vals) => vals.a === 'skip it!',
        inheritValidation: true,
        skipOnSkipsInherited: skipParent,
      })
      class TestClassA extends TestClassB {
        constructor (
          @ValidatedArg('a', [
            ENSURE_MINLEN(100),
          ])
          public a: string,
          b: string,
        ) {
          super(b);
        }
      }

      return () => new TestClassA(paramA, paramB);
    };

    expect(mkCase('1', '1'))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displaynameA &&
        e.errors.some(it => it.field === 'a') &&
        e.errors.some(it => it.field === 'b') &&
        e.errors.length === 2
    ));

    expect(mkCase('X'.repeat(100), '1'))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displaynameA &&
        e.errors.some(it => it.field === 'b') &&
        e.errors.length === 1
    ));

    expect(mkCase('skip it!', '1'))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displaynameA &&
        e.errors.some(it => it.field === 'b') &&
        e.errors.length === 1
    ));

    expect(mkCase('skip it!', '1', true)).not.to.throw;
  });

  it('should skip fields inside class', () => {

    const displayname = genModelName();
    @CtorEnsure({
      displayname,
    })
    class TestClass {
      constructor (
        @ValidatedArg('a', [
          ENSURE_MINLEN(100),
        ], Optionality.REQUIRED, (vals) => vals.b === 'skip it!')
        public a: string,

        @ValidatedArg('b', [])
        public b: string,
      ) {}
    }

    expect(() => new TestClass('1', '1'))
      .to.throw(CtorEnsureException.message)
      .and.to.satisfy((e: CtorEnsureException) => (
        e.displayName === displayname &&
        e.errors.some(it => it.field === 'a') &&
        e.errors.length === 1
      ));

    expect(() => new TestClass('1', 'skip it!')).not.to.throw;
  });

  it('should not remove (static) members from class', () => {
    @CtorEnsure({
      displayname: genModelName(),
    })
    class Test {
      static staticNum = 4;
      public normalNum = 3;

      static staticFn () {
        return 5;
      }
    }

    expect(Test.staticFn()).to.equal(5);
    expect(Test.staticNum).to.equal(4);
    expect(new Test().normalNum).to.equal(3);
  });

  it('should not accept duplicate displaynames', () => {
    expect(() => {
      @CtorEnsure({
        displayname: 'test',
      })
      class A {}

      @CtorEnsure({
        displayname: 'test',
      })
      class B {}
    }).to.throw('The displayname test is already taken!');
  });
});