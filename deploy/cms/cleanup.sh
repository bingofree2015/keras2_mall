#!/bin/bash

# KerasMall CMS 生产环境清理脚本
# 使用方法: ./cleanup.sh
# 功能: 停止由 install.sh 创建的容器服务，删除相关目录与文件
#
# 安全特性: 此脚本只会清理由 install.sh 生成的资源
#           - 通过检查 docker-compose.yml 文件的存在来确认
#           - 如果没有该文件，则跳过容器清理
#           - 确保不会误删其他项目的容器和数据
#
# 注意: 此脚本会完全清理所有由 install.sh 创建的资源
#       包括容器、配置文件等，请谨慎使用

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目名称（与 install.sh 保持一致）
PROJECT_NAME=${PROJECT_NAME:-"keras-mall"}
# 当前工作目录（作为 compose 归属校验）
SCRIPT_DIR="$(pwd)"

# 判断指定容器是否由本目录的 install.sh（docker compose）创建
# 依据 docker compose v2 的标签：
#   - com.docker.compose.project == $PROJECT_NAME
#   - com.docker.compose.service == cms
#   - com.docker.compose.project.working_dir == $SCRIPT_DIR
# 若缺失 working_dir 标签，则视为不属于当前目录（从而不做删除）
own_container() {
  local container_id="$1"
  local project_label service_label working_dir_label
  project_label=$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' "$container_id" 2>/dev/null || true)
  service_label=$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.service" }}' "$container_id" 2>/dev/null || true)
  working_dir_label=$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project.working_dir" }}' "$container_id" 2>/dev/null || true)

  if [[ -z "$project_label" || -z "$service_label" || -z "$working_dir_label" ]]; then
    return 1
  fi

  if [[ "$project_label" == "$PROJECT_NAME" && "$service_label" == "cms" && "$working_dir_label" == "$SCRIPT_DIR" ]]; then
    return 0
  fi
  return 1
}

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  KerasMall CMS 生产环境清理${NC}"
echo -e "${BLUE}  项目名称: ${PROJECT_NAME}${NC}"
echo -e "${BLUE}================================${NC}"

# 检查是否在正确的目录
if [ ! -f "install.sh" ]; then
    echo -e "${RED}错误: 请在包含 install.sh 的目录中运行此脚本${NC}"
    exit 1
fi

# 确认操作
echo -e "${YELLOW}警告: 此操作将删除所有由 install.sh 创建的资源${NC}"
echo -e "${YELLOW}包括:${NC}"
echo -e "  - 所有容器 (cms)"
echo -e "  - 所有生成的目录和文件"
echo -e "  - 所有数据将丢失"
echo -e "${GREEN}安全特性: 只会清理由 install.sh 生成的资源${NC}"
echo -e "${GREEN}          (通过检查 docker-compose.yml 文件确认)${NC}"
echo
read -p "确认要执行清理操作吗? (输入 'yes' 确认): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${BLUE}操作已取消${NC}"
    exit 0
fi

echo

# 1. 停止并删除容器
echo -e "${GREEN}步骤 1: 停止并删除容器...${NC}"

# 只有在存在 docker-compose.yml 时才进行“本目录项目”的清理流程
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${YELLOW}⚠ 未发现 docker-compose.yml 文件，跳过容器清理${NC}"
    echo -e "${BLUE}说明: 仅当本目录通过 install.sh 部署过时才会生成此文件${NC}"
else
    echo -e "${BLUE}发现 docker-compose.yml 文件，将进行容器归属校验后再清理${NC}"

    CMS_NAME="${PROJECT_NAME}_cms"
    CMS_ID="$(docker ps -aq -f name="^${CMS_NAME}$" || true)"

    if [[ -n "$CMS_ID" ]]; then
        if own_container "$CMS_ID"; then
            # 若在运行则先停止
            if docker ps -q -f id="$CMS_ID" | grep -q .; then
                echo -e "${BLUE}正在停止容器: ${CMS_NAME}${NC}"
                docker stop "$CMS_ID"
                echo -e "${GREEN}✓ 容器已停止${NC}"
            else
                echo -e "${BLUE}容器未在运行: ${CMS_NAME}${NC}"
            fi

            echo -e "${BLUE}正在删除容器: ${CMS_NAME}${NC}"
            docker rm "$CMS_ID"
            echo -e "${GREEN}✓ 容器已删除${NC}"
        else
            echo -e "${YELLOW}⚠ 检测到同名容器但不属于本目录部署，已跳过: ${CMS_NAME}${NC}"
        fi
    else
        echo -e "${BLUE}未发现同名容器: ${CMS_NAME}${NC}"
    fi
fi

# 2. 删除生成的目录和文件
echo -e "${GREEN}步骤 2: 删除生成的目录和文件...${NC}"

# 要删除的文件列表
FILES=("nginx.conf" "docker-compose.yml" ".env")

# 要删除的目录列表
DIRECTORIES=()

# 删除文件
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${BLUE}删除文件: $file${NC}"
        rm -f "$file"
    fi
done

# 删除目录
for dir in "${DIRECTORIES[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${BLUE}删除目录: $dir${NC}"
        rm -rf "$dir"
    fi
done

echo -e "${GREEN}✓ 目录和文件已删除${NC}"

# 3. 验证清理结果
echo -e "${GREEN}步骤 3: 验证清理结果...${NC}"

# 校验是否仍有属于本目录部署的容器残留
CMS_NAME_CHECK="${PROJECT_NAME}_cms"
CMS_ID_CHECK="$(docker ps -aq -f name="^${CMS_NAME_CHECK}$" || true)"
if [[ -n "$CMS_ID_CHECK" && own_container "$CMS_ID_CHECK" ]]; then
    echo -e "${YELLOW}⚠ 仍有容器存在（属于本目录部署）:${NC}"
    docker ps -a -f id="$CMS_ID_CHECK"
else
    echo -e "${GREEN}✓ 所有容器已清理（本目录部署）${NC}"
fi

# 检查文件
REMAINING_FILES=()
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        REMAINING_FILES+=("$file")
    fi
done

if [ ${#REMAINING_FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ 所有生成的文件已清理${NC}"
else
    echo -e "${YELLOW}⚠ 仍有文件存在: ${REMAINING_FILES[*]}${NC}"
fi

# 检查目录
REMAINING_DIRS=()
for dir in "${DIRECTORIES[@]}"; do
    if [ -d "$dir" ]; then
        REMAINING_DIRS+=("$dir")
    fi
done

if [ ${#REMAINING_DIRS[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ 所有生成的目录已清理${NC}"
else
    echo -e "${YELLOW}⚠ 仍有目录存在: ${REMAINING_DIRS[*]}${NC}"
fi

# 显示当前目录状态
echo -e "${BLUE}当前目录内容:${NC}"
ls -la

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}清理完成!${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}已清理的资源:${NC}"
echo -e "  ✓ 容器: cms（仅清理由本目录 install.sh 创建的容器）"
echo -e "  ✓ 文件: nginx.conf, docker-compose.yml, .env"
echo -e ""
echo -e "${BLUE}保留的文件:${NC}"
echo -e "  - install.sh (安装脚本)"
echo -e ""
echo -e "${YELLOW}注意:${NC}"
echo -e "  - 所有数据已丢失，如需备份请重新运行 install.sh"
echo -e "  - 如需重新部署，请运行 ./install.sh"
echo -e "${BLUE}================================${NC}"
