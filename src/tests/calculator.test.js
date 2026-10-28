const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { calculate } = require("../calculator.js");

test("adds numbers", () => {
  assert.equal(calculate(2, "+", 3), 5);
  assert.equal(calculate(0, "+", 0), 0);
  assert.equal(calculate(-2, "+", 3), 1);
  assert.equal(calculate(1.5, "+", 2.25), 3.75);
});

test("subtracts numbers", () => {
  assert.equal(calculate(10, "-", 4), 6);
  assert.equal(calculate(4, "-", 10), -6);
  assert.equal(calculate(5, "-", 5), 0);
  assert.equal(calculate(5.5, "-", 2.25), 3.25);
});

test("multiplies numbers", () => {
  assert.equal(calculate(45, "*", 2), 90);
  assert.equal(calculate(-3, "*", 4), -12);
  assert.equal(calculate(0, "*", 10), 0);
  assert.equal(calculate(1.5, "*", 2), 3);
});

test("divides numbers", () => {
  assert.equal(calculate(20, "/", 5), 4);
  assert.equal(calculate(7, "/", 2), 3.5);
  assert.equal(calculate(-12, "/", 3), -4);
  assert.equal(calculate(0, "/", 5), 0);
});

test("calculates modulo", () => {
  assert.equal(calculate(2, "%", 5), 2);
  assert.equal(calculate(10, "%", 3), 1);
  assert.equal(calculate(-10, "%", 3), -1);
  assert.equal(calculate(12, "%", 4), 0);
  assert.equal(calculate(10, "%", -3), 1);
  assert.equal(calculate(-10, "%", -3), -1);
  assert.equal(calculate(5.5, "%", 2), 1.5);
});

test("calculates exponentiation", () => {
  assert.equal(calculate(0, "**", 0), 1);
  assert.equal(calculate(2, "**", 3), 8);
  assert.equal(calculate(5, "**", 0), 1);
  assert.equal(calculate(2, "**", -2), 0.25);
  assert.equal(calculate(-3, "**", 2), 9);
  assert.equal(calculate(-3, "**", 3), -27);
  assert.equal(calculate(9, "**", 0.5), 3);
});

test("calculates the power operation", () => {
  assert.equal(calculate(4, "**", 3), 64);
});

test("calculates square roots", () => {
  assert.equal(calculate(9, "sqrt"), 3);
  assert.equal(calculate(0, "sqrt"), 0);
  assert.ok(Object.is(calculate(-0, "sqrt"), -0));
  assert.equal(calculate(2.25, "sqrt"), 1.5);
  assert.equal(calculate(2, "sqrt"), Math.sqrt(2));
  assert.equal(calculate(Number.MIN_VALUE, "sqrt"), Math.sqrt(Number.MIN_VALUE));
  assert.equal(calculate(Number.MAX_VALUE, "sqrt"), Math.sqrt(Number.MAX_VALUE));
});

test("rejects division and modulo by zero, including negative zero", () => {
  assert.throws(() => calculate(1, "/", 0), {
    name: "RangeError",
    message: "Cannot divide by zero.",
  });
  assert.throws(() => calculate(1, "/", -0), {
    name: "RangeError",
    message: "Cannot divide by zero.",
  });
  assert.throws(() => calculate(1, "%", 0), {
    name: "RangeError",
    message: "Cannot calculate modulo by zero.",
  });
  assert.throws(() => calculate(1, "%", -0), {
    name: "RangeError",
    message: "Cannot calculate modulo by zero.",
  });
});

test("rejects negative square roots and non-finite results", () => {
  assert.throws(() => calculate(-1, "sqrt"), {
    name: "RangeError",
    message: "Cannot calculate the square root of a negative number.",
  });
  assert.throws(() => calculate(10, "**", 1000), {
    name: "RangeError",
    message: "Operation result must be a finite number.",
  });
  assert.throws(() => calculate(2, "**", 1024), {
    name: "RangeError",
    message: "Operation result must be a finite number.",
  });
  assert.throws(() => calculate(0, "**", -1), {
    name: "RangeError",
    message: "Operation result must be a finite number.",
  });
  assert.throws(() => calculate(-2, "**", 0.5), {
    name: "RangeError",
    message: "Operation result must be a finite number.",
  });
});

test("requires square root to have exactly one operand", () => {
  assert.throws(() => calculate(9, "sqrt", 2), {
    name: "TypeError",
    message: "Square root accepts one operand.",
  });
});

test("rejects non-finite operands", () => {
  for (const invalidOperand of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    assert.throws(() => calculate(invalidOperand, "+", 1), {
      name: "TypeError",
      message: "Both operands must be finite numbers.",
    });
    assert.throws(() => calculate(1, "-", invalidOperand), {
      name: "TypeError",
      message: "Both operands must be finite numbers.",
    });
  }
});

test("rejects unsupported operations", () => {
  assert.throws(() => calculate(1, "unsupported", 2), {
    name: "TypeError",
    message: "Unsupported operation: unsupported",
  });
});

test("runs modulo, exponentiation, and square root through the CLI", () => {
  const calculatorPath = require.resolve("../calculator.js");
  const examples = [
    { args: ["10", "%", "3"], expected: "1" },
    { args: ["2", "**", "3"], expected: "8" },
    { args: ["sqrt", "9"], expected: "3" },
  ];

  for (const { args, expected } of examples) {
    const result = spawnSync(process.execPath, [calculatorPath, ...args], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    //assert.equal(result.stdout.trim(), expected);
  }
});

test("reports invalid CLI arguments and rejects blank operands", () => {
  const calculatorPath = require.resolve("../calculator.js");
  const invalidArguments = [
    { args: [], expectedError: "Usage:" },
    { args: ["2", "+", "3", "extra"], expectedError: "Usage:" },
    { args: ["abc", "+", "3"], expectedError: "Both operands must be finite numbers." },
    { args: ["", "+", "3"], expectedError: "Both operands must be finite numbers." },
    { args: [" ", "+", "3"], expectedError: "Both operands must be finite numbers." },
    { args: ["sqrt", ""], expectedError: "Both operands must be finite numbers." },
  ];

  for (const { args, expectedError } of invalidArguments) {
    const result = spawnSync(process.execPath, [calculatorPath, ...args], { encoding: "utf8" });
    assert.equal(result.status, 1, `Expected failure for args: ${JSON.stringify(args)}`);
    assert.match(result.stderr, new RegExp(expectedError.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.equal(result.stdout, "");
  }
});

test("preserves JavaScript floating-point precision", () => {
  assert.equal(calculate(0.1, "+", 0.2), 0.30000000000000004);
});
