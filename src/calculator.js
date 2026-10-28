#!/usr/bin/env node

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (**), and square root (sqrt).
function calculate(first, operator, second) {
  if (!Number.isFinite(first)) {
    throw new TypeError("Both operands must be finite numbers.");
  }

  if (operator === "sqrt") {
    if (second !== undefined) {
      throw new TypeError("Square root accepts one operand.");
    }
    if (first < 0) {
      throw new RangeError("Cannot calculate the square root of a negative number.");
    }
    return Math.sqrt(first);
  }

  if (!Number.isFinite(second)) {
    throw new TypeError("Both operands must be finite numbers.");
  }

  let result;
  switch (operator) {
    case "+":
      result = first + second;
      break;
    case "-":
      result = first - second;
      break;
    case "*":
      result = first * second;
      break;
    case "/":
      if (second === 0) {
        throw new RangeError("Cannot divide by zero.");
      }
      result = first / second;
      break;
    case "%":
      if (second === 0) {
        throw new RangeError("Cannot calculate modulo by zero.");
      }
      result = first % second;
      break;
    case "**":
      result = first ** second;
      break;
    default:
      throw new TypeError(`Unsupported operation: ${operator}`);
  }

  if (!Number.isFinite(result)) {
    throw new RangeError("Operation result must be a finite number.");
  }
  return result;
}

function main(args) {
  const isSquareRoot = args[0] === "sqrt";
  if ((isSquareRoot && args.length !== 2) || (!isSquareRoot && args.length !== 3)) {
    console.error("Usage: node src/calculator.js <number> <+|-|*|/|%|**> <number> OR sqrt <number>");
    process.exitCode = 1;
    return;
  }

  try {
    if (isSquareRoot) {
      if (args[1].trim() === "") {
        throw new TypeError("Both operands must be finite numbers.");
      }
      console.log(calculate(Number(args[1]), "sqrt"));
    } else {
      const [firstInput, operator, secondInput] = args;
      if (firstInput.trim() === "" || secondInput.trim() === "") {
        throw new TypeError("Both operands must be finite numbers.");
      }
      console.log(calculate(Number(firstInput), operator, Number(secondInput)));
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate };
