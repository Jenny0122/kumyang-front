# 1. Node.js 이미지를 기반으로 빌드 환경 설정
FROM node:16 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 설치
COPY package*.json ./
RUN npm install

# 4. Vite 프로젝트 빌드
COPY . .
RUN npm run build

# 5. Nginx를 사용하여 빌드된 파일을 서빙
FROM nginx:alpine

# 6. 빌드된 파일을 Nginx에 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 7. 80번 포트 개방
EXPOSE 80

# 8. Nginx 서버 실행
CMD ["nginx", "-g", "daemon off;"]
