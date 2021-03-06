module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': 'off',
    'max-len': 'off',
    eqeqeq: 'off',
    'guard-for-in': 'off',
    'no-unused-vars': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
        message: 'Unexpected property on console object was called',
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
