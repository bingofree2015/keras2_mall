## KerasMall 卸载与清理说明（API + CMS）

本说明基于 `deploy/api/cleanup.sh` 与 `deploy/cms/cleanup.sh`。脚本具备“归属校验”，只会清理由当前目录安装脚本创建的资源，避免误删其他同名容器/数据卷。

### 一、清理 CMS
1) 切换目录并执行
```bash
cd deploy/cms
./cleanup.sh
```
2) 脚本将：
- 仅在发现本目录生成的 `docker-compose.yml` 时执行容器清理
- 校验容器标签（包含 `com.docker.compose.project.working_dir` 等）后，仅删除属于本目录的 `${PROJECT_NAME}_cms`
- 删除生成文件：`nginx.conf`, `docker-compose.yml`, `.env`

### 二、清理 API（最后执行）
1) 切换目录并执行
```bash
cd deploy/api
./cleanup.sh
```
2) 脚本将：
- 仅在发现本目录生成的 `docker-compose.yml` 时执行容器/卷清理
- 校验容器标签，仅删除属于本目录的容器：`${PROJECT_NAME}_nginx`, `${PROJECT_NAME}_api`, `${PROJECT_NAME}_mysql`, `${PROJECT_NAME}_redis`
- 校验数据卷标签，仅删除属于本目录的数据卷：`${PROJECT_NAME}_mysql_data`, `${PROJECT_NAME}_redis_data`
- 删除生成目录与文件：`nginx_logs`, `db`, `ssl`, `logs`, `upload`, 以及 `nginx.conf`, `docker-compose.yml`, `.env`

### 注意事项
- 两边的 `PROJECT_NAME` 需一致（默认 `keras-mall`），以便 CMS 连接到 API 网络 `"${PROJECT_NAME}_app_network"`
- 若手动创建了同名容器/数据卷且不带 compose 标签或工作目录标签，清理脚本会跳过，不会误删
- 如需彻底手动清理残留资源，可执行（请谨慎）：
```bash
docker ps -a | grep keras-mall
docker rm -f <container>
docker volume ls | grep keras-mall
docker volume rm <volume>
```

### 重新部署
清理完成后，按 `INSTALL.md` 重新执行 API 与 CMS 的安装脚本即可。


