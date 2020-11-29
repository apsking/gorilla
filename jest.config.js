module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
    },
  },
};
