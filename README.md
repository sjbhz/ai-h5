# ai-h5

vue3 + element-ui 实现 仿AI智能机器人助手h5，
支持流式文本（sse）、图文回复展示

## 安装依赖
```
cnpm install
```

### 开发环境编译运行
```
npm run dev
```

### 生成环境打包
```
npm run build:test

```
### 构建镜像
```
docker  build . -t ai-web:v1.0.0
```
### 启动
```
docker run -it -p 13358:80 -v /ai-web/nginx.conf:/apps/conf/nginx_80/nginx.conf -d ai-web:v1.0.0
```

### 部署后访问的url地址（/qrobot/子路径部署）（比如在120.11.11.100机器中部署）
```
测试环境url：webHashHistroy: 'http://120.11.11.100:13358/qrobot/#/?token=xxxx'
```