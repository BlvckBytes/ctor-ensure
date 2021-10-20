import { expect } from 'chai';
import { Encoding, ENSURE_BASEENCODED, evalStrThunk } from '../../src';

describe('ENSURE_BASEENCODED', () => {

  const validBase32 = 'JBSWY3DPEB3W64TMMQWCA5DINFZSA2LTEBBECU2FGMZCC===';
  const validBase58 = 'kBt4Pa5V3NRRv2wHd7d5NFHJeadNcfTLFBVeLY';
  const validBase64 = 'SGVsbG8gd29ybGQsIHRoaXMgaXMgQkFTRTY0IQ==';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_BASEENCODED(Encoding.BASE32).description)).to.equal('data encoded as BASE32');
    expect(evalStrThunk(ENSURE_BASEENCODED(Encoding.BASE58).description)).to.equal('data encoded as BASE58');
    expect(evalStrThunk(ENSURE_BASEENCODED(Encoding.BASE64).description)).to.equal('data encoded as BASE64');
  });

  it('should throw on unknown encoding', () => {
    expect(() => ENSURE_BASEENCODED(500)).to.throw('Unsupported base!');
  });

  it('should accept valid encoded data', () => {
    expect(ENSURE_BASEENCODED(Encoding.BASE32).pattern?.test(validBase32)).to.equal(true);
    expect(ENSURE_BASEENCODED(Encoding.BASE58).pattern?.test(validBase58)).to.equal(true);
    expect(ENSURE_BASEENCODED(Encoding.BASE64).pattern?.test(validBase64)).to.equal(true);
  });

  it('should accept empty data', () => {
    expect(ENSURE_BASEENCODED(Encoding.BASE32).pattern?.test('')).to.equal(true);
    expect(ENSURE_BASEENCODED(Encoding.BASE58).pattern?.test('')).to.equal(true);
    expect(ENSURE_BASEENCODED(Encoding.BASE64).pattern?.test('')).to.equal(true);
  });

  it('shouldn\'t allow invalid encoded data', () => {
    expect(ENSURE_BASEENCODED(Encoding.BASE32).pattern?.test(validBase58)).to.equal(false);
    expect(ENSURE_BASEENCODED(Encoding.BASE58).pattern?.test(validBase64)).to.equal(false);
    expect(ENSURE_BASEENCODED(Encoding.BASE64).pattern?.test(validBase58)).to.equal(false);
  });
});