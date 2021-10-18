import { expect } from 'chai';
import { CtorEnsure, CtorEnsureException, ENSURE_ALPHANUM, ENSURE_ENUM, ENSURE_MINMAX, ENSURE_NONEMPTY, STAGE_ISARRAY, ValidatedArg } from '../../src';

describe('post-arrays E2E', () => {
  enum Tags {
    TAG1, TAG2, TAG3, TAG4, TAG5,
  }

  @CtorEnsure('post', true)
  class Post {
    constructor (
      @ValidatedArg('tags', [
        ENSURE_ENUM(Tags),
      ], { isArray: true, isUnique: true })
      public tags: string[] | string,
    ) {}
  }

  const satisfyField = (field = 'tags') => (e: CtorEnsureException) => e.errors[0]?.field === field;

  it('should accept correct values', () => {
    expect(() => new Post([])).not.to.throw;
    expect(() => new Post([Tags[0], Tags[1], Tags[2]])).not.to.throw;
  });

  it('shouldn\'t accept a scalar value', () => {
    expect(() => new Post(Tags[0])).to.throw(CtorEnsureException.message).and.satisfy(satisfyField());
  });

  // it('shouldn\'t accept duplicates', () => {
  //   expect(() => new Post([Tags[0], Tags[0]])).to.throw(CtorEnsureException.message).and.satisfy(satisfyField());
  // });
});