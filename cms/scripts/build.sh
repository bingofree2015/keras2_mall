#!/bin/bash

# KerasMall CMS 单一功能部署脚本
# 功能：
# 1) 安装依赖
# 2) 构建前端项目
# 3) 构建镜像
# 4) 验证镜像可用性
# 5) 推送镜像到阿里云 ACR

set -Eeuo pipefail

# 颜色
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
ok()      { echo -e "${GREEN}[OK]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
err()     { echo -e "${RED}[ERR]${NC} $*"; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# 镜像与仓库（可通过环境变量覆盖）
REGISTRY_URL=${REGISTRY_URL:-"crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com"}
REGISTRY_NAMESPACE=${REGISTRY_NAMESPACE:-"bingofree2025"}
IMAGE_NAME=${IMAGE_NAME:-"keras-mall-cms"}
IMAGE_TAG=${IMAGE_TAG:-"$(date +%Y%m%d-%H%M%S)"}
IMAGE_REF="${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"

# 前端构建使用占位符（运行时由 nginx sub_filter 替换）
# 注意：vite.config.js 中的 build.define 会强制使用占位符，无需传入真实值
VITE_BASE_URL="VITE_BASE_URL_PLACEHOLDER"
VITE_APP_TITLE="VITE_APP_TITLE_PLACEHOLDER"

# 推送凭据（需预先导出环境变量）
ACR_USERNAME=${ACR_USERNAME:-""}
ACR_PASSWORD=${ACR_PASSWORD:-""}

show_help() {
  cat <<EOF
用法: $0 [选项]

选项:
  --tag <TAG>                 指定镜像标签（默认: 当前时间戳）
  -h, --help                  显示帮助

环境变量:
  REGISTRY_URL                默认 ${REGISTRY_URL}
  REGISTRY_NAMESPACE          默认 ${REGISTRY_NAMESPACE}
  IMAGE_NAME                  默认 ${IMAGE_NAME}
  ACR_USERNAME / ACR_PASSWORD 用于 docker login

注意:
  构建时使用占位符，运行时通过 nginx sub_filter 替换为真实值
  VITE_BASE_URL 和 VITE_APP_TITLE 在部署时设置，无需构建时指定
EOF
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --tag)
        IMAGE_TAG="$2"; IMAGE_REF="${REGISTRY_URL}/${REGISTRY_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"; shift 2 ;;
      -h|--help)
        show_help; exit 0 ;;
      *)
        err "未知参数: $1"; show_help; exit 1 ;;
    esac
  done
}

check_deps() {
  info "检查依赖..."
  for c in docker node pnpm; do
    if ! command -v "$c" >/dev/null 2>&1; then
      err "未安装依赖: $c"; exit 1
    fi
  done
  ok "依赖检查通过"
}

install_deps() {
  info "安装前端依赖..."
  pnpm install
  ok "依赖安装完成"
}

build_frontend() {
  info "构建前端... (使用占位符，运行时替换)"
  # 仅为开发期校验，Docker 构建时也会再次构建
  rm -rf dist || true
  pnpm run build
  [[ -f dist/index.html ]] || { err "构建失败: dist/index.html 缺失"; exit 1; }
  ok "前端构建完成"
}

build_image() {
  info "构建镜像: ${IMAGE_REF}"
  # 注意：Dockerfile 的 ARG 仍然存在，但会被 vite.config.js 的 define 覆盖为占位符
  docker build \
    --build-arg VITE_BASE_URL="${VITE_BASE_URL}" \
    --build-arg VITE_APP_TITLE="${VITE_APP_TITLE}" \
    -t "${IMAGE_REF}" .
  ok "镜像构建完成"
}

verify_image() {
  info "验证镜像运行..."
  local cname="cms-verify-$$"
  # nginx 基础镜像默认监听 80，此处映射到 18085
  docker run -d --rm --name "$cname" -p 18085:80 "${IMAGE_REF}" >/dev/null
  trap 'docker rm -f "$cname" >/dev/null 2>&1 || true' EXIT
  # 简单探测首页可达
  for i in {1..20}; do
    if curl -fsS http://127.0.0.1:18085/ >/dev/null 2>&1; then
      ok "镜像验证通过 (http://127.0.0.1:18085/)"
      docker rm -f "$cname" >/dev/null 2>&1 || true
      trap - EXIT
      return 0
    fi
    sleep 1
  done
  err "镜像验证失败"
  docker logs "$cname" || true
  docker rm -f "$cname" >/dev/null 2>&1 || true
  trap - EXIT
  exit 1
}

push_image() {
  info "推送镜像到 ACR: ${IMAGE_REF}"
  if [[ -z "$ACR_USERNAME" || -z "$ACR_PASSWORD" ]]; then
    err "缺少 ACR 凭据：请导出 ACR_USERNAME / ACR_PASSWORD 环境变量"
    exit 1
  fi
  echo "$ACR_PASSWORD" | docker login "$REGISTRY_URL" -u "$ACR_USERNAME" --password-stdin
  docker push "${IMAGE_REF}"
  ok "镜像推送完成"
}

main() {
  parse_args "$@"
  echo -e "${BLUE}================================${NC}"
  echo -e "${BLUE}   KerasMall CMS 构建与推送   ${NC}"
  echo -e "${BLUE}================================${NC}"
  echo "镜像: ${IMAGE_REF}"
  echo "构建方式: 占位符模式（运行时替换）"
  echo

  check_deps
  install_deps
  build_frontend
  build_image
  # verify_image
  push_image

  ok "全部完成！"
}

main "$@"
