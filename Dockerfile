# 简洁镜像构造脚本
# FROM 127.0.0.1:5000/library/common-base-ai-h5:v1.0.0
# WORKDIR /app
# COPY . /app/
# RUN npm run build

#将127.0.0.1更换为指定ip,或者直接拉取nignx,注意响应nginx的文件路径都需要相应修改
FROM 127.0.0.1:5000/library/bcnginx:v1.20.2
LABEL maintainer="erised"
COPY qrobot/ /apps/svr/nginx-1.20.2/html/qrobot
COPY nginx.conf /apps/conf/nginx_80/nginx.conf

