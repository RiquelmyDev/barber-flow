# Stage 1: build
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Instalar dependências
COPY package*.json ./
RUN npm install

# 2. Copiar o código-fonte (incluindo prisma/)
COPY . .

# 3. Gerar o Prisma Client com o schema correto
RUN npx prisma generate

# 4. Build da aplicação NestJS
RUN npm run build

# Stage 2: imagem final de produção
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copia apenas o build e a pasta prisma gerada
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Comando de start
CMD ["node", "dist/main"]

