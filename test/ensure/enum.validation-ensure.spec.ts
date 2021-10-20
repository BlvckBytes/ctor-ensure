import { expect } from 'chai';
import { ENSURE_ENUM, evalStrThunk } from '../../src';
import { enumKeys, enumValues } from '../../src/ensure/enum.validation-ensure';

describe('ENSURE_ENUM', () => {
  enum SINGULAR {
    TYPE1,
  }

  enum PLURAL {
    TYPE1,
    TYPE2,
    TYPE3,
  }

  it('should have it\'s default description singular', () => {
    const desc = evalStrThunk(ENSURE_ENUM(SINGULAR).description);
    expect(desc).to.equal(`needs to equal to the value: ${SINGULAR[0]}`);
  });

  it('should have it\'s default description plural', () => {
    const desc = evalStrThunk(ENSURE_ENUM(PLURAL).description);
    expect(desc).to.equal(`needs to equal to one of the values: ${PLURAL[0]}, ${PLURAL[1]}, ${PLURAL[2]}`);
  });

  it('should allow empty strings', () => {
    const ensure = ENSURE_ENUM(PLURAL);
    expect(ensure.pattern?.test('')).to.equal(true);
  });

  it('should have a proper pattern singular', () => {
    // Singular
    const ensure = ENSURE_ENUM(SINGULAR);
    expect(ensure.pattern?.source).to.equal(`(^${SINGULAR[0]}$)|^$`);
  });

  it('should have a proper pattern singular', () => {
    // Singular
    const ensure = ENSURE_ENUM(PLURAL);
    expect(ensure.pattern?.source).to.equal(`(^${PLURAL[0]}|${PLURAL[1]}|${PLURAL[2]}$)|^$`);
  });

  enum TestEnum {
    ONE, TWO, THREE,
  }

  it('should get the right enum keys', () => {
    expect(enumKeys(TestEnum)).to.deep.equal([TestEnum.ONE, TestEnum.TWO, TestEnum.THREE]);
  });

  it('should get the right enum values', () => {
    expect(enumValues(TestEnum)).to.deep.equal([TestEnum[TestEnum.ONE], TestEnum[TestEnum.TWO], TestEnum[TestEnum.THREE]]);
  });
});