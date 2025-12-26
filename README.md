# 🐳 Docker Calculator — Учебный проект

Полнофункциональное приложение-калькулятор для изучения Docker.

## 📋 Описание

Этот проект создан для обучения Docker на практике. Включает:
- **Backend**: Java Spring Boot REST API
- **Frontend**: React SPA + nginx
- **Tests**: pytest + Selenium

## 🎯 Чему вы научитесь

- Собирать Docker-образы из Dockerfile
- Запускать контейнеры и настраивать сети
- Пробрасывать порты между хостом и контейнером
- Использовать Docker Compose для оркестрации
- Заходить внутрь контейнеров для отладки
- Запускать автотесты в Docker

## 👨‍🏫 Для преподавателей

**Подробная инструкция:** [TEACHER_GUIDE.md](TEACHER_GUIDE.md)

Содержит:
- Пошаговый план урока с конкретными командами
- Сценарии демонстрации (быстрый старт и пошаговая сборка)
- Практические задания для студентов
- Troubleshooting типичных проблем
- Чек-лист подготовки к уроку

## 🚀 Быстрый старт

### Требования
- Docker Desktop (Mac/Windows) или Docker Engine (Linux)
- Git

### 📦 Готовые образы на Docker Hub

| Образ | Ссылка |
|-------|--------|
| **Backend** | https://hub.docker.com/r/nikolaysaltan/calculator-docker-backend |
| **Frontend** | https://hub.docker.com/r/nikolaysaltan/calculator-docker-frontend |
| **Tests** | https://hub.docker.com/r/nikolaysaltan/calculator-docker-tests |

### Вариант 1: Запуск из готовых образов (быстро!)

```bash
# Скачать compose файл
curl -O https://raw.githubusercontent.com/nikolasalta/calculator-docker-course/main/docker-compose.prebuilt.yml

# Запустить
docker compose -f docker-compose.prebuilt.yml up -d

# Открыть в браузере
open http://localhost:3001
```

### Вариант 2: Клонировать и собрать локально

```bash
# Клонировать репозиторий
git clone https://github.com/nikolasalta/calculator-docker-course.git
cd calculator-docker-course

# Запустить через Docker Compose
docker compose up --build -d

# Открыть в браузере
open http://localhost:3001
```

### Остановка

```bash
docker compose down
```

## 📁 Структура проекта

```
calculator/
├── backend/                 # Java Spring Boot приложение
│   ├── Dockerfile          # Инструкция сборки backend
│   ├── pom.xml             # Maven конфигурация
│   └── src/                # Исходный код
│
├── frontend/               # React приложение
│   ├── Dockerfile          # Инструкция сборки (manual)
│   ├── Dockerfile.compose  # Инструкция сборки (compose)
│   ├── nginx.conf          # Конфиг nginx (manual)
│   ├── nginx.compose.conf  # Конфиг nginx (compose)
│   ├── package.json        # Node.js зависимости
│   └── src/                # Исходный код React
│
├── tests/                  # Автотесты (pytest + Selenium)
│   ├── Dockerfile          # Образ с тестами
│   ├── requirements.txt    # Python зависимости
│   ├── conftest.py         # Общие fixtures
│   ├── test_api.py         # API-тесты
│   └── test_ui_selenium.py # UI-тесты
│
├── docker-compose.yml          # Основной compose
├── docker-compose.test.yml     # Compose с API-тестами
└── docker-compose.selenium.yml # Compose с Selenium-тестами
```

## 🔧 Режимы запуска

### 1. Manual режим (для обучения)

```bash
# Создать сеть
docker network create calc-net

# Собрать образы
docker build -t calc-backend:local ./backend
docker build -t calc-frontend:local ./frontend

# Запустить backend
docker run -d --name calc-backend \
  --network calc-net \
  -p 8080:8080 \
  calc-backend:local

# Запустить frontend
docker run -d --name calc-frontend \
  --network calc-net \
  -p 3001:80 \
  calc-frontend:local

# Проверить
docker ps
curl http://localhost:8080/api/health
open http://localhost:3001
```

### 2. Docker Compose (рекомендуется)

```bash
docker compose up --build -d
```

### 3. С тестами

```bash
# API-тесты
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Selenium UI-тесты
docker compose -f docker-compose.selenium.yml up --build --abort-on-container-exit

# Отчёт
open ./test-reports/report.html
```

## 🌐 Endpoints

