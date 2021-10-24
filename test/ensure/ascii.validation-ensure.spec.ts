import { expect } from 'chai';
import { ENSURE_ASCII, evalStrThunk } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_ASCII', () => {

  let asciiFull = '';
  let asciiPrintable = '';
  for (let i = 0; i < 128; i += 1) {
    const curr = String.fromCharCode(i);
    asciiFull += curr;
    if (i >= 32 && i <= 126)
      asciiPrintable += curr;
  }
  const asciiFullNoSpaces = asciiFull.replace(' ', '');
  const asciiPrintableNoSpaces = asciiPrintable.replace(' ', '');

  const desc = 'only ascii characters';
  const descNoSpaces = 'only ascii characters without spaces';
  const descPrintable = 'only printable ascii characters';
  const descPrintableNoSpaces = 'only printable ascii characters without spaces';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_ASCII().description)).to.equal(desc);
    expect(evalStrThunk(ENSURE_ASCII(false, false).description)).to.equal(descNoSpaces);
    expect(evalStrThunk(ENSURE_ASCII(true).description)).to.equal(descPrintable);
    expect(evalStrThunk(ENSURE_ASCII(true, false).description)).to.equal(descPrintableNoSpaces);
  });

  it('should allow all ascii characters', () => {
    expect(executeEnsure(ENSURE_ASCII(), asciiFull)).to.have.lengthOf(0);
  });

  it('should allow only printable ascii characters', () => {
    expect(executeEnsure(ENSURE_ASCII(true), asciiPrintable)).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ASCII(true), asciiFull)).satisfies(checkEnsureArgErrors(descPrintable, asciiFull));
  });

  it('should allow empty strings', () => {
    expect(executeEnsure(ENSURE_ASCII(), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ASCII(false, false), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ASCII(true, false), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ASCII(true, true), '')).to.have.lengthOf(0);
  });

  it('should allow all ascii characters without space', () => {
    expect(executeEnsure(ENSURE_ASCII(false, false), asciiFullNoSpaces)).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ASCII(false, false), asciiFull)).satisfies(checkEnsureArgErrors(descNoSpaces, asciiFull));
  });

  it('should allow only printable ascii characters without space', () => {
    expect(executeEnsure(ENSURE_ASCII(true, false), asciiPrintableNoSpaces)).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ASCII(true, false), asciiPrintable)).satisfies(checkEnsureArgErrors(descPrintableNoSpaces, asciiPrintable));
    expect(executeEnsure(ENSURE_ASCII(true, false), asciiFull)).satisfies(checkEnsureArgErrors(descPrintableNoSpaces, asciiFull));
    expect(executeEnsure(ENSURE_ASCII(true, false), asciiFullNoSpaces)).satisfies(checkEnsureArgErrors(descPrintableNoSpaces, asciiFullNoSpaces));
  });

  it('should disallow unicode', () => {
    const unicode = '🧲';
    expect(executeEnsure(ENSURE_ASCII(true), unicode)).satisfies(checkEnsureArgErrors(descPrintable, unicode));
    expect(executeEnsure(ENSURE_ASCII(true, false), unicode)).satisfies(checkEnsureArgErrors(descPrintableNoSpaces, unicode));
  });
});