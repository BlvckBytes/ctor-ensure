import { expect } from 'chai';
import { ENSURE_ALPHANUM, evalStrThunk } from '../../src';
import { checkEnsureArgError, executeEnsure } from '../test-util';

describe('ENSURE_ALPHANUM', () => {
  let alphanum = ' '; // With space at 0
  for (let i = 0; i < 26; i += 1) {
    // Uppercase letters
    alphanum += String.fromCharCode(i + 65);

    // Lowercase letters
    alphanum += String.fromCharCode(i + 97);

    // Numbers
    if (i <= 9)
      alphanum += String.fromCharCode(i + 48);
  }

  const desc = 'only alphanumeric characters';
  const descNoSpaces = 'only alphanumeric characters without spaces';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_ALPHANUM().description)).to.equal(desc);
    expect(evalStrThunk(ENSURE_ALPHANUM(false).description)).to.equal(descNoSpaces);
  });

  it('should allow all alphanumeric characters', () => {
    expect(executeEnsure(ENSURE_ALPHANUM(), alphanum)).to.have.lengthOf(0);
  });

  it('should allow empty strings', () => {
    expect(executeEnsure(ENSURE_ALPHANUM(), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ALPHANUM(false), '')).to.have.lengthOf(0);
  });

  it('should disallow spaces', () => {
    expect(executeEnsure(ENSURE_ALPHANUM(false), alphanum)).satisfies(checkEnsureArgError(descNoSpaces, alphanum));
    expect(executeEnsure(ENSURE_ALPHANUM(false), alphanum.substring(1))).to.have.lengthOf(0);
  });

  it('should disallow non-alphanumeric characters', () => {
    const inp = '@!$%#?:;-.+';
    expect(executeEnsure(ENSURE_ALPHANUM(), inp)).satisfies(checkEnsureArgError(desc, inp));
    expect(executeEnsure(ENSURE_ALPHANUM(false), inp)).satisfies(checkEnsureArgError(descNoSpaces, inp));
  });
});