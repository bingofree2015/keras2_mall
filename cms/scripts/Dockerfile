# 构建阶段
FROM node:20-alpine AS builder

# 不再需要构建期 API 地址/标题，占位符方案已移除

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

# 生产环境镜像
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8085

CMD ["nginx", "-g", "daemon off;"]


