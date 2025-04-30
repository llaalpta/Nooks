module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  ignorePatterns: ['/dist/*', '/expo-env.d.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'react-hooks', 'import'],

  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {}],
    'react-hooks/exhaustive-deps': 'off',
    'no-empty-pattern': 'error',
    'import/order': [
      'error',
      {
        groups: [
          ['builtin'],
          ['external'],
          ['internal'],
          ['parent', 'sibling', 'index'],
          ['object'],
          ['type'],
          ['unknown'],
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
          '.png',
          '.jpg',
          '.jpeg',
          '.gif',
          '.svg',
        ],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
