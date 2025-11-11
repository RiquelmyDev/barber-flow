FROM node:18-alpine AS builder

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source code including prisma/
COPY . .

# 3. Generate Prisma Client
RUN npx prisma generate

# 4. Build NestJS app
RUN npm run build

# 5. Prepare production image
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

CMD ["node", "dist/main"]