| URL | Описание |
|-----|----------|
| http://localhost:3001 | UI калькулятора |
| http://localhost:8080/api/health | Health check |
| http://localhost:8080/api/calc | API вычислений |
| http://localhost:4444 | Selenium Grid UI (при запуске тестов) |

## 📚 API Reference

### POST /api/calc

Выполнить вычисление.

**Request:**
```json
{
  "a": 10,
  "b": 5,
  "op": "+"
}
```

**Response:**
```json
{
  "result": 15.0,
  "operation": "10.0 + 5.0"
}
```

**Операции:** `+`, `-`, `*`, `/`

### GET /api/health

Проверка состояния сервиса.

**Response:**
```json
{
  "status": "OK",
  "service": "calc-backend"
}
```

## 🧪 Тестирование

> 📖 **Полная документация:** [TESTING_DOCUMENTATION.md](TESTING_DOCUMENTATION.md)

### 📦 Docker-образ тестов (Multi-Platform)

| Архитектура | Платформа | Поддержка |
|-------------|-----------|-----------|
| `linux/amd64` | x86_64 | Windows, Linux, Intel Mac |
| `linux/arm64` | aarch64 | Apple Silicon (M1/M2/M3) |

```bash
# Скачать образ (автоматический выбор архитектуры)
docker pull nikolaysaltan/calculator-docker-tests:latest

# Запуск с встроенным браузером (Chromium внутри контейнера!)
docker run --rm \
  -e USE_EMBEDDED_BROWSER=true \
  -e HEADLESS=true \
  -e BACKEND_URL=http://host.docker.internal:8080 \
  -e FRONTEND_URL=http://host.docker.internal:3001 \
  -v $(pwd)/reports:/tests/reports \
  nikolaysaltan/calculator-docker-tests:latest
```

### 🎬 Визуальное тестирование (noVNC)

```bash
# Запустить тесты с визуализацией браузера
docker compose -f docker-compose.selenium.yml up --build

# Открыть http://localhost:7900 (пароль: secret)
# Смотрите тесты в реальном времени!
```

### Просмотр отчётов в браузере

```bash
# Запустить сервер отчётов (после выполнения тестов)
docker compose -f docker-compose.reports.yml up -d

# Открыть http://localhost:9001/report.html
```

### Запуск всех тестов
```bash
docker compose -f docker-compose.selenium.yml up --build --abort-on-container-exit
```

### Только smoke-тесты
```bash
docker compose -f docker-compose.test.yml run --rm tests pytest -m smoke
```

### Только API-тесты
```bash
docker compose -f docker-compose.test.yml run --rm tests pytest -m api
```

### Только UI-тесты
```bash
docker compose -f docker-compose.selenium.yml run --rm tests pytest -m ui_selenium
```

## 🐛 Отладка

### Посмотреть логи
```bash
docker compose logs -f
docker compose logs backend
docker compose logs frontend
```

### Зайти внутрь контейнера
```bash
docker exec -it calc-backend sh
docker exec -it calc-frontend sh
```

### Проверить сеть
```bash
docker network ls
docker inspect calc-backend --format '{{json .NetworkSettings.Networks}}'
```

## 📖 Полезные команды

```bash
# Список образов
docker images | grep calc-

# Список контейнеров
docker ps -a

# Очистка
docker compose down
docker system prune -a  # ОСТОРОЖНО: удалит всё неиспользуемое
```

## 📚 Дополнительные материалы

В папке `documents/` находятся дополнительные обучающие материалы:

- **`docker_quiz.html`** — интерактивный тест по Docker с тремя режимами:
  - 🎴 Флеш-карты (изучение вопросов и ответов)
  - 📝 Тест (выбор правильного ответа)
  - Фильтрация по категориям (Docker основы, Dockerfile, Сети, Compose, Команды, Тестирование)
  - 64 вопроса с детальными ответами
  
- **`pdf_diagrams/`** — PDF-диаграммы архитектуры и процессов:
  - `01_docker_architecture.drawio.pdf` — архитектура Docker
  - И другие схемы для визуального понимания концепций

- **`flashcards.csv`** — база вопросов и ответов в формате CSV
- **`docker_basic.png`** — базовая схема Docker

### 🌐 Онлайн-версия квиза

Интерактивный Docker Quiz доступен онлайн:
**https://nikolasalta.github.io/calculator-docker-course/**

## 📝 Лицензия

MIT License - используйте для обучения свободно!
