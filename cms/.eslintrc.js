module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true,
    },
    globals: {
        AMap: 'readonly',
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
        'vue/html-indent': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/first-attribute-linebreak': 'off',
        'vue/html-closing-bracket-newline': 'off',
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
                indent: 'off', // 关闭默认的indent规则
                'vue/script-indent': [
                    'error',
                    4,
                    {
                        baseIndent: 0,
                        switchCase: 1,
                        ignores: ['ArrayExpression', 'ObjectExpression', 'ImportDeclaration'],
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
