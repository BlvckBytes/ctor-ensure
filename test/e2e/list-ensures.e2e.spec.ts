import { expect } from 'chai';
import { CtorEnsure, CtorEnsureException, ENSURE_ARRAYSIZEMAX, ENSURE_ARRAYSIZEMIN, ENSURE_ENUM, ENSURE_ISARRAY, ValidatedArg } from '../../src';
import { genModelName } from '../test-util';

describe('list-ensure E2E', () => {
  enum Skill {
    FRONTEND,
    BACKEND,
  }


  const displayname = genModelName();
  @CtorEnsure({
    displayname,
    multipleErrorsPerField: true,
  })
  class Test {
    constructor (
      @ValidatedArg('skills', [
        ENSURE_ISARRAY(true, true, true),
        ENSURE_ARRAYSIZEMIN(1),
        ENSURE_ENUM(Skill),
      ])
      public skills: Skill[],
    ) {}
  }

  it('should not accept missing parameter', () => {
    expect(() => new Test(undefined as any))
    .to.throw(CtorEnsureException.message)
    .satisfy((e: CtorEnsureException) => (e.errors.filter(it => it.field === 'skills').length === 1));
  });

  it('should not accept empty array', () => {
    expect(() => new Test([]))
    .to.throw(CtorEnsureException.message)
    .satisfy((e: CtorEnsureException) => (e.errors.filter(it => it.field === 'skills').length === 2));
  });

  it('should not accept non-enum value', () => {
    expect(() => new Test([('not an enum' as any)]))
    .to.throw(CtorEnsureException.message)
    .satisfy((e: CtorEnsureException) => (e.errors.filter(it => it.field === 'skills').length === 1));
  });

  it('should not accept duplicate enum value, ignorecase', () => {
    expect(() => new Test([Skill[Skill.BACKEND], Skill[Skill.BACKEND] as any]))
    .to.throw(CtorEnsureException.message)
    .satisfy((e: CtorEnsureException) => (e.errors.filter(it => it.field === 'skills').length === 1));
  });

  it('should accept proper enum values', () => {
    expect(() => new Test([Skill[Skill.BACKEND], Skill[Skill.FRONTEND] as any]))
    .not.to.throw;
  });
});