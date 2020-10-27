module.exports = {
  env: {
    es2020: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [
    // tasks, manifests and build scripts
    {
      env: { node: true },
      files: ['*.js']
    },
    // content
    {
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-implicit-any': [0],
        '@typescript-eslint/no-unused-vars': [1],
        '@typescript-eslint/promise-function-async': [0],
        '@typescript-eslint/member-delimiter-style': [2],
        '@typescript-eslint/consistent-type-definitions': [2, 'interface'],
        '@typescript-eslint/no-empty-interface': [1],
        '@typescript-eslint/prefer-optional-chain': [2],
        '@typescript-eslint/no-inferrable-types': [0],
        '@typescript-eslint/array-type': [2, { default: 'array-simple' }],
        '@typescript-eslint/prefer-enum-initializers': [2],
        '@typescript-eslint/explicit-member-accessibility': [2],
        '@typescript-eslint/consistent-type-imports': [2],
        '@typescript-eslint/consistent-type-assertions': [
          2,
          { assertionStyle: 'as' }
        ],
        '@typescript-eslint/explicit-function-return-type': [
          2,
          {
            allowHigherOrderFunctions: true,
            allowExpressions: true
          }
        ]
      },
      files: ['*.ts']
    }
  ],
  ignorePatterns: ['*.js', 'bin/**/*']
};
