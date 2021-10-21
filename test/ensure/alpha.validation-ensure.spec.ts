import { expect } from 'chai';
import { ENSURE_ALPHA, evalStrThunk } from '../../src';
import { executeEnsure, checkEnsureArgError } from '../test-util';

describe('ENSURE_ALPHA', () => {

  let alpha = ' '; // Include space at 0
  for (let i = 0; i < 26; i += 1) {
    // Uppercase letters
    alpha += String.fromCharCode(i + 65);

    // Lowercase letters
    alpha += String.fromCharCode(i + 97);
  }

  const desc = 'only alphabetical characters';
  const descNoSpaces = 'only alphabetical characters without spaces';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_ALPHA().description)).to.equal(desc);
    expect(evalStrThunk(ENSURE_ALPHA(false).description)).to.equal(descNoSpaces);
  });

  it('should allow all alphabetical characters', () => {
    expect(executeEnsure(ENSURE_ALPHA(), alpha)).to.have.lengthOf(0);
  });

  it('should allow empty strings', () => {
    expect(executeEnsure(ENSURE_ALPHA(), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ALPHA(false), '')).to.have.lengthOf(0);
  });

  it('should disallow spaces', () => {
    expect(executeEnsure(ENSURE_ALPHA(false), alpha)).satisfies(checkEnsureArgError(descNoSpaces, alpha));
    expect(executeEnsure(ENSURE_ALPHA(false), alpha.substring(1))).to.have.lengthOf(0);
  });

  it('should disallow numeric non-alpha characters', () => {
    const nonAlpha = '0123456789';
    expect(executeEnsure(ENSURE_ALPHA(), nonAlpha)).satisfies(checkEnsureArgError(desc, nonAlpha));
  });

  it('should disallow other non-alpha characters', () => {
    const nonAlpha = '@!$%#?:;-.+';
    expect(executeEnsure(ENSURE_ALPHA(), nonAlpha)).satisfies(checkEnsureArgError(desc, nonAlpha));
  });
});