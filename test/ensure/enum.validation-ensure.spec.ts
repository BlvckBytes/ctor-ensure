import { expect } from 'chai';
import { ENSURE_ENUM, evalStrThunk } from '../../src';

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
    // Singular
    const ensure = ENSURE_ENUM(SINGULAR);
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal(`needs to equal to the value: ${SINGULAR[0]}`);
  });

  it('should have it\'s default description plural', () => {
    // Singular
    const ensure = ENSURE_ENUM(PLURAL);
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal(`needs to equal to one of the values: ${PLURAL[0]}, ${PLURAL[1]}, ${PLURAL[2]}`);
  });

  it('should have a proper pattern singular', () => {
    // Singular
    const ensure = ENSURE_ENUM(SINGULAR);
    expect(ensure.pattern?.source).to.equal(`^${SINGULAR[0]}$`);
  });

  it('should have a proper pattern singular', () => {
    // Singular
    const ensure = ENSURE_ENUM(PLURAL);
    expect(ensure.pattern?.source).to.equal(`^${PLURAL[0]}|${PLURAL[1]}|${PLURAL[2]}$`);
  });
});