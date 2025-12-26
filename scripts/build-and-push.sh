#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# build-and-push.sh — Сборка и публикация Docker образов
# ═══════════════════════════════════════════════════════════════════════════
#
# Использование:
#   ./scripts/build-and-push.sh                    # Только сборка
#   ./scripts/build-and-push.sh --push             # Сборка + пуш на Docker Hub
#   ./scripts/build-and-push.sh --push --ghcr      # Сборка + пуш на GitHub CR
#
# Перед пушем нужно залогиниться:
#   Docker Hub:  docker login
#   GitHub CR:   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
# ═══════════════════════════════════════════════════════════════════════════

set -e

# ─────────────────────────────────────────────────────────────────────────────
# КОНФИГУРАЦИЯ — ИЗМЕНИТЕ ЭТИ ЗНАЧЕНИЯ
# ─────────────────────────────────────────────────────────────────────────────

# Ваш username на Docker Hub или GitHub
DOCKER_USERNAME="${DOCKER_USERNAME:-your-username}"

# Название репозитория
REPO_NAME="calculator-docker"

# Версия образов
VERSION="1.0.0"

# Реестр (docker.io для Docker Hub, ghcr.io для GitHub)
REGISTRY="${REGISTRY:-docker.io}"

# ─────────────────────────────────────────────────────────────────────────────
# ПАРСИНГ АРГУМЕНТОВ
# ─────────────────────────────────────────────────────────────────────────────

PUSH=false
USE_GHCR=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --push)
            PUSH=true
            shift
            ;;
        --ghcr)
            USE_GHCR=true
            REGISTRY="ghcr.io"
            shift
            ;;
        *)
            echo "Неизвестный аргумент: $1"
            exit 1
            ;;
    esac
done

# ─────────────────────────────────────────────────────────────────────────────
# ФОРМИРОВАНИЕ ИМЁН ОБРАЗОВ
# ─────────────────────────────────────────────────────────────────────────────

BACKEND_IMAGE="${REGISTRY}/${DOCKER_USERNAME}/${REPO_NAME}-backend"
FRONTEND_IMAGE="${REGISTRY}/${DOCKER_USERNAME}/${REPO_NAME}-frontend"

echo "═══════════════════════════════════════════════════════════════════════════"
echo "🐳 Docker Calculator — Сборка образов"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "📦 Backend:  ${BACKEND_IMAGE}:${VERSION}"
echo "📦 Frontend: ${FRONTEND_IMAGE}:${VERSION}"
echo "📤 Пуш:      ${PUSH}"
echo "🏠 Реестр:   ${REGISTRY}"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# ПЕРЕХОД В КОРЕНЬ ПРОЕКТА
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "📂 Рабочая директория: $(pwd)"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# СБОРКА BACKEND
# ─────────────────────────────────────────────────────────────────────────────

echo "═══════════════════════════════════════════════════════════════════════════"
echo "🔨 Сборка Backend образа..."
echo "═══════════════════════════════════════════════════════════════════════════"

docker build \
    -t "${BACKEND_IMAGE}:${VERSION}" \
    -t "${BACKEND_IMAGE}:latest" \
    ./backend

echo ""
echo "✅ Backend образ собран!"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# СБОРКА FRONTEND
# ─────────────────────────────────────────────────────────────────────────────

echo "═══════════════════════════════════════════════════════════════════════════"
echo "🔨 Сборка Frontend образа..."
echo "═══════════════════════════════════════════════════════════════════════════"

docker build \
    -t "${FRONTEND_IMAGE}:${VERSION}" \
    -t "${FRONTEND_IMAGE}:latest" \
    -f frontend/Dockerfile.compose \
    ./frontend

echo ""
echo "✅ Frontend образ собран!"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# ПРОВЕРКА ОБРАЗОВ
# ─────────────────────────────────────────────────────────────────────────────

echo "═══════════════════════════════════════════════════════════════════════════"
echo "📋 Созданные образы:"
echo "═══════════════════════════════════════════════════════════════════════════"

docker images | grep -E "(${REPO_NAME}|REPOSITORY)" | head -10

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# ПУШ ОБРАЗОВ (если указан флаг --push)
# ─────────────────────────────────────────────────────────────────────────────

if [ "$PUSH" = true ]; then
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo "📤 Публикация образов в ${REGISTRY}..."
    echo "═══════════════════════════════════════════════════════════════════════════"
    
    # Проверка авторизации
    if [ "$DOCKER_USERNAME" = "your-username" ]; then
        echo ""
        echo "❌ ОШИБКА: Установите переменную DOCKER_USERNAME"
        echo ""
        echo "   export DOCKER_USERNAME=ваш-username"
        echo "   ./scripts/build-and-push.sh --push"
        echo ""
        exit 1
    fi
    
    echo ""
    echo "📤 Пуш Backend..."
    docker push "${BACKEND_IMAGE}:${VERSION}"
    docker push "${BACKEND_IMAGE}:latest"
    
    echo ""
    echo "📤 Пуш Frontend..."
    docker push "${FRONTEND_IMAGE}:${VERSION}"
    docker push "${FRONTEND_IMAGE}:latest"
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo "✅ Образы опубликованы!"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo ""
    echo "Для использования:"
    echo ""
    echo "   docker pull ${BACKEND_IMAGE}:${VERSION}"
    echo "   docker pull ${FRONTEND_IMAGE}:${VERSION}"
    echo ""
else
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo "✅ Сборка завершена!"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo ""
    echo "Для публикации образов выполните:"
    echo ""
    echo "   # Docker Hub:"
    echo "   docker login"
    echo "   export DOCKER_USERNAME=ваш-username"
    echo "   ./scripts/build-and-push.sh --push"
    echo ""
    echo "   # GitHub Container Registry:"
    echo "   echo \$GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin"
    echo "   export DOCKER_USERNAME=ваш-github-username"
    echo "   ./scripts/build-and-push.sh --push --ghcr"
    echo ""
fi

