FROM node:20-alpine AS build

WORKDIR /app

# 소스 코드 복사 및 빌드
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 Nginx의 서비스 디렉토리로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 로그 디렉토리 생성
RUN mkdir -p /var/log/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]