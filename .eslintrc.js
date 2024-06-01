module.exports = {
  extends: [
    './@eslint-config/react.js',
    './@eslint-config/comments.js',
    './@eslint-config/import.js',
    './@eslint-config/typescript.js',

    'plugin:prettier/recommended',
  ],
  plugins: ['import'],
  rules: {
    'newline-before-return': 'error',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
    ],
    'no-else-return': ['error', { allowElseIf: false }],
    'no-var': 'error',
    'no-nested-ternary': 'error',
    'no-implicit-coercion': ['error', { boolean: false }],
    curly: 'error',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react-hooks/exhaustive-deps': 'off',

    // подсвечивает использование console.log(...) в проекте
    // 'no-console': [
    //   'warn',
    //   {
    //     allow: ['warn', 'error'],
    //   },
    // ],
  },
};
