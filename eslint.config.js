import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Add this block for Firebase Functions (CommonJS environment)
  {
    files: ['functions/**/*.js'],  // Adjust this to the path where your Firebase functions are
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,  // Use Node.js global variables
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script',  // Use script for CommonJS modules
      },
    },
    rules: {
      'no-undef': 'off',  // Disable no-undef for CommonJS-specific globals
    },
  },
]
