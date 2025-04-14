#####################################
# 将应用程序构建为静态网站 #
#####################################
# 修饰符 --platform=$BUILDPLATFORM 在 buildx 多平台构建期间限制平台为 "BUILDPLATFORM"
# 这是因为 npm "chromedriver" 包与所有平台不兼容
# 更多信息请参阅：https://docs.docker.com/build/building/multi-platform/#cross-compilation
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

# 安装依赖
# --ignore-scripts 阻止 postinstall 脚本（运行 grunt），因为它依赖于 package.json 之外的文件
RUN npm ci --ignore-scripts

# 复制 postinstall 和构建所需的文件
COPY . .

# npm postinstall 运行 grunt，它依赖于 package.json 之外的文件
RUN npm run postinstall

# 构建应用程序
RUN npm run build

#########################################
# 将静态构建文件打包到 nginx 中 #
#########################################
# 我们正在使用 Github Actions: redhat-actions/buildah-build@v2，它需要在基础镜像中手动选择架构
# 如果 CI 发布版本支持 docker buildx，则移除 TARGETARCH，因为 --platform=$TARGETPLATFORM 将被自动设置
ARG TARGETARCH
ARG TARGETPLATFORM
FROM ${TARGETARCH}/nginx:stable-alpine AS cyberchef

COPY --from=builder /app/build/prod /usr/share/nginx/html/
