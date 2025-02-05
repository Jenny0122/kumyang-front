import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import strip from '@rollup/plugin-strip';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      vueDevTools(),
      // 운영 모드일 때만 strip 플러그인 적용
      mode === 'production' && strip({
        include: ['**/*.js', '**/*.vue'], // js와 vue 파일에서만 제거
        functions: ['console.log', 'console.debug'], // 제거할 함수 목록
      }),
    ],
    build: {
      // outDir: path.resolve(__dirname, '../kumYang/src/main/resources/static'), // Spring Boot의 /static 폴더 경로
      outDir: '../kumYang/src/main/resources/static', // Spring Boot의 /static 폴더 경로
      emptyOutDir: true, // 빌드 시 static 폴더 비우기
      assetsDir: 'assets',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    base: '/', // 변경: Vue Router와 호환되도록 절대 경로 사용
    server: {
      historyApiFallback: true, // 추가: 개발 서버에서 히스토리 모드 지원
      proxy: {
        '/api': {
          target: 'http://localhost:8080', // Spring Boot API 서버
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});




// export default defineConfig({
//   plugins: [
//     vue(),
//     vueDevTools(),
//     strip({
//       include: ['**/*.js', '**/*.vue'], // js와 vue 파일에서만 제거
//       functions: ['console.log', 'console.debug'], // 제거할 함수 목록
//     }),
//   ],
//   build: {
//     // outDir: path.resolve(__dirname, '../kumYang/src/main/resources/static'), // Spring Boot의 /static 폴더 경로
//     outDir: '../kumYang/src/main/resources/static', // Spring Boot의 /static 폴더 경로
//     emptyOutDir: true, // 빌드 시 static 폴더 비우기
//     assetsDir: 'assets',
//   },
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//   },
//   base: './'
// })