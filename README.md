# ctor-ensure

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Ensure that the arguments of your constructor meet constraints defined through decorators.

🧨 [WARNING] 🧨 This module is in early alpha and has not yet been tested thoroughly! Use at your own risk.

## Aims

I developed this from scratch, since I couldn't find any other module that was able to directly validate constructor arguments (to make use of typescript's shorthand notation) and which wasn't bloatware. Simple things like these should be kept as small and concise as possible, without trying to cover every possible usecase, even if it's completely irrational and only occurs once in a blue moon.

## Advantages

The biggest advantage of this module is the fact that it allows you to directly validate constructor arguments. In combination with typescript, this means that the constructor defines and validates those arguments all in one go. This greatly reduces boilerplate code, especially in conjunction with the handy standard ensurements, that you're always free to extend to your liking. It can be viewed as an atomic transaction, since there are no states of inconsistency between creating your class and having a valid instance.

* ✅ Reduced boilerplate code, thanks to direct argument validation
* ✅ Handy pre-made standard ensurements
* ✅ Great extendability
* ✅ Rich exception that can be customly mapped
* ✅ Template engine for validation descriptions

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

Last but not least, make sure you have your .ENV set up properly, feel free to use the default provided in this document.

## How to use

Mark the target class for validation. This decorator accepts two parameters, the first one being the class' displayname, the second one being a flag whether or not to allow multiple errors per field (default false). For demonstration purposes, we'll switch that flag on.
```typescript
@CtorEnsure('UserRegistration', true)
export class UserRegistrationModel {}
```

Create a constructor using shorthand properties
```typescript
@CtorEnsure('UserRegistration', true)
export class UserRegistrationModel {

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

Now it's time to decide on which and how arguments need to be validated. This decorator has three parameters: The field's displayname, either a single or an array of configs, and last but not least the flag whether or not it's an array.

```typescript
@CtorEnsure('UserRegistration', true)
export class UserRegistrationModel {

