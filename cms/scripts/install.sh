#!/bin/bash

set -Eeuo pipefail

# =============================
# KerasMall CMS 部署脚本（单一功能版）
# - 自动生成 docker-compose.yml 与 nginx.conf
# - 环境检测（docker / compose / 端口占用 / 写权限 / curl）
# - 不包含镜像构建过程，仅拉取并启动容器
# - 连接到 API 创建的网络，实现容器间通信
# - 使用方法:
#   ./install.sh                          # 使用默认项目名称 "keras-mall"
#   PROJECT_NAME=my-mall ./install.sh     # 使用自定义项目名称 "my-mall"
# =============================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# 将工作目录固定为脚本所在目录，所有生成文件落在当前目录
REPO_ROOT="$SCRIPT_DIR"
cd "$REPO_ROOT"

# 设置容器组项目名称（与 API 保持一致）
PROJECT_NAME=${PROJECT_NAME:-"keras-mall"}
export COMPOSE_PROJECT_NAME="$PROJECT_NAME"

# 常量（可通过环境变量覆盖）
REGISTRY_URL=${REGISTRY_URL:-"crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com"}
REGISTRY_NAMESPACE=${REGISTRY_NAMESPACE:-"bingofree2025"}
IMAGE_NAME=${IMAGE_NAME:-"keras-mall-cms"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}

SERVICE_NAME=${SERVICE_NAME:-"${PROJECT_NAME}_cms"}
COMPOSE_FILE=${COMPOSE_FILE:-"docker-compose.yml"}
NGINX_CONF=${NGINX_CONF:-"nginx.conf"}

# 端口
APP_PORT=${APP_PORT:-8085}                 # 宿主机端口
NGINX_CONTAINER_PORT=${NGINX_CONTAINER_PORT:-8085}  # 容器内 nginx 监听端口

# 前端运行时变量（将被注入到容器并由 nginx 使用）
VITE_BASE_URL=${VITE_BASE_URL:-"http://127.0.0.1:8080"}
VITE_APP_TITLE=${VITE_APP_TITLE:-"KerasMall CMS"}

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERR]${NC} $*"; }

timestamp() { date +"%Y%m%d-%H%M%S"; }

backup_file() {
  local f="$1"
  if [[ -f "$f" ]]; then
    local bak="$f.bak.$(timestamp)"
    cp "$f" "$bak"
    info "已备份 $f -> $bak"
  fi
}

detect_compose_cmd() {
  if docker compose version >/dev/null 2>&1; then
    echo "docker compose"
    return 0
  fi
  if command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
    return 0
  fi
  return 1
}

check_env() {
  info "进行环境检测..."

  if ! command -v docker >/dev/null 2>&1; then
    error "未检测到 docker，请先安装并启动 Docker Desktop/Engine"
    exit 1
  fi
  if ! docker info >/dev/null 2>&1; then
    error "Docker 未运行，请先启动 Docker"
    exit 1
  fi

  if ! COMPOSE_CMD="$(detect_compose_cmd)"; then
    error "未检测到 docker compose 或 docker-compose，请安装其中之一"
    exit 1
  fi
  info "使用 Compose 命令: ${COMPOSE_CMD}"

  if ! command -v curl >/dev/null 2>&1; then
    error "未检测到 curl，请安装 curl 用于健康检查"
    exit 1
  fi

  # 写权限
  if [[ ! -w "$REPO_ROOT" ]]; then
    error "当前目录无写权限：$REPO_ROOT"
    exit 1
  fi

  # 端口占用检查（若有 lsof 则检查）
  if command -v lsof >/dev/null 2>&1; then
    if lsof -iTCP:"$APP_PORT" -sTCP:LISTEN -Pn >/dev/null 2>&1; then
      error "宿主机端口 $APP_PORT 已被占用，请更换 APP_PORT 环境变量后重试"
      exit 1
    fi
  else
    warn "未检测到 lsof，跳过端口占用检查"
  fi

  success "环境检测通过"
}

container_exists() {
  # 返回 0 表示存在，1 表示不存在
  if docker ps -a --format '{{.Names}}' | grep -wq "^${SERVICE_NAME}$"; then
    return 0
  fi
  return 1
}

