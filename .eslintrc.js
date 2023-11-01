/* eslint-env node */
module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:playwright/recommended"
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    env: {
        es6: true
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 8,
    },
    rules: {
        "quotes": [2, "single", { "avoidEscape": true }],
        "playwright/no-eval": 0,
        "no-useless-catch": 1,
        "playwright/no-skipped-test": 0,
        'max-len': [1, { code: 80 }],
        indent: ['error', 4],
        semi: [1,'never'],
        'no-trailing-spaces': ['error', {
            'skipBlankLines': false,
            'ignoreComments': false
        }],
        'no-prototype-builtins': 0,
        'arrow-parens': [2, 'as-needed']
    }
}

