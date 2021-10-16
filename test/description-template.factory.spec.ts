import { expect } from 'chai';
import { Func } from 'mocha';
import { getRegisteredTemplateFunctions, registerTemplateFunction, template, FunctionMap, VariableMap } from '../src';
import { findFunctionCalls, processFunction, replaceVariables, stripEscapes, key, escapeFunctionResult } from '../src/description-template.factory';

describe('registerTemplateFunction()', () => {
  it('added function should be registered', () => {
    // Create dummy function
    const testFunction = () => 'test';

    // Capture size before and after registration
    const sizeBefore = Object.keys(getRegisteredTemplateFunctions()).length;
    registerTemplateFunction('test', testFunction);
    const sizeAfter = Object.keys(getRegisteredTemplateFunctions()).length;

    // Except array to have grown
    expect(sizeBefore).to.be.lessThan(sizeAfter);
  });
});

describe('findFunctionCalls()', () => {
  it('should return correct indices', () => {
    // Create a few dummy functions
    const knownFunctions: FunctionMap = {
      a: () => 'a',
      b: () => 'b',
      c: () => 'c',
    };

    // Create a template that uses these functions
    const expr = 'This is a:{x}:{y}:"hi" test of b:{z}:"c:"hi":{x}" functions! c:{x}:"a:{y}:"c:{z}""';

    // Exact copy of the template, but with # for function calls
    // That's why I've chosen 1-character functions (easier and changes nothing about the logic)
    const markedTemplate = 'This is #:{x}:{y}:"hi" test of #:{z}:"#:"hi":{x}" functions! #:{x}:"#:{y}:"#:{z}""';

    // Count the indices "manually"
    const manualIndices = [];
    for (let i = 0; i < expr.length; i += 1)
      if (markedTemplate[i] === '#') manualIndices.push(i);

    // Count the indices automatically
    const automatedIndices = findFunctionCalls(expr, knownFunctions);

    // Should yield the same result, but in reverse
    expect(automatedIndices).to.deep.equal(manualIndices.reverse());
  });

  it('should not find escaped function calls', () => {
    // Create a template that calls test normally, and then escaped
    const expr = 'test:{x} test\\:';

    // Create a dummy function
    const knownFunctions: FunctionMap = {
      test: () => 'test',
    };

    // Should only detect function at the beginning
    expect(findFunctionCalls(expr, knownFunctions)).to.have.members([0]);
  });
});

describe('replaceVariables()', () => {
  it('should not replace escaped variables', () => {
    // Create test variables
    const vars: VariableMap = {
      example: 'example value',
      variable: 'variable value',
    };

    // Create proper variables, partially escaped and fully escaped
    const result = replaceVariables('{example} {variable} \\{example} {example\\} \\{variable\\}', vars);
    expect(result).to.equal(`${vars.example} ${vars.variable} \\{example} {example\\} \\{variable\\}`);
  });

  it('should not replace unknown variables', () => {
    // Create test variables
    const vars: VariableMap = {
      test: 'test value',
    };

    // Test should have been substituted, but unknowns need to persist
    const result = replaceVariables('{test} {unknown1} {unknown2}', vars);
    expect(result).to.equal(`${vars.test} {unknown1} {unknown2}`);
  });
});

describe('stripEscapes()', () => {
  it('should remove only variable escape-sequences of known variables', () => {
    const vars: VariableMap = {
      x: 'irrelevant',
    };

    // Should remove partial escapes and full escapes, but no non-variable escapes
    const result = stripEscapes('\\{x} {x\\} \\{x\\} \\{unknown} {unknown\\} \\{unknown\\} \\no-var \\\\no-var', {}, vars);
    expect(result).to.equal('{x} {x} {x} \\{unknown} {unknown\\} \\{unknown\\} \\no-var \\\\no-var');
  });

  it('should remove colon escapes', () => {
    const funcs: FunctionMap = {
      test: () => '',
    };

    const result = stripEscapes('this \\: should persist, this test\\: should be replaced', funcs, {});
    expect(result).to.equal('this \\: should persist, this test: should be replaced');
  });
});

describe('escapeFunctionResult()', () => {
  const vars: VariableMap = {
    a: 5,
  };

  it('should escape colons of known functions only', () => {
    const funcs: FunctionMap = {
      test: () => '',
    };

    expect(escapeFunctionResult('stay: test:', funcs, {})).to.equal('stay: test\\:');
  });

  it('should escape all quotes', () => {
    expect(escapeFunctionResult('"""', {}, {})).to.equal('\\"\\"\\"');
  });

  it('should escape curly brackets of known variables only', () => {
    expect(escapeFunctionResult('{unknown} {a}', {}, vars)).to.equal('{unknown} \\{a\\}');
  });

  it('should not escape escaped curly brackets', () => {
    expect(escapeFunctionResult('{a} \\{a} {a\\} \\{a\\}', {}, vars)).to.equal('\\{a\\} \\{a} {a\\} \\{a\\}');
  });

  it('should not escape escaped quotes', () => {
    expect(escapeFunctionResult('\\" "', {}, {})).to.equal('\\" \\"');
  });
});

