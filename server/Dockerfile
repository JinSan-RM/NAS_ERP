# Multi-stage build for Node.js application
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json
COPY src/package*.json ./

# Install dependencies using npm install instead of npm ci
RUN npm install

# Copy source code
COPY src/ ./

# Development stage
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Copy package.json
COPY src/package*.json ./

# Install production dependencies using npm install
RUN npm install --omit=dev && npm cache clean --force

RUN npm install express cors helmet compression dotenv
RUN npm install --save-dev @types/express @types/cors @types/node typescript ts-node
# Copy built application
COPY src/ ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app
USER nodeuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the application
CMD ["npm", "start"]