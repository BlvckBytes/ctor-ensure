import { expect } from 'chai';
import { ENSURE_ALPHANUM, evalStrThunk } from '../../src';

describe('ENSURE_ALPHANUM', () => {
  const ensure = ENSURE_ALPHANUM();

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ensure.description)).to.equal('only alphanumeric characters');
  });

  it('should allow all alphanumeric characters', () => {
    let alphanum = '';
    for (let i = 0; i < 26; i += 1) {
      // Uppercase letters
      alphanum += String.fromCharCode(i + 65);

      // Lowercase letters
      alphanum += String.fromCharCode(i + 97);

      // Numbers
      if (i <= 9)
        alphanum += String.fromCharCode(i + 48);
    }

    expect(ensure.pattern?.test(alphanum)).to.equal(true);
  });

  it('should disallow non-alphanumeric characters', () => {
    expect(ensure.pattern?.test('@!$%#?:;-.+')).to.equal(false);
  });
});