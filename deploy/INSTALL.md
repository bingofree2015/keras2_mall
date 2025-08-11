## KerasMall 生产环境安装说明（API + CMS）

本说明基于 `deploy/api/install.sh` 与 `deploy/cms/install.sh`，帮助你快速完成 API 与 CMS 的部署。

### 前置条件
- 已安装并运行 Docker
- 必须安装 Docker Compose（API 脚本要求 `docker-compose` 命令）
- 建议安装 curl（用于健康检查）

### 一、安装 API（必须先安装）
1) 切换目录
```bash
cd deploy/api
```

2) 准备环境文件（首次）
```bash
cp env.example .env
# 编辑 .env（数据库口令、端口、JWT 等）
```

3) 执行安装
```bash
# 可选指定项目名（会影响容器/网络/卷前缀），默认 keras-mall
PROJECT_NAME=keras-mall ./install.sh
```

4) 成功后访问
- API: `http://127.0.0.1:8080`
- 健康检查: `http://127.0.0.1:8080/health`
- Nginx 反代: `http://127.0.0.1`

5) 常用命令（在 `deploy/api`）
```bash
docker-compose -f ./docker-compose.yml ps
docker-compose -f ./docker-compose.yml logs -f
docker-compose -f ./docker-compose.yml restart
docker-compose -f ./docker-compose.yml down
```

6) 说明
- 默认使用 MySQL 8.0 与 Redis，首次启动会自动导入 `keras_mall.sql`
- 数据卷：`${PROJECT_NAME}_mysql_data`, `${PROJECT_NAME}_redis_data`
- 反代端口：80（可选 443，证书放置于 `deploy/api/ssl/` 并在 `nginx.conf` 中开启）

### 二、安装 CMS（依赖 API 已创建的网络）
1) 切换目录
```bash
cd deploy/cms
```

2) 执行安装（与 API 使用相同的 `PROJECT_NAME`）
```bash
# 默认宿主机端口 8085，可通过 APP_PORT 自定义
# VITE_BASE_URL 指向 API 外部可访问地址
PROJECT_NAME=keras-mall \
APP_PORT=8085 \
VITE_BASE_URL="http://127.0.0.1:8080" \
./install.sh
```

3) 成功后访问
- CMS: `http://127.0.0.1:8085`
- 健康检查: `http://127.0.0.1:8085/health`

4) 常用命令（在 `deploy/cms`）
```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

### 环境变量速查
- API（在 `deploy/api/.env` 或运行时传入）
  - `DB_USERNAME`/`DB_PASSWORD`/`DB_DATABASE`/`DB_PORT`
  - `REDIS_PORT`
  - `APP_PORT`（默认 8080）
  - `JWT_SECRET`
  - `PROJECT_NAME`（默认 `keras-mall`）
- CMS（运行时传入或写入 `deploy/cms/.env` 并在 `docker-compose.yml` 绑定）
  - `APP_PORT`（默认 8085）
  - `VITE_BASE_URL`（前端请求 API 的基地址）
  - `VITE_APP_TITLE`

### 验证与排错
- API 容器健康检查 OK 即代表服务就绪，即使直接访问返回 401（鉴权）也属正常
- 查看容器状态与日志，定位问题：
```bash
# API 侧
cd deploy/api && docker-compose -f ./docker-compose.yml ps && docker-compose -f ./docker-compose.yml logs --tail=200
# CMS 侧
cd deploy/cms && docker compose ps && docker compose logs --tail=200
```


