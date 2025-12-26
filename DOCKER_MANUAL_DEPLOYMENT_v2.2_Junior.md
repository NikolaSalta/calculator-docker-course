# 🐳 Docker Calculator — Полное руководство по развёртыванию

> **Версия:** 2.2 Junior  
> **Дата:** 26 декабря 2025  
> **Порты:** Frontend: 3001, Backend: 8080

---

## 📋 Оглавление

1. [Требования к системе](#1-требования-к-системе)
2. [Используемые порты](#2-используемые-порты)
3. [🚀 Быстрый запуск из готовых образов](#3-быстрый-запуск-из-готовых-образов)
4. [Запуск с локальной сборкой (Docker Compose)](#4-запуск-с-локальной-сборкой-docker-compose)
5. [Пошаговый ручной запуск](#5-пошаговый-ручной-запуск)
6. [🎬 Визуальный запуск полного приложения](#6-визуальный-запуск-полного-приложения)
7. [Проверка работоспособности](#7-проверка-работоспособности)
8. [Остановка и очистка](#8-остановка-и-очистка)
9. [Решение проблем](#9-решение-проблем)
10. [Архитектура](#10-архитектура)
11. [Публикация своих образов](#11-публикация-своих-образов)

---

## 1. Требования к системе

### Необходимое ПО

| Программа | Минимальная версия | Команда проверки |
|-----------|-------------------|------------------|
| Docker Desktop | 4.0+ | `docker --version` |
| Docker Compose | v2.0+ | `docker compose version` |
| Git | 2.0+ | `git --version` |

### Проверка Docker

```bash
docker --version
```

**Ожидаемый вывод:**
```
Docker version 27.4.0, build bde2b89
```

```bash
docker compose version
```

**Ожидаемый вывод:**
```
Docker Compose version v2.31.0-desktop.2
```

---

## 2. Используемые порты

### Схема портов

```
┌─────────────────────────────────────────────────────────────────┐
│                         Ваш компьютер                          │
│                                                                 │
│  Браузер ────────────────────────────────────────┐              │
│                                                   │              │
│                                                   ▼              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Docker Engine                         │   │
│  │                                                          │   │
│  │  ┌─────────────────┐         ┌─────────────────┐        │   │
│  │  │    frontend     │  ─────▶ │     backend     │        │   │
│  │  │   nginx:80      │  proxy  │  tomcat:8080    │        │   │
│  │  │                 │  /api/* │                 │        │   │
│  │  └────────┬────────┘         └────────┬────────┘        │   │
│  │           │                           │                  │   │
│  │      localhost:3001              localhost:8080          │   │
│  │           ▲                           ▲                  │   │
│  └───────────│───────────────────────────│──────────────────┘   │
│              │                           │                       │
│      ┌───────┴───────────────────────────┴───────┐              │
│      │     Проброс портов Docker                 │              │
│      │     3001:80 (frontend → nginx)            │              │
│      │     8080:8080 (backend → tomcat)          │              │
│      └───────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Таблица портов

| Сервис | Порт хоста | Порт контейнера | Протокол | Описание |
|--------|------------|-----------------|----------|----------|
| Frontend | **3001** | 80 | HTTP | React + nginx (UI калькулятора) |
| Backend | **8080** | 8080 | HTTP | Spring Boot (REST API) |

### Почему порт 3001, а не 3000?

Порт 3000 часто используется другими приложениями:
- Grafana (мониторинг)
- React Development Server
- Другие веб-приложения

Чтобы избежать конфликтов, используется порт **3001**.

### Проверка доступности портов

```bash
# macOS/Linux
lsof -i :3001
lsof -i :8080

# Если порты свободны — вывод будет пустым
# Если заняты — увидите процесс, использующий порт
```

**Если порт занят:**
```bash
# Найти и завершить процесс на порту 3001
lsof -i :3001
kill -9 <PID>
```

---

## 3. 🚀 Быстрый запуск из готовых образов

> **Самый быстрый способ!** Не требует сборки — образы скачиваются из Docker Hub.

### 📦 Готовые образы на Docker Hub

#### 🍎 Apple Silicon (ARM64) — Mac M1/M2/M3

| Компонент | Команда скачивания | Ссылка на Docker Hub |
|-----------|-------------------|---------------------|
| **Backend** | `docker pull nikolaysaltan/calculator-docker-backend:arm64` | [🔗 Backend ARM64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-backend/tags?name=arm64) |
| **Frontend** | `docker pull nikolaysaltan/calculator-docker-frontend:arm64` | [🔗 Frontend ARM64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-frontend/tags?name=arm64) |
| **Tests** | `docker pull nikolaysaltan/calculator-docker-tests:arm64` | [🔗 Tests ARM64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-tests/tags?name=arm64) |

#### 💻 x86_64 (AMD64) — Windows, Linux, Intel Mac

| Компонент | Команда скачивания | Ссылка на Docker Hub |
|-----------|-------------------|---------------------|
| **Backend** | `docker pull nikolaysaltan/calculator-docker-backend:amd64` | [🔗 Backend AMD64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-backend/tags?name=amd64) |
| **Frontend** | `docker pull nikolaysaltan/calculator-docker-frontend:amd64` | [🔗 Frontend AMD64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-frontend/tags?name=amd64) |
| **Tests** | `docker pull nikolaysaltan/calculator-docker-tests:amd64` | [🔗 Tests AMD64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-tests/tags?name=amd64) |

#### 📋 Общие ссылки на репозитории

- **Backend**: https://hub.docker.com/r/nikolaysaltan/calculator-docker-backend
- **Frontend**: https://hub.docker.com/r/nikolaysaltan/calculator-docker-frontend
- **Tests**: https://hub.docker.com/r/nikolaysaltan/calculator-docker-tests

> 📦 **Multi-Platform:** Образы работают на Windows, Linux, Intel Mac и Apple Silicon (M1/M2/M3)!

**Образ тестов содержит:**
- Chromium браузер (встроен!)
- ChromeDriver
- Python 3.12 + pytest + selenium

### Шаг 3.1: Скачать docker-compose файл

Если вы ещё не клонировали репозиторий:

```bash
git clone https://github.com/YOUR_USERNAME/calculator-docker-course.git
cd calculator-docker-course/ykg
```

### Шаг 3.2: Запустить из готовых образов

Образы уже опубликованы на Docker Hub под username `nikolaysaltan`:

```bash
# Образы доступны по умолчанию, не нужно ничего настраивать!
docker compose -f docker-compose.prebuilt.yml up -d
```

Или с явным указанием username:

```bash
export DOCKER_USERNAME=nikolaysaltan
```

### Шаг 3.3: Запустить из готовых образов

```bash
docker compose -f docker-compose.prebuilt.yml up -d
```

**Что происходит:**
1. Docker скачивает готовые образы из Docker Hub
2. Создаёт сеть и контейнеры
3. Запускает backend, ждёт пока он станет healthy
4. Запускает frontend

**Ожидаемый вывод:**
```
[+] Running 3/3
 ✔ Network ykg_default  Created
 ✔ Container calc-backend   Started
 ✔ Container calc-frontend  Started
```

### Шаг 3.4: Открыть в браузере

```
http://localhost:3001
```

### Преимущества готовых образов

| Способ | Время запуска | Требования |
|--------|---------------|------------|
| **Готовые образы** | ~30 секунд | Только Docker |
| Локальная сборка | 2-5 минут | Docker + Node.js + Maven (в контейнерах) |

---

## 4. Запуск с локальной сборкой (Docker Compose)

### Шаг 3.1: Перейти в папку проекта

```bash
cd /путь/к/проекту
```

### Шаг 3.2: Запустить приложение

```bash
docker compose up --build -d
```

**Разбор команды:**

| Флаг | Описание |
|------|----------|
| `up` | Создать и запустить контейнеры |
| `--build` | Пересобрать образы перед запуском |
| `-d` | Запустить в фоновом режиме (detached) |

**Ожидаемый вывод:**
```
[+] Building 45.2s (24/24) FINISHED
 => [backend builder 1/6] FROM docker.io/library/maven:3.9-eclipse-temurin-17
 => [frontend builder 1/7] FROM docker.io/library/node:20-alpine
 ...
 => exporting to image
 => => naming to docker.io/library/ykg-backend:latest
 => => naming to docker.io/library/ykg-frontend:latest
 
 Network ykg_default  Created
 Container calc-backend  Created
 Container calc-frontend  Created
 Container calc-backend  Started
 Container calc-backend  Healthy
 Container calc-frontend  Started
```

**Важно:** Обратите внимание на `Healthy` — это означает, что backend прошёл health check и готов принимать запросы.

### Шаг 3.3: Проверить статус

```bash
docker compose ps
```

**Ожидаемый вывод:**
```
NAME            IMAGE          COMMAND                  SERVICE    CREATED          STATUS                    PORTS
calc-backend    ykg-backend    "java -XX:+UseConta…"   backend    30 seconds ago   Up 29 seconds (healthy)   0.0.0.0:8080->8080/tcp
calc-frontend   ykg-frontend   "/docker-entrypoint…"   frontend   25 seconds ago   Up 24 seconds             0.0.0.0:3001->80/tcp
```

### Шаг 3.4: Открыть в браузере

```
http://localhost:3001
```

---

## 5. Пошаговый ручной запуск

Если вы хотите понять, как работает Docker Compose "под капотом", выполните эти шаги вручную.

### Шаг 4.1: Сборка Backend образа

```bash
docker build -t calc-backend-image ./backend
```

**Ожидаемый вывод (сокращённо):**
```
[+] Building 45.2s (12/12) FINISHED
 => [internal] load build definition from Dockerfile
 => [builder 1/6] FROM docker.io/library/maven:3.9-eclipse-temurin-17
 => [builder 2/6] WORKDIR /app
 => [builder 3/6] COPY pom.xml .
 => [builder 4/6] RUN mvn dependency:go-offline -B
 => [builder 5/6] COPY src ./src
 => [builder 6/6] RUN mvn clean package -DskipTests -B
 => [stage-1 2/5] RUN groupadd --gid 1001 appgroup && useradd ...
 => [stage-1 4/5] COPY --from=builder /app/target/*.jar app.jar
 => exporting to image
 => => naming to docker.io/library/calc-backend-image:latest
```

### Шаг 4.2: Сборка Frontend образа

```bash
docker build -t calc-frontend-image -f frontend/Dockerfile.compose ./frontend
```

**Ожидаемый вывод (сокращённо):**
```
[+] Building 89.5s (15/15) FINISHED
 => [builder 1/7] FROM docker.io/library/node:20-alpine
 => [builder 4/7] RUN npm install
 => [builder 7/7] RUN npm run build
 => [stage-1 3/5] COPY --from=builder /app/build /usr/share/nginx/html
 => [stage-1 4/5] COPY nginx.compose.conf /etc/nginx/conf.d/default.conf
 => exporting to image
 => => naming to docker.io/library/calc-frontend-image:latest
```

### Шаг 4.3: Создание Docker сети

```bash
docker network create calc-network
```

**Ожидаемый вывод:**
```
a1b2c3d4e5f6g7h8i9j0...
```

### Шаг 4.4: Запуск Backend контейнера

```bash
docker run -d \
  --name backend \
  --network calc-network \
  -p 8080:8080 \
  calc-backend-image
```

**Разбор параметров:**

| Параметр | Описание |
|----------|----------|
| `-d` | Фоновый режим (detached) |
| `--name backend` | Имя контейнера для DNS в сети |
| `--network calc-network` | Подключить к созданной сети |
| `-p 8080:8080` | Проброс порта: хост:контейнер |

**Ожидаемый вывод:**
```
76c96f0719cf...
```

### Шаг 4.5: Проверка Backend

```bash
# Подождите 5-10 секунд для запуска Spring Boot
curl http://localhost:8080/api/health
```

**Ожидаемый вывод:**
```json
{"status":"OK","service":"calc-backend"}
```

### Шаг 4.6: Запуск Frontend контейнера

```bash
docker run -d \
  --name frontend \
  --network calc-network \
  -p 3001:80 \
  calc-frontend-image
```

**Ожидаемый вывод:**
```
8be86c66cade...
```

### Шаг 4.7: Проверка обоих контейнеров

```bash
docker ps
```

**Ожидаемый вывод:**
```
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS          PORTS                    NAMES
8be86c66cade   calc-frontend-image   "/docker-entrypoint…"   5 seconds ago    Up 4 seconds    0.0.0.0:3001->80/tcp     frontend
76c96f0719cf   calc-backend-image    "java -XX:+UseConta…"   30 seconds ago   Up 29 seconds   0.0.0.0:8080->8080/tcp   backend
```

---

## 6. 🎬 Визуальный запуск полного приложения

> **Цель:** Запустить Frontend и Backend в одной Docker-сети и открыть калькулятор в браузере.

### Визуализация: Что мы создадим

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DOCKER ENGINE                                   │
│                                                                              │
│   ┌────────────────────── calc-network ──────────────────────┐              │
│   │                    (Docker Bridge Network)                │              │
│   │                                                           │              │
│   │   ┌───────────────────┐         ┌───────────────────┐    │              │
│   │   │                   │   DNS   │                   │    │              │
│   │   │  calc-frontend    │◄───────►│   calc-backend    │    │              │
│   │   │                   │ backend │                   │    │              │
│   │   │  ┌─────────────┐  │         │  ┌─────────────┐  │    │              │
│   │   │  │   nginx     │  │  HTTP   │  │ Spring Boot │  │    │              │
│   │   │  │   :80       │──┼────────►│  │    :8080    │  │    │              │
│   │   │  └─────────────┘  │ /api/*  │  └─────────────┘  │    │              │
│   │   │  ┌─────────────┐  │         │  ┌─────────────┐  │    │              │
│   │   │  │ React SPA   │  │         │  │CalcController│  │    │              │
│   │   │  │ (static)    │  │         │  │  /api/calc  │  │    │              │
│   │   │  └─────────────┘  │         │  │  /api/health│  │    │              │
│   │   │                   │         │  └─────────────┘  │    │              │
│   │   └─────────┬─────────┘         └─────────┬─────────┘    │              │
│   │             │                             │               │              │
│   └─────────────│─────────────────────────────│───────────────┘              │
│                 │                             │                              │
│            Port 3001                     Port 8080                           │
│                 │                             │                              │
└─────────────────│─────────────────────────────│──────────────────────────────┘
                  │                             │
                  ▼                             ▼
            ┌─────────┐                   ┌─────────┐
            │ :3001   │                   │ :8080   │
            │ Browser │                   │  curl   │
            └─────────┘                   └─────────┘
```

---

### 🔄 Шаг 6.1: Очистка (если запускали раньше)

```bash
# Остановить и удалить старые контейнеры, если есть
docker stop calc-frontend calc-backend 2>/dev/null
docker rm calc-frontend calc-backend 2>/dev/null
docker network rm calc-network 2>/dev/null
```

**Что делает:**
- `docker stop` — корректно останавливает контейнеры (SIGTERM)
- `docker rm` — удаляет контейнеры (освобождает имена)
- `docker network rm` — удаляет сеть
- `2>/dev/null` — скрывает ошибки, если контейнеры не существуют

---

### 🌐 Шаг 6.2: Создание Docker-сети

```bash
docker network create calc-network
```

**Визуализация того, что создаётся:**

```
                    ┌─────────────────────────────────┐
                    │        calc-network             │
                    │   (bridge driver, 172.18.0.0/16)│
                    │                                 │
                    │   DNS: контейнеры видят друг    │
                    │   друга по имени!               │
                    │                                 │
                    │   calc-frontend ◄──► calc-backend│
                    │                                 │
                    └─────────────────────────────────┘
```

**Почему это важно:**
- Контейнеры в одной сети могут обращаться друг к другу **по имени**
- nginx может использовать `proxy_pass http://calc-backend:8080`
- Изоляция от других контейнеров

**Ожидаемый вывод:**
```
7f8a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7
```

---

### ⚙️ Шаг 6.3: Запуск Backend-контейнера

```bash
docker run -d \
  --name calc-backend \
  --network calc-network \
  -p 8080:8080 \
  -e JAVA_OPTS="-Xmx384m -Xms128m" \
  calc-backend-image
```

**Визуализация состояния после команды:**

```
┌─────────────────────── calc-network ───────────────────────┐
│                                                             │
│   ┌───────────────────────────────────────┐                │
│   │         calc-backend                   │                │
│   │         IP: 172.18.0.2                 │                │
│   │                                        │                │
│   │   ┌──────────────────────────────┐    │                │
│   │   │      Spring Boot :8080       │    │                │
│   │   │                              │    │                │
│   │   │  GET  /api/health  → OK      │    │                │
│   │   │  POST /api/calc    → result  │    │                │
│   │   └──────────────────────────────┘    │                │
│   │                                        │                │
│   └────────────────┬───────────────────────┘                │
│                    │                                        │
└────────────────────│────────────────────────────────────────┘
                     │
                Port 8080 (проброшен на localhost)
                     │
                     ▼
              http://localhost:8080
```

**Разбор параметров:**

| Параметр | Описание | Зачем нужен |
|----------|----------|-------------|
| `-d` | Detached mode | Запуск в фоне, терминал свободен |
| `--name calc-backend` | Имя контейнера | DNS-имя в сети Docker |
| `--network calc-network` | Подключить к сети | Контейнеры видят друг друга |
| `-p 8080:8080` | Проброс порта | Доступ с localhost |
| `-e JAVA_OPTS=...` | Переменная окружения | Ограничение памяти JVM |

**Ожидаемый вывод:**
```
a1b2c3d4e5f6789012345678901234567890123456789012345678901234
```

---

### ⏳ Шаг 6.4: Ожидание готовности Backend

```bash
echo "⏳ Ожидание запуска Spring Boot (10-15 секунд)..."
for i in {1..30}; do
  if curl -s http://localhost:8080/api/health | grep -q "OK"; then
    echo "✅ Backend готов!"
    break
  fi
  echo "   Попытка $i/30..."
  sleep 1
done
```

**Визуализация процесса:**

```
Время ──────────────────────────────────────────────────────────►

  0s        5s        10s       15s
  │         │         │         │
  ▼         ▼         ▼         ▼
  
  JVM       Spring    Tomcat    ✅ Ready!
  Start     Init      Listen    
  
  [===      [======   [=========[====================]
  
  ❌ 404    ❌ 404    ❌ 404    ✅ {"status":"OK"}
```

**Ожидаемый вывод:**
```
⏳ Ожидание запуска Spring Boot (10-15 секунд)...
   Попытка 1/30...
   Попытка 2/30...
   ...
   Попытка 12/30...
✅ Backend готов!
```

---

### 🎨 Шаг 6.5: Запуск Frontend-контейнера

```bash
docker run -d \
  --name calc-frontend \
  --network calc-network \
  -p 3001:80 \
  calc-frontend-image
```

**Визуализация полной архитектуры после команды:**

```
┌─────────────────────── calc-network ───────────────────────┐
│                                                             │
│   ┌─────────────────────┐     ┌─────────────────────┐      │
│   │    calc-frontend    │     │    calc-backend     │      │
│   │    IP: 172.18.0.3   │     │    IP: 172.18.0.2   │      │
│   │                     │     │                     │      │
│   │  ┌───────────────┐  │     │  ┌───────────────┐  │      │
│   │  │  nginx :80    │  │     │  │ Tomcat :8080  │  │      │
│   │  │               │  │HTTP │  │               │  │      │
│   │  │ /api/* ───────┼──┼────►│  │ /api/calc     │  │      │
│   │  │               │  │     │  │ /api/health   │  │      │
│   │  └───────────────┘  │     │  └───────────────┘  │      │
│   │  ┌───────────────┐  │     │                     │      │
│   │  │  React SPA    │  │     │                     │      │
│   │  │  index.html   │  │     │                     │      │
│   │  │  App.js       │  │     │                     │      │
│   │  └───────────────┘  │     │                     │      │
│   │                     │     │                     │      │
│   └──────────┬──────────┘     └──────────┬──────────┘      │
│              │                           │                  │
└──────────────│───────────────────────────│──────────────────┘
               │                           │
          Port 3001                   Port 8080
               │                           │
               ▼                           ▼
        http://localhost:3001       http://localhost:8080
               │
               ▼
        ┌─────────────┐
        │   БРАУЗЕР   │
        │             │
        │ ┌─────────┐ │
        │ │Калькуля-│ │
        │ │   тор   │ │
        │ │  10+5   │ │
        │ │  = 15   │ │
        │ └─────────┘ │
        └─────────────┘
```

**Ожидаемый вывод:**
```
b2c3d4e5f6789012345678901234567890123456789012345678901234ab
```

---

### 🔍 Шаг 6.6: Проверка статуса контейнеров

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**Ожидаемый вывод:**

```
NAMES           STATUS          PORTS
calc-frontend   Up 5 seconds    0.0.0.0:3001->80/tcp
calc-backend    Up 20 seconds   0.0.0.0:8080->8080/tcp
```

**Визуализация статусов:**

```
┌──────────────────────────────────────────────────────────┐
│                    Docker Containers                      │
├───────────────┬──────────────┬───────────────────────────┤
│     Name      │    Status    │          Ports            │
├───────────────┼──────────────┼───────────────────────────┤
│ calc-frontend │   ✅ Up      │  localhost:3001 → :80     │
│ calc-backend  │   ✅ Up      │  localhost:8080 → :8080   │
└───────────────┴──────────────┴───────────────────────────┘
```

---

### 🌐 Шаг 6.7: Проверка сетевого подключения

```bash
# Проверить, что контейнеры видят друг друга
docker exec calc-frontend ping -c 2 calc-backend
```

**Ожидаемый вывод:**

```
PING calc-backend (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.089 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.095 ms
```

**Визуализация сетевого взаимодействия:**

```
                      calc-network (172.18.0.0/16)
                      
    calc-frontend                      calc-backend
    (172.18.0.3)                       (172.18.0.2)
         │                                  │
         │         ICMP Echo Request        │
         │ ─────────────────────────────────►
         │                                  │
         │         ICMP Echo Reply          │
         │ ◄─────────────────────────────────
         │                                  │
         │          time=0.089ms            │
         │                                  │
```

---

### 🧮 Шаг 6.8: Тестирование API через Frontend

```bash
# Запрос через Frontend (nginx проксирует в backend)
curl -s -X POST http://localhost:3001/api/calc \
  -H "Content-Type: application/json" \
  -d '{"a": 42, "b": 8, "op": "+"}' | cat
```

**Визуализация пути запроса:**

```
    curl                nginx               Spring Boot
      │                   │                     │
      │   POST /api/calc  │                     │
      │ ─────────────────►│                     │
      │                   │                     │
      │                   │  proxy_pass         │
      │                   │  /api/calc          │
      │                   │ ───────────────────►│
      │                   │                     │
      │                   │                     │ calculate()
      │                   │                     │ 42 + 8 = 50
      │                   │                     │
      │                   │  {"result": 50}     │
      │                   │ ◄───────────────────│
      │                   │                     │
      │  {"result": 50}   │                     │
      │ ◄─────────────────│                     │
      │                   │                     │
```

**Ожидаемый вывод:**

```json
{"result":50.0,"operation":"42.0 + 8.0"}
```

---

### 🌍 Шаг 6.9: Открыть в браузере

```bash
# macOS
open http://localhost:3001

# Linux
xdg-open http://localhost:3001

# Windows (PowerShell)
Start-Process http://localhost:3001

# Или просто откройте в любом браузере:
# http://localhost:3001
```

**Что вы увидите:**

```
┌─────────────────────────────────────────────────────────────┐
│  ← → ↻  🔒 localhost:3001                              ─ □ ✕ │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│           ┌────────────────────────────────────┐            │
│           │                                    │            │
│           │      🐳 Калькулятор  Docker        │            │
│           │                                    │            │
│           │  ┌────────┐      ┌────────┐       │            │
│           │  │   10   │  +   │   5    │       │            │
│           │  └────────┘      └────────┘       │            │
│           │                                    │            │
│           │       ┌─────────────────┐         │            │
│           │       │   Вычислить     │         │            │
│           │       └─────────────────┘         │            │
│           │                                    │            │
│           │      ┌──────────────────┐         │            │
│           │      │  Результат: 15   │         │            │
│           │      └──────────────────┘         │            │
│           │                                    │            │
│           └────────────────────────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 📊 Шаг 6.10: Просмотр логов в реальном времени

```bash
# Логи backend (в отдельном терминале)
docker logs -f calc-backend
```

**При выполнении вычислений в браузере увидите:**

```
18:30:15.463 [http-nio-8080-exec-1] DEBUG CalcController - Получен запрос: {a=10, b=5, op=+}
18:30:15.466 [http-nio-8080-exec-1] INFO  CalcController - Вычисление: 10.0 + 5.0
18:30:15.467 [http-nio-8080-exec-1] INFO  CalcController - Результат: 10.0 + 5.0 = 15.0
```

**Визуализация потока логов:**

```
Время                Событие                         Уровень
──────────────────────────────────────────────────────────────
18:30:15.463         Получен запрос                  DEBUG
                     ├─ a = 10
                     ├─ b = 5
                     └─ op = +

18:30:15.466         Вычисление: 10.0 + 5.0          INFO

18:30:15.467         Результат = 15.0               INFO
──────────────────────────────────────────────────────────────
```

---

### ✅ Шаг 6.11: Итоговая проверка

Выполните все проверки одной командой:

```bash
echo "
═══════════════════════════════════════════════════════════════
       🐳 Docker Calculator — Проверка развёртывания
═══════════════════════════════════════════════════════════════
"

echo "1️⃣  Статус контейнеров:"
docker ps --format "   {{.Names}}: {{.Status}}" | grep calc

echo ""
echo "2️⃣  Health Check Backend:"
echo -n "   "
curl -s http://localhost:8080/api/health

echo ""
echo ""
echo "3️⃣  Тест сложения (10 + 5):"
echo -n "   "
curl -s -X POST http://localhost:3001/api/calc \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 5, "op": "+"}'

echo ""
echo ""
echo "4️⃣  Тест умножения (7 × 8):"
echo -n "   "
curl -s -X POST http://localhost:3001/api/calc \
  -H "Content-Type: application/json" \
  -d '{"a": 7, "b": 8, "op": "*"}'

echo ""
echo ""
echo "5️⃣  Тест деления на ноль:"
echo -n "   "
curl -s -X POST http://localhost:3001/api/calc \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 0, "op": "/"}'

echo ""
echo ""
echo "═══════════════════════════════════════════════════════════════
       ✅ Все проверки выполнены!
       🌐 Откройте в браузере: http://localhost:3001
═══════════════════════════════════════════════════════════════
"
```

**Ожидаемый вывод:**

```
═══════════════════════════════════════════════════════════════
       🐳 Docker Calculator — Проверка развёртывания
═══════════════════════════════════════════════════════════════

1️⃣  Статус контейнеров:
   calc-frontend: Up 2 minutes
   calc-backend: Up 3 minutes

2️⃣  Health Check Backend:
   {"service":"calc-backend","status":"OK"}

3️⃣  Тест сложения (10 + 5):
   {"result":15.0,"operation":"10.0 + 5.0"}

4️⃣  Тест умножения (7 × 8):
   {"result":56.0,"operation":"7.0 * 8.0"}

5️⃣  Тест деления на ноль:
   {"error":"Bad Request","message":"Division by zero"}

═══════════════════════════════════════════════════════════════
       ✅ Все проверки выполнены!
       🌐 Откройте в браузере: http://localhost:3001
═══════════════════════════════════════════════════════════════
```

---

### 🗂️ Полная последовательность команд (копировать и запускать)

```bash
#!/bin/bash
# Полный запуск Docker Calculator в одной сети

# 1. Очистка
docker stop calc-frontend calc-backend 2>/dev/null
docker rm calc-frontend calc-backend 2>/dev/null
docker network rm calc-network 2>/dev/null

# 2. Создание сети
docker network create calc-network

# 3. Запуск Backend
docker run -d \
  --name calc-backend \
  --network calc-network \
  -p 8080:8080 \
  calc-backend-image

# 4. Ожидание готовности
echo "⏳ Ожидание Backend..."
sleep 15

# 5. Запуск Frontend
docker run -d \
  --name calc-frontend \
  --network calc-network \
  -p 3001:80 \
  calc-frontend-image

# 6. Проверка
echo "✅ Готово! Открывайте http://localhost:3001"
docker ps --filter "name=calc" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 7. Проверка работоспособности

### 7.1: Проверка Health Endpoint

```bash
curl http://localhost:8080/api/health
```

**Ожидаемый вывод:**
```json
{"status":"OK","service":"calc-backend"}
```

### 7.2: Тест вычислений через Backend напрямую

```bash
curl -X POST http://localhost:8080/api/calc \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 5, "op": "+"}'
```

**Ожидаемый вывод:**
```json
{"operation":"10.0 + 5.0","result":15.0}
```

### 7.3: Тест вычислений через Frontend (nginx proxy)

```bash
curl -X POST http://localhost:3001/api/calc \
  -H "Content-Type: application/json" \
  -d '{"a": 100, "b": 4, "op": "/"}'
```

**Ожидаемый вывод:**
```json
{"operation":"100.0 / 4.0","result":25.0}
```

### 7.4: Тест обработки ошибок (деление на ноль)

```bash
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -X POST http://localhost:3001/api/calc \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 0, "op": "/"}'
```

**Ожидаемый вывод:**
```json
{"error":"Bad Request","message":"Division by zero"}
HTTP Status: 400
```

### 7.5: Проверка Security Headers

```bash
curl -I http://localhost:3001 2>/dev/null | grep -E "(X-Frame|X-Content|X-XSS|Server)"
```

**Ожидаемый вывод:**
```
Server: nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### 7.6: Проверка в браузере

1. Откройте браузер
2. Перейдите по адресу: `http://localhost:3001`
3. Введите числа: `10` и `5`
4. Выберите операцию: `+`
5. Нажмите "Вычислить"
6. Результат: `15`

### 7.7: Тест обработки ошибок в UI

1. Введите `10` в первое поле
2. Введите `0` во второе поле
3. Выберите `÷` (деление)
4. Нажмите "Вычислить"
5. Результат: `Ошибка: деление на ноль`

---

## 8. Остановка и очистка

### 8.1: Остановка Docker Compose

```bash
docker compose down
```

**Ожидаемый вывод:**
```
[+] Running 3/3
 ✔ Container calc-frontend                   Removed
 ✔ Container calc-backend                    Removed
 ✔ Network ykg_default                       Removed
```

### 8.2: Остановка ручных контейнеров

```bash
docker stop frontend backend
docker rm frontend backend
docker network rm calc-network
```

### 8.3: Удаление образов (опционально)

```bash
docker rmi calc-backend-image calc-frontend-image
```

### 8.4: Полная очистка Docker

⚠️ **ВНИМАНИЕ:** Удалит ВСЕ неиспользуемые Docker ресурсы!

```bash
docker system prune -a --volumes -f
```

---

## 9. Решение проблем

### Проблема: Port is already allocated

**Симптом:**
```
Error response from daemon: Bind for 0.0.0.0:8080 failed: port is already allocated
```

**Решение:**
```bash
# Найти процесс на порту
lsof -i :8080

# Остановить старые контейнеры
docker stop $(docker ps -q)
docker rm $(docker ps -aq)

# Повторить запуск
docker compose up -d
```

### Проблема: Container is unhealthy

**Симптом:**
```
Container calc-backend  Unhealthy
```

**Решение:**
```bash
# Посмотреть логи backend
docker logs calc-backend

# Типичные причины:
# - Ошибка компиляции Java
# - Неправильный порт
# - Отсутствующие зависимости
```

### Проблема: CORS ошибка в браузере

**Симптом:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/calc' from origin 
'http://localhost:3001' has been blocked by CORS policy
```

**Решение:**

Проверьте `backend/src/main/resources/application.properties`:
```properties
cors.allowed-origins=http://localhost:3000,http://localhost:3001,http://localhost:80
```

Пересоберите backend:
```bash
docker compose build backend
docker compose up -d
```

### Проблема: Cannot connect to Docker daemon

**Симптом:**
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Решение:**
1. Запустите Docker Desktop
2. Подождите 30-60 секунд
3. Повторите команду

---

## 10. Архитектура

### Потоки данных

```
Браузер (localhost:3001)
    │
    ▼
┌───────────────────────────────────────┐
│           Frontend Container           │
│                                        │
│  nginx:80                              │
│  ┌──────────────────────────────────┐  │
│  │ location / {                      │  │
│  │   → /usr/share/nginx/html (React) │  │
│  │ }                                 │  │
│  │                                   │  │
│  │ location /api/ {                  │  │
│  │   → proxy_pass http://backend:8080│  │
│  │ }                                 │  │
│  └──────────────────────────────────┘  │
└───────────────────────────────────────┘
    │
    │ /api/* запросы
    ▼
┌───────────────────────────────────────┐
│           Backend Container            │
│                                        │
│  Spring Boot:8080                      │
│  ┌──────────────────────────────────┐  │
│  │ CalcController                    │  │
│  │   POST /api/calc → calculate()    │  │
│  │   GET  /api/health → health()     │  │
│  │                                   │  │
│  │ GlobalExceptionHandler            │  │
│  │   → 400 Bad Request               │  │
│  │   → 500 Internal Server Error     │  │
│  └──────────────────────────────────┘  │
└───────────────────────────────────────┘
```

### Структура файлов проекта

```
calculator-docker-course/
├── docker-compose.yml          # Основной файл Docker Compose
├── backend/
│   ├── Dockerfile              # Multi-stage сборка Java
│   ├── pom.xml                 # Maven зависимости
│   └── src/main/java/com/example/calc/
│       ├── CalcApplication.java      # Точка входа
│       ├── CalcController.java       # REST API контроллер
│       └── GlobalExceptionHandler.java # Обработка ошибок
├── frontend/
│   ├── Dockerfile              # Сборка для manual режима
│   ├── Dockerfile.compose      # Сборка для Docker Compose
│   ├── nginx.conf              # nginx для manual режима
│   ├── nginx.compose.conf      # nginx для Docker Compose
│   ├── package.json            # npm зависимости
│   └── src/
│       └── App.js              # React компонент
└── tests/
    ├── test_api.py             # API тесты
    └── test_ui_selenium.py     # UI тесты
```

### Используемые технологии

| Компонент | Технология | Версия |
|-----------|------------|--------|
| Backend | Spring Boot | 3.2.0 |
| Backend | Java | 17 |
| Frontend | React | 18.x |
| Frontend | nginx | alpine |
| Build | Maven | 3.9 |
| Build | Node.js | 20 |

---

## 11. Публикация своих образов

Если вы хотите опубликовать собранные образы, чтобы другие могли их использовать.

### 11.1: Регистрация на Docker Hub

1. Перейдите на [hub.docker.com](https://hub.docker.com)
2. Создайте бесплатный аккаунт
3. Запомните ваш **username**

### 11.2: Вход в Docker Hub

```bash
docker login
```

**Ожидаемый вывод:**
```
Login with your Docker ID to push and pull images from Docker Hub.
Username: your-username
Password: 
Login Succeeded
```

### 11.3: Сборка и публикация (скрипт)

```bash
# Установите ваш username
export DOCKER_USERNAME=your-username

# Запустите скрипт сборки и публикации
./scripts/build-and-push.sh --push
```

**Ожидаемый вывод:**
```
═══════════════════════════════════════════════════════════════════════════
🐳 Docker Calculator — Сборка образов
═══════════════════════════════════════════════════════════════════════════

📦 Backend:  docker.io/your-username/calculator-docker-backend:1.0.0
📦 Frontend: docker.io/your-username/calculator-docker-frontend:1.0.0
📤 Пуш:      true
🏠 Реестр:   docker.io

...

✅ Образы опубликованы!
```

### 11.4: Ручная публикация

Если предпочитаете делать вручную:

```bash
# Тегирование образов
docker tag ykg-backend:latest your-username/calculator-docker-backend:1.0.0
docker tag ykg-frontend:latest your-username/calculator-docker-frontend:1.0.0

# Публикация
docker push your-username/calculator-docker-backend:1.0.0
docker push your-username/calculator-docker-frontend:1.0.0
```

### 11.5: Публикация на GitHub Container Registry

Альтернатива Docker Hub — GitHub CR (бесплатно для публичных репозиториев):

```bash
# Создайте Personal Access Token на GitHub
# Settings → Developer settings → Personal access tokens → Tokens (classic)
# Права: write:packages, read:packages

# Вход
echo $GITHUB_TOKEN | docker login ghcr.io -u your-github-username --password-stdin

# Сборка и публикация
export DOCKER_USERNAME=your-github-username
./scripts/build-and-push.sh --push --ghcr
```

### 11.6: Использование опубликованных образов

**Опубликованные образы на Docker Hub (Multi-Platform: AMD64 + ARM64):**

#### 🍎 Apple Silicon (ARM64) — Mac M1/M2/M3

| Компонент | Команда скачивания | Ссылка на Docker Hub |
|-----------|-------------------|---------------------|
| **Backend** | `docker pull nikolaysaltan/calculator-docker-backend:arm64` | [🔗 Backend ARM64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-backend/tags?name=arm64) |
| **Frontend** | `docker pull nikolaysaltan/calculator-docker-frontend:arm64` | [🔗 Frontend ARM64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-frontend/tags?name=arm64) |
| **Tests** | `docker pull nikolaysaltan/calculator-docker-tests:arm64` | [🔗 Tests ARM64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-tests/tags?name=arm64) |

#### 💻 x86_64 (AMD64) — Windows, Linux, Intel Mac

| Компонент | Команда скачивания | Ссылка на Docker Hub |
|-----------|-------------------|---------------------|
| **Backend** | `docker pull nikolaysaltan/calculator-docker-backend:amd64` | [🔗 Backend AMD64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-backend/tags?name=amd64) |
| **Frontend** | `docker pull nikolaysaltan/calculator-docker-frontend:amd64` | [🔗 Frontend AMD64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-frontend/tags?name=amd64) |
| **Tests** | `docker pull nikolaysaltan/calculator-docker-tests:amd64` | [🔗 Tests AMD64](https://hub.docker.com/r/nikolaysaltan/calculator-docker-tests/tags?name=amd64) |

#### 📋 Общие ссылки на репозитории

- **Backend**: https://hub.docker.com/r/nikolaysaltan/calculator-docker-backend
- **Frontend**: https://hub.docker.com/r/nikolaysaltan/calculator-docker-frontend
- **Tests**: https://hub.docker.com/r/nikolaysaltan/calculator-docker-tests

> 💡 **Поддержка архитектур:** Все образы работают на Windows (x86), Linux и Apple Silicon (M1/M2/M3)!

После публикации другие пользователи могут запустить:

```bash
# Скачать docker-compose.prebuilt.yml из репозитория
curl -O https://raw.githubusercontent.com/USER/REPO/main/ykg/docker-compose.prebuilt.yml

# Установить username владельца образов
export DOCKER_USERNAME=your-username

# Запустить
docker compose -f docker-compose.prebuilt.yml up -d
```

---

## ✅ Чек-лист успешного развёртывания

- [ ] Docker Desktop запущен (`docker ps` работает)
- [ ] Порты 3001 и 8080 свободны
- [ ] `docker compose up --build -d` выполнен успешно
- [ ] `docker compose ps` показывает оба контейнера в статусе Up
- [ ] Backend healthy (`curl localhost:8080/api/health`)
- [ ] Frontend доступен (`http://localhost:3001` в браузере)
- [ ] Калькулятор выполняет вычисления
- [ ] Деление на ноль показывает ошибку

---

**🎉 Приложение готово к использованию!**

**URL:** http://localhost:3001

