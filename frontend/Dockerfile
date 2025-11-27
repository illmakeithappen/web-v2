# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and npm config
COPY package*.json .npmrc ./

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code (excluding node_modules to avoid conflicts)
COPY src ./src
COPY public ./public
COPY .storybook ./.storybook
COPY index.html vite.config.js ./

# Accept build-time environment variables for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application (Vite will embed VITE_API_URL at build time)
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install only production dependencies for server
COPY package*.json .npmrc ./
RUN npm ci --only=production

# Copy built application and server
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs

# Expose port (Render uses dynamic PORT environment variable)
EXPOSE $PORT

# Health check (use dynamic port)
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/ || exit 1

# Start production server with dynamic port for Render
CMD node server.js