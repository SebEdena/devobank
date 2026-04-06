export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testRegex: '\\.(int|e2e)\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      { useESM: true, tsconfig: 'tsconfig.int.json' },
    ],
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^tests/(.*)$': '<rootDir>/tests/$1',
  },
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true,
  globalSetup: './tests/shared/setup/global-setup.ts',
  globalTeardown: './tests/shared/setup/global-teardown.ts',
};
