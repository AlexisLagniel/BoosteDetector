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
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
        message: 'Unexpected property on console object was called',
      },
    ],
    'prefer-destructuring': ['error', {
      array: false,
      object: false,
    }, {
      enforceForRenamedProperties: false,
    }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
