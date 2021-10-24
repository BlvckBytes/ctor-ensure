import { expect } from 'chai';
import { CtorEnsure, CtorEnsureException, ENSURE_ALPHANUM, ENSURE_EMAIL, ENSURE_ENUM, ENSURE_EQUALS, ENSURE_MINLEN, ENSURE_MINMAXLEN, ENSURE_NOSPACES, ENSURE_STRDATE, META_KEY_DISPLAYNAME, ValidatedArg } from '../../src';
import { checkExceptionHasFields } from '../test-util';

describe('user-creation E2E', () => {
  enum Role {
    USER,
    MODERATOR,
    ADMIN,
  }

  @CtorEnsure({
    displayname: 'user', 
    multipleErrorsPerField: true,
  })
  class User {
    constructor (
      @ValidatedArg('username', [
        ENSURE_ALPHANUM(),
        ENSURE_NOSPACES(),
        ENSURE_MINMAXLEN(10, 15),
      ])
      public username: string,

      @ValidatedArg('password', [
        ENSURE_MINLEN(10),
      ])
      public password: string,

      @ValidatedArg('passwordRepeated', [
        ENSURE_EQUALS('password'),
      ])
      public passwordRepeated: string,

      @ValidatedArg('dateOfBirth', ENSURE_STRDATE())
      public dateOfBirth: string,

      @ValidatedArg('email', ENSURE_EMAIL())
      public email: string,

      @ValidatedArg('role', ENSURE_ENUM(Role, true))
      public role: Role,
    ) {}
  }

  const mkDefault = (overrides: { [key: string]: any } = {}) => {
    const v = {
      username: 'BlvckBytes',
      password: 'helloworld',
      passwordRepeated: 'helloworld',
      dateOfBirth: new Date().toISOString(),
      email: 'blvckbytes@gmail.com',
      role: Role.USER,
      ...overrides,
    };
    new User(
      v.username, v.password, v.passwordRepeated,
      v.dateOfBirth, v.email, v.role,
    );
  };

  it('should accept values within range', () => {
    expect(() => mkDefault()).not.to.throw;
  });

  it('shouldn\'t accept differing passwords', () => {
    expect(() => mkDefault({
      passwordRepeated: 'different',
    })).to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields('user', ['passwordRepeated']));
  });

  it('shouldn\'t accept short or long usernames', () => {
    expect(() => mkDefault({
      username: 'short',
    })).to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields('user', ['username']));

    expect(() => mkDefault({
      username: 'long'.repeat(10),
    })).to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields('user', ['username']));
  });

  it('shouldn\'t accept invalid email', () => {
    expect(() => mkDefault({
      email: 'non existent @ example-com',
    })).to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields('user', ['email']));
  });

  it('shouldn\'t accept invalid dob', () => {
    expect(() => mkDefault({
      dateOfBirth: '12.11.2000',
    })).to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields('user', ['dateOfBirth']));
  });

  it('should accept valid role', () => {
    for (let i = 0; i < Object.keys(Role).length / 2; i += 1)
      expect(() => mkDefault({
        role: Role[i],
      })).not.to.throw;
  });

   it('shouldn\'t accept invalid role', () => {
    expect(() => mkDefault({
      role: 'DEVELOPER',
    })).to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields('user', ['role']));
  });
});