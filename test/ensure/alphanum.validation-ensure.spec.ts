import { expect } from 'chai';
import { ENSURE_ALPHANUM, evalStrThunk } from '../../src';

describe('ENSURE_ALPHANUM', () => {
  const ensure = ENSURE_ALPHANUM();

  let alphanum = ' '; // With space at start
  for (let i = 0; i < 26; i += 1) {
    // Uppercase letters
    alphanum += String.fromCharCode(i + 65);

    // Lowercase letters
    alphanum += String.fromCharCode(i + 97);

    // Numbers
    if (i <= 9)
      alphanum += String.fromCharCode(i + 48);
  }

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_ALPHANUM().description)).to.equal('only alphanumeric characters');
    expect(evalStrThunk(ENSURE_ALPHANUM(false).description)).to.equal('only alphanumeric characters without spaces');
  });

  it('should allow all alphanumeric characters', () => {
    expect(ensure.pattern?.test(alphanum)).to.equal(true);
  });

  it('should disallow spaces', () => {
    expect(ENSURE_ALPHANUM(false).pattern?.test(alphanum));
    expect(ENSURE_ALPHANUM(false).pattern?.test(alphanum.substring(1))).to.equal(true);
  });

  it('should disallow non-alphanumeric characters', () => {
    expect(ensure.pattern?.test('@!$%#?:;-.+')).to.equal(false);
  });
});