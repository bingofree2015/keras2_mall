# 构建阶段
FROM node:20-alpine AS builder

# 定义构建参数
ARG VITE_BASE_URL=http://127.0.0.1:8080
ARG VITE_APP_TITLE=KerasMall CMS

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

# 设置环境变量用于构建
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE

RUN pnpm run build

# 生产环境镜像
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8085

CMD ["nginx", "-g", "daemon off;"]