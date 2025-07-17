# 서버 Dockerfile (server/Dockerfile)
FROM node:18-alpine AS base

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# package.json과 package-lock.json 복사
COPY package*.json ./

# 개발 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 개발 환경
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3001
CMD ["npm", "run", "dev"]

# 프로덕션 환경
FROM node:18-alpine AS production

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 설치 (런타임에 필요한 것만)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# package.json 복사
COPY package*.json ./

# 프로덕션 의존성만 설치
RUN npm ci --only=production && npm cache clean --force

# 빌드된 파일 복사
COPY --from=base /app/dist ./dist

# 필요한 디렉토리 생성
RUN mkdir -p uploads data logs

# 권한 설정
RUN chown -R node:node /app
USER node

# 환경변수 설정
ENV NODE_ENV=production
ENV PORT=3001

# 포트 노출
EXPOSE 3001

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# 애플리케이션 시작
CMD ["node", "dist/app.js"]