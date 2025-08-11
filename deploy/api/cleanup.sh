#!/bin/bash

# KerasMall生产环境清理脚本
# 使用方法: ./cleanup.sh
# 功能: 停止由 install.sh 创建的容器服务，删除相关目录与文件
#
# 安全特性: 此脚本只会清理由 install.sh 生成的资源
#           - 通过检查 docker-compose.yml 文件的存在来确认
#           - 如果没有该文件，则跳过容器和数据卷清理
#           - 确保不会误删其他项目的容器和数据
#
# 注意: 此脚本会完全清理所有由 install.sh 创建的资源
#       包括容器、数据卷、配置文件等，请谨慎使用

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
#   - com.docker.compose.service ∈ {nginx, api, mysql, redis}
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

  case "$service_label" in
    nginx|api|mysql|redis) : ;; 
    *) return 1 ;;
  esac

  if [[ "$project_label" == "$PROJECT_NAME" && "$working_dir_label" == "$SCRIPT_DIR" ]]; then
    return 0
  fi
  return 1
}

# 判断指定数据卷是否由本目录的 compose 创建
# 标签：
#   - com.docker.compose.project == $PROJECT_NAME
#   - com.docker.compose.volume ∈ {mysql_data, redis_data}
#   - com.docker.compose.project.working_dir == $SCRIPT_DIR
own_volume() {
  local volume_name="$1"
  local project_label volume_label working_dir_label
  project_label=$(docker volume inspect -f '{{ index .Labels "com.docker.compose.project" }}' "$volume_name" 2>/dev/null || true)
  volume_label=$(docker volume inspect -f '{{ index .Labels "com.docker.compose.volume" }}' "$volume_name" 2>/dev/null || true)
  working_dir_label=$(docker volume inspect -f '{{ index .Labels "com.docker.compose.project.working_dir" }}' "$volume_name" 2>/dev/null || true)

  if [[ -z "$project_label" || -z "$volume_label" || -z "$working_dir_label" ]]; then
    return 1
  fi

  case "$volume_label" in
    mysql_data|redis_data) : ;;
    *) return 1 ;;
  esac

  if [[ "$project_label" == "$PROJECT_NAME" && "$working_dir_label" == "$SCRIPT_DIR" ]]; then
    return 0
  fi
  return 1
}

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  KerasMall生产环境清理${NC}"
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
echo -e "  - 所有容器 (nginx, api, mysql, redis)"
echo -e "  - 所有数据卷 (mysql_data, redis_data)"
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

# 检查 docker-compose.yml 是否存在，确保只清理由 install.sh 生成的容器
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${YELLOW}⚠ 未发现 docker-compose.yml 文件，跳过容器清理${NC}"
    echo -e "${BLUE}说明: 只有运行过 install.sh 后才会生成此文件${NC}"
else
    echo -e "${BLUE}发现 docker-compose.yml 文件，将进行容器归属校验后再清理${NC}"

    CONTAINER_NAMES=("${PROJECT_NAME}_nginx" "${PROJECT_NAME}_api" "${PROJECT_NAME}_mysql" "${PROJECT_NAME}_redis")

    for name in "${CONTAINER_NAMES[@]}"; do
        cid="$(docker ps -aq -f name="^${name}$" || true)"
        if [[ -z "$cid" ]]; then
            echo -e "${BLUE}未发现同名容器: ${name}${NC}"
            continue
        fi
        if own_container "$cid"; then
            if docker ps -q -f id="$cid" | grep -q .; then
                echo -e "${BLUE}正在停止容器: ${name}${NC}"
                docker stop "$cid"
                echo -e "${GREEN}✓ 容器已停止${NC}"
            else
                echo -e "${BLUE}容器未在运行: ${name}${NC}"
            fi
            echo -e "${BLUE}正在删除容器: ${name}${NC}"
            docker rm "$cid"
            echo -e "${GREEN}✓ 容器已删除${NC}"
        else
            echo -e "${YELLOW}⚠ 检测到同名容器但不属于本目录部署，已跳过: ${name}${NC}"
        fi
    done
fi

# 2. 删除数据卷
echo -e "${GREEN}步骤 2: 删除数据卷...${NC}"

