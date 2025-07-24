module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
    plugins: ['vue', 'prettier'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                tabWidth: 4,
                singleQuote: true,
                semi: true,
                printWidth: 100,
                trailingComma: 'es5',
                bracketSpacing: true,
                arrowParens: 'always',
                htmlWhitespaceSensitivity: 'ignore',
                vueIndentScriptAndStyle: false,
                endOfLine: 'auto',
            },
        ],
        'vue/multi-word-component-names': 'off',
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': [
            'error',
            {
                singleline: 4,
                multiline: 1,
            },
        ],
        'vue/first-attribute-linebreak': [
            'error',
            {
                singleline: 'beside',
                multiline: 'below',
            },
        ],
        'vue/html-closing-bracket-newline': [
            'error',
            {
                singleline: 'never',
                multiline: 'always',
            },
        ],
        'vue/html-closing-bracket-spacing': [
            'error',
            {
                startTag: 'never',
                endTag: 'never',
                selfClosingTag: 'always',
            },
        ],
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'never',
                    component: 'always',
                },
            },
        ],
        'key-spacing': [
            'error',
            {
                beforeColon: false,
                afterColon: true,
            },
        ],
        'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        'no-unused-vars': ['error', { args: 'none' }],
        'vue/require-explicit-emits': 'error',
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: ['error', 4, { SwitchCase: 1 }],
                'vue/script-indent': [
                    'error',
                    4,
                    {
                        baseIndent: 0,
                        switchCase: 1,
                    },
                ],
                'prettier/prettier': [
                    'error',
                    {
                        tabWidth: 4,
                        htmlWhitespaceSensitivity: 'ignore',
                        vueIndentScriptAndStyle: false,
                    },
                ],
            },
        },
    ],
};
