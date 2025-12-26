# ═══════════════════════════════════════════════════════════════════════════
# Dockerfile для Frontend (React + nginx) - MANUAL режим
# ═══════════════════════════════════════════════════════════════════════════
#
# Multi-stage build с улучшениями безопасности
# Использует nginx.conf (proxy_pass http://calc-backend:8080)
# ═══════════════════════════════════════════════════════════════════════════


# ┌─────────────────────────────────────────────────────────────────────────┐
# │ ЭТАП 1: СБОРКА REACT (builder)                                          │
# └─────────────────────────────────────────────────────────────────────────┘

FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей ОТДЕЛЬНО от кода (оптимизация кеша)
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY public ./public
COPY src ./src

# Собираем production-версию
RUN npm run build


# ┌─────────────────────────────────────────────────────────────────────────┐
# │ ЭТАП 2: NGINX (runtime)                                                 │
# └─────────────────────────────────────────────────────────────────────────┘

FROM nginx:alpine

# Удаляем дефолтную конфигурацию
RUN rm -rf /usr/share/nginx/html/*

# Копируем собранные файлы React из builder
COPY --from=builder /app/build /usr/share/nginx/html

# Копируем конфигурацию nginx для MANUAL режима
# Использует proxy_pass http://calc-backend:8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Устанавливаем правильные права
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
