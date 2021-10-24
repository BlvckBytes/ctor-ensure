import { expect } from 'chai';
import { CtorEnsure, CtorEnsureException, ENSURE_ALPHANUM, ENSURE_MAXLEN, ENSURE_MINLEN, ENSURE_MINMAXLEN, ENSURE_NONEMPTY, ENSURE_STRUUID, ValidatedArg } from '../../src';
import { checkExceptionHasFields } from '../test-util';

const mkPost = (
  data: {
    title?: string,
    id?: string,
    username?: string,
    password?: string,
  } = {},
  userInherit = true, userBlocklist: string[] = [],
  postInherit = true, postBlocklist: string[] = [],
) => {
  const values = {
    title: '',
    id: '',
    username: '',
    password: '',
    ...data,
  };

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
    inheritValidation: userInherit,
    blockInheritanceForFields: userBlocklist,
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
    inheritValidation: postInherit,
    blockInheritanceForFields: postBlocklist,
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

  return () => new Post(values.title, values.id, values.username, values.password);
};

describe('inheritance E2E', () => {

  it('should inherit all errors', () => {
    expect(mkPost())
    .to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields('post', ['username', 'password', 'id', 'title']));
  });

  it('should inherit all but blocked out errors', () => {
    // Should ignore blocks of higher classes
    expect(mkPost({}, true, ['username'], true, ['password']))
    .to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields('post', ['username', 'id', 'title']));
   
    const data = {
      title: 'Cool title',
      id: 'f0e946fc-339d-11ec-8d3d-0242ac130003',
      username: 'Username',
      password: '',
    };

    expect(mkPost(data, true, [], true, ['password'])())
    .to.include(data);
  });

  it('should ignore errors above a non-inheriting class for all classes below', () => {
    expect(mkPost({}, false, [], true, []))
    .to.throw(CtorEnsureException.message)
    .to.satisfy(checkExceptionHasFields('post', ['id', 'title']));
  });
});