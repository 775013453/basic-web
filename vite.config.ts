/**
 * description：vite配置，增加自动导入组件、hooks、eslint检查
 * organization：self
 * author: almostSir
 * date：2024-07-17 13:35:23
 */

import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import { viteMockServe } from 'vite-plugin-mock';

const pathSrc = path.resolve(__dirname, 'src');
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE', 'ENV']);
  console.log(env);
  return {
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '^': path.resolve(__dirname, 'public')
      }
    },
    plugins: [
      vue({
        script: {
          defineModel: true
        }
      }),
      // 增加下面的配置项,这样在运行时就能检查eslint规范
      eslintPlugin({
        include: [
          'src/**/*.js',
          'src/*.js',
          'src/*.ts',
          'src/**/*.ts',
          'src/**/*.d.ts',
          'src/**/*.vue',
          'src/typings/**/*.d.ts',
          'src/*.vue'
        ]
      }),
      // 自动导入hooks,生成auto-imports.d声明文件，例如：vue3的hooks
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            axios: [['default', 'axios']],
            dayjs: ['dayjs'],
            mockjs: ['Mock'],
            'butterfly-dag': ['TreeCanvas', 'TreeNode'],
            'crypto-js/crypto-js': ['CryptoJS'],
            'pinyin-pro': ['pinyin'],
            'vue-draggable-plus': ['VueDraggable']
          }
        ],
        resolvers: [
          ElementPlusResolver(),
          // Auto import icon components
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon'
          })
        ],
        dts: path.resolve(pathSrc, 'typings/auto-imports.d.ts')
      }),
      // 自动导入组件库,生成components.d.ts声明文件，例如：elementPlus
      Components({
        dirs: ['src/components'],
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            // 自动引入的Icon组件统一前缀，默认为 i，设置false为不需要前缀
            // {prefix}-{collection}-{icon} 使用组件解析器时，您必须遵循名称转换才能正确推断图标
            prefix: 'icon',
            enabledCollections: ['ep'] // 这是可选的，默认启用 IConIfy 支持的所有集合['mdi']
          })
        ],
        dts: path.resolve(pathSrc, 'typings/components.d.ts')
      }),
      Icons({
        scale: 1,
        compiler: 'vue3',
        autoInstall: true
      }),
      viteMockServe({
        mockPath: './src/mock/', // 配置mock模拟数据配置文件路径
        localEnabled: command === 'serve', // 开发打包开关
        prodEnabled: command !== 'serve', // 生产打包开关
        supportTs: true, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `
      })
    ],
    server: {
      port: 8080, // 开发服务器端口
      strictPort: true, // 若端口已被占用则会直接退出
      open: true, // 启动时自动在浏览器中打开应用程序
      cors: true, // 启用并允许任何源
      hmr: true, // 开启热更新
      logLevel: 'info', // 调整控制台输出的级别,'info' | 'warn' | 'error' | 'silent'
      origin: '', // 定义开发调试阶段生成的origin
      // 开发服务器配置自定义代理规则
      proxy: {
        '/service/': {
          target: 'http://192.168.111.95:8120',
          changeOrigin: false
        }
      }
    }
  };
});
