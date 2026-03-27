# build stage
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
COPY .env .env
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# ===== RUNTIME STAGE =====
FROM node:22

WORKDIR /app

# Chỉ install production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy Prisma client (QUAN TRỌNG)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy build + prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env .env

CMD ["node", "dist/index.js"]