  constructor(
    public id: string,

    // Alphanumeric and between 5 and 20 characters
    @ValidatedArg('username', [
      ENSURE_ALPHANUM(),
      ENSURE_MINMAX(5, 20),
    ])
    public username: string,

    // Between 10 and 30 characters
    @ValidatedArg('password', [
      ENSURE_MINMAX(10, 30),
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

    // Every array element: between 5 and 20 characters
    @ValidatedArg('hobbies', [
      ENSURE_MINMAX(5, 20),
    ], true)
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
export class CtorEnsureException {
  // Name of source class
  readonly displayName: string;

  constructor(
    // Source class
    public readonly clazz: Constructable,

    // Validation errors based on individual fields
    public readonly errors: CtorEnsureArgError[],
  ) {
    this.displayName = Reflect.getOwnMetadata(
      META_KEY_DISPLAYNAME,
      this.clazz
    );
  }
}
```

You get provided with the class' displayname and the occurred errors, based on the individual fields. Just like this:

```typescript
/**
 * Describes an occurred validation error for a constructor's field
 */
export interface CtorEnsureArgError {
  field: string;
  description: string;
}
```

Every error per field will produce one arg-error, so you could group these by the field property when displaying, as I'll do in my output.

Now, that we're all wired up, it's time to give it a shot! I will be using NestJS in conjunction with a custom exception filter, in order to map the detailled data to a beautiful error message.

```typescript
@Catch(CtorEnsureException)
export class CtorEnsureExceptionFilter implements ExceptionFilter {
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
        "needs to be an array",
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

## Custom Ensures

Please try to avoid defining ensures inline with the constructor parameter decorator, this causes nothing but confusion and inconsistencies. Just define your own ensure, based on the provided type.

```typescript
// A validation ensure is a function that may take arguments
// and returns a validation config
export type ValidationEnsure = (...args: any[]) => ValidationConfig;
```

It will be called for every field, or every value of the array, if the field is an array. To get a feel for how the standard ensures have been implemented, have a look at one of it's sourcecodes.

## Custom Stages

Stages are something ensures partially make use of, for example with the pattern, type or equals validation. Think of them as an ensure, but it gets all available information injected into it (having a look at the greater picture). They do things like looking at the containing field for arrays, or at the value of other fields for equals-ensures. Personally, I think that they are a topic you don't need to worry about, but you still can play around with them, if you're interested or in need of extra functionality.

```typescript
/**
 * Representing the state of validation-info at a single
 * config within a single control, gets executed for every
 * field or element of field if it's an array
 */
export type ValidationStage = (
  // All controls of model
  controls: ValidationControl[],

  // Arguments of model's constructor
  ctorArgs: any[],

  // Current config of current control
  currConfig: ValidationConfig,

  // Current control of validation-chain
  currControl: ValidationControl,

  // Current argument of constructor
  currArg: any,

  // Current value of current argument, if is an array
  currValue: any
) => CtorEnsureArgError | null;
```

Register them like this, called before your application launches:

```typescript
/**
 * Register a new validation stage
 * @param stage Custom validation stage
 */
export const registerValidationStage = (stage: ValidationStage) => {
  VALIDATION_STAGES.push(stage);
}
```

## Templating

As you may have already noticed in the advantage-section, this module comes with a small template engine. There are multiple reasons why I've created it:

* ✅ Centralization of all messages in a single file
* ✅ Standardization accross multiple microservices

There are two elements at your disposal:
* ✅ Variables: passed through by the template invocation
* ✅ Functions: allowing to format conditionally

### Syntax in JS

Here's a quick example of a template for the minmax-ensure:

```typescript
export const ENSURE_MINMAX: ValidationEnsure = (min: number, max: number): ValidationConfig => {
  if (min < 0 && max < 0) throw new SyntaxError('Invalid arguments');

  return {
    pattern: new RegExp(`^.{${min > 0 ? min : ''},${max > 0 ? max : ''}}$`),
    description: template('ENSURE_MINMAX', {
      min, max, hasMin: min > 0, hasMax: max > 0, hasBoth: min > 0 && max > 0
    }),
  };
};
```

This ensure is making use of the pattern-stage, to only allow a minimum and or maximum number of characters. The description gets loaded from a template, known by the name of ENSURE_MINMAX (it's a good practise to call those the same as the ensure itself). As variables, min, max, hasMin as min > 0 (boolean), hasMax as max > 0 (boolean) and hasBoth as min > 0 && max > 0 (boolean) are passed to the template. There are no extra functions defined, since the standard functions are sufficient.

### Syntax in .ENV

```
# Format: CTOR_ENSURE_<name>_DESC=<template>
CTOR_ENSURE_ENSURE_MINMAX_DESC=opt:"at least {min} plur:"character":{min}":{hasMin}opt:" and ":{hasBoth}opt:"up to {max} plur:"character":{max}":{hasMax}
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
export const strOpt = (str: string, state: boolean): string => state ? str : '';

/**
 * Pluralize a word, based on the corresponding count. Also
 * gets rid of all spaces on the right to properly append
 * @param word Word in singular form
 * @param num Count of type the word describes
 * @param suf Suffix for plural, defaults to s
 * @returns Pluralized word
 */
export const pluralize = (word: string, num: number, suf = 's'): string => `${word.trimRight()}${strOpt(suf, num !== 1)}`;
```

They have quite long names, which is why they're registered with a short alias:

```typescript
// Default functions that are always available
const PREDEFINED_FUNCTIONS: FunctionMap = {
  opt: strOpt,
  plur: pluralize
}
```

You can always add to this global registry, by calling this before your application launches:

```typescript
/**
 * Register a new function to be available globally inside all templates
 * @param name Name of the function inside template
 * @param func Reference to function
 */
export const registerTemplateFunction = (name: string, func: TemplateFunction) => {
  PREDEFINED_FUNCTIONS[name] = func;
}
```

On the other hand, if you just need a function locally, for the specific template, you can provide it in the `template` call directly, after the variables. Here is a stupid example, that proves the point:

```typescript
const ENSURE_MINMAX: ValidationEnsure = (min: number, max: number): ValidationConfig => {
  if (min < 0 && max < 0) throw new SyntaxError('Invalid arguments');

  return {
    pattern: new RegExp(`^.{${min > 0 ? min : ''},${max > 0 ? max : ''}}$`),
    description: template('ENSURE_MINMAX', {
      min, max, hasMin: min > 0, hasMax: max > 0, hasBoth: min > 0 && max > 0
    }, {
      rep: (word: string, amount: number) => {
        return word.repeat(amount);
      }
    }),
  };
};
```

```
CTOR_ENSURE_ENSURE_MINMAX_DESC=rep:"Hello":{min} opt:"at least {min} plur:"character":{min}":{hasMin}opt:" and ":{hasBoth}opt:"up to {max} plur:"character":{max}":{hasMax}
```

With a call like this:

```typescript
ENSURE_MINMAX(3, 5)
```

It would yield a behavior of:

```javascript
{
  "pattern": /^.{3,5}$/,
  "description": 'HelloHelloHello at least 3 characters and up to 5 characters'
}
```

### Default .ENV

To save time and effort, I created pretty solid templates beforehand. If you're okay with them, copy and paste to your .env file:

```
CTOR_ENSURE_ENSURE_ALPHANUM_DESC=only alphanumeric characters
CTOR_ENSURE_ENSURE_EMAIL_DESC=valid email address
CTOR_ENSURE_ENSURE_EQUALS_DESC=needs to equal to the plur:"field":{numFields}\: {fieldNames}
CTOR_ENSURE_ENSURE_EXISTING_DESC=mandatory field
CTOR_ENSURE_ENSURE_FLOAT_DESC=floating point number
CTOR_ENSURE_ENSURE_INT_DESC=integer number
CTOR_ENSURE_ENSURE_MINMAX_DESC=opt:"at least {min} plur:"character":{min}":{hasMin}opt:" and ":{hasBoth}opt:"up to {max} plur:"character":{max}":{hasMax}
CTOR_ENSURE_ENSURE_NONEMPTY_DESC=no empty value
CTOR_ENSURE_ENSURE_NONNULL_DESC=no null value
CTOR_ENSURE_ENSURE_STRDATE_DESC=valid full ISO-8601 datetime string
CTOR_ENSURE_ENSURE_STRFLOAT_DESC=floating point number as string
CTOR_ENSURE_ENSURE_STRINT_DESC=integer number as string
CTOR_ENSURE_ENSURE_STRUUID_DESC=uuid as string
CTOR_ENSURE_STAGE_ISARRAY_DESC=needs to be an array of values
```

## Contribution

If you have any suggestions on how to improve this module, I'm happy to hear about it! Hope it helped you in some way, shape or form.