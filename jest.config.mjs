export default {
  roots: [
    "<rootDir>/tests"
  ],
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  verbose: false,
  globals: {
    'ts-jest': {
      useESM: true
    },
  }
};