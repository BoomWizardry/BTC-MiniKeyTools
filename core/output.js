// core/output.js
function printResult(message) {
  process.stdout.write(`${message}\n`); // Always print directly to stdout
}

module.exports = { printResult };
