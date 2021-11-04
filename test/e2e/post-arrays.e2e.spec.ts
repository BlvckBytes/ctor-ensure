import { expect } from 'chai';
import { CtorEnsure, CtorEnsureException, ENSURE_ENUM, ENSURE_ISARRAY, ValidatedArg } from '../../src';
import { checkExceptionHasFields, genModelName } from '../test-util';

describe('post-arrays E2E', () => {
  enum Tags {
    TAG1, TAG2, TAG3, TAG4, TAG5,
  }

  const displayname = genModelName();
  @CtorEnsure({
    displayname, 
    multipleErrorsPerField: true,
  })
  class Post {
    constructor (
      @ValidatedArg('tags', [
        ENSURE_ISARRAY(true, true),
        ENSURE_ENUM(Tags),
      ])
      public tags: string[] | string,
    ) {}
  }

  const displayname2 = genModelName();
  @CtorEnsure({
    displayname: displayname2, 
    multipleErrorsPerField: true,
  })
  class Post2 {
    constructor (
      @ValidatedArg('tags', [
        ENSURE_ISARRAY(true, true, true),
        ENSURE_ENUM(Tags),
      ])
      public tags: string[] | string,
    ) {}
  }

  it('should accept correct values', () => {
    expect(() => new Post([])).not.to.throw;
    expect(() => new Post([Tags[0], Tags[1], Tags[2]])).not.to.throw;
  });

  it('shouldn\'t accept a scalar value', () => {
    expect(() => new Post(Tags[0]))
    .to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields(displayname, ['tags']));
  });

  it('shouldn\'t accept duplicates case-sensitive', () => {
    expect(() => new Post([Tags[0], Tags[0]]))
    .to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields(displayname, ['tags']));

    expect(() => new Post([Tags[0], Tags[0].toLocaleLowerCase()])).not.to.throw;
  });

  it('shouldn\'t accept duplicates ignorecase', () => {
    expect(() => new Post2([Tags[0], Tags[0]]))
    .to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields(displayname2, ['tags']));

    expect(() => new Post2([Tags[0], Tags[0].toLocaleLowerCase()]))
    .to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields(displayname2, ['tags']));
  });
});