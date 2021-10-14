import { expect } from 'chai';
import { ENSURE_EQUALS } from '../src';

// NOTE: Woah, there is still a lot of work to do here!

describe('STD ENSURE_EQUALS', () => {
  it('test description multiple', () => {
    const conf = ENSURE_EQUALS('a', 'b', 'c');
    expect(conf.description).equal('needs to equal to the fields: a, b, c');
  });

  it('test description single', () => {
    const conf = ENSURE_EQUALS('a');
    expect(conf.description).equal('needs to equal to the field: a');
  });
});