import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

let instance: any = null;

function render(props?: any) {
  instance = createApp(App)
    .use(store)
    .use(router)
    .mount(
      props && props.container
        ? props.container.querySelector("#app-test")
        : "#app-test" // 节点不一样来区分子应用
    );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// 判断是不是乾坤微前端 这是本地运行
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 生命周期
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// 微前端运行 的生命周期
export async function mount(props: any) {
  const prop = {
    container: props.container,
  };
  render(prop);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function unmount() {
  instance?.$destroy && instance.$destroy();
  instance = null;
}
