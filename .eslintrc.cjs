module.exports = {
  // 生效需要在开发工具中安装eslint插件，同时在setting.json配置"eslint.enable": true
  // ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找
  root: true,
  // 指定脚本的运行环境。每种环境都有一组特定的预定义全局变量
  env: {
    browser: true,
    node: true
  },
  // 启用的规则
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2015,
    sourceType: 'module'
  },
  globals: {
    document: true,
    window: true
  },
  plugins: ['vue', '@typescript-eslint'], // eslint-plugin-vue
  ignorePatterns: ['src/**/*.test.ts'],
  rules: {
    'no-undef': 0, // 由于使用了自动导入包，与未定义冲突
    'vue/html-self-closing': 0, // 关闭标签自闭合验证
    'vue/attribute-hyphenation': 0, // 在模板中属性强制帕斯卡命名法
    'vue/v-on-event-hyphenation': 0, // 在模板中事件强制帕斯卡命名法
    'vue/multi-word-component-names': 0, // 关闭组件名称始终为多字
    'vue/singleline-html-element-content-newline': 0, // 关闭单行元素的内容之前和之后使用换行符
    '@typescript-eslint/no-explicit-any': 2, // ts中使用any类型警告处理
    '@typescript-eslint/ban-ts-comment': 1 // ts中使用@ts发出警告
  }
};
