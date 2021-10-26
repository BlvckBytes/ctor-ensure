import { expect } from 'chai';
import { ENSURE_ENUM, evalStrThunk } from '../../src';
import { enumValues, enumKeys } from '../../src/ensure/datatypes/enum.validation-ensure';
import { executeEnsure } from '../test-util';

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
  const desc = (inp: { [key: string]: string | number }) => `needs to equal to the value: ${enumValues(inp).join(', ')}`;
  const descPlural = (inp: { [key: string]: string | number }) => `needs to equal to one of the values: ${enumValues(inp).join(', ')}`;
  const descKeys = (inp: { [key: string]: string | number }) => `needs to equal to the value: ${enumKeys(inp).join(', ')}`;
  const descKeysPlural = (inp: { [key: string]: string | number }) => `needs to equal to one of the values: ${enumKeys(inp).join(', ')}`;

  it('should have it\'s default description singular', () => {
    expect(evalStrThunk(ENSURE_ENUM(SINGULAR).description)).to.equal(desc(SINGULAR));
    expect(evalStrThunk(ENSURE_ENUM(SINGULAR, true).description)).to.equal(descKeys(SINGULAR));
  });

  it('should have it\'s default description plural', () => {
    expect(evalStrThunk(ENSURE_ENUM(PLURAL).description)).to.equal(descPlural(PLURAL));
    expect(evalStrThunk(ENSURE_ENUM(PLURAL, true).description)).to.equal(descKeysPlural(PLURAL));
  });

  it('should allow empty strings', () => {
    expect(executeEnsure(ENSURE_ENUM(PLURAL), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ENUM(SINGULAR), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ENUM(PLURAL, true), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ENUM(SINGULAR, true), '')).to.have.lengthOf(0);
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
});