stop_existing_container() {
  if container_exists; then
    warn "检测到已存在容器: ${SERVICE_NAME}，正在停止并删除..."
    docker stop "${SERVICE_NAME}" >/dev/null 2>&1 || true
    docker rm   "${SERVICE_NAME}" >/dev/null 2>&1 || true
    success "已清理旧容器: ${SERVICE_NAME}"
  else
    info "未检测到同名容器: ${SERVICE_NAME}"
  fi
}

check_api_network() {
  local network_name="${PROJECT_NAME}_app_network"
  info "检查 API 网络是否存在..."
  
  if ! docker network ls --format '{{.Name}}' | grep -wq "^${network_name}$"; then
    error "未找到 API 网络: ${network_name}"
    error "请先运行 API 的 install.sh 脚本创建网络"
    error "或者使用相同的 PROJECT_NAME 环境变量"
    exit 1
  fi
  
  success "找到 API 网络: ${network_name}"
}

pull_latest_image() {
  local image_ref="${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"
  info "拉取最新镜像: ${image_ref}"
  docker pull "${image_ref}"
  success "镜像已更新: ${image_ref}"
}

generate_nginx_conf() {
  info "生成 $NGINX_CONF"
  # 按用户要求：不备份旧配置，直接覆盖生成
  cat > "$NGINX_CONF" <<EOF
server {
    listen ${NGINX_CONTAINER_PORT};
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 静态站点与前端路由
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 反向代理到 API（容器网络内，通过服务名解析）
    location /cms/ {
        proxy_pass http://${PROJECT_NAME}_api:8080/cms/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /upload/ {
        proxy_pass http://${PROJECT_NAME}_api:8080/upload/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin *;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # 错误页面
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
}
EOF
  success "已生成 $NGINX_CONF"
}

generate_compose() {
  info "生成 $COMPOSE_FILE"
  # 按用户要求：不备份旧配置，直接覆盖生成
  # 注意：新版 Docker Compose 不再需要 version 字段
  cat > "$COMPOSE_FILE" <<EOF
services:
  cms:
    image: ${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}
    container_name: ${PROJECT_NAME}_cms
    ports:
      - "${APP_PORT}:${NGINX_CONTAINER_PORT}"
    environment:
      - VITE_BASE_URL=${VITE_BASE_URL}
      - VITE_APP_TITLE="${VITE_APP_TITLE}"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - app_network
    restart: unless-stopped

networks:
  app_network:
    external: true
    name: ${PROJECT_NAME}_app_network
EOF
  success "已生成 $COMPOSE_FILE"
}

start_stack() {
  info "启动服务..."
  ${COMPOSE_CMD} up -d
  success "服务已启动"
}

health_check() {
  info "执行健康检查..."
  local url="http://127.0.0.1:${APP_PORT}/health"
  for i in {1..30}; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      success "健康检查通过：$url"
      return 0
    fi
    sleep 1
  done
  error "健康检查失败：$url"
  ${COMPOSE_CMD} logs || true
  exit 1
}

main() {
  echo -e "${BLUE}================================${NC}"
  echo -e "${BLUE}  KerasMall CMS 部署（Compose） ${NC}"
  echo -e "${BLUE}  项目名称: ${PROJECT_NAME}${NC}"
  echo -e "${BLUE}================================${NC}"
  echo "镜像: ${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"
  echo "映射端口: ${APP_PORT}->${NGINX_CONTAINER_PORT}"
  echo "VITE_BASE_URL: ${VITE_BASE_URL}"
  echo "VITE_APP_TITLE: ${VITE_APP_TITLE}"
  echo "工作目录: ${REPO_ROOT}"
  echo

  check_env
  check_api_network
  generate_nginx_conf
  generate_compose
  stop_existing_container
  pull_latest_image
  start_stack
  health_check

  echo
  success "部署完成！"
  echo "应用地址: http://localhost:${APP_PORT}"
  echo "健康检查: http://localhost:${APP_PORT}/health"
  echo
  echo "常用命令："
  echo "  查看日志: ${COMPOSE_CMD} logs -f"
  echo "  重启服务: ${COMPOSE_CMD} restart"
  echo "  停止服务: ${COMPOSE_CMD} down"
}

main "$@"


