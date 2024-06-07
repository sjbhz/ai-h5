let origin = "";
let flag = "";
if (import.meta.env.VITE_NODE_ENV === "production") {
  origin = "https://127.0.0.1";
  flag = "prod";
}
if (import.meta.env.VITE_NODE_ENV === "test") {
  origin = "https://127.0.0.1:13358"; // 测试 
  flag = "test"; // 启用组件标志
}
if (import.meta.env.VITE_NODE_ENV === "development") {
  origin = "https://127.0.0.1:12258"; // 正式 对外端口
  flag = "dev"; // 启用组件标志
}
export default {
  origin,
  flag,
};
