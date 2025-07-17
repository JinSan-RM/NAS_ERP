# 물품 수령 관리 시스템 Dockerfile
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apk add --no-cache \
    python3 \
    make \
    g++

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 애플리케이션 시작
CMD ["npm", "start"]