describe('processFunction()', () => {
  // The concat functions just concats all it's parameter without spaces
  const funcs: FunctionMap = {
    concat: (...args: string[]) => args.map(it => it === '' ? '<empty>' : it).join(''),
  };

  // Dummy variables
  const vars: VariableMap = {
    a: 5,
    b: 3,
    c: 22,
    d: 'Hello, world',
    e: 'concat',
    empty: '',
  };

  it('should accept string arguments', () => {
    // Invoke with two string parameters
    const expr = 'concat:"Hello":"World"';
    const result = processFunction(0, expr, {}, funcs);
    expect(result).to.equal(`HelloWorld`);
  });

  it('should accept variable arguments', () => {
    // Invoke with known variables
    const epxr = 'concat:{a}:{b}:{d}:{c}';
    const result = processFunction(0, epxr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.b}${vars.d}${vars.c}`);
  });

  it('should work as expected with empty variable values', () => {
    const expr = 'concat:{a}:{b}:{empty}:{c}';
    const result = processFunction(0, expr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.b}<empty>${vars.c}`);
  });

  it('should accept variables, strings and variables inside of strings', () => {
    // Invoke with string, var and var inside of string parameters
    const expr = 'concat:{a}:{b}:{d}:{c}:"Hello":"{a} World!"';
    const result = processFunction(0, expr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.b}${vars.d}${vars.c}Hello${vars.a} World!`);
  });

  it('should work with back-to-back variables inside a string', () => {
    const expr = 'concat:{a}:{b}:"{a}{b}string{c}string{c}{b}{a}{empty}{a}"';
    const result = processFunction(0, expr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.b}${vars.a}${vars.b}string${vars.c}string${vars.c}${vars.b}${vars.a}${vars.a}`);
  });

  it('should ignore escaped variables inside of strings', () => {
    const expr = 'concat:{a}:"{a}\\{b}":"{a}{b\\}":"{a}\\{b\\}":"{a}{b}"';
    const result = processFunction(0, expr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.a}\\{b}${vars.a}{b\\}${vars.a}\\{b\\}${vars.a}${vars.b}`);
  });

  it('should not use colons in string arguments as delimiters', () => {
    // Create template, first a word, then concat invoke, and one of it's string parameters
    // contains a colon that should not be used as a delimiter
    const expr = 'test concat:{a}:{b}:{d}:{c}:"The colon : inside should be ignored":"last arg"';
    const result = processFunction(5, expr, vars, funcs);
    expect(result).to.equal(`test ${vars.a}${vars.b}${vars.d}${vars.c}The colon : inside should be ignoredlast arg`);
  });

  it('should ignore unknown variables', () => {
    // variable and unknown should be left as is
    const expr = 'concat:{a}:{b}:{d}:"i am a {variable}":{unknown}:{c}';
    const result = processFunction(0, expr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.b}${vars.d}i am a {variable}{unknown}${vars.c}`);
  });

  it('should be able to escape quotes inside a string argument', () => {
    const expr = 'concat:{a}:{b}:"\\"{a}{b}\\"Hello\\""';
    const result = processFunction(0, expr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.b}\\"${vars.a}${vars.b}\\"Hello\\"`);
  });

  it('should be able to escape colon at the end of function call', () => {
    const expr = 'concat:{a}:{b}\\: after colon';
    const result = processFunction(0, expr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.b}: after colon`);
  });

  it('should not unescape colon if looks like invocation', () => {
    const expr = 'concat:{a}:{e}\\: after colon';
    const result = processFunction(0, expr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.e}\\: after colon`);
  });

  it('should be able to escape quote at the end of function call', () => {
    const expr = 'concat:{a}:{b}\\" after quote';
    const result = processFunction(0, expr, vars, funcs);
    expect(result).to.equal(`${vars.a}${vars.b}\\" after quote`);
  });
});

describe('template()', () => {
  // The concat functions just concats all it's parameter without spaces
  const funcs: FunctionMap = {
    concat: (...args: string[]) => args.map(it => it === '' ? '<empty>' : it).join(''),
  };

  // Create dummy variables
  const vars: VariableMap = {
    a: 'Hello',
    b: 'World',
    varvar: '{a}',
  };

  it('should not process unknown templates', () => {
    // A unknown template needs to provoke an exception
    expect(() => template('UNKNOWN')).to.throw(`The template ${key('UNKNOWN')} is not registered as an ENV-VAR!`);
  });

  it('should replace non-function variables', () => {
    // Set template to environment for the function to access it
    process.env[key('TEST')] = '{a} {b}';
    expect(template('TEST', vars)).to.equal(`${vars.a} ${vars.b}`);
  });

  it('should strip escapes', () => {
    // Set template to environment for the function to access it
    process.env[key('TEST')] = '{a} \\{b\\} concat\\: {a\\} \\{a}';
    expect(template('TEST', vars, funcs)).to.equal(`${vars.a} {b} concat: {a} {a}`);
  });

  it('should call a function', () => {
     // Set template to environment for the function to access it
    process.env[key('TEST')] = 'concat:"{a} \\{b\\} concat\\:":{b}';
    expect(template('TEST', vars, funcs)).to.equal(`${vars.a} {b} concat:${vars.b}`);
  });

  it('should call nested functions', () => {
    // Set template to environment for the function to access it
    process.env[key('TEST')] = 'concat:"{a}{b} concat:{b}:{a}"';
    expect(template('TEST', vars, funcs)).to.equal(`${vars.a}${vars.b} ${vars.b}${vars.a}`);
  });

  it('should not further interpret nested function result', () => {
    // Set template to environment for the function to access it
    process.env[key('TEST')] = 'concat:"{a}{b} concat:{varvar}:{a}"';
    expect(template('TEST', vars, funcs)).to.equal(`${vars.a}${vars.b} {a}${vars.a}`);
  });
});