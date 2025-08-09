# KerasMall CMS 部署脚本使用指南

本目录包含 KerasMall CMS 项目的自动化部署脚本，提供完整的构建与部署流水线。

## 脚本说明

### `build.sh` - 构建与推送脚本

-   安装前端依赖
-   构建前端项目（使用占位符）
-   构建 Docker 镜像
-   验证镜像可用性
-   推送镜像到阿里云 ACR

### `install.sh` - 部署脚本

-   环境检测与依赖检查
-   自动生成 `docker-compose.yml` 和 `nginx.conf`
-   停止现有容器并拉取最新镜像
-   启动服务并进行健康检查

## 技术特点

采用占位符模式：构建时使用 `VITE_BASE_URL_PLACEHOLDER` 和 `VITE_APP_TITLE_PLACEHOLDER`，运行时通过 nginx `sub_filter` 替换为真实值，实现一次构建多环境部署。

---

## 1. 前置条件

-   Docker（含 docker CLI）
-   Docker Compose（支持 docker compose v2 或 docker-compose v1）
-   Node.js 与 pnpm（用于本地构建校验）
-   curl（用于健康检查）

---

## 2. 一键构建并推送镜像（build.sh）

### 2.1 准备 ACR 凭据

```sh
export ACR_USERNAME=你的阿里云账号或临时令牌
export ACR_PASSWORD=对应密码或令牌
```

### 2.2 执行构建与推送

```sh
# 最简用法（镜像标签默认为时间戳）
./build.sh

# 指定镜像标签
./build.sh --tag 1.0.0
```

脚本动作：

-   安装依赖 → 本地前端构建校验（生成 dist，包含占位符）
-   docker build（构建产物包含占位符，运行时替换）
-   本地启动临时容器进行健康验证
-   docker login 到 ACR 并 push 镜像

可用环境变量（可覆盖默认值）：

-   REGISTRY_URL（默认：crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com）
-   REGISTRY_NAMESPACE（默认：bingofree2025）
-   IMAGE_NAME（默认：keras-mall-cms）
-   IMAGE_TAG（默认：当前时间戳，也可用 `--tag` 覆盖）

**重要**：构建时使用占位符，VITE_BASE_URL 和 VITE_APP_TITLE 无需在构建时指定，在部署时设置。

---

## 3. 一键部署/安装（install.sh）

脚本会：

-   环境检测（docker、compose、curl、端口占用、目录写权限）
-   生成 `nginx.conf` 与 `docker-compose.yml`（含备份机制）
-   如有同名容器则停止并删除
-   拉取镜像并通过 Compose 启动
-   健康检查 `http://localhost:<APP_PORT>/health`

### 3.1 快速部署

```sh
# 使用 latest 标签，端口 8085，API 地址默认 http://127.0.0.1:8080
./install.sh
```

### 3.2 常用环境变量（执行前设置即可）

```sh
# 运行时替换到前端代码中的 API 地址与标题
export VITE_BASE_URL=http://prod-api.example.com:8080
export VITE_APP_TITLE="KerasMall CMS"

# 选择镜像标签
export IMAGE_TAG=1.0.0

# 端口映射：宿主机端口 -> 容器内 nginx 监听端口
export APP_PORT=8085                  # 宿主机端口（默认 8085）
export NGINX_CONTAINER_PORT=8085      # 容器内端口（默认 8085）

# 可选：服务名/仓库信息（如需改名或换仓库）
export SERVICE_NAME=keras-mall-cms
export REGISTRY_URL=crpi-xxxx.aliyuncs.com
export REGISTRY_NAMESPACE=xxxx
export IMAGE_NAME=keras-mall-cms

./install.sh
```

部署完成后访问：`http://localhost:<APP_PORT>`（默认 http://localhost:8085）

---

## 4. 常见操作

-   升级到指定版本：

```sh
IMAGE_TAG=1.0.1 ./install.sh
```

-   切换 API 地址（无需重建镜像）：

```sh
VITE_BASE_URL=http://new-api.example.com:8080 ./install.sh
```

-   更换宿主机端口：

```sh
APP_PORT=9090 ./install.sh
```

---

## 5. 技术原理

### 5.1 占位符机制

构建时：

```javascript
// vite.config.js - 构建时强制使用占位符
define: {
    'import.meta.env.VITE_BASE_URL': JSON.stringify('VITE_BASE_URL_PLACEHOLDER'),
    'import.meta.env.VITE_APP_TITLE': JSON.stringify('VITE_APP_TITLE_PLACEHOLDER'),
}
```

运行时：

```nginx
# nginx.conf - 运行时动态替换
location / {
    sub_filter 'VITE_BASE_URL_PLACEHOLDER' '$VITE_BASE_URL';
    sub_filter 'VITE_APP_TITLE_PLACEHOLDER' '$VITE_APP_TITLE';
    sub_filter_once off;
}
```

### 5.2 优势

-   **一次构建，多环境部署**：同一镜像可部署到不同环境
-   **配置灵活**：无需重建镜像即可切换后端地址
-   **生产安全**：避免在镜像中硬编码敏感信息

---

## 6. 目录与文件说明

-   `scripts/Dockerfile`：前端构建并打包为 nginx 静态站点镜像
-   `scripts/build.sh`：构建 + 验证 + 推送镜像
-   `scripts/install.sh`：生成配置 + 拉取镜像 + 启动服务
-   `vite.config.js`：包含占位符配置
-   `env.example`：.env 示例（仅用于开发环境）
-   `dist/`：前端构建产物（由脚本或 Docker 构建生成）

提示：`docker-compose.yml` 与 `nginx.conf` 不再保存在仓库，安装脚本会自动生成并带备份。

---

## 7. 故障排查

-   登录/推送失败：检查 `ACR_USERNAME` / `ACR_PASSWORD` 是否正确、网络是否可达
-   端口占用：修改 `APP_PORT` 重试
-   健康检查失败：
    -   查看日志：`docker compose logs -f` 或 `docker-compose logs -f`
    -   检查 `VITE_BASE_URL` 是否可访问
    -   检查镜像版本是否正确（`IMAGE_TAG`）
-   拉取镜像缓慢：考虑配置 Docker 镜像加速器
-   占位符未替换：检查 nginx `sub_filter` 模块是否启用

---

## 8. 工作流程示例

### 构建镜像

```sh
# 设置 ACR 凭据
export ACR_USERNAME=your_username
export ACR_PASSWORD=your_password

# 构建并推送镜像
./build.sh --tag 1.0.0
```

### 部署到开发环境

```sh
VITE_BASE_URL=http://dev-api.example.com:8080 \
VITE_APP_TITLE="KerasMall CMS (Dev)" \
IMAGE_TAG=1.0.0 \
./install.sh
```

### 部署到生产环境

```sh
VITE_BASE_URL=http://prod-api.example.com:8080 \
VITE_APP_TITLE="KerasMall CMS" \
IMAGE_TAG=1.0.0 \
APP_PORT=80 \
./install.sh
```

---

如需进一步自定义部署流程，请参考 `build.sh` 与 `install.sh` 源码注释。
