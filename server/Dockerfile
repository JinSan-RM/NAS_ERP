# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci

# TypeScript 및 필요한 dev 의존성 설치
RUN npm install typescript @types/node @types/express

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --only=production

# 빌드된 파일 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# 필요한 디렉토리 생성
RUN mkdir -p /app/client/dist /app/uploads /app/logs \
    && chown -R node:node /app

# 보안을 위해 non-root 유저로 전환
USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["npm", "start"]