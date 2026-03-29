# build stage
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

RUN npm run build


# runtime stage
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy Prisma Client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy build files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/index.js"]