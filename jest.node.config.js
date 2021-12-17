module.exports = {
  preset: 'vite-jest',
  testMatch: ['**/*.node.test.(js|ts)'],
  testEnvironment: 'node',
  globals: {
    __DEV__: true,
    __FLAVOR__: 'node-cjs',
  },
};
