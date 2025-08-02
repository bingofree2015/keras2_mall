#!/usr/bin/env node

const fs = require('fs');

// 翻译映射表
/* eslint-disable quote-props */
const translations = {
    // 常见动词
    fix: '修复',
    Fix: '修复',
    feat: '新增',
    Feat: '新增',
    update: '更新',
    Update: '更新',
    refactor: '重构',
    Refactor: '重构',
    remove: '移除',
    Remove: '移除',
    add: '添加',
    Add: '添加',
    delete: '删除',
    Delete: '删除',
    clean: '清理',
    Clean: '清理',
    optimize: '优化',
    Optimize: '优化',
    improve: '改进',
    Improve: '改进',
    enhance: '增强',
    Enhance: '增强',
    implement: '实现',
    Implement: '实现',
    change: '修改',
    Change: '修改',
    modify: '修改',
    Modify: '修改',
    rename: '重命名',
    Rename: '重命名',
    move: '移动',
    Move: '移动',
    merge: '合并',
    Merge: '合并',
    resolve: '解决',
    Resolve: '解决',

    // 常见名词
    error: '错误',
    Error: '错误',
    bug: '缺陷',
    Bug: '缺陷',
    issue: '问题',
    Issue: '问题',
    component: '组件',
    Component: '组件',
    function: '函数',
    Function: '函数',
    method: '方法',
    Method: '方法',
    file: '文件',
    File: '文件',
    directory: '目录',
    Directory: '目录',
    folder: '文件夹',
    Folder: '文件夹',
    script: '脚本',
    Script: '脚本',
    config: '配置',
    Config: '配置',
    setting: '设置',
    Setting: '设置',
    style: '样式',
    Style: '样式',
    layout: '布局',
    Layout: '布局',
    format: '格式',
    Format: '格式',
    syntax: '语法',
    Syntax: '语法',
    typo: '拼写错误',
    Typo: '拼写错误',
    comment: '注释',
    Comment: '注释',
    documentation: '文档',
    Documentation: '文档',
    readme: '说明',
    Readme: '说明',
    README: '说明',

    // 常见形容词
    broken: '损坏的',
    Broken: '损坏的',
    missing: '缺失的',
    Missing: '缺失的',
    invalid: '无效的',
    Invalid: '无效的',
    deprecated: '已弃用的',
    Deprecated: '已弃用的',
    obsolete: '过时的',
    Obsolete: '过时的',
    duplicate: '重复的',
    Duplicate: '重复的',
    unused: '未使用的',
    Unused: '未使用的',
    unnecessary: '不必要的',
    Unnecessary: '不必要的',

    // 常见介词和连接词
    for: '为',
    For: '为',
    to: '到',
    To: '到',
    with: '与',
    With: '与',
    without: '无',
    Without: '无',
    and: '和',
    And: '和',
    or: '或',
    Or: '或',
    but: '但',
    But: '但',
    in: '在',
    In: '在',
    on: '在',
    On: '在',
    at: '在',
    At: '在',
    by: '通过',
    By: '通过',
    from: '从',
    From: '从',
    of: '的',
    Of: '的',
    the: '这个',
    The: '这个',
    a: '一个',
    A: '一个',
    an: '一个',
    An: '一个',
    this: '这个',
    This: '这个',
    that: '那个',
    That: '那个',
    these: '这些',
    These: '这些',
    those: '那些',
    Those: '那些',

    // 技术词汇
    authentication: '认证',
    Authentication: '认证',
    authorization: '授权',
    Authorization: '授权',
    database: '数据库',
    Database: '数据库',
    query: '查询',
    Query: '查询',
    performance: '性能',
    Performance: '性能',
    handling: '处理',
    Handling: '处理',
    navigation: '导航',
    Navigation: '导航',
    endpoint: '端点',
    Endpoint: '端点',
    conflict: '冲突',
    Conflict: '冲突',
    branch: '分支',
    Branch: '分支',
    feature: '功能',
    Feature: '功能',
    user: '用户',
    User: '用户',
    management: '管理',
    Management: '管理',
    functionality: '功能',
    Functionality: '功能',
    utils: '工具',
    Utils: '工具',
    code: '代码',
    Code: '代码',
    new: '新的',
    New: '新的',
    main: '主',
    Main: '主',
    login: '登录',
    Login: '登录',
    API: 'API',
    calls: '调用',
    Calls: '调用',
};

function translateCommitMessage(message) {
    let translated = message;

    // 按长度排序，先替换长词，避免部分匹配
    const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        translated = translated.replace(regex, translations[key]);
    }

    return translated;
}

// 如果直接运行此脚本
if (require.main === module) {
    const commitMsgFile = process.argv[2];

    if (!commitMsgFile) {
        console.error('请提供 commit message 文件路径');
        process.exit(1);
    }

    try {
        const originalMessage = fs.readFileSync(commitMsgFile, 'utf8');
        const translatedMessage = translateCommitMessage(originalMessage);

        if (translatedMessage !== originalMessage) {
            fs.writeFileSync(commitMsgFile, translatedMessage, 'utf8');
            console.log('✅ Commit message 已翻译为中文');
        }
    } catch (error) {
        console.error('翻译失败:', error.message);
        process.exit(1);
    }
}

module.exports = { translateCommitMessage };
