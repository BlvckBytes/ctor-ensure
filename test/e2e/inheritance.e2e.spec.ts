import { expect } from 'chai';
import { CtorEnsure, CtorEnsureException, ENSURE_ALPHANUM, ENSURE_MAXLEN, ENSURE_MINLEN, ENSURE_MINMAXLEN, ENSURE_NONEMPTY, ENSURE_STRUUID, ValidatedArg } from '../../src';

describe('inheritance E2E', () => {

  it('should inherit all errors', () => {
    @CtorEnsure({
      displayname: 'credentials',
      multipleErrorsPerField: true,
    })
    class Credentials {
      constructor (
        @ValidatedArg('username', [
          ENSURE_NONEMPTY(),
          ENSURE_ALPHANUM(),
          ENSURE_MAXLEN(30),
        ])
        public username: string,

        @ValidatedArg('password', [
          ENSURE_NONEMPTY(),
          ENSURE_MINMAXLEN(10, 30),
        ])
        public password: string,
      ) {}
    }

    @CtorEnsure({
      displayname: 'user',
      multipleErrorsPerField: true,
      inheritValidation: true,
    })
    class User extends Credentials {
      constructor (
        @ValidatedArg('id', [
          ENSURE_NONEMPTY(),
          ENSURE_STRUUID(),
        ])
        public id: string,
        username: string,
        password: string,
      ) {
        super(username, password);
      }
    }

    @CtorEnsure({
      displayname: 'post',
      multipleErrorsPerField: true,
      inheritValidation: true,
    })
    class Post extends User {
      constructor (
        @ValidatedArg('title', [
          ENSURE_NONEMPTY(),
          ENSURE_MINLEN(10),
        ])
        public title: string,
        userid: string,
        username: string,
        password: string,
      ) {
        super(userid, username, password);
      }
    }

    expect(() => new Post('', '', '', ''))
    .to.throw(CtorEnsureException.message)
    .to.satisfy((e: CtorEnsureException) => (
      e.errors.some(it => it.field === 'username') &&
      e.errors.some(it => it.field === 'password') &&
      e.errors.some(it => it.field === 'id') &&
      e.errors.some(it => it.field === 'title')
    ));
  });

  it('should inherit all but blocked out errors', () => {
    @CtorEnsure({
      displayname: 'credentials',
      multipleErrorsPerField: true,
    })
    class Credentials {
      constructor (
        @ValidatedArg('username', [
          ENSURE_NONEMPTY(),
          ENSURE_ALPHANUM(),
          ENSURE_MAXLEN(30),
        ])
        public username: string,

        @ValidatedArg('password', [
          ENSURE_NONEMPTY(),
          ENSURE_MINMAXLEN(10, 30),
        ])
        public password: string,
      ) {}
    }

    @CtorEnsure({
      displayname: 'user',
      multipleErrorsPerField: true,
      inheritValidation: true,
    })
    class User extends Credentials {
      constructor (
        @ValidatedArg('id', [
          ENSURE_NONEMPTY(),
          ENSURE_STRUUID(),
        ])
        public id: string,
        username: string,
        password: string,
      ) {
        super(username, password);
      }
    }

    @CtorEnsure({
      displayname: 'post',
      multipleErrorsPerField: true,
      inheritValidation: true,
      blockInheritanceForFields: [
        'password',
      ],
    })
    class Post extends User {
      constructor (
        @ValidatedArg('title', [
          ENSURE_NONEMPTY(),
          ENSURE_MINLEN(10),
        ])
        public title: string,
        userid: string,
        username: string,
        password: string,
      ) {
        super(userid, username, password);
      }
    }

    expect(() => new Post('', '', '', ''))
    .to.throw(CtorEnsureException.message)
    .to.satisfy((e: CtorEnsureException) => (
      e.errors.some(it => it.field === 'username') &&
      e.errors.some(it => it.field === 'id') &&
      e.errors.some(it => it.field === 'title')
    ));
   
    expect(new Post('Cool title', 'f0e946fc-339d-11ec-8d3d-0242ac130003', 'Username', ''))
    .to.include({
      title: 'Cool title',
      id: 'f0e946fc-339d-11ec-8d3d-0242ac130003',
      username: 'Username',
      password: '',
    });
  });
});