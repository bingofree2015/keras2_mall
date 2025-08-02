#!/usr/bin/env node

const { translateCommitMessage } = require('./translate-commit-msg.js');

// 测试用例
const testCases = [
    "fix: resolve authentication error in login component",
    "feat: add new user management functionality",
    "refactor: optimize database query performance",
    "update: improve error handling in API calls",
    "remove: delete unused configuration files",
    "clean: remove duplicate code in utils",
    "fix bug in navigation component",
    "add missing documentation for API endpoints",
    "resolve merge conflicts in main branch",
    "implement new feature for user authentication"
];

console.log('🧪 测试 Commit Message 翻译功能\n');

testCases.forEach((testCase, index) => {
    const translated = translateCommitMessage(testCase);
    console.log(`测试 ${index + 1}:`);
    console.log(`原文: ${testCase}`);
    console.log(`翻译: ${translated}`);
    console.log('---');
});

console.log('✅ 翻译测试完成！');
