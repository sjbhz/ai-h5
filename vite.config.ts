import { defineConfig ,loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import pxToRem from 'postcss-pxtorem'
import styleImport from 'vite-plugin-style-import'
import autoprefixer from 'autoprefixer'

export default (({ mode }) => {
const env = loadEnv(mode, process.cwd());
const { VITE_OUTPUT_DIR } = env;
return defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: '@haloe/mobile',
          esModule: true,
          resolveStyle: (name) => `@haloe/mobile/es/${name}/style`,
        },
      ],
    }),
  ],
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      sass: {
        javascriptEnabled: true
      }
    },
    postcss: {
      plugins: [
        // px换算成rem
        pxToRem({
          rootValue: 37.5, // 换算的基数
          // selectorBlackList: ['van-'], // 忽略转换正则匹配项
          propList: ['*'],
          unitPrecision: 4,
          minPixelValue: 2
        }),
        autoprefixer({ // 自动添加前缀
          overrideBrowserslist: [
            "Android 4.1",
            "iOS 7.1",
            "Chrome > 31",
            "ff > 31",
            "ie >= 8"
            //'last 2 versions', // 所有主流浏览器最近2个版本
          ],
          grid: true
        })
      ]
    },
  },
  base: './', // 打包路径
  build: {
    outDir: VITE_OUTPUT_DIR,// 打包后dist修改名字
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',  // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js',  // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        // manualChunks: (id: string) => {
        //   if (id.includes('node_modules')) {
        //     return 'vendor'
        //   }
        //   return 'index'
        // },
        manualChunks: {
          vue: ['vue', 'vue-router', 'vuex'],
          haloe: ['@haloe/mobile']
        },
        experimentalMinChunkSize: 10 * 1024, // 单位b
      },
      treeshake: {
        preset: 'recommended',
        manualPureFunctions: ['console.log'],
      },
      // external: ["mitt", "lodash"]
    }
  },
  server: {
    port: 5174, // 服务端口号
    open: true, // 服务启动时是否自动打开浏览器
    host: '0.0.0.0',
    proxy: {
      '/robotweb': {       //普通json
        target: 'http://127.0.0.1:7861',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/robotweb/, '')
      },
      '/robotwebchat': {     //sse流式专用
        target: 'http://127.0.0.1:7861',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/robotwebchat/, '')
      }
    }
  }
})

})