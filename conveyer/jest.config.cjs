module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^../controllers/(.*)\\.js$': '<rootDir>/src/controllers/$1.ts',
    '^../services/(.*)\\.js$': '<rootDir>/src/services/$1.ts',
    '^../dtos\\.js$': '<rootDir>/src/dtos.ts',
    '^../types/(.*)\\.js$': '<rootDir>/src/types/$1.ts',
    '^../helpers/(.*)\\.js$': '<rootDir>/src/helpers/$1.ts',
    '^../errors/(.*)\\.js$': '<rootDir>/src/errors/$1.ts',
    '^../db\\.js$': '<rootDir>/src/db.ts'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"]
};
