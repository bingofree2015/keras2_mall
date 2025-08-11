#!/bin/bash

# KerasMall生产环境部署脚本（在当前目录执行）
# 使用方法: 
#   ./install.sh                                   # 使用默认项目名称 "keras-mall"
#   PROJECT_NAME=my-mall ./install.sh              # 使用自定义项目名称 "my-mall"
#
# 环境变量优先级（从高到低）:
#   1. 命令行环境变量 (如: DB_PASSWORD=mysecret ./install.sh)
#   2. .env 文件中的值
#   3. env.example 文件中的值
#   4. 脚本默认值
#
# 注意: 本脚本使用 mysql:8.0 镜像，确保稳定性和兼容性
#       MySQL 8.0 默认使用 caching_sha2_password 认证插件
#       脚本已注释掉不兼容的认证参数以确保最佳兼容性

set -e



# 计算目录
SCRIPT_DIR="$(pwd)"
REPO_ROOT="$(dirname "${SCRIPT_DIR}")"

# 加载环境变量配置
load_environment_config() {
  echo -e "${GREEN}加载环境变量配置...${NC}"
  
  # 首先检查并创建 .env 文件
  if [ ! -f "${SCRIPT_DIR}/.env" ]; then
    if [ -f "${SCRIPT_DIR}/env.example" ]; then
      cp "${SCRIPT_DIR}/env.example" "${SCRIPT_DIR}/.env"
      echo -e "${GREEN}✓ 已从 ${SCRIPT_DIR}/env.example 创建 .env 文件${NC}"
      echo -e "${YELLOW}⚠ 请编辑 .env 文件配置生产环境参数${NC}"
      read -p "是否现在编辑? (y/N): " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} "${SCRIPT_DIR}/.env"
      fi
    else
      echo -e "${RED}错误: ${SCRIPT_DIR}/env.example 文件不存在${NC}"
      exit 1
    fi
  else
    echo -e "${BLUE}发现现有 .env 文件，将使用现有配置${NC}"
  fi
  
  # 现在加载环境变量
  if [ -f "${SCRIPT_DIR}/.env" ]; then
    echo -e "${BLUE}正在加载 .env 文件...${NC}"
    export $(grep -v '^#' "${SCRIPT_DIR}/.env" | xargs)
    echo -e "${GREEN}✓ .env 文件加载完成${NC}"
  elif [ -f "${SCRIPT_DIR}/env.example" ]; then
    echo -e "${BLUE}发现 env.example 文件，正在加载...${NC}"
    export $(grep -v '^#' "${SCRIPT_DIR}/env.example" | xargs)
    echo -e "${GREEN}✓ env.example 文件加载完成${NC}"
  else
    echo -e "${YELLOW}⚠ 未发现 .env 文件，将使用脚本默认值${NC}"
  fi
}

# 设置容器组项目名称
PROJECT_NAME=${PROJECT_NAME:-"keras-mall"}
export COMPOSE_PROJECT_NAME="$PROJECT_NAME"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  KerasMall生产环境部署${NC}"
echo -e "${BLUE}  项目名称: ${PROJECT_NAME}${NC}"
echo -e "${BLUE}================================${NC}"

# 加载环境变量配置
load_environment_config

# 显示当前使用的配置值
echo -e "${BLUE}当前配置信息:${NC}"
echo -e "  - 数据库用户名: ${DB_USERNAME:-root}"
echo -e "  - 数据库密码: ${DB_PASSWORD:-keras123!@qwe}"
echo -e "  - 数据库名称: ${DB_DATABASE:-keras_mall}"
echo -e "  - 数据库端口: ${DB_PORT:-3306}"
echo -e "  - Redis端口: ${REDIS_PORT:-6379}"
echo -e "  - 应用端口: ${APP_PORT:-8080}"
echo -e "  - JWT密钥: ${JWT_SECRET:-jwtSecret}"
echo

# 检查是否为root用户
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}警告: 不建议使用root用户运行此脚本${NC}"
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查系统要求
echo -e "${GREEN}检查系统要求...${NC}"

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    exit 1
fi

# 检查Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    exit 1
fi

# 检查Docker服务状态
if ! docker info &> /dev/null; then
    echo -e "${RED}错误: Docker 服务未运行${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 系统要求检查通过${NC}"

