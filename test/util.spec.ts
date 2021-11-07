import { expect } from 'chai';
import { pluralize, strOpt } from '../src';
import { key, TemplateParameters } from '../src/description-template.factory';
import { escapeRegExp, evalDesc } from '../src/util';

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

describe('evalDesc()', () => {
  it('should return immediate values correctly', () => {
    // Provide immediate (hardcoded) value
    expect(evalDesc('immediate')).to.equal('immediate');
  });

  it('should evaluate string thunks correctly', () => {
    // Provide function that returns string
    expect(evalDesc(() => 'thunk')).to.equal('thunk');
  });

  it('should render templates correctly', () => {
    const templateVal = 'This is a test, {a}!';
    const templateValDE = 'Dies ist ein Test, {a}!';
    const template: TemplateParameters = {
      name: 'TEST',
      vars: { a: 5 },
    };

    process.env[key(template.name)] = templateVal;
    expect(evalDesc(template)).to.equal(templateVal.replace('{a}', template.vars?.a));

    process.env[key(`${template.name}--DE`)] = templateValDE;
    expect(evalDesc(template, 'DE')).to.equal(templateValDE.replace('{a}', template.vars?.a));
  });
});

describe('escapeRegExp()', () => {
  it('should properly escape regex-symbols', () => {
    expect(escapeRegExp('[]{}^$')).to.equal('\\[\\]\\{\\}\\^\\$');
  });
});