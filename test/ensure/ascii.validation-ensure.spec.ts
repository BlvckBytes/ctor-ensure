import { expect } from 'chai';
import { ENSURE_ASCII, evalStrThunk } from '../../src';

describe('ENSURE_ASCII', () => {

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_ASCII().description)).to.equal('only ascii characters');
    expect(evalStrThunk(ENSURE_ASCII(false, false).description)).to.equal('only ascii characters without spaces');
    expect(evalStrThunk(ENSURE_ASCII(true).description)).to.equal('only printable ascii characters');
    expect(evalStrThunk(ENSURE_ASCII(true, false).description)).to.equal('only printable ascii characters without spaces');
  });

  let asciiFull = '';
  let asciiPrintable = '';
  for (let i = 0; i < 128; i += 1) {
    const curr = String.fromCharCode(i);
    asciiFull += curr;
    if (i >= 32 && i <= 126)
      asciiPrintable += curr;
  }

  it('should allow all ascii characters', () => {
    const ensure = ENSURE_ASCII();
    expect(ensure.pattern?.test(asciiFull)).to.equal(true);
  });

  it('should allow only printable ascii characters', () => {
    const ensure = ENSURE_ASCII(true);
    expect(ensure.pattern?.test(asciiPrintable)).to.equal(true);
    expect(ensure.pattern?.test(asciiFull)).to.equal(false);
  });

  it('should allow empty strings', () => {
    expect(ENSURE_ASCII().pattern?.test('')).equal(true);
    expect(ENSURE_ASCII(false, false).pattern?.test('')).equal(true);
    expect(ENSURE_ASCII(true, false).pattern?.test('')).equal(true);
    expect(ENSURE_ASCII(true, true).pattern?.test('')).equal(true);
  });

  it('should allow all ascii characters without space', () => {
    const ensure = ENSURE_ASCII(false, false);
    expect(ensure.pattern?.test(asciiFull.replace(' ', ''))).to.equal(true);
    expect(ensure.pattern?.test(asciiFull)).to.equal(false);
  });

  it('should allow only printable ascii characters without space', () => {
    const ensure = ENSURE_ASCII(true, false);
    expect(ensure.pattern?.test(asciiPrintable.replace(' ', ''))).to.equal(true);
    expect(ensure.pattern?.test(asciiPrintable)).to.equal(false);
    expect(ensure.pattern?.test(asciiFull)).to.equal(false);
    expect(ensure.pattern?.test(asciiFull.replace(' ', ''))).to.equal(false);
  });

  it('should disallow unicode', () => {
    const ensure = ENSURE_ASCII();
    expect(ensure.pattern?.test('😂')).to.equal(false);
  });
});