# as-frame(基于vue3基础框架)

### author: almostSir，date：2024-07-01

### 基础框架详情

- 开发环境：vs code 开发工具、nodejs@20.10.0、vite/5.0.\*
- 基于 Vue 3 + TypeScript + Vite 搭建的通用框架

### 准备工作

- 安装degit工具：npm install -g degit

### 1.从仓库下载文件,并命名为vue-demo（可以根据实际情况重命名）

```
degit 775013453/basic-web vue-demo
```

### 2.安装依赖包

```
npm install
```

### 3.程序启动（开发环境）

```
npm run serve
```

### 4.程序打包前预览

```
npm run preview
```

### 5.项目代码格式化

```
npm run format
```

### 6.程序打包（生产环境）

```
npm run build
```

### 自动修复 bug（包括语法、格式错误，业务错误不包含在内）

```
npm run lint
```

### 自定义配置

See [Configuration Reference](https://cli.vuejs.org/config/).

### 文件目录结构说明

- public -- 静态资源文件夹（工具会将文件夹内部的拷贝到打包文件夹下）
- src/assets -- 静态资源文件夹（工具会处理里面的图片与文件）
- src/components -- 公共组件文件夹（自定义的公共组件文件目录）
- src/config -- 功能配置文件（根据业务功能配置功能的表格、表单、详情字段,菜单等）
- src/mock -- mock数据接口配置
- src/router -- 路由配置文件夹
- src/store -- pinia共享文件夹（配置全局的变量）
- src/typings -- ts声明文件
- src/utils -- 公共方法及配置文件夹（亦可存放hooks公共函数）
- src/views -- 业务界面文件夹

### 打包命令：

- 生产环境：npm run build

### 静态系统字典配置

- 配置文件地址：src/utils/system-dict.ts

### 游客模式配置(参考配置文件)

- 配置文件地址：src/utils/system-config.ts -> visitorMode 配置
- 游客模式下静态菜单配置地址：src/config/login-config.ts

### mock接口配置说明

1. 在src/mock目录下新建mock模拟接口配置（建议按照业务划分），参考dict.mock.ts文件
2. 在src/mock目录下的index.ts文件中导入新建的接口配置文件，并在，export中导出，参考例子

### 附加说明

- vueThis包位置：import { vueThis } from 'components/utils/send-http';
- 如果不是采用degit脚手架克隆，直接通过npm安装公共组件需要在main.ts文件加入：vueThis(app);
