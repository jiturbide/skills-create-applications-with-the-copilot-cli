#!/usr/bin/env node

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
function calculate(first, operator, second) {
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    throw new TypeError("Both operands must be finite numbers.");
  }

  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      if (second === 0) {
        throw new RangeError("Cannot divide by zero.");
      }
      return first / second;
    default:
      throw new TypeError(`Unsupported operation: ${operator}`);
  }
}

function main(args) {
  if (args.length !== 3) {
    console.error("Usage: node src/calculator.js <number> <+|-|*|/> <number>");
    process.exitCode = 1;
    return;
  }

  const [firstInput, operator, secondInput] = args;
  const first = Number(firstInput);
  const second = Number(secondInput);

  try {
    console.log(calculate(first, operator, second));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate };
