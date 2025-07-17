# 클라이언트 Dockerfile (client/Dockerfile)
FROM node:18-alpine AS base

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 개발 환경
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 빌드 단계
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

# 프로덕션 환경 - Nginx로 정적 파일 서빙
FROM nginx:alpine AS production

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 앱 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 권한 설정
RUN chown -R nginx:nginx /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]