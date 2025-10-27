export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: 'error',
    },
  },
  {
    files: ['server/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    ignores: [
      'client/**/*.jsx',
      'client/**/*.js',
      'node_modules/**',
      'dist/**',
      'build/**',
    ],
  },
];
