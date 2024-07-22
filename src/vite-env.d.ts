/// <reference types="vite/client" />

/**
 * description：用于TS编译器如何处理Vue的单文件组件（SFC）和其他自定义模块的声明文件
 * organization：self
 * author: almostSir
 * date：2024-07-17 15:03:45
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly MODE: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_BASE_API: string;
}
