import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^#controllers/(.*)\\.js$': '<rootDir>/src/Controllers/$1',
    '^#models/(.*)\\.js$': '<rootDir>/src/Models/$1',
    '^#routes/(.*)\\.js$': '<rootDir>/src/Routes/$1',
    '^#middleware/(.*)\\.js$': '<rootDir>/src/Middleware/$1',
    '^#config/(.*)\\.js$': '<rootDir>/src/Config/$1',
    '^#utils/(.*)\\.js$': '<rootDir>/src/Utils/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
};

export default config;
