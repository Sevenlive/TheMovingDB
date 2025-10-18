# Frontend Dockerfile for production
FROM oven/bun:1.1.38-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_BASE_URL=http://localhost:3000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the app
RUN bun run build

# Production stage - serve with Bun
FROM oven/bun:1.1.38-alpine

WORKDIR /app

# Copy built assets and server from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

# Expose port
EXPOSE 80

# Start Bun server
CMD ["bun", "server.ts"]
