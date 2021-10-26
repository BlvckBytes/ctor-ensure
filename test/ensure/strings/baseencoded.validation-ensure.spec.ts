import { expect } from 'chai';
import { Encoding, ENSURE_BASEENCODED, evalStrThunk } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_BASEENCODED', () => {

  const validBase32 = 'JBSWY3DPEB3W64TMMQWCA5DINFZSA2LTEBBECU2FGMZCC===';
  const validBase58 = 'kBt4Pa5V3NRRv2wHd7d5NFHJeadNcfTLFBVeLY';
  const validBase64 = 'SGVsbG8gd29ybGQsIHRoaXMgaXMgQkFTRTY0IQ==';

  const desc32 = 'data encoded as BASE32';
  const desc58 = 'data encoded as BASE58';
  const desc64 = 'data encoded as BASE64';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_BASEENCODED(Encoding.BASE32).description)).to.equal(desc32);
    expect(evalStrThunk(ENSURE_BASEENCODED(Encoding.BASE58).description)).to.equal(desc58);
    expect(evalStrThunk(ENSURE_BASEENCODED(Encoding.BASE64).description)).to.equal(desc64);
  });

  it('should throw on unknown encoding', () => {
    expect(() => ENSURE_BASEENCODED(500)).to.throw('Unsupported base!');
  });

  it('should accept valid encoded data', () => {
    expect(executeEnsure(ENSURE_BASEENCODED(Encoding.BASE32), validBase32)).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_BASEENCODED(Encoding.BASE58), validBase58)).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_BASEENCODED(Encoding.BASE64), validBase64)).to.have.lengthOf(0);
  });

  it('should accept empty data', () => {
    expect(executeEnsure(ENSURE_BASEENCODED(Encoding.BASE32), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_BASEENCODED(Encoding.BASE58), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_BASEENCODED(Encoding.BASE64), '')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow invalid encoded data', () => {
    expect(executeEnsure(ENSURE_BASEENCODED(Encoding.BASE32), validBase58)).satisfies(checkEnsureArgErrors(desc32, validBase58));
    expect(executeEnsure(ENSURE_BASEENCODED(Encoding.BASE58), validBase64)).satisfies(checkEnsureArgErrors(desc58, validBase64));
    expect(executeEnsure(ENSURE_BASEENCODED(Encoding.BASE64), validBase32)).satisfies(checkEnsureArgErrors(desc64, validBase32));
  });
});