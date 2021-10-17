import { expect } from 'chai';
import { pluralize, strOpt } from '../src';
import { escapeRegExp, evalStrThunk } from '../src/util';

describe('strOpt()', () => {
  it('string should be rendered if condition is true', () => {
    // Condition is true, string should be passed through
    expect(strOpt('test', true)).to.equal('test');
  });

  it('string should not be rendered if condition is false', () => {
    // Condition is false, string should be empty
    expect(strOpt('test', false)).to.be.empty;
  });
});

describe('pluralize()', () => {
  it('should add default s when != 1', () => {
    // character, multiple, s as default letter
    expect(pluralize('character', 0)).to.equal('characters');
  });

  it('shouldn\'t add a default s when == 1', () => {
    // character, one, s as default letter
    expect(pluralize('character', 1)).to.equal('character');
  });

  it('should add custom letter when != 1', () => {
    // str, multiple, z as letter
    expect(pluralize('str', 0, 'z')).to.equal('strz');
  });

  it('shouldn\'t add custom letter when == 0', () => {
    // str, one, z as letter
    expect(pluralize('str', 1, 'z')).to.equal('str');
  });
});

describe('evalStrThunk()', () => {
  it('should return immediate values correctly', () => {
    // Provide immediate (hardcoded) value
    expect(evalStrThunk('immediate')).to.equal('immediate');
  });

  it('should evaluate string thunks correctly', () => {
    // Provide function that returns string
    expect(evalStrThunk(() => 'thunk')).to.equal('thunk');
  });
});

describe('escapeRegExp()', () => {
  it('should properly escape regex-symbols', () => {
    expect(escapeRegExp('[]{}^$')).to.equal('\\[\\]\\{\\}\\^\\$');
  });
});