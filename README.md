# ctor-ensure

[![install size](https://packagephobia.now.sh/badge?p=ctor-ensure)](https://packagephobia.now.sh/result?p=ctor-ensure)
[![npm version](https://badge.fury.io/js/ctor-ensure.svg)](https://badge.fury.io/js/ctor-ensure)
[![codecov](https://codecov.io/gh/BlvckBytes/ctor-ensure/branch/master/graph/badge.svg)](https://codecov.io/gh/BlvckBytes/ctor-ensure)
![Build Status](https://github.com/BlvckBytes/ctor-ensure/workflows/NodeJS%20CI/badge.svg)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Ensure that the arguments of your constructor meet constraints defined through decorators.

✏️ NOTE: If you want to learn about this repo by using a demo, have a look at [Demo Project](#demo-project)!

## Table of Contents
* [Aims](#aims)
* [Advantages](#advantages)
* [Installation](#installation)
* [How To use](#how-to-use)
  * [Full Example](#full-example)
  * [Optionality](#optionality)
  * [Inheritance](#inheritance)
  * [Object Validation](#object-validation)
  * [Object Parsing](#object-parsing)
  * [Demo Project](#demo-project)
* [Standard Ensures](#standard-ensures)
* [Custom Ensures](#custom-ensures)
* [Templating](#templating)
  * [Syntax JS](#syntax-in-js)
  * [Syntax .ENV](#syntax-in-env)
  * [Multilingual](#multilingual)
* [Contribution](#contribution)
  * [Testing](#testing)
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

Using npm:
```bash
npm install ctor-ensure --save
```

Using yarn:
```bash
yarn add ctor-ensure
```

Last but not least, make sure you have your .ENV set up properly, feel free to use the default provided by `.env-presets`.

## How To use

### Full Example

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

  // Callback to check whether or not to
  // skip this class's validation
  skipOn?: (
    // Values of constructor, where the key is
    // is field's displayname
    values: { [ key: string ]: any }
  ) => boolean;

  // Whether or not the skipOn callback also skips
  // inherited errors
  skipOnSkipsInherited?: boolean;
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

Now it's time to decide on which and how arguments need to be validated. This decorator has three parameters: The field's displayname, either a single or an array of ensures, it's optionality state and the skipOn callback to allow conditional skipping of validation for that one field. Personally, I like to always put an array with one ensure per line, just for readability's sake, and for quick addition of more ensures.

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
      ENSURE_EQUALSFIELD(true, 'password'),
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

### Optionality

Fields can be optional, where it's then decided whether or not it's nullable, omittable, or both. Use this enum as a third parameter on validated arguments:

```typescript
/**
 * Signals the state of optionality of a validated argument
 */
enum Optionality {
  // Needs to have a defined, non-null value
  REQUIRED,

  // Can be omitted, thus undefined
  OMITTABLE,

  // Can be null
  NULLABLE,

  // Can be undefined, null, or an actual value
  IRRELEVANT,
}
```

Required arguments are always validated, omittable's validation is skipped on undefined values, nullable's on null, and irrelevant's on both. By default, all arguments are required.

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

Obviously, the user is going to need some credentials still. Since we've already defined a class and some pretty plausible validations for it, we'd like to reuse that within the user's class. In order to accomplish this, I will add it as a super-class, add passthrough-arguments to the constructor, and enable the inheritance flag on the user's decorator. When this flag is off, all errors above the class are ignored, and thus not inherited. This also affects class down the chain.

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

Whenever you instantiate a user, it will validate all fields, but skip `password`. This technique allows for a very flexible and DRY schema notation. You can use `*` as a field-name inside the block-list to disable all fields within the whole chain up from *(including)* this class, which can be useful too, if not abused.

The `skipOn` callback, which can also be used on class-level, comes with a companion, named `skipOnSkipsInherited`. If that flag is set to true, the inherited validations will also skip, if `skipsOn` evaluates to true. Otherwise, just the class' validation itself will be disabled.

### Object Validation

There's a quick way to just validate a (non-class) object's fields and receive a list of errors, using this method:

```typescript
const validateCtor = (className: string, value: any, templateLang: string): CtorEnsureArgError[] | null;
```

The `className` corresponds to the displayname defined using `@CtorEnsure` and the value can be any object. If the `className` is unknown, null will be returned, otherwise you'll get a list of errors. This is especially useful to validate fields within a UI, without hardcoding any validation and using async backend calls. Since fields can depend on eachother, I've ommitted single field validation at this point, and just validate the whole object as is. `templateLang` will be described [here](#multilingual).

The function `validateCtor` internally makes use of `argsFromObj`, which is also available within this API. It allows you to extract constructor arguments from a plain object and then returns an array of any types in just the right order to later on be used with the spread operator.

```typescript
new MyClass(...argsFromObj(MyClass, x))
```

Arguments are matched by their name defined using `ValidatedArg` on the class as well as the property names within the plain object. If an argument cannot be found, `undefined` will take it's place within the argument array.

If you need to know whether or not a class type is constructor validated by this library, use the following utility:

```typescript
/**
 * Check whether or not a given class is marked by @CtorEnsure
 * @param Clazz Class to test
 */
const isCtorEnsured = (Clazz: Constructable) => Reflect.getMetadata(META_KEY_DISPLAYNAME, Clazz) !== undefined;
```

### Object Parsing

In order to quickly parse plain objects like request bodies into validated classes while also making sure validation errors will occur on mismatching values, the following utility method is at your disposal:

```typescript
/**
 * Create a validated class instance from a plain object's keys
 * @param Clazz Clazz to create
 * @param obj Object to extract from
 */
const fromObj = (Clazz: Constructable, obj: any) => {
  const args = argsFromObj(Clazz, obj);
  if (!args) throw new Error('Class is not marked by @CtorEnsure!');
  return new Clazz(...args);
};
```

It's basically just a routine using APIs you already know, but it packages it up nice and tidy. That's a perfect fit for pipes using NodeJS (middleware).

### Demo Project

You can find a demo project containing a back- and frontend implementation here: [ctor-ensure-demo](https://github.com/BlvckBytes/ctor-ensure-demo)

## Standard Ensures

There are a lot of standard ensures shipped with this module that you can combine with your decorators to build great validation.

| Ensure | Parameters | Checks | Allows Empty Values |
| :----- | :--------- | :----- | :-------------------|
| **Datatypes** |
| ENSURE_ISARRAY | positive: boolean, unique: boolean, ignoreCase: boolean | Allow/disallow array type, allow/disallow duplicates | yes |
| ENSURE_BOOLEAN | / | Boolean value (true/false) | no |
| ENSURE_ENUM | values: { [key: string]: string \| number }, disallow: boolean, useKey: boolean | Only (or not) enum keys/values | no |
| ENSURE_FLOAT | / | Floating point number | no |
| ENSURE_INT | / | Integer number | no |
| ENSURE_EXISTING | / | Has to be defined | yes |
| ENSURE_NONNULL | / | No null values | yes |
| ENSURE_ISDATE | / | JS date object | no |
| **Strings** |
| ENSURE_NONEMPTY | / | No empty strings | no |
| ENSURE_NOSPACES | / | No spaces in string | yes |
| ENSURE_PATTERN | pattern: RegExp, description: string | Custom pattern validation | / |
| ENSURE_STRDATE | / | Full ISO-8601 datetime string | no |
| ENSURE_STRFLOAT | / | Floating point number as string | no |
| ENSURE_STRINT | / | Integer number as string | no |
| ENSURE_STRUUID | / | UUID as string | no |
| ENSURE_ALPHA | allowSpaces: boolean | Alphabetical characters | / |
| ENSURE_ALPHANUM | allowSpaces: boolean | Alphanumerical characters | / |
| ENSURE_ASCII | justPrintable: boolean, allowSpaces: boolean | ASCII characters | / |
| ENSURE_BASEENCODED | encoding: Encoding | BaseX encoded data | yes |
| ENSURE_CONTAINS | string: string, allow: boolean | String contains or not contains | / |
| ENSURE_EMAIL | / | Valid E-Mail format | no |
| **Ranges** |
| ENSURE_MINMAXDATE | min: Date, max: Date | Minimum and maximum date stamps | no |
| ENSURE_MAXDATE | max: Date | Maximum date stamp | no |
| ENSURE_MINDATE | min: Date | Minimum date stamp | no |
| ENSURE_MINMAXLEN | min: number, max: number | Minimum and maximum string length | / |
| ENSURE_MAXLEN | max: number | Maximum string length | / |
| ENSURE_MINLEN | min: number | Minimum string length | / |
| ENSURE_ARRAYSIZE | min: number, max: number | Minimum and maximum array size | no |
| ENSURE_ARRAYSIZEMAX | max: number | Maximum array size if is array, ignores otherwise | no |
| ENSURE_ARRAYSIZEMIN | min: number, max: number | Minimum array size if is array, ignores otherwise | no |
| ENSURE_MINMAXNUMBER | min: number, max: number | Minimum and maximum number value if is number, ignores otherwise | no |
| ENSURE_MAXNUMBER | max: number | Maximum number value if is number, ignores otherwise | no |
| ENSURE_MINNUMBER | min: number| Minimum number value if is number, ignores otherwise | no |
| **Miscellaneous** |
| ENSURE_EQUALSFIELD | positive: boolean, ...fieldNames: string[] | Content equals (or not) to content of provided fields | / |

## Custom Ensures

Please try to avoid defining ensures inline with the constructor parameter decorator, while it is certainly possible, this causes nothing but confusion and inconsistencies. Just define your own ensure, which does nothing but create `ValidationConfig` based on your arguments.

```typescript
/**
 * Configuration of a validation chain element
 */
interface ValidationConfig {
  // Description of this validator
  // Can be either a template, a string thunk or an immediate string value
  description: TemplateParameters | (() => string) | string;

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

  // Return the value that caused trouble, or null if all passed
  ) => ValidationResult;
}

/**
 * Result of calling process() on a {@link ValidationConfig}
 */
interface ValidationResult {
  // True if it didn't pass validation, false on success
  error: boolean;

  // Specific value that caused this error
  value?: any;
}
```

`process()` will be called for every field (or element of an array) the ensure is connected with. It returns an object with the error-flag (true on error, false if valid) and the value that caused trouble. To get a feel for how the standard ensures have been implemented, have a look at the sourcecode.

## Templating

As you may have already noticed in the advantage-section, this module comes with a small template engine. There are multiple reasons why I've created it:

* ✅ Centralization of all messages in a single file
* ✅ Standardization accross multiple microservices

There are two elements at your disposal:
* ✅ Variables: passed through by the template invocation
* ✅ Functions: allowing to format conditionally

### Syntax JS

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
    description: {
      name: 'ENSURE_MINMAXLEN',
      vars: {
        min, max, hasMin: min > 0, hasMax: max > 0, hasBoth: min > 0 && max > 0,
      },
    },
    process: (value) => ({
      error: !pattern.test(value),
      value,
    }),
  };
};
```

After the ensure's arguments have been validated, a pattern is built conditionally, which will later be used to test against the value inside `process()`. For the description, I create a `TemplateParameters` object, using the name specified inside `.env`, and a map of variables. `min` and `max` are just passed along, `hasMin`, `hasMax` and `hasBoth` are evaluated booleans.

### Syntax .ENV

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

On the other hand, if you just need a function locally, for the specific template, you can provide it in the `description`'s `TemplateParameters` directly, in an inline-fashion.

### Multilingual

When using object validation, which will be the main interface for real-time frontend form validation, multiple languages are supported. The `templateLang` parameter of `validateCtor` corresponds case-sensitively to a suffix after the ensure's name within the .ENV configuration.

An example of the `templateLang` 'DE' would be the following:

```
CTOR_ENSURE_ENSURE_ARRAYSIZE--DE_DESC=opt:"mindestens {min} array plur:"Element":{min}:"en":{hasMin}opt:" und ":{hasBoth}opt:"bis zu {max} array plur:"Element":{max}:"en"":{hasMax}
```

Where the ensure's name is 'ARRAYSIZE' and the suffix is '--DE'.

Whenever an unknown language has been requested, the following exception will be thrown:

```typescript
class UnknownLanguageException extends Error {
  constructor (
    public lang: string,
  ) {
    super(`Could not find the requested language ${lang}!`);
  }
}
```

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
export const checkEnsureArgErrors = (description: string, value: any) => (errors: CtorEnsureArgError[]): boolean;
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
    expect(executeEnsure(ENSURE_ALPHA(false), alpha)).satisfies(checkEnsureArgErrors(descNoSpaces, alpha));
    expect(executeEnsure(ENSURE_ALPHA(false), alpha.substring(1))).to.have.lengthOf(0);
  });

  it('should disallow numeric non-alpha characters', () => {
    const nonAlpha = '0123456789';
    expect(executeEnsure(ENSURE_ALPHA(), nonAlpha)).satisfies(checkEnsureArgErrors(desc, nonAlpha));
  });

  it('should disallow other non-alpha characters', () => {
    const nonAlpha = '@!$%#?:;-.+';
    expect(executeEnsure(ENSURE_ALPHA(), nonAlpha)).satisfies(checkEnsureArgErrors(desc, nonAlpha));
  });
});
```

This way, I can usually check every case with about 1-3 lines of code only, and don't miss out on any granularity checking. I strongly advise you to take advantage of those utilities, if you plan on adding to this repo.