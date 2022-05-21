module.exports = {
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'consistent-return': 'off',
  },
};