# 生成配置文件: docker-compose.yml 与 nginx.conf（部署时动态生成）
generate_config_files() {
  echo -e "${GREEN}生成部署配置文件...${NC}"

  # 检查数据库初始化文件是否存在
  if [ ! -f "${SCRIPT_DIR}/keras_mall.sql" ]; then
    echo -e "${RED}错误: 数据库初始化文件 keras_mall.sql 不存在${NC}"
    echo -e "${YELLOW}请确保 ${SCRIPT_DIR}/keras_mall.sql 文件存在${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ 发现数据库初始化文件: keras_mall.sql${NC}"

  # 优先使用环境变量，如果没有配置则使用脚本默认值
  DB_USERNAME_EFFECTIVE="${DB_USERNAME:-root}"
  DB_PASSWORD_EFFECTIVE="${DB_PASSWORD:-keras123!@qwe}"
  DB_DATABASE_EFFECTIVE="${DB_DATABASE:-keras_mall}"
  DB_PORT_EFFECTIVE="${DB_PORT:-3306}"
  REDIS_PORT_EFFECTIVE="${REDIS_PORT:-6379}"
  APP_PORT_EFFECTIVE="${APP_PORT:-8080}"
  JWT_SECRET_EFFECTIVE="${JWT_SECRET:-jwtSecret}"

  # 文件头与 MySQL 公共部分（到 environment: 前）
  # 注意：新版 Docker Compose 不再需要 version 字段
  cat > "${SCRIPT_DIR}/docker-compose.yml" <<YAML
services:
  # MySQL数据库服务
  mysql:
    image: mysql:8.0
    container_name: ${PROJECT_NAME}_mysql
    restart: unless-stopped
    environment:
YAML

  if [[ "$DB_USERNAME_EFFECTIVE" == "root" ]]; then
    # 仅设置 root 密码与数据库，避免设置 MYSQL_USER=root 触发官方镜像报错
    cat >> "${SCRIPT_DIR}/docker-compose.yml" <<YAML
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD_EFFECTIVE}
      MYSQL_DATABASE: ${DB_DATABASE_EFFECTIVE}
YAML
  else
    # 创建普通用户（用户名与密码与 API 侧一致），同时仍设置 root 密码
    cat >> "${SCRIPT_DIR}/docker-compose.yml" <<YAML
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD_EFFECTIVE}
      MYSQL_DATABASE: ${DB_DATABASE_EFFECTIVE}
      MYSQL_USER: ${DB_USERNAME_EFFECTIVE}
      MYSQL_PASSWORD: ${DB_PASSWORD_EFFECTIVE}
YAML
  fi

  # MySQL 其余配置与其他服务
  cat >> "${SCRIPT_DIR}/docker-compose.yml" <<YAML
    ports:
      - "${DB_PORT_EFFECTIVE}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      # 挂载数据库初始化文件: MySQL 容器首次启动时会自动执行 /docker-entrypoint-initdb.d/ 目录下的 .sql 文件
      - ./keras_mall.sql:/docker-entrypoint-initdb.d/01-init-data.sql:ro
    # MySQL 8.0+ 兼容性配置（注释掉不兼容的参数）
    # command: --default-authentication-plugin=mysql_native_password
    networks:
      - app_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "-u", "root", "-p${DB_PASSWORD_EFFECTIVE}"]
      timeout: 20s
      retries: 10
      start_period: 30s

  # Redis缓存服务
  redis:
    image: redis:alpine
    container_name: ${PROJECT_NAME}_redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT_EFFECTIVE}:6379"
    volumes:
      - redis_data:/data
    networks:
      - app_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # KerasMallAPI应用
  api:
    image: crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com/bingofree2025/keras-mall-api:latest
    container_name: ${PROJECT_NAME}_api
    restart: unless-stopped
    ports:
      - "${APP_PORT_EFFECTIVE}:8080"
    environment:
      - NODE_ENV=production
      - PORT=${APP_PORT_EFFECTIVE}
      - DB_HOST=${DB_HOST:-mysql}
      - DB_PORT=${DB_PORT:-3306}
      - DB_USERNAME=${DB_USERNAME_EFFECTIVE}
      - DB_PASSWORD=${DB_PASSWORD_EFFECTIVE}
      - DB_DATABASE=${DB_DATABASE_EFFECTIVE}
      - REDIS_HOST=${REDIS_HOST:-redis}
      - REDIS_PORT=${REDIS_PORT:-6379}
      - JWT_SECRET=${JWT_SECRET_EFFECTIVE}
    volumes:
      - ./upload:/app/upload
      - ./logs:/app/logs
      - ./.env:/app/.env:ro
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app_network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://127.0.0.1:8080/', (res) => { process.exit(res.statusCode < 500 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Nginx反向代理
  nginx:
    image: nginx:alpine
    container_name: ${PROJECT_NAME}_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      # 如需开启 HTTPS，请在 ../ssl 放置证书并取消注释 443 端口与 nginx.conf 内相应配置
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./nginx_logs:/var/log/nginx
    depends_on:
      api:
        condition: service_healthy
    networks:
      - app_network

