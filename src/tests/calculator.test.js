const test = require("node:test");
const assert = require("node:assert/strict");
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

test("rejects division by zero, including negative zero", () => {
  assert.throws(() => calculate(1, "/", 0), {
    name: "RangeError",
    message: "Cannot divide by zero.",
  });
  assert.throws(() => calculate(1, "/", -0), {
    name: "RangeError",
    message: "Cannot divide by zero.",
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
  assert.throws(() => calculate(1, "%", 2), {
    name: "TypeError",
    message: "Unsupported operation: %",
  });
});
