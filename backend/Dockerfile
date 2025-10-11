# Backend Dockerfile for production
FROM oven/bun:1.1.38-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "index.ts"]
