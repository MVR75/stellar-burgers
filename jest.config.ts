/** @jest-config-loader ts-node */
import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/cypress/'],
  moduleNameMapper: {
    '^@pages$': '<rootDir>/src/pages',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@components$': '<rootDir>/src/components',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@utils-types/(.*)$': '<rootDir>/src/utils/types/$1',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices$': '<rootDir>/src/slices',
    '^@slices/(.*)$': '<rootDir>/src/slices/$1',
    '^.+\\.(svg|png|jpg|jpeg|gif|webp|avif)$': '<rootDir>/src/test-utils/fileMock.ts'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
    '^.+\\.(js|jsx)$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-css-modules-transform'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};

export default config;