volumes:
  mysql_data:
    driver: local
  redis_data:
    driver: local

networks:
  app_network:
    driver: bridge
YAML

  # 生成 nginx.conf
  cat > "${SCRIPT_DIR}/nginx.conf" <<'NGINX'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # 基本设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # 上游服务器配置
    upstream api_backend {
        server api:8080;
    }

    # HTTP服务器配置
    server {
        listen 80;
        server_name 127.0.0.1;

        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # 客户端最大请求体大小
        client_max_body_size 100M;

        # API代理
        location / {
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # 超时设置
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # 静态文件缓存
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt)$ {
            proxy_pass http://api_backend;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # 健康检查
        location /health {
            proxy_pass http://api_backend;
            access_log off;
        }
    }

    # HTTPS服务器配置（可选）
    # server {
    #     listen 443 ssl http2;
    #     server_name your-domain.com;
    #
    #     ssl_certificate /etc/nginx/ssl/cert.pem;
    #     ssl_certificate_key /etc/nginx/ssl/key.pem;
    #     ssl_protocols TLSv1.2 TLSv1.3;
    #     ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    #     ssl_prefer_server_ciphers off;
    #
    #     location / {
    #         proxy_pass http://api_backend;
    #         proxy_http_version 1.1;
    #         proxy_set_header Upgrade $http_upgrade;
    #         proxy_set_header Connection 'upgrade';
    #         proxy_set_header Host $host;
    #         proxy_set_header X-Real-IP $remote_addr;
    #         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #         proxy_set_header X-Forwarded-Proto $scheme;
    #         proxy_cache_bypass $http_upgrade;
    #     }
    # }
}
NGINX

  echo -e "${GREEN}✓ 配置文件已生成于 ${SCRIPT_DIR}${NC}"
}

# 先生成配置文件（便于后续备份和 compose 调用）
generate_config_files

# 备份现有数据（如有）
echo -e "${GREEN}备份现有数据...${NC}"
if docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" ps | grep -q "Up"; then
    echo -e "${YELLOW}检测到运行中的服务，正在备份...${NC}"

    # 创建数据库备份目录
    mkdir -p "${SCRIPT_DIR}/db"
    BACKUP_FILE="${SCRIPT_DIR}/db/keras_mall_$(date +%Y%m%d_%H%M%S).sql"
    
    # 获取数据库配置（已在前面定义）
    
    echo -e "${BLUE}备份数据库: ${DB_DATABASE_EFFECTIVE}${NC}"
    
    # 执行数据库备份，显示详细错误信息
    if docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" exec -T mysql \
        mysqldump -u root -p"${DB_PASSWORD_EFFECTIVE}" "${DB_DATABASE_EFFECTIVE}" > "${BACKUP_FILE}" 2>&1; then
        
        # 检查备份文件是否为空
        if [ -s "${BACKUP_FILE}" ]; then
            echo -e "${GREEN}✓ 数据备份完成: ${BACKUP_FILE}${NC}"
            echo -e "${BLUE}备份文件大小: $(du -h "${BACKUP_FILE}" | cut -f1)${NC}"
        else
            echo -e "${YELLOW}⚠ 备份文件为空，可能数据库中没有数据${NC}"
            rm -f "${BACKUP_FILE}"
        fi
    else
        echo -e "${YELLOW}⚠ MySQL备份失败，详细错误请查看上方输出${NC}"
        rm -f "${BACKUP_FILE}"
    fi
else
    echo -e "${BLUE}未检测到运行中的服务，跳过数据备份${NC}"
fi

# 停止现有服务
echo -e "${GREEN}停止现有服务...${NC}"
docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" down

# 拉取最新镜像
echo -e "${GREEN}拉取最新镜像...${NC}"
docker pull crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com/bingofree2025/keras-mall-api:latest

# 环境配置文件已在 load_environment_config() 函数中处理



# 创建必要的目录（在scripts目录下）
echo -e "${GREEN}创建必要的目录...${NC}"
mkdir -p "${SCRIPT_DIR}/upload" "${SCRIPT_DIR}/logs" "${SCRIPT_DIR}/db" "${SCRIPT_DIR}/ssl" "${SCRIPT_DIR}/nginx_logs"
echo -e "${GREEN}✓ 目录创建完成${NC}"

# 启动生产环境服务
echo -e "${GREEN}启动生产环境服务...${NC}"
docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 服务启动成功${NC}"
else
    echo -e "${RED}✗ 服务启动失败${NC}"
    exit 1
fi

# 等待服务启动
echo -e "${YELLOW}等待服务启动...${NC}"
sleep 60

