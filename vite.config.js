import { defineConfig, loadEnv } from "vite";
import path from "path";
import createVitePlugins from "./vite/plugins";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV } = env;
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === "production" ? "/" : "/",
    plugins: createVitePlugins(env, command === "build"),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        "~": path.resolve(__dirname, "./"),
        // 设置别名
        "@": path.resolve(__dirname, "./src"),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    // 打包相关配置
    build: {
      // 生产环境打包配置
      minify: 'terser', // 确保使用 terser 压缩
      terserOptions: {
        compress: {
          drop_console: true, // 移除所有 console
          drop_debugger: true, // 移除 debugger
          pure_funcs: ['console.log'] // 只移除 console.log，保留 console.error 等
        }
      }
    },
    // vite 相关配置
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        "/dev-api": {
          // target: "http://localhost:8083",
          // target: "https://erp-api.zcylovezhx.com/api",
          target: "http://124.222.232.138:82/api",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, ""),
        },
      },
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
  };
});
