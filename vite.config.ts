import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        cors: true,
        proxy: {
            //所有以 '/api'为前缀的接口都转向http://localhost:8000
            "/api": {
                target: "http://localhost:8090",
                changeOrigin: true,
                //去掉接口中的 '/api'以便和后端接口匹配
            }
        },
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
})
