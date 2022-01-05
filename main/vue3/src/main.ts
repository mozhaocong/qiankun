import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
  registerMicroApps,
  start,
  setDefaultMountApp,
} from "qiankun";

createApp(App).use(store).use(router).mount("#app");
registerMicroApps([
  {
    name: "app-test", //子应用名称 和子应用的package的那么一致
    entry: "//127.0.0.1:4331", //子应用地址，假设此项目名称为智能质检应用（下面演示生命周期的时候会用到）
    container: "#container", //子应用要挂载的节点，和vue.$mount("#app")类似; 在App.vue的节点上
    activeRule: "/app-test", //重点：路由命中规则，当浏览器链接有/app-test时候，例如http://localhost:9000/quality/* ，就可以自动的把http://localhost:808挂载到本地的#container节点下
    // activeRule 建议设置和子应用的router的 history: createWebHistory("/app-test"),一致
  },
]);


// 启动默认应用 应用没有默认路由才会启动默认应用，反之, 可以去掉 use(router) 查看效果
setDefaultMountApp("/app-test");

// 启动 qiankun
start();
