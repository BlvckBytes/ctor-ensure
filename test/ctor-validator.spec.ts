import { expect } from 'chai';
import { CtorEnsure, CtorEnsureArgError, ENSURE_INT, ENSURE_MINMAXLEN, ENSURE_MINMAXNUMBER, validateCtor, ValidatedArg } from '../src';

describe('validateCtor()', () => {
  it('should return null for unknown names', () => {
    expect(validateCtor('unknown', {})).to.be.null;
  });

  @CtorEnsure({
    displayname: 'test',
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
    expect(validateCtor('test', {
      name: 'BlvckBytes',
      age: 20,
    })).to.have.lengthOf(0);
  });

  it('should return errors', () => {
    expect(validateCtor('test', {
      name: 'short',
      age: 'no-int',
    }))
    .satisfy((errors: CtorEnsureArgError[]) => (
      errors.filter(it => it.field === 'name').length === 1 &&
      errors.filter(it => it.field === 'age').length === 2
    ));
  });
});