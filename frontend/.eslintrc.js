module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [1, { allow: 'as-needed' }],
    'react/button-has-type': [
      enabled,
      {
        button: boolean,
        submit: boolean,
        reset: boolean,
      },
    ],
  },
};
