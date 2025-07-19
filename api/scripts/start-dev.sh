#!/bin/bash

echo "🚀 启动优惠券商城 API 开发环境..."
echo "📋 检查环境..."

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查 pnpm 版本
PNPM_VERSION=$(pnpm --version)
echo "✅ pnpm 版本: $PNPM_VERSION"

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    pnpm install
fi

# 检查数据库配置
echo "🔍 检查数据库配置..."
if [ -f "config/default.json" ]; then
    echo "✅ 数据库配置文件存在"
else
    echo "❌ 数据库配置文件不存在"
    exit 1
fi

# 启动开发服务器
echo "🎯 启动开发服务器..."
echo "📍 服务将在 http://localhost:8080 启动"
echo "🛑 按 Ctrl+C 停止服务"
echo ""

pnpm start 