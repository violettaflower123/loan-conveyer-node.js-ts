module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^../controllers/(.*)\\.js$': '<rootDir>/src/controllers/$1.ts',
    '^../services/(.*)\\.js$': '<rootDir>/src/services/$1.ts',
    '^../dtos\\.js$': '<rootDir>/src/dtos.ts',
  }
};
