# ═══════════════════════════════════════════════════════════════════════════
# Dockerfile для Frontend (React + nginx)
# ═══════════════════════════════════════════════════════════════════════════
#
# Это multi-stage build для React-приложения:
# - Этап 1 (builder): компилируем React в статические файлы
# - Этап 2 (runtime): отдаём файлы через nginx
#
# Почему nginx, а не Node.js?
# - React после сборки — это просто HTML/CSS/JS файлы
# - Не нужен Node.js в продакшене
# - nginx быстрее и легче для раздачи статики
# - nginx может проксировать API-запросы в backend
# ═══════════════════════════════════════════════════════════════════════════


# ┌─────────────────────────────────────────────────────────────────────────┐
# │ ЭТАП 1: СБОРКА REACT (builder)                                          │
# └─────────────────────────────────────────────────────────────────────────┘

# node:20-alpine — Node.js 20 на минимальном Alpine Linux
# Alpine делает образ меньше (~150MB вместо ~1GB)
FROM node:20-alpine AS builder

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей ОТДЕЛЬНО от кода
# Это оптимизация для кеширования:
# - Если package.json не изменился, npm install возьмётся из кеша
# - Даже если изменился код приложения
COPY package*.json ./

# Устанавливаем зависимости
# npm install читает package.json и скачивает пакеты в node_modules
RUN npm install

# Копируем публичные файлы (index.html и т.д.)
COPY public ./public

# Копируем исходный код React
COPY src ./src

# Собираем production-версию React-приложения
# npm run build:
# 1. Компилирует JSX в JavaScript
# 2. Минифицирует код (удаляет пробелы, сокращает имена)
# 3. Создаёт оптимизированные бандлы
# 4. Результат в папке /app/build
RUN npm run build


# ┌─────────────────────────────────────────────────────────────────────────┐
# │ ЭТАП 2: NGINX (runtime)                                                 │
# └─────────────────────────────────────────────────────────────────────────┘

# nginx:alpine — веб-сервер nginx на Alpine Linux (~25MB)
FROM nginx:alpine

# Создаем pid файл и даем права пользователю nginx
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Копируем собранные файлы React из этапа builder
# /app/build (из builder) → /usr/share/nginx/html (в nginx)
# Это стандартная директория для статических файлов в nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Меняем владельца файлов на nginx
RUN chown -R nginx:nginx /usr/share/nginx/html

# Копируем конфигурацию nginx
# nginx.conf содержит настройки проксирования /api в backend
# /etc/nginx/conf.d/default.conf — путь к конфигу сайта по умолчанию
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Документируем порт 8080 (стандартный HTTP-порт nginx)
EXPOSE 8080

# Переключаемся на пользователя nginx
USER nginx

# Запускаем nginx
# daemon off — запустить на переднем плане (не демонизировать)
# Это важно для Docker: контейнер должен иметь foreground-процесс
# Если процесс уйдёт в background, Docker решит что контейнер завершился
CMD ["nginx", "-g", "daemon off;"]
