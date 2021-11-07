import { expect } from 'chai';
import { CtorEnsure, CtorEnsureArgError, ENSURE_INT, ENSURE_MINMAXLEN, ENSURE_MINMAXNUMBER, validateCtor, ValidatedArg } from '../src';
import { genModelName } from './test-util';

describe('validateCtor()', () => {
  it('should return null for unknown names', () => {
    expect(validateCtor('unknown', {})).to.be.null;
  });


  const displayname = genModelName();
  @CtorEnsure({
    displayname,
    multipleErrorsPerField: true,
  })
  class TestClass {
    constructor (
      @ValidatedArg('name', [
        ENSURE_MINMAXLEN(10, 20),
      ])
      public name: string,

      @ValidatedArg('age', [
        ENSURE_INT(),
        ENSURE_MINMAXNUMBER(18, 200),
      ])
      public age: number,
    ) {}
  }

  it('should return empty array on successful validation', () => {
    expect(validateCtor(displayname, {
      name: 'BlvckBytes',
      age: 20,
    })).to.have.lengthOf(0);
  });

  it('should return errors', () => {
    expect(validateCtor(displayname, {
      name: 'short',
      age: 'no-int',
    }))
    .satisfy((errors: CtorEnsureArgError[]) => (
      errors.filter(it => it.field === 'name').length === 1 &&
      errors.filter(it => it.field === 'age').length === 2
    ));
  });

  it('should support multilingual', () => {
    expect(validateCtor(displayname, {
      name: 'short',
      age: 'no-int',
    }, 'DE'))
    .satisfy((errors: CtorEnsureArgError[]) => {
      const nE = errors.filter(it => it.field === 'name');
      const aE = errors.filter(it => it.field === 'age');

      return (
        nE.length === 1 && aE.length === 2 &&
        nE.some(it => it.description === 'mindestens 10 Zeichen und bis zu 20 Zeichen') &&
        aE.some(it => it.description === 'ganze Zahl') &&
        aE.some(it => it.description === 'mindestens 18 und bis zu 200')
      );
    });
  });
});