module.exports = {
  // Root directory of your project
  rootDir: './',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Specify the test environment
  testEnvironment: 'node',

  // Map module aliases for Jest to resolve paths correctly
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@classes/(.*)$': '<rootDir>/src/classes/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },

  // Paths to include module-alias registration for tests
  setupFiles: ['module-alias/register'],

  // Specify test file patterns
  testMatch: [
    '**/tests/**/*.test.js', // Match all .test.js files in the tests folder
    '**/?(*.)+(spec|test).js' // Match *.spec.js and *.test.js files anywhere
  ]
};
