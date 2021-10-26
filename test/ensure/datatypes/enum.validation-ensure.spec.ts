import { expect } from 'chai';
import { ENSURE_ENUM, evalStrThunk, strOpt } from '../../../src';
import { enumValues, enumKeys } from '../../../src/ensure/datatypes/enum.validation-ensure';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

enum SINGULAR {
  TYPE1,
}

enum PLURAL {
  TYPE1,
  TYPE2,
  TYPE3,
}

describe('enumValues()', () => {
  it('should extract correct values', () => {
    expect(enumValues(PLURAL)).to.include.members(['TYPE1', 'TYPE2', 'TYPE3']);
  });
});

describe('enumKeys()', () => {
  it('should extract correct keys', () => {
    expect(enumKeys(PLURAL)).to.include.members([0, 1, 2]);
  });
});

describe('ENSURE_ENUM', () => {
  const desc = (inp: { [key: string]: string | number }, disallow = false) => `needs to ${strOpt('not ', disallow)}equal to the value: ${enumValues(inp).join(', ')}`;
  const descPlural = (inp: { [key: string]: string | number }, disallow = false) => `needs to ${strOpt('not ', disallow)}equal to one of the values: ${enumValues(inp).join(', ')}`;
  const descKeys = (inp: { [key: string]: string | number }, disallow = false) => `needs to ${strOpt('not ', disallow)}equal to the value: ${enumKeys(inp).join(', ')}`;
  const descKeysPlural = (inp: { [key: string]: string | number }, disallow = false) => `needs to ${strOpt('not ', disallow)}equal to one of the values: ${enumKeys(inp).join(', ')}`;

  it('should have it\'s default description singular', () => {
    expect(evalStrThunk(ENSURE_ENUM(SINGULAR).description)).to.equal(desc(SINGULAR));
    expect(evalStrThunk(ENSURE_ENUM(SINGULAR, true).description)).to.equal(desc(SINGULAR, true));
    expect(evalStrThunk(ENSURE_ENUM(SINGULAR, false, true).description)).to.equal(descKeys(SINGULAR));
    expect(evalStrThunk(ENSURE_ENUM(SINGULAR, true, true).description)).to.equal(descKeys(SINGULAR, true));
  });

  it('should have it\'s default description plural', () => {
    expect(evalStrThunk(ENSURE_ENUM(PLURAL).description)).to.equal(descPlural(PLURAL));
    expect(evalStrThunk(ENSURE_ENUM(PLURAL, true).description)).to.equal(descPlural(PLURAL, true));
    expect(evalStrThunk(ENSURE_ENUM(PLURAL, false, true).description)).to.equal(descKeysPlural(PLURAL));
    expect(evalStrThunk(ENSURE_ENUM(PLURAL, true, true).description)).to.equal(descKeysPlural(PLURAL, true));
  });

  it('should allow empty strings', () => {
    expect(executeEnsure(ENSURE_ENUM(PLURAL), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ENUM(SINGULAR), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ENUM(PLURAL, false, true), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ENUM(SINGULAR, false, true), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ENUM(PLURAL, true, true), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ENUM(SINGULAR, true, true), '')).to.have.lengthOf(0);
  });

  it('should allow SINGULAR enum values', () => {
    enumValues(SINGULAR).forEach(value => {
      expect(executeEnsure(ENSURE_ENUM(SINGULAR), value)).to.have.lengthOf(0);
    });
  });

  it('should allow PLURAL enum values', () => {
    enumValues(PLURAL).forEach(value => {
      expect(executeEnsure(ENSURE_ENUM(PLURAL), value)).to.have.lengthOf(0);
    });
  });

  it('should disallow SINGULAR enum values', () => {
    enumValues(SINGULAR).forEach(value => {
      expect(executeEnsure(ENSURE_ENUM(SINGULAR, true), value)).satisfy(checkEnsureArgErrors(desc(SINGULAR, true), value));
    });
    expect(executeEnsure(ENSURE_ENUM(SINGULAR, true), 'i am not disallowed')).to.have.lengthOf(0);
  });

  it('should disallow PLURAL enum values', () => {
    enumValues(PLURAL).forEach(value => {
      expect(executeEnsure(ENSURE_ENUM(PLURAL, true), value)).satisfy(checkEnsureArgErrors(descPlural(PLURAL, true), value));
    });
    expect(executeEnsure(ENSURE_ENUM(PLURAL, true), 'i am not disallowed')).to.have.lengthOf(0);
  });
});