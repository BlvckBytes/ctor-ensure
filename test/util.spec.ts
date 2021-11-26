import { expect } from 'chai';
import { CtorEnsure, CtorEnsureException, ENSURE_MINMAXLEN, ENSURE_MINMAXNUMBER, pluralize, strOpt, ValidatedArg } from '../src';
import { key, TemplateParameters } from '../src/description-template.factory';
import { escapeRegExp, evalDesc, isCtorEnsured, fromObj } from '../src/util';
import { checkExceptionHasFields, genModelName } from './test-util';

describe('strOpt()', () => {
  it('string should be rendered if condition is true', () => {
    // Condition is true, string should be passed through
    expect(strOpt('test', true)).to.equal('test');
  });

  it('string should not be rendered if condition is false', () => {
    // Condition is false, string should be empty
    expect(strOpt('test', false)).to.be.empty;
  });
});

describe('pluralize()', () => {
  it('should add default s when != 1', () => {
    // character, multiple, s as default letter
    expect(pluralize('character', 0)).to.equal('characters');
  });

  it('shouldn\'t add a default s when == 1', () => {
    // character, one, s as default letter
    expect(pluralize('character', 1)).to.equal('character');
  });

  it('should add custom letter when != 1', () => {
    // str, multiple, z as letter
    expect(pluralize('str', 0, 'z')).to.equal('strz');
  });

  it('shouldn\'t add custom letter when == 0', () => {
    // str, one, z as letter
    expect(pluralize('str', 1, 'z')).to.equal('str');
  });
});

describe('evalDesc()', () => {
  it('should return immediate values correctly', () => {
    // Provide immediate (hardcoded) value
    expect(evalDesc('immediate')).to.equal('immediate');
  });

  it('should evaluate string thunks correctly', () => {
    // Provide function that returns string
    expect(evalDesc(() => 'thunk')).to.equal('thunk');
  });

  it('should render templates correctly', () => {
    const templateVal = 'This is a test, {a}!';
    const templateValDE = 'Dies ist ein Test, {a}!';
    const template: TemplateParameters = {
      name: 'TEST',
      vars: { a: 5 },
    };

    process.env[key(template.name)] = templateVal;
    expect(evalDesc(template)).to.equal(templateVal.replace('{a}', template.vars?.a));

    process.env[key(`${template.name}--DE`)] = templateValDE;
    expect(evalDesc(template, 'DE')).to.equal(templateValDE.replace('{a}', template.vars?.a));
  });
});

describe('escapeRegExp()', () => {
  it('should properly escape regex-symbols', () => {
    expect(escapeRegExp('[]{}^$')).to.equal('\\[\\]\\{\\}\\^\\$');
  });
});

describe('isCtorEnsured()', () => {
  it('should detect a valid class as true', () => {
    const displayname = genModelName();
    @CtorEnsure({
      displayname,
    })
    class Valid {}
    expect(isCtorEnsured(Valid)).to.equal(true);
  });

  it('should detect a invalid class as false', () => {
    class Invalid {}
    expect(isCtorEnsured(Invalid)).to.equal(false);
  });
});

describe('fromObj()', () => {
  const displayname = genModelName();
  @CtorEnsure({
    displayname,
  })
  class Test {
    constructor (
      @ValidatedArg('name', [
        ENSURE_MINMAXLEN(5, 10),
      ])
      public name: string,

      @ValidatedArg('age', [
        ENSURE_MINMAXNUMBER(18, 120),
      ])
      public age: number,
    ) {}
  }

  it('should extract all keys from an object properly', () => {
    const data = {
      name: 'BlvckBytes',
      age: 20,
    };

    const res = fromObj(Test, data);
    expect(res).to.have.property('name', data.name);
    expect(res).to.have.property('age', data.age);
  });

  it('should throw errors', () => {
    const data = {
      name: 'xx',
      age: 5,
    };

    expect(() => fromObj(Test, data))
    .to.throw(CtorEnsureException)
    .satisfies(checkExceptionHasFields(displayname, ['name', 'age']));
  });

  it('should throw an error on non-ctor-ensured', () => {
    class Invalid {}
    expect(() => fromObj(Invalid, {})).to.throw('Class is not marked by @CtorEnsure!');
  });
});