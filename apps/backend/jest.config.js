module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
    '@backend/(.*)': '<rootDir>/src/$1',
    '@libs/(.*)': '<rootDir>/libs/$1',
    '@config/(.*)': '<rootDir>/config/$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.mts', '!src/**/*.d.ts', '!src/**/*.d.mts'],
  setupFilesAfterEnv: ['<rootDir>/jest.init.js'],
  globalSetup: '<rootDir>/jest.setup.ts',
  globalTeardown: '<rootDir>/jest.teardown.ts',
  // globals: {
  //   __DATA_SOURCE__: null,
  // },
};
