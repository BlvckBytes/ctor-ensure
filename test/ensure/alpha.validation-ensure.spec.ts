import { expect } from 'chai';
import { ENSURE_ALPHA, evalStrThunk } from '../../src';

describe('ENSURE_ALPHA', () => {

  let alpha = ' '; // Include space
  for (let i = 0; i < 26; i += 1) {
    // Uppercase letters
    alpha += String.fromCharCode(i + 65);

    // Lowercase letters
    alpha += String.fromCharCode(i + 97);
  }

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_ALPHA().description)).to.equal('only alphabetical characters');
    expect(evalStrThunk(ENSURE_ALPHA(false).description)).to.equal('only alphabetical characters without spaces');
  });

  it('should allow all alphabetical characters', () => {
    expect(ENSURE_ALPHA().pattern?.test(alpha)).to.equal(true);
  });

  it('should allow empty strings', () => {
    expect(ENSURE_ALPHA().pattern?.test('')).to.equal(true);
    expect(ENSURE_ALPHA(false).pattern?.test('')).to.equal(true);
  });

  it('should disallow spaces', () => {
    expect(ENSURE_ALPHA(false).pattern?.test(alpha));
    expect(ENSURE_ALPHA(false).pattern?.test(alpha.substring(1))).to.equal(true);
  });

  it('should disallow non-numeric characters', () => {
    expect(ENSURE_ALPHA().pattern?.test('0123456789')).to.equal(false);
  });

  it('should disallow non-alphabetical characters', () => {
    expect(ENSURE_ALPHA().pattern?.test('@!$%#?:;-.+')).to.equal(false);
  });
});