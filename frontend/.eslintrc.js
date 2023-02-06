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
    'react/button-has-type': 0,
    'react/react-in-jsx-scope': 0,
    'quotes': 0,
    'curly': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-unescaped-entities': 0,
    'react/jsx-props-no-spreading': 0,
    'comma-dangle': 0,
    'arrow-parens':0,
    'object-curly-newline': 0,
    'object-shorthand': 0,
    'semi': 0,
    'keyword-spacing': 0,
    'nonblock-statement-body-position': 0,
    'no-return-await': 0,
    'jsx-a11y/anchor-is-valid': 0,
    "linebreak-style": 0
  },
};