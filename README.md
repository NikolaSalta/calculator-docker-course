# Calculator Project - QA & DevOps Review

Этот репозиторий содержит full-stack приложение "Калькулятор" (Java Spring Boot backend + React frontend).
В рамках ревью были внесены улучшения в безопасность, стабильность сборки и документацию.

## Структура проекта

- `backend/`: Java Spring Boot приложение
- `frontend/`: React приложение с Nginx
- `docker-compose.yml`: Конфигурация Docker Compose для запуска
- `tests/`: Скрипты для автоматического тестирования

## Требования (Prerequisites)

Для работы с проектом вам понадобятся установленные:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Python 3 (для запуска smoke-тестов)

## Сборка и Запуск

1.  **Сборка и запуск приложения**:
    Выполните следующую команду в корне проекта:

    ```bash
    docker compose up --build -d
    ```
    Эта команда соберет Docker-образы и запустит контейнеры в фоновом режиме.

2.  **Доступ к приложению**:
    - **Frontend (Калькулятор)**: Откройте браузер по адресу [http://localhost:3000](http://localhost:3000)
    - **Backend API (Health check)**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

3.  **Остановка приложения**:

    ```bash
    docker compose down
    ```

## Тестирование (Smoke Tests)

В проекте предусмотрен автоматический smoke-тест, который проверяет полный цикл работы: сборку, запуск, доступность сервисов и корректное завершение.

**Как запустить тест:**

```bash
python3 tests/run_smoke_test.py
```

Сценарий теста:
1. Очищает окружение (`docker compose down`).
2. Собирает и запускает проект (`docker compose up --build`).
3. Проверяет доступность Frontend (HTTP 200).
4. Проверяет статус Backend API (`{"status": "OK"}`).
5. Останавливает контейнеры.

## Безопасность и Конфигурация

Проект настроен с учетом Best Practices по безопасности и DevOps:

- **Non-root пользователи**:
  - Backend запускается под пользователем `appuser`.
  - Frontend (Nginx) запускается под пользователем `nginx`.
- **Security Headers**: В Nginx добавлены заголовки безопасности (`X-Frame-Options`, `X-Content-Type-Options`, `Permissions-Policy` и др.).
- **Reproducible Builds**: Используются фиксированные версии базовых образов (pinned versions) вместо тега `:latest`.
- **Healthchecks**: Настроены проверки здоровья (healthchecks) для обоих сервисов в `docker-compose.yml`.

## Устранение неполадок (Troubleshooting)

- **Порт занят (Port already in use)**:
  Если вы видите ошибку `Bind for 0.0.0.0:3000 failed: port is already allocated`, значит порт 3000 занят другим процессом. Освободите порт или измените маппинг портов в `docker-compose.yml`.

- **Ошибки сборки**:
  Попробуйте выполнить сборку без кеша:
  ```bash
  docker compose build --no-cache
  ```

- **Просмотр логов**:
  Если контейнеры падают или работают некорректно, проверьте логи:
  ```bash
  docker compose logs -f
  ```