# 检查MySQL版本和兼容性
echo -e "${GREEN}检查MySQL版本和兼容性...${NC}"
sleep 10
if docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" exec mysql mysql --version > /dev/null 2>&1; then
    MYSQL_VERSION=$(docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" exec mysql mysql --version)
    echo -e "${GREEN}✓ MySQL版本: ${MYSQL_VERSION}${NC}"
    
    # 检查认证插件
    if docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" exec mysql mysql -u root -p"${DB_PASSWORD_EFFECTIVE}" -e "SELECT plugin_name FROM mysql.user WHERE user='root' LIMIT 1;" 2>/dev/null | grep -q "mysql_native_password"; then
        echo -e "${GREEN}✓ 认证插件配置正确 (mysql_native_password)${NC}"
    else
        echo -e "${YELLOW}⚠ 认证插件可能不是 mysql_native_password，但脚本已配置兼容性${NC}"
    fi
else
    echo -e "${YELLOW}⚠ 无法获取MySQL版本信息，可能还在启动中${NC}"
fi

# 检查服务状态
echo -e "${GREEN}检查服务状态...${NC}"
docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" ps

# 健康检查
echo -e "${GREEN}执行健康检查...${NC}"
sleep 20

# 检查API服务
APP_PORT_CHECK="${APP_PORT:-8080}"
if curl -f "http://127.0.0.1:${APP_PORT_CHECK}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API服务运行正常 (端口: ${APP_PORT_CHECK})${NC}"
else
    echo -e "${YELLOW}⚠ API服务可能还在启动中 (端口: ${APP_PORT_CHECK})${NC}"
fi

# 检查MySQL服务
DB_PORT_CHECK="${DB_PORT:-3306}"
if docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" exec mysql mysqladmin ping -h 127.0.0.1 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MySQL服务运行正常 (端口: ${DB_PORT_CHECK})${NC}"
else
    echo -e "${YELLOW}⚠ MySQL服务可能还在启动中 (端口: ${DB_PORT_CHECK})${NC}"
fi

# 检查Redis服务
REDIS_PORT_CHECK="${REDIS_PORT:-6379}"
if docker-compose -f "${SCRIPT_DIR}/docker-compose.yml" exec redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Redis服务运行正常 (端口: ${REDIS_PORT_CHECK})${NC}"
else
    echo -e "${YELLOW}⚠ Redis服务可能还在启动中 (端口: ${REDIS_PORT_CHECK})${NC}"
fi

# 检查Nginx服务
if curl -f http://127.0.0.1:80 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Nginx服务运行正常 (端口: 80)${NC}"
else
    echo -e "${YELLOW}⚠ Nginx服务可能还在启动中 (端口: 80)${NC}"
fi

# 性能检查
echo -e "${GREEN}检查系统资源使用...${NC}"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}生产环境部署完成!${NC}"
echo -e "${BLUE}项目名称: ${PROJECT_NAME}${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}访问地址:${NC}"
echo -e "  - API服务: http://127.0.0.1:${APP_PORT:-8080}"
echo -e "  - Nginx代理: http://127.0.0.1:80"
echo -e "  - 健康检查: http://127.0.0.1:${APP_PORT:-8080}/health"
echo -e ""
echo -e "${GREEN}数据库信息:${NC}"
echo -e "  - MySQL: 127.0.0.1:${DB_PORT:-3306}"
echo -e "  - 用户名: ${DB_USERNAME:-root}"
echo -e "  - 密码: 请查看 .env 文件"
echo -e "  - 数据库: ${DB_DATABASE:-keras_mall}"
echo -e "  - 初始化: 已自动执行 keras_mall.sql"
echo -e ""
echo -e "${GREEN}Redis信息:${NC}"
echo -e "  - Redis: 127.0.0.1:${REDIS_PORT:-6379}"
echo -e ""
echo -e "${YELLOW}生产环境命令:${NC}"
echo -e "  - 查看日志: docker-compose -f ./docker-compose.yml logs -f"
echo -e "  - 停止服务: docker-compose -f ./docker-compose.yml down"
echo -e "  - 重启服务: docker-compose -f ./docker-compose.yml restart"
echo -e "  - 查看状态: docker-compose -f ./docker-compose.yml ps"
echo -e ""
echo -e "${RED}重要提醒:${NC}"
echo -e "  - 请确保已修改默认密码"
echo -e "  - 建议配置SSL证书"
echo -e "  - 数据库备份位置: ${SCRIPT_DIR}/db/"
echo -e "  - 请定期备份数据库"
echo -e "  - 建议配置监控和告警"
echo -e "  - MySQL 8.0 兼容性: 脚本已优化认证配置"
echo -e "  - 如遇认证问题，请检查客户端是否支持 caching_sha2_password"
echo -e "${BLUE}================================${NC}"


