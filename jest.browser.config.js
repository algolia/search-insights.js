module.exports = {
  preset: "vite-jest",
  testMatch: ["**/*.test.(js|ts)", "!**/*.node.test.(js|ts)"],
  testEnvironment: "jest-environment-jsdom",
  globals: {
    __DEV__: true,
    __FLAVOR__: "browser-cjs"
  }
};