# 只有在存在 docker-compose.yml 时才清理“本目录部署”的数据卷
if [ -f "docker-compose.yml" ]; then
    VOLUME_NAMES=("${PROJECT_NAME}_mysql_data" "${PROJECT_NAME}_redis_data")
    for vname in "${VOLUME_NAMES[@]}"; do
        if docker volume ls -q | grep -q "^${vname}$"; then
            if own_volume "$vname"; then
                # 检查是否被容器使用
                if docker ps -q --filter volume="$vname" | grep -q .; then
                    echo -e "${YELLOW}⚠ 数据卷 $vname 仍被容器使用，尝试强制删除...${NC}"
                    docker volume rm -f "$vname" 2>/dev/null || echo -e "${YELLOW}⚠ 无法删除 $vname，可能仍有容器引用${NC}"
                else
                    echo -e "${BLUE}正在删除数据卷: $vname${NC}"
                    docker volume rm "$vname"
                fi
                echo -e "${GREEN}✓ 数据卷处理完成: $vname${NC}"
            else
                echo -e "${YELLOW}⚠ 检测到同名数据卷但不属于本目录部署，已跳过: ${vname}${NC}"
            fi
        fi
    done
else
    echo -e "${YELLOW}⚠ 未发现 docker-compose.yml 文件，跳过数据卷清理${NC}"
fi

# 3. 删除生成的目录和文件
echo -e "${GREEN}步骤 3: 删除生成的目录和文件...${NC}"

# 要删除的目录列表
DIRECTORIES=("nginx_logs" "db" "ssl" "logs" "upload")

# 要删除的文件列表
FILES=("nginx.conf" "docker-compose.yml" ".env")

# 删除目录
for dir in "${DIRECTORIES[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${BLUE}删除目录: $dir${NC}"
        rm -rf "$dir"
    fi
done

# 删除文件
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${BLUE}删除文件: $file${NC}"
        rm -f "$file"
    fi
done

echo -e "${GREEN}✓ 目录和文件已删除${NC}"

# 4. 验证清理结果
echo -e "${GREEN}步骤 4: 验证清理结果...${NC}"

# 校验是否仍有属于本目录部署的容器/数据卷残留
CONTAINER_NAMES_CHECK=("${PROJECT_NAME}_nginx" "${PROJECT_NAME}_api" "${PROJECT_NAME}_mysql" "${PROJECT_NAME}_redis")
OWN_LEFT=false
for name in "${CONTAINER_NAMES_CHECK[@]}"; do
  cid="$(docker ps -aq -f name="^${name}$" || true)"
  if [[ -n "$cid" && $(own_container "$cid"; echo $?) -eq 0 ]]; then
    OWN_LEFT=true
    echo -e "${YELLOW}⚠ 仍有容器存在（属于本目录部署）:${NC}"
    docker ps -a -f id="$cid"
  fi
done
if [[ "$OWN_LEFT" == false ]]; then
  echo -e "${GREEN}✓ 所有容器已清理（本目录部署）${NC}"
fi

VOLUME_NAMES_CHECK=("${PROJECT_NAME}_mysql_data" "${PROJECT_NAME}_redis_data")
OWN_VOL_LEFT=false
for vname in "${VOLUME_NAMES_CHECK[@]}"; do
  if docker volume ls -q | grep -q "^${vname}$"; then
    if own_volume "$vname"; then
      OWN_VOL_LEFT=true
      echo -e "${YELLOW}⚠ 仍有数据卷存在（属于本目录部署）: ${vname}${NC}"
    fi
  fi
done
if [[ "$OWN_VOL_LEFT" == false ]]; then
  echo -e "${GREEN}✓ 所有数据卷已清理（本目录部署）${NC}"
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
echo -e "  ✓ 容器: nginx, api, mysql, redis（仅清理由本目录 install.sh 创建的容器）"
echo -e "  ✓ 数据卷: mysql_data, redis_data（仅清理由本目录 install.sh 创建的数据卷）"
echo -e "  ✓ 目录: nginx_logs, db, ssl, logs, upload"
echo -e "  ✓ 文件: nginx.conf, docker-compose.yml, .env"
echo -e ""
echo -e "${BLUE}保留的文件:${NC}"
echo -e "  - env.example (原始配置文件)"
echo -e "  - install.sh (安装脚本)"
echo -e "  - keras_mall.sql (数据库初始化文件)"
echo -e ""
echo -e "${YELLOW}注意:${NC}"
echo -e "  - 所有数据已丢失，如需备份请重新运行 install.sh"
echo -e "  - 如需重新部署，请运行 ./install.sh"
echo -e "${BLUE}================================${NC}"
