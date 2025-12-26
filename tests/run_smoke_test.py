import subprocess
import time
import sys
import urllib.request
import json

def run_command(command):
    """Выполняет shell команду и возвращает код возврата"""
    print(f"🚀 Выполнение: {command}")
    process = subprocess.run(command, shell=True)
    return process.returncode

def check_url(url, description, retries=10, delay=5):
    """Проверяет доступность URL с повторными попытками"""
    print(f"🔍 Проверка {description} по адресу {url}...")

    for i in range(retries):
        try:
            with urllib.request.urlopen(url) as response:
                status = response.getcode()
                if status == 200:
                    print(f"✅ {description} доступен (Status: 200)")
                    return True
                else:
                    print(f"⚠️ {description} вернул статус {status}, попытка {i+1}/{retries}")
        except Exception as e:
            print(f"⚠️ Ошибка соединения с {description}: {e}, попытка {i+1}/{retries}")

        time.sleep(delay)

    print(f"❌ Не удалось подключиться к {description} после {retries} попыток")
    return False

def check_api_health(url, retries=10, delay=5):
    """Проверяет JSON ответ от API Health endpoint"""
    print(f"🔍 Проверка API Health по адресу {url}...")

    for i in range(retries):
        try:
            with urllib.request.urlopen(url) as response:
                data = json.load(response)
                if data.get("status") == "OK":
                    print(f"✅ API Health OK: {data}")
                    return True
                else:
                    print(f"⚠️ API Health вернул неожиданный статус: {data}")
        except Exception as e:
            print(f"⚠️ Ошибка соединения с API: {e}, попытка {i+1}/{retries}")

        time.sleep(delay)

    print(f"❌ API Health check провален")
    return False

def main():
    print("🎬 Запуск автоматического Smoke-теста...")

    # 1. Очистка предыдущего запуска
    print("\n🧹 Очистка окружения...")
    run_command("docker compose down -v")

    # 2. Сборка и запуск контейнеров
    print("\n🏗️ Сборка и запуск контейнеров...")
    if run_command("docker compose up --build -d") != 0:
        print("❌ Ошибка при запуске docker compose")
        sys.exit(1)

    # 3. Ожидание и проверки
    print("\n⏳ Ожидание инициализации сервисов...")
    # Даем немного времени на холодный старт, хотя check_url имеет ретраи
    time.sleep(10)

    frontend_ok = check_url("http://localhost:3000", "Frontend")
    backend_ok = check_api_health("http://localhost:8080/api/health")

    # 4. Остановка контейнеров
    print("\n🛑 Остановка контейнеров...")
    run_command("docker compose down")

    # 5. Итоговый результат
    if frontend_ok and backend_ok:
        print("\n✅✅✅ TEST PASSED: Все сервисы работают корректно!")
        sys.exit(0)
    else:
        print("\n❌❌❌ TEST FAILED: Один или несколько сервисов недоступны!")
        sys.exit(1)

if __name__ == "__main__":
    main()
