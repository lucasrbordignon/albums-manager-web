# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json e package-lock.json
COPY package.json package-lock.json ./

# Instala todas as dependências (incluindo dev)
RUN npm ci

# Copia todo o código
COPY . .

# Build do React + TS + Vite
RUN npm run build

# Stage 2: Nginx para servir frontend
FROM nginx:1.25-alpine

# Copia build final para Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração do Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
