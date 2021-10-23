# ctor-ensure

[![codecov](https://codecov.io/gh/BlvckBytes/ctor-ensure/branch/master/graph/badge.svg)](https://codecov.io/gh/BlvckBytes/ctor-ensure)
![Build Status](https://github.com/BlvckBytes/ctor-ensure/workflows/NodeJS%20CI/badge.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Ensure that the arguments of your constructor meet constraints defined through decorators.

## Aims

I developed this from scratch, since I couldn't find any other module that was able to directly validate constructor arguments (to make use of typescript's shorthand notation) and which wasn't bloatware. Simple things like these should be kept as small and concise as possible.

## Advantages

The biggest advantage of this module is the fact that it allows you to directly validate constructor arguments. In combination with typescript, this means that the constructor defines and validates those arguments all in one go. This greatly reduces boilerplate code, especially in conjunction with the handy standard ensurements, that you're always free to extend to your liking. It can be viewed as an atomic transaction, since there are no states of inconsistency between creating your class and having a valid instance.

* ✅ Reduced boilerplate code, thanks to direct argument validation
* ✅ Handy pre-made standard ensurements
* ✅ Great extendability
* ✅ Rich exception that can be customly mapped
* ✅ Template engine for validation descriptions
* ✅ Small and very simple

## Installation

🧨 [WARNING] 🧨 This module is not yet officially registered! Coming soon!

Using npm:
```bash
npm install ctor-ensure --save
```

Using yarn:
```bash
yarn add ctor-ensure
```

Last but not least, make sure you have your .ENV set up properly, feel free to use the default provided by `.env-presets`.

## How to use

Mark the target class for validation. This decorator uses a configuration object as it's only parameter, like you're probably used to already from other frameworks. The following options are at your disposal:

```typescript
/**
 * Configuration to be used with the {@link CtorEnsure} decorator
 */
interface CtorEnsureConfig {
  // Displayname of the class
  displayname: string;

  // Whether or not to display multiple errors per field
  // Default: false
  multipleErrorsPerField?: boolean;

  // Whether or not to inherit any validation from super-classes
  // Default: false
  inheritValidation?: boolean;

  // Fields for which inheritance of validation is blocked
  // This is only processed for the called class and does not
  // merge with super-classes. It has full access to all super-
  // class fields, including the most-base class
  // Default: empty
  blockInheritanceForFields?: string[];
}
```

For demonstration purposes, we'll switch multiple errors on and leave the other fields at their default value for now.

```typescript
@CtorEnsure({
  displayname: 'UserRegistration', 
  multipleErrorsPerField: true,
})
class UserRegistrationModel {}
```

Create a constructor using shorthand properties
```typescript
@CtorEnsure({
  displayname: 'UserRegistration', 
  multipleErrorsPerField: true,
})
class UserRegistrationModel {

  constructor(
    public id: string,
    public username: string,
    public password: string,
    public passwordRepeated: string,
    public email: string,
    public hobbies: string[],
    public dateOfBirth: string,
  ) {}
}
```

Now it's time to decide on which and how arguments need to be validated. This decorator has just two parameters: The field's displayname and either a single or an array of ensures. Personally, I like to always put an array with one ensure per line, just for readability's sake, and for quick addition of more ensures.

```typescript
@CtorEnsure({
  displayname: 'UserRegistration', 
  multipleErrorsPerField: true,
})
class UserRegistrationModel {

  constructor(
    public id: string,

    // Alphanumeric and between 5 and 20 characters
    @ValidatedArg('username', [
      ENSURE_ALPHANUM(),
      ENSURE_MINMAXLEN(5, 20),
    ])
    public username: string,

    // Between 10 and 30 characters
    @ValidatedArg('password', [
      ENSURE_MINMAXLEN(10, 30),
    ])
    public password: string,

    // Equal to the password-argument
    @ValidatedArg('passwordRepeated', [
      ENSURE_EQUALS('password'),
    ])
    public passwordRepeated: string,

    // Valid email address
    @ValidatedArg('email', [
      ENSURE_EMAIL(),
    ])
    public email: string,

    // Has to be an array with unique (ignorecase) values
    // Every array element: between 5 and 20 characters
    @ValidatedArg('hobbies', [
      ENSURE_ISARRAY(true, true, true),
      ENSURE_MINMAX(5, 20),
    ])
    public hobbies: string[],

    // Valid full ISO-8601 datetime
    @ValidatedArg('dateOfBirth', [
      ENSURE_STRDATE(),
    ])
    public dateOfBirth: string,
  ) {}
}
```

That's it! Couldn't be much easier, right? Let's have a quick look at the structure of a resulting exception.

```typescript
/**
 * Thrown when a constructor didn't pass validation
 */
interface CtorEnsureException {
  // Name of source class
  displayName: string;

  // Source class
  clazz: Constructable;

  // Validation errors based on individual fields
  errors: CtorEnsureArgError[];
}
```

You get provided with the class, it's displayname and the occurred errors, based on the individual fields. Just like this:

```typescript
/**
 * Describes an occurred validation error for a constructor's field
 */
interface CtorEnsureArgError {
  // Displayname of field
  field: string;

  // Description of failed ensure
  description: string;

  // Value that caused the issue
  value: any;
}
```

Every error (ensure) per field will produce one arg-error, so you could group these by the field property when displaying, as I'll do in my output.

Now, that we're all wired up, it's time to give it a shot! I will be using NestJS in conjunction with a custom exception filter, in order to map the detailled data to a beautiful error message.

```typescript
@Catch(CtorEnsureException)
class CtorEnsureExceptionFilter implements ExceptionFilter {
  catch(ex: CtorEnsureException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const validationErrors = {};
    const fieldErrors = {};
    ex.errors.forEach((error) => {
      fieldErrors[error.field] = [].concat(
        ...(fieldErrors[error.field] || []),
        [error.description],
      );
    });
    validationErrors[ex.displayName] = fieldErrors;

    ctx.getResponse<Response>().status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      validationErrors,
    });
  }
}
```

Quick and dirty, but it gets the job done. This is how the output looks like:

```javascript
{
  "statusCode": 400,
  "timestamp": "2021-10-13T23:06:22.527Z",
  "validationErrors": {
    "UserRegistration": {
      "username": [
        "alphanumeric characters",
        "at least 10 characters and up to 20 characters"
      ],
      "password": [
        "at least 10 characters and up to 30 characters"
      ],
      "passwordRepeated": [
        "equal to field: password"
      ],
      "email": [
        "valid email"
      ],
      "hobbies": [
        "array of values which is unique ignorecase",
        "at least 5 characters and up to 20 characters"
      ],
      "dateOfBirth": [
        "full ISO-8601 datetime string"
      ]
    }
  }
}
```

Wow! Now that's what I call a descriptive error message, providing a nice user experience to your API-invoker, especially when you keep the little effort to set this up in mind.

### Inheritance

There are many ways to implement validation inheritance, and I've tried many of them. The goal of this project is to keep a balance between simplicity and granularity, which I think I've achieved with the following solution:

Let's start by defining two separate, independent, validated classes:
```typescript
@CtorEnsure({
  displayname: 'Credentials',
  multipleErrorsPerField: true,
})
class Credentials {
  constructor (
    @ValidatedArg('username', [
      ENSURE_ALPHANUM(),
      ENSURE_MINMAXLEN(5, 30),
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
  displayname: 'User',
  multipleErrorsPerField: true,
})
class User {
  constructor (
    @ValidatedArg('id', [
      ENSURE_NONEMPTY(),
      ENSURE_STRUUID(),
    ])
    public id: string,
  ) {}
}
```

Obviously, the user is going to need some credentials still. Since we've already defined a class and some pretty plausible validations for it, we'd like to reuse that within the user's class. In order to accomplish this, I will add it as a super-class, add passthrough-arguments to the constructor, and enable the inheritance flag on the user's decorator.

```typescript
@CtorEnsure({
  displayname: 'Credentials',
  multipleErrorsPerField: true,
})
class Credentials {
  constructor (
    @ValidatedArg('username', [
      ENSURE_ALPHANUM(),
      ENSURE_MINMAXLEN(5, 30),
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
  displayname: 'User',
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
```

Yep, that's it! But wait, what if I want to - just for the user's class - disable the validation of the `password` field? There's a way to block individual fields using yet another config property, which works like this: Add the displayname of any field to the array, and it will not be validated for **the current model's invocation only**. All fields from *(including)* the derived class this is applied on, up to *(including)* the highest base-class are available! By design, this is **not** stackable, which means if there would be another class inbetween, which blocks fields, it only blocks them for itself, not affecting classes below it in the chain. That would just get confusing real quick, and is not really necessary.

```typescript
@CtorEnsure({
  displayname: 'Credentials',
  multipleErrorsPerField: true,
})
class Credentials {
  constructor (
    @ValidatedArg('username', [
      ENSURE_ALPHANUM(),
      ENSURE_MINMAXLEN(5, 30),
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
  displayname: 'User',
  multipleErrorsPerField: true,
  inheritValidation: true,
  blockInheritanceForFields: [
    'password',
  ],
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
```

Whenever you instantiate a user, it will validate all fields, but skip `password`. This technique allows for a very flexible and DRY schema notation.

## Standard Ensures

There are a lot of standard ensures shipped with this module that you can combine with your decorators to build great validation.

| Ensure | Parameters | Checks | Allows Empty Values |
|--------|------------|--------|---------------------|
| **Datatypes** |
| ENSURE_ISARRAY | positive: boolean, unique: boolean, ignoreCase: boolean | Data structure and content | yes |
| ENSURE_BOOLEAN | / | Boolean value (true/false) | no |
| ENSURE_ENUM | values: { [key: string]: string | number }, useKey: boolean | Only enum keys/values | yes |
| ENSURE_FLOAT | / | Floating point number | no |
| ENSURE_INT | / | Integer number | no |
| ENSURE_EXISTING | / | Has to be defined | yes |
| ENSURE_NONNULL | / | No null values | yes |
| **Strings** |
| ENSURE_MAXLEN | max: number | Maximum string length | yes |
| ENSURE_MINLEN | min: number | Minimum string length | / |
| ENSURE_MINMAXLEN | min: number, max: number | Minimum and maximum string length | / |
| ENSURE_NONEMPTY | / | No empty strings | no |
| ENSURE_NOSPACES | / | No spaces in string | yes |
| ENSURE_PATTERN | pattern: RegExp, description: string | Custom pattern validation | / |
| ENSURE_STRDATE | / | Full ISO-8601 datetime string | yes |
| ENSURE_STRFLOAT | / | Floating point number as string | yes |
| ENSURE_STRINT | / | Integer number as string | yes |
| ENSURE_STRUUID | / | UUID as string | yes |
| ENSURE_ALPHA | allowSpaces: boolean | Alphabetical characters | yes |
| ENSURE_ALPHANUM | allowSpaces: boolean | Alphanumerical characters | yes |
| ENSURE_ASCII | justPrintable: boolean, allowSpaces: boolean | ASCII characters | yes |
| ENSURE_BASEENCODED | encoding: Encoding | BaseX encoded data | yes |
| ENSURE_CONTAINS | string: string, allow: boolean | String contains or not contains | / |
| ENSURE_EMAIL | / | Valid E-Mail format | yes |
| **Miscellaneous** |
| ENSURE_EQUALS | ...fieldNames: string[] | Content equals to content of provided fields | / |

## Custom Ensures

Please try to avoid defining ensures inline with the constructor parameter decorator, while it is certainly possible, this causes nothing but confusion and inconsistencies. Just define your own ensure, which does nothing but create `ValidationConfig` based on your arguments.

```typescript
/**
 * Configuration of a validation chain element
 */
export interface ValidationConfig {
  // Description of this validator
  description: (() => string) | string;

  // Callback to process this configuration
  // Returns passing as true and failed as false
  process: (
    // Value to validate, always scalar
    value: any,

    // Neighbor validation controls
    neighbors: ValidationControl[],

    // All constructor arguments
    ctor: any[],

    // Parent validation control
    parent: ValidationControl,

    // Current ctor argument, scalar or array
    arg: any,
  ) => boolean;
}
```

The description may be an immediate value, or a thunk. `process()` will be called for every field (or element of an array) the ensure is connected with. It simply returns true if the validation succeeded, and false if it didn't. To get a feel for how the standard ensures have been implemented, have a look at the sourcecode.

## Templating

As you may have already noticed in the advantage-section, this module comes with a small template engine. There are multiple reasons why I've created it:

* ✅ Centralization of all messages in a single file
* ✅ Standardization accross multiple microservices

There are two elements at your disposal:
* ✅ Variables: passed through by the template invocation
* ✅ Functions: allowing to format conditionally

### Syntax in JS

Here's a quick example of a template for the minmaxlen-ensure:

```typescript
/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the length of a string
 * @param min Minimum length
 * @param max Maximum length
 */
const ENSURE_MINMAXLEN = (min: number, max: number): ValidationConfig => {
  if (min < 0 && max < 0)
    throw new SyntaxError('Define at least min or max!');
  if (min > max && max !== -1)
    throw new SyntaxError('Max cannot be less than min!');

  const pattern = new RegExp(`^.{${min > 0 ? min : 0},${max > 0 ? max : ''}}$`);

  return {
    description: template('ENSURE_MINMAXLEN', {
      min, max, hasMin: min > 0, hasMax: max > 0, hasBoth: min > 0 && max > 0,
    }),
    process: (value) => pattern.test(value),
  };
};
```

After the ensure's arguments have been validated, a pattern is built conditionally, which will later be used to test against the value inside `process()`. For the description, I call `template()`, using the name specified inside `.env`, and a map of variables. `min` and `max` are just passed along, `hasMin`, `hasMax` and `hasBoth` are evaluated booleans.

### Syntax in .ENV

```
# Format: CTOR_ENSURE_<name>_DESC=<template>
CTOR_ENSURE_ENSURE_MINMAXLEN_DESC=opt:"at least {min} plur:"character":{min}":{hasMin}opt:" and ":{hasBoth}opt:"up to {max} plur:"character":{max}":{hasMax}
```

There's a lot going on! Keys are always defined by using the pattern specified by the format-comment, to avoid collisions with other variables. The value represents the template. Variables are very simple, just use `{variable}` anywhere. Unknown variables will not be substituted. To avoid substitution, escape: `\{variable\}`

Functions, on the other hand, can get quite complex to notate. At the simplest, that's the format: `name:arg1:arg2:arg3:...`. Use `name:arg1\:` to escape colons. Functions can have as many arguments as you'd like, and they will be passed 1:1 to the JS-function. After evaluation, the result is substituted with the function's return value. There are only two types of arguments, strings `"string"` and variables `{variable}`. Variables are just substituted, as stated, and strings themselves can contain variables and functions again. This way, you can nest calls!

```
opt:"at least {min} plur:"character":{min}":{hasMin}
```

This notates a optional string, `"at least {min} plur:"character":{min}"`, which will only be rendered when `{hasMin}` holds a value of true. The optional string contains another function call, `plur:"character":{min}`, which will pluralize the word `"character"` based on the number `{min}`. As of now, there are only these two basic functions provided by default, but you can always create and register your own. The functions look like this:

```typescript
/**
 * Make a string optional, which means it'll be empty when the
 * condition didin't evaluate to true
 * @param str String to optionalize
 * @param state Condition
 * @returns Original string or empty string
 */
const strOpt = (str: string, state: boolean): string => state ? str : '';

/**
 * Pluralize a word, based on the corresponding count. Also
 * gets rid of all spaces on the right to properly append
 * @param word Word in singular form
 * @param num Count of type the word describes
 * @param suf Suffix for plural, defaults to s
 * @returns Pluralized word
 */
const pluralize = (word: string, num: number, suf = 's'): string => `${word.trimRight()}${strOpt(suf, num !== 1)}`;

/**
 * Shorthand to use a ternary operator on two string parameters
 * @param state Boolean representing state
 * @param ifTrue String for true state
 * @param ifFalse String for false state
 * @returns Either one of the strings
 */
const ternaryString = (state: boolean, ifTrue: string, ifFalse: string): string => state ? ifTrue : ifFalse;
```

They have quite long names, which is why they're registered with a short alias:

```typescript
// Default functions that are always available
const PREDEFINED_FUNCTIONS: FunctionMap = {
  opt: strOpt,
  plur: pluralize,
  trn: ternaryString,
}
```

You can always add to this global registry, by calling this before your application launches:

```typescript
/**
 * Register a new function to be available globally inside all templates
 * @param name Name of the function inside template
 * @param func Reference to function
 */
const registerTemplateFunction = (name: string, func: TemplateFunction) => {
  PREDEFINED_FUNCTIONS[name] = func;
}
```

On the other hand, if you just need a function locally, for the specific template, you can provide it in the `template` call directly, in an inline-fashion.

## Contribution

If you have any suggestions on how to improve this module, I'm happy to hear about it!

### Testing

I want this module to be tested as thoroughly as possible, which is why I aim for 100% coverage. But remember, you can still leave out special edge-cases, even though all lines and branches have been covered by your tests. So please try to always write tests parallel to the development of the new feature.

There are two very simple to use utility methods, that cut down on the boilerplate code by a fair margin.

```typescript
/**
 * Execute a ensure and retrieve a list of it's ensure-arg errors
 * @param ensure Ensure to execute
 * @param value Value to execute it against
 * @param otherControls Neighbor controls, for real-case scenario mocks
 * @returns List of ensure-arg errors that occurred
 */
const executeEnsure = (ensure: ValidationConfig, value: any, otherControls: { [key: string]: any} = {} ): CtorEnsureArgError[];
```

```typescript
/**
 * To be used in conjunction with satisfy() from chai, to check the
 * valid existence of an ensure-arg error
 * @param description Expected description of the error
 * @param value Value that is causing this error
 * @returns True if found, false otherwise
 */
export const checkEnsureArgError = (description: string, value: any) => (errors: CtorEnsureArgError[]): boolean;
```

And here's a quick example of how I tend to use these:

```typescript
describe('ENSURE_ALPHA', () => {

  let alpha = ''; // Containing all alphanumeric characters...

  // Prepare all possible descriptions beforehand (can be used with interpolation too)
  const desc = 'only alphabetical characters';
  const descNoSpaces = 'only alphabetical characters without spaces';

  it('should allow all alphabetical characters', () => {
    expect(executeEnsure(ENSURE_ALPHA(), alpha)).to.have.lengthOf(0);
  });

  it('should allow empty strings', () => {
    expect(executeEnsure(ENSURE_ALPHA(), '')).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ALPHA(false), '')).to.have.lengthOf(0);
  });

  it('should disallow spaces', () => {
    expect(executeEnsure(ENSURE_ALPHA(false), alpha)).satisfies(checkEnsureArgError(descNoSpaces, alpha));
    expect(executeEnsure(ENSURE_ALPHA(false), alpha.substring(1))).to.have.lengthOf(0);
  });

  it('should disallow numeric non-alpha characters', () => {
    const nonAlpha = '0123456789';
    expect(executeEnsure(ENSURE_ALPHA(), nonAlpha)).satisfies(checkEnsureArgError(desc, nonAlpha));
  });

  it('should disallow other non-alpha characters', () => {
    const nonAlpha = '@!$%#?:;-.+';
    expect(executeEnsure(ENSURE_ALPHA(), nonAlpha)).satisfies(checkEnsureArgError(desc, nonAlpha));
  });
});
```

This way, I can usually check every case with about 1-3 lines of code only, and don't miss out on any granularity checking. I strongly advise you to take advantage of those utilities, if you plan on adding to this repo.