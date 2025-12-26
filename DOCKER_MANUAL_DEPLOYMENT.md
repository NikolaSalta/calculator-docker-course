# 🐳 Полное руководство: от нуля до работающего Docker-приложения

---

# ЧАСТЬ 1: ПОДГОТОВКА СИСТЕМЫ

---

## 1.1 Установка среды разработки Cursor IDE

### Что такое Cursor IDE?
Cursor — это современная среда разработки на базе VS Code с встроенным AI-ассистентом. Бесплатна для базового использования.

---

### 🍎 Установка на macOS

#### Шаг 1: Скачать Cursor

1. Откройте браузер Safari или Chrome
2. Перейдите на сайт: **https://cursor.sh**
3. Нажмите большую кнопку **"Download for macOS"**
4. Дождитесь скачивания файла `Cursor-darwin-universal.dmg` (≈150 MB)

#### Шаг 2: Установить Cursor

1. Откройте скачанный файл `Cursor-darwin-universal.dmg`
2. В появившемся окне перетащите иконку **Cursor** в папку **Applications**
3. Дождитесь копирования (10-30 секунд)
4. Закройте окно установки

#### Шаг 3: Первый запуск

1. Откройте **Finder** → **Applications** (Программы)
2. Найдите **Cursor** и дважды кликните
3. При первом запуске macOS спросит: "Cursor загружен из интернета. Открыть?"
4. Нажмите **"Открыть"**

#### Шаг 4: Начальная настройка Cursor

1. Cursor попросит войти или зарегистрироваться
2. Можно нажать **"Skip"** чтобы пропустить регистрацию
3. Выберите тему оформления (светлая/тёмная)
4. Нажмите **"Get Started"**

**Ожидаемый результат:** Откроется пустое окно Cursor IDE с приветственной страницей.

---

### 🐧 Установка на Linux (Ubuntu/Debian)

#### Шаг 1: Открыть терминал

**Способ 1:** Нажмите `Ctrl + Alt + T`

**Способ 2:** Кликните правой кнопкой на рабочем столе → "Open Terminal"

**Ожидаемый результат:**
```
user@ubuntu:~$ 
```

#### Шаг 2: Скачать Cursor

```bash
cd ~/Downloads
wget https://downloader.cursor.sh/linux/appImage/x64 -O cursor.AppImage
```

**Ожидаемый вывод:**
```
--2025-12-26 12:00:00--  https://downloader.cursor.sh/linux/appImage/x64
Resolving downloader.cursor.sh... 104.21.xx.xx
Connecting to downloader.cursor.sh... connected.
HTTP request sent, awaiting response... 200 OK
Length: 156789012 (150M) [application/octet-stream]
Saving to: 'cursor.AppImage'

cursor.AppImage     100%[===================>] 149.56M  15.2MB/s    in 10s

2025-12-26 12:00:10 (15.0 MB/s) - 'cursor.AppImage' saved [156789012/156789012]
```

#### Шаг 3: Сделать файл исполняемым

```bash
chmod +x cursor.AppImage
```

**Ожидаемый вывод:**
```
(никакого вывода - это нормально, команда выполнилась успешно)
```

#### Шаг 4: Запустить Cursor

```bash
./cursor.AppImage
```

**Ожидаемый результат:** Откроется окно Cursor IDE.

#### Шаг 5 (опционально): Добавить в меню приложений

```bash
mkdir -p ~/.local/bin
mv cursor.AppImage ~/.local/bin/cursor
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Теперь можно запускать командой `cursor` из любого места.

---

### 🪟 Установка на Windows

#### Шаг 1: Скачать Cursor

1. Откройте браузер
2. Перейдите на **https://cursor.sh**
3. Нажмите **"Download for Windows"**
4. Скачается файл `CursorSetup.exe` (≈150 MB)

#### Шаг 2: Установить Cursor

1. Откройте скачанный `CursorSetup.exe`
2. Если Windows спросит "Разрешить этому приложению вносить изменения?" → **Да**
3. Следуйте инструкциям установщика
4. Нажмите **"Install"**
5. Дождитесь установки (1-2 минуты)
6. Нажмите **"Finish"**

**Ожидаемый результат:** Cursor автоматически запустится.

---

## 1.2 Установка Docker

### Что такое Docker?
Docker — это платформа для запуска приложений в изолированных контейнерах. Контейнер содержит всё необходимое для работы приложения: код, библиотеки, настройки.

---

### 🍎 Установка Docker на macOS

#### Шаг 1: Скачать Docker Desktop

1. Откройте браузер
2. Перейдите на: **https://www.docker.com/products/docker-desktop/**
3. Нажмите **"Download for Mac"**
4. Выберите версию:
   - **Apple Silicon** — если у вас Mac с чипом M1, M2, M3, M4
   - **Intel chip** — если у вас Mac с процессором Intel
   
   > Чтобы узнать какой чип: меню Apple (яблоко) → "About This Mac" → смотрите "Chip" или "Processor"

5. Скачается файл `Docker.dmg` (≈600 MB)

#### Шаг 2: Установить Docker Desktop

1. Откройте скачанный `Docker.dmg`
2. Перетащите иконку **Docker** в папку **Applications**
3. Дождитесь копирования (1-2 минуты)
4. Закройте окно установки

#### Шаг 3: Первый запуск Docker

1. Откройте **Finder** → **Applications**
2. Найдите **Docker** и дважды кликните
3. macOS спросит: "Docker загружен из интернета. Открыть?" → **"Открыть"**
4. Docker попросит системные разрешения → введите пароль вашего Mac
5. Примите лицензионное соглашение

#### Шаг 4: Дождаться запуска

В верхней панели меню (справа) появится иконка кита 🐳

1. Кликните на иконку кита
2. Дождитесь пока статус станет **"Docker Desktop is running"**
3. Первый запуск занимает 1-3 минуты

**Ожидаемый результат:** Иконка кита перестанет анимироваться, статус "Running".

#### Шаг 5: Проверить установку в терминале

Откройте **Terminal** (Finder → Applications → Utilities → Terminal) или нажмите `Cmd + Space`, введите "Terminal", нажмите Enter.

Введите команду:

```bash
docker --version
```

**Ожидаемый вывод:**
```
Docker version 27.4.0, build bde2b89
```

Введите ещё одну команду:

```bash
docker run hello-world
```

**Ожидаемый вывод:**
```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:305243c734571da2d100c8c8b3c3167a098cab6049c9a5b066b6021a60fcb966
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

**✅ Docker установлен и работает!**

---

### 🐧 Установка Docker на Linux (Ubuntu/Debian)

#### Шаг 1: Открыть терминал

Нажмите `Ctrl + Alt + T`

#### Шаг 2: Обновить список пакетов

```bash
sudo apt update
```

**Ожидаемый вывод:**
```
[sudo] password for user: (введите пароль)
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]
...
Reading package lists... Done
```

#### Шаг 3: Установить необходимые пакеты

```bash
sudo apt install -y ca-certificates curl gnupg lsb-release
```

**Ожидаемый вывод:**
```
Reading package lists... Done
Building dependency tree... Done
...
Setting up ca-certificates (20230311ubuntu0.22.04.1) ...
```

#### Шаг 4: Добавить GPG ключ Docker

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

**Ожидаемый вывод:**
```
(никакого вывода - это нормально)
```

#### Шаг 5: Добавить репозиторий Docker

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

**Ожидаемый вывод:**
```
(никакого вывода - это нормально)
```

#### Шаг 6: Обновить список пакетов с новым репозиторием

```bash
sudo apt update
```

**Ожидаемый вывод:**
```
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 https://download.docker.com/linux/ubuntu jammy InRelease [48.8 kB]
Get:3 https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages [29.3 kB]
...
Reading package lists... Done
```

#### Шаг 7: Установить Docker

```bash
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

**Ожидаемый вывод:**
```
Reading package lists... Done
Building dependency tree... Done
...
Setting up docker-ce (5:27.4.0-1~ubuntu.22.04~jammy) ...
Created symlink /etc/systemd/system/multi-user.target.wants/docker.service
...
Processing triggers for man-db (2.10.2-1) ...
```

#### Шаг 8: Добавить пользователя в группу docker

Это позволит запускать docker без sudo:

```bash
sudo usermod -aG docker $USER
```

**Ожидаемый вывод:**
```
(никакого вывода - это нормально)
```

#### Шаг 9: Применить изменения группы

**ВАЖНО!** Нужно выйти и войти заново, или выполнить:

```bash
newgrp docker
```

**Ожидаемый вывод:**
```
(никакого вывода - это нормально)
```

#### Шаг 10: Проверить установку

```bash
docker --version
```

**Ожидаемый вывод:**
```
Docker version 27.4.0, build bde2b89
```

```bash
docker run hello-world
```

**Ожидаемый вывод:**
```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
...
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

**✅ Docker установлен и работает!**

---

### 🪟 Установка Docker на Windows

#### Шаг 1: Проверить требования

- Windows 10 64-bit: Pro, Enterprise, или Education (Build 19041+)
- Windows 11 64-bit
- Включённая виртуализация в BIOS

#### Шаг 2: Включить WSL 2 (если не включен)

Откройте **PowerShell от имени администратора**:
1. Нажмите `Win + X`
2. Выберите "Windows Terminal (Admin)" или "PowerShell (Admin)"
3. Подтвердите запуск от имени администратора

Введите команду:

```powershell
wsl --install
```

**Ожидаемый вывод:**
```
Installing: Virtual Machine Platform
Virtual Machine Platform has been installed.
Installing: Windows Subsystem for Linux
Windows Subsystem for Linux has been installed.
Installing: Ubuntu
Ubuntu has been installed.
The requested operation is successful. Changes will not be effective until the system is rebooted.
```

**ВАЖНО!** Перезагрузите компьютер.

#### Шаг 3: Скачать Docker Desktop

1. Откройте браузер
2. Перейдите на: **https://www.docker.com/products/docker-desktop/**
3. Нажмите **"Download for Windows"**
4. Скачается файл `Docker Desktop Installer.exe` (≈600 MB)

#### Шаг 4: Установить Docker Desktop

1. Запустите `Docker Desktop Installer.exe`
2. Если спросит "Разрешить?" → **Да**
3. Оставьте галочку "Use WSL 2 instead of Hyper-V"
4. Нажмите **"OK"**
5. Дождитесь установки (5-10 минут)
6. Нажмите **"Close and restart"** для перезагрузки

#### Шаг 5: Первый запуск после перезагрузки

1. После входа в Windows, Docker Desktop запустится автоматически
2. Примите лицензионное соглашение
3. Дождитесь пока Docker запустится (1-3 минуты)
4. В системном трее (справа внизу) появится иконка кита 🐳

#### Шаг 6: Проверить установку

Откройте **PowerShell** или **Command Prompt**:

```cmd
docker --version
```

**Ожидаемый вывод:**
```
Docker version 27.4.0, build bde2b89
```

```cmd
docker run hello-world
```

**Ожидаемый вывод:**
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

**✅ Docker установлен и работает!**

---

## 1.3 Установка Git

### Что такое Git?
Git — это система контроля версий. GitHub — это сервис для хранения Git-репозиториев в облаке.

---

### 🍎 Проверка/Установка Git на macOS

Git обычно уже установлен на macOS. Проверьте:

```bash
git --version
```

**Если Git установлен:**
```
git version 2.39.3 (Apple Git-146)
```

**Если Git НЕ установлен:**
```
xcode-select: note: no developer tools were found at '/Applications/Xcode.app'...
```

В этом случае macOS автоматически предложит установить Command Line Tools. Нажмите **"Install"** и дождитесь установки (5-10 минут).

---

### 🐧 Установка Git на Linux

```bash
sudo apt install -y git
```

**Ожидаемый вывод:**
```
Reading package lists... Done
...
Setting up git (1:2.34.1-1ubuntu1.10) ...
```

Проверьте:

```bash
git --version
```

**Ожидаемый вывод:**
```
git version 2.34.1
```

---

### 🪟 Установка Git на Windows

1. Скачайте с **https://git-scm.com/download/win**
2. Запустите установщик
3. Нажимайте **"Next"** на всех шагах (настройки по умолчанию)
4. Нажмите **"Install"**
5. Нажмите **"Finish"**

Проверьте в PowerShell:

```powershell
git --version
```

**Ожидаемый вывод:**
```
git version 2.43.0.windows.1
```

---

# ЧАСТЬ 2: КЛОНИРОВАНИЕ ПРОЕКТА

---

## 2.1 Открыть Cursor IDE

### 🍎 macOS
- Нажмите `Cmd + Space`
- Введите "Cursor"
- Нажмите Enter

### 🐧 Linux
- Нажмите `Super` (клавиша Windows)
- Введите "Cursor"
- Нажмите Enter

Или в терминале:
```bash
cursor
```

### 🪟 Windows
- Нажмите `Win`
- Введите "Cursor"
- Нажмите Enter

**Ожидаемый результат:** Откроется окно Cursor IDE.

---

## 2.2 Клонировать проект из GitHub

### Способ 1: Через интерфейс Cursor (рекомендуется)

#### Шаг 1: Открыть Command Palette

**macOS:** `Cmd + Shift + P`
**Linux/Windows:** `Ctrl + Shift + P`

Появится поле ввода вверху окна.

#### Шаг 2: Найти команду клонирования

Введите:
```
Git: Clone
```

Выберите **"Git: Clone"** из списка.

#### Шаг 3: Ввести URL репозитория

В появившемся поле введите URL вашего GitHub репозитория:

```
https://github.com/YOUR_USERNAME/calculator-docker-course.git
```

> Замените `YOUR_USERNAME` на ваш логин GitHub или URL реального репозитория.

Нажмите Enter.

#### Шаг 4: Выбрать папку для проекта

1. Откроется диалог выбора папки
2. Перейдите в папку, где хотите сохранить проект (например, Desktop или Documents)
3. Нажмите **"Select Repository Location"** (или "Выбрать")

#### Шаг 5: Дождаться клонирования

Cursor покажет прогресс в правом нижнем углу:
```
Cloning into 'calculator-docker-course'...
```

После завершения появится уведомление:
```
Would you like to open the cloned repository?
```

Нажмите **"Open"** или **"Open in New Window"**.

**Ожидаемый результат:** Cursor откроет проект с файловым деревом слева.

---

### Способ 2: Через терминал

#### Шаг 1: Открыть терминал в Cursor

**macOS:** `Ctrl + `` ` (Ctrl + обратная кавычка)
**Linux/Windows:** `Ctrl + `` `

Или через меню: **Terminal → New Terminal**

#### Шаг 2: Перейти в нужную папку

```bash
cd ~/Desktop
```

**Ожидаемый вывод:**
```
(никакого вывода)
```

#### Шаг 3: Клонировать репозиторий

```bash
git clone https://github.com/YOUR_USERNAME/calculator-docker-course.git
```

**Ожидаемый вывод:**
```
Cloning into 'calculator-docker-course'...
remote: Enumerating objects: 89, done.
remote: Counting objects: 100% (89/89), done.
remote: Compressing objects: 100% (67/67), done.
remote: Total 89 (delta 23), reused 75 (delta 15), pack-reused 0
Receiving objects: 100% (89/89), 28.45 KiB | 1.42 MiB/s, done.
Resolving deltas: 100% (23/23), done.
```

#### Шаг 4: Открыть проект в Cursor

```bash
cursor calculator-docker-course
```

**Ожидаемый результат:** Откроется новое окно Cursor с проектом.

---

## 2.3 Изучить структуру проекта

После открытия проекта в левой панели вы увидите файловое дерево:

```
calculator-docker-course/
├── backend/                    ← Java Spring Boot приложение
│   ├── Dockerfile              ← Инструкция сборки Docker образа
│   ├── pom.xml                 ← Зависимости Maven (Java)
│   └── src/
│       └── main/
│           └── java/
│               └── com/example/calc/
│                   ├── CalcApplication.java    ← Точка входа
│                   ├── CalcController.java     ← REST API контроллер
│                   └── GlobalExceptionHandler.java
│
├── frontend/                   ← React приложение
│   ├── Dockerfile              ← Для разработки
│   ├── Dockerfile.compose      ← Для production (nginx)
│   ├── nginx.compose.conf      ← Конфигурация nginx
│   ├── package.json            ← Зависимости npm
│   ├── public/
│   │   └── index.html
│   └── src/
│       └── App.js              ← Главный React компонент
│
├── tests/                      ← Автоматические тесты
│   ├── test_api.py             ← API тесты
│   └── test_ui_selenium.py     ← UI тесты
│
├── docker-compose.yml          ← Оркестрация контейнеров
└── README.md
```

### Что где находится:

| Папка/Файл | Описание |
|------------|----------|
| `backend/` | REST API на Java Spring Boot. Обрабатывает вычисления. |
| `frontend/` | Веб-интерфейс на React. То, что видит пользователь. |
| `docker-compose.yml` | Файл для запуска всех контейнеров одной командой. |

---

# ЧАСТЬ 3: СБОРКА И ЗАПУСК DOCKER КОНТЕЙНЕРОВ

---

## 3.1 Открыть терминал в Cursor

### Шаг 1: Открыть терминал

**macOS:** Нажмите `Ctrl + `` ` (Ctrl и клавиша слева от 1)
**Linux/Windows:** Нажмите `Ctrl + `` `

Или через меню: **Terminal → New Terminal**

### Шаг 2: Убедиться что вы в папке проекта

Терминал автоматически откроется в корневой папке проекта. Проверьте:

```bash
pwd
```

**Ожидаемый вывод:**
```
/Users/yourname/Desktop/calculator-docker-course
```

Или на Linux:
```
/home/yourname/Desktop/calculator-docker-course
```

Или на Windows:
```
C:\Users\yourname\Desktop\calculator-docker-course
```

### Шаг 3: Проверить содержимое

```bash
ls -la
```

**Ожидаемый вывод:**
```
total 24
drwxr-xr-x  8 user staff  256 Dec 26 12:00 .
drwxr-xr-x  5 user staff  160 Dec 26 12:00 ..
drwxr-xr-x 12 user staff  384 Dec 26 12:00 .git
-rw-r--r--  1 user staff  234 Dec 26 12:00 .gitignore
-rw-r--r--  1 user staff 1234 Dec 26 12:00 README.md
drwxr-xr-x  5 user staff  160 Dec 26 12:00 backend
-rw-r--r--  1 user staff  567 Dec 26 12:00 docker-compose.yml
drwxr-xr-x  8 user staff  256 Dec 26 12:00 frontend
drwxr-xr-x  4 user staff  128 Dec 26 12:00 tests
```

---

## 3.2 Проверить что Docker запущен

### Шаг 1: Проверить версию Docker

```bash
docker --version
```

**Ожидаемый вывод (если Docker работает):**
```
Docker version 27.4.0, build bde2b89
```

**Ошибка (если Docker НЕ запущен):**
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

### Шаг 2: Если Docker не запущен

**macOS:**
1. Откройте Launchpad (F4 на клавиатуре или клик по иконке в Dock)
2. Найдите и кликните **Docker**
3. Подождите 1-2 минуты пока иконка кита в меню-баре перестанет анимироваться

**Linux:**
```bash
sudo systemctl start docker
```

**Windows:**
1. Найдите Docker Desktop в меню Start
2. Запустите его
3. Подождите 1-2 минуты

### Шаг 3: Повторить проверку

```bash
docker ps
```

**Ожидаемый вывод (Docker работает, контейнеров нет):**
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

---

## 3.3 Сборка Backend Docker образа

### Что такое Docker образ?
Образ (image) — это шаблон для создания контейнера. Содержит код приложения, зависимости, настройки. Контейнер — это запущенный экземпляр образа.

### Шаг 1: Выполнить команду сборки

В терминале Cursor введите:

```bash
docker build -t calc-backend-image ./backend
```

**Разбор команды:**
| Часть | Значение |
|-------|----------|
| `docker build` | Команда сборки образа |
| `-t calc-backend-image` | Имя (тег) для образа |
| `./backend` | Путь к папке с Dockerfile |

### Шаг 2: Наблюдать за процессом сборки

**Ожидаемый вывод (первая сборка, ~2-5 минут):**

```
[+] Building 125.3s (12/12) FINISHED                      docker:desktop-linux
 => [internal] load build definition from Dockerfile                      0.0s
 => [internal] load metadata for docker.io/library/eclipse-temurin:17-jre 1.2s
 => [internal] load metadata for docker.io/library/maven:3.9-eclipse-temurin-17 1.2s
```

Затем идёт этап загрузки базовых образов:

```
 => [builder 1/6] FROM docker.io/library/maven:3.9-eclipse-temurin-17@sha256:abc123 0.0s
```

Затем копирование файлов и сборка:

```
 => [builder 2/6] WORKDIR /app                                            0.1s
 => [builder 3/6] COPY pom.xml .                                          0.0s
 => [builder 4/6] RUN mvn dependency:go-offline                          45.3s
```

> На этом этапе Maven скачивает все Java зависимости. Это занимает время.

Затем компиляция:

```
 => [builder 5/6] COPY src ./src                                          0.0s
 => [builder 6/6] RUN mvn clean package -DskipTests                      25.2s
```

Финальный этап — создание минимального образа:

```
 => [stage-1 1/2] FROM docker.io/library/eclipse-temurin:17-jre           0.0s
 => [stage-1 2/2] COPY --from=builder /app/target/*.jar app.jar           0.1s
 => exporting to image                                                    0.3s
 => => naming to docker.io/library/calc-backend-image:latest             0.0s
```

### Шаг 3: Убедиться что образ создан

```bash
docker images | grep calc-backend
```

**Ожидаемый вывод:**
```
calc-backend-image   latest    abc123def456   About a minute ago   298MB
```

**✅ Backend образ собран!**

---

## 3.4 Сборка Frontend Docker образа

### Шаг 1: Выполнить команду сборки

```bash
docker build -t calc-frontend-image -f frontend/Dockerfile.compose ./frontend
```

**Разбор команды:**
| Часть | Значение |
|-------|----------|
| `docker build` | Команда сборки |
| `-t calc-frontend-image` | Имя образа |
| `-f frontend/Dockerfile.compose` | Путь к конкретному Dockerfile |
| `./frontend` | Контекст сборки (откуда копировать файлы) |

### Шаг 2: Наблюдать за процессом

**Ожидаемый вывод (~1-2 минуты):**

```
[+] Building 95.2s (15/15) FINISHED                       docker:desktop-linux
 => [internal] load build definition from Dockerfile.compose              0.0s
 => [builder 1/7] FROM docker.io/library/node:20-alpine                   0.0s
```

Установка npm зависимостей (самый долгий этап):

```
 => [builder 4/7] RUN npm install                                        85.3s
```

> npm install скачивает ~1300 пакетов. Это нормально.

Сборка React приложения:

```
 => [builder 7/7] RUN npm run build                                       5.2s
```

Вывод:
```
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  46.9 kB  build/static/js/main.2116540a.js
```

Финальный этап — копирование в nginx:

```
 => [stage-1 2/3] COPY --from=builder /app/build /usr/share/nginx/html    0.0s
 => [stage-1 3/3] COPY nginx.compose.conf /etc/nginx/conf.d/default.conf  0.0s
 => exporting to image                                                    0.1s
 => => naming to docker.io/library/calc-frontend-image:latest            0.0s
```

### Шаг 3: Проверить созданные образы

```bash
docker images | grep calc
```

**Ожидаемый вывод:**
```
calc-frontend-image   latest    xyz789abc012   30 seconds ago    25.4MB
calc-backend-image    latest    abc123def456   5 minutes ago     298MB
```

**✅ Frontend образ собран!**

---

## 3.5 Создание Docker сети

### Зачем нужна сеть?
Docker контейнеры по умолчанию изолированы друг от друга. Чтобы frontend мог общаться с backend, они должны быть в одной сети.

### Шаг 1: Создать сеть

```bash
docker network create calc-network
```

**Ожидаемый вывод:**
```
4e3de4d641c9b83334c9fc8ad1259482c7f3a42466e76b91947cdda611a9106d
```

> Это уникальный ID созданной сети.

### Шаг 2: Проверить что сеть создана

```bash
docker network ls
```

**Ожидаемый вывод:**
```
NETWORK ID     NAME           DRIVER    SCOPE
a1b2c3d4e5f6   bridge         bridge    local
4e3de4d641c9   calc-network   bridge    local
f7g8h9i0j1k2   host           host      local
l3m4n5o6p7q8   none           null      local
```

**✅ Сеть создана!**

---

## 3.6 Запуск Backend контейнера

### Шаг 1: Запустить контейнер

```bash
docker run -d \
  --name backend \
  --network calc-network \
  -p 8080:8080 \
  calc-backend-image
```

**Разбор команды:**

| Параметр | Значение |
|----------|----------|
| `docker run` | Запустить контейнер из образа |
| `-d` | Detached mode — запуск в фоне |
| `--name backend` | Имя контейнера = "backend" |
| `--network calc-network` | Подключить к сети calc-network |
| `-p 8080:8080` | Проброс порта: localhost:8080 → контейнер:8080 |
| `calc-backend-image` | Имя образа для запуска |

> **ВАЖНО!** Имя `backend` критично — nginx будет искать сервер с этим именем.

**Ожидаемый вывод:**
```
76c96f0719cf2423fa386d7e00af09763391ee048f48f6377c0bc81e0014d36d
```

### Шаг 2: Проверить что контейнер запущен

```bash
docker ps
```

**Ожидаемый вывод:**
```
CONTAINER ID   IMAGE                COMMAND                  CREATED         STATUS         PORTS                    NAMES
76c96f0719cf   calc-backend-image   "java -jar app.jar"      5 seconds ago   Up 4 seconds   0.0.0.0:8080->8080/tcp   backend
```

### Шаг 3: Посмотреть логи запуска

```bash
docker logs backend
```

**Ожидаемый вывод:**
```

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2025-12-26 14:05:30.170 [main] INFO  c.e.calc.CalcApplication - Starting CalcApplication
2025-12-26 14:05:30.701 [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat initialized with port 8080
2025-12-26 14:05:30.920 [main] INFO  o.s.b.w.e.tomcat.TomcatWebServer - Tomcat started on port 8080
2025-12-26 14:05:30.928 [main] INFO  c.e.calc.CalcApplication - Started CalcApplication in 1.012 seconds
```

> Ключевая строка: `Started CalcApplication in X.XXX seconds`

### Шаг 4: Проверить health endpoint

```bash
curl http://localhost:8080/api/health
```

**Ожидаемый вывод:**
```json
{
  "service" : "calc-backend",
  "status" : "OK"
}
```

### Шаг 5: Протестировать API

```bash
curl -X POST http://localhost:8080/api/calc \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 5, "op": "+"}'
```

**Ожидаемый вывод:**
```json
{
  "result" : 15.0,
  "operation" : "10.0 + 5.0"
}
```

**✅ Backend работает!**

---

## 3.7 Запуск Frontend контейнера

### Шаг 1: Запустить контейнер

```bash
docker run -d \
  --name frontend \
  --network calc-network \
  -p 3001:80 \
  calc-frontend-image
```

**Разбор команды:**

| Параметр | Значение |
|----------|----------|
| `--name frontend` | Имя контейнера |
| `--network calc-network` | Та же сеть, что и backend |
| `-p 3001:80` | localhost:3001 → nginx:80 (nginx слушает 80 внутри) |

**Ожидаемый вывод:**
```
8be86c66cade5f70e972a933de4d9194ba329d77c6ca3f0d5efe6c69da695105
```

### Шаг 2: Проверить что оба контейнера работают

```bash
docker ps
```

**Ожидаемый вывод:**
```
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS          PORTS                    NAMES
8be86c66cade   calc-frontend-image   "/docker-entrypoint.…"   5 seconds ago    Up 4 seconds    0.0.0.0:3001->80/tcp     frontend
76c96f0719cf   calc-backend-image    "java -jar app.jar"      2 minutes ago    Up 2 minutes    0.0.0.0:8080->8080/tcp   backend
```

### Шаг 3: Проверить связь между контейнерами

```bash
docker exec frontend ping -c 2 backend
```

**Ожидаемый вывод:**
```
PING backend (172.19.0.2): 56 data bytes
64 bytes from 172.19.0.2: seq=0 ttl=64 time=0.234 ms
64 bytes from 172.19.0.2: seq=1 ttl=64 time=0.156 ms

--- backend ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
```

> Frontend видит backend по имени благодаря Docker DNS.

**✅ Frontend работает!**

---

## 3.8 Проверка в браузере

### Шаг 1: Открыть браузер

Откройте любой браузер (Chrome, Firefox, Safari).

### Шаг 2: Перейти на калькулятор

В адресной строке введите:

```
http://localhost:3001
```

Нажмите Enter.

### Шаг 3: Что вы должны увидеть

**Ожидаемый результат:**

1. Заголовок "Калькулятор" с бейджем "Docker"
2. Два поля ввода для чисел
3. Выпадающий список с операциями: +, −, ×, ÷
4. Кнопка "Вычислить" (неактивна пока поля пусты)

### Шаг 4: Протестировать калькулятор

1. Введите `100` в первое поле
2. Выберите `×` (умножение)
3. Введите `5` во второе поле
4. Нажмите **"Вычислить"**

**Ожидаемый результат:**
```
Результат: 500
```

### Шаг 5: Проверить обработку ошибок

1. Введите `10` в первое поле
2. Выберите `÷` (деление)
3. Введите `0` во второе поле
4. Нажмите **"Вычислить"**

**Ожидаемый результат:**
```
Ошибка: деление на ноль
```

**🎉 Приложение полностью работает!**

---

# ЧАСТЬ 4: АЛЬТЕРНАТИВНЫЙ СПОСОБ — DOCKER COMPOSE

---

## 4.1 Что такое Docker Compose?

Docker Compose — это инструмент для запуска нескольких контейнеров одной командой. Вместо ручного создания сети и запуска контейнеров по отдельности, всё описано в файле `docker-compose.yml`.

---

## 4.2 Остановить ручные контейнеры

Если вы запускали контейнеры вручную, сначала остановите их:

```bash
docker stop frontend backend
docker rm frontend backend
docker network rm calc-network
```

---

## 4.3 Запуск через Docker Compose

### Шаг 1: Выполнить команду

```bash
docker compose up -d
```

**Ожидаемый вывод:**
```
[+] Building 0.0s (0/0)                                   docker:desktop-linux
[+] Running 3/3
 ✔ Network calculator-docker-course_default  Created                      0.1s
 ✔ Container calc-backend                    Started                      0.5s
 ✔ Container calc-frontend                   Started                      0.7s
```

### Шаг 2: Проверить статус

```bash
docker compose ps
```

**Ожидаемый вывод:**
```
NAME            IMAGE                               COMMAND                  SERVICE    STATUS          PORTS
calc-backend    calculator-docker-course-backend    "java -jar app.jar"      backend    Up 30 seconds   0.0.0.0:8080->8080/tcp
calc-frontend   calculator-docker-course-frontend   "/docker-entrypoint.…"   frontend   Up 30 seconds   0.0.0.0:3001->80/tcp
```

### Шаг 3: Открыть в браузере

Перейдите на http://localhost:3001

**✅ Приложение работает!**

---

## 4.4 Полезные команды Docker Compose

| Команда | Описание |
|---------|----------|
| `docker compose up -d` | Запустить все контейнеры в фоне |
| `docker compose ps` | Показать статус контейнеров |
| `docker compose logs` | Показать логи всех контейнеров |
| `docker compose logs -f` | Логи в реальном времени (Ctrl+C для выхода) |
| `docker compose logs backend` | Логи только backend |
| `docker compose stop` | Остановить контейнеры (не удалять) |
| `docker compose start` | Запустить остановленные контейнеры |
| `docker compose restart` | Перезапустить контейнеры |
| `docker compose down` | Остановить и удалить контейнеры и сеть |
| `docker compose down -v` | + удалить volumes |
| `docker compose build` | Пересобрать образы |
| `docker compose up -d --build` | Пересобрать и запустить |

---

# ЧАСТЬ 5: ОСТАНОВКА И ОЧИСТКА

---

## 5.1 Остановить приложение

### Если запускали через Docker Compose:

```bash
docker compose down
```

**Ожидаемый вывод:**
```
[+] Running 3/3
 ✔ Container calc-frontend                   Removed                      0.3s
 ✔ Container calc-backend                    Removed                      0.5s
 ✔ Network calculator-docker-course_default  Removed                      0.1s
```

### Если запускали вручную:

```bash
docker stop frontend backend
docker rm frontend backend
docker network rm calc-network
```

---

## 5.2 Удалить образы (опционально)

```bash
docker rmi calc-backend-image calc-frontend-image
```

---

## 5.3 Полная очистка Docker

**⚠️ ВНИМАНИЕ!** Удалит ВСЕ неиспользуемые ресурсы Docker.

```bash
docker system prune -a --volumes -f
```

---

# ЧАСТЬ 6: СХЕМА АРХИТЕКТУРЫ

---

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ВАШ КОМПЬЮТЕР                                  │
│                                                                             │
│   ┌─────────────────┐                                                       │
│   │    Браузер      │                                                       │
│   │  (Chrome, etc)  │                                                       │
│   └────────┬────────┘                                                       │
│            │                                                                │
│            │ http://localhost:3001                                          │
│            ▼                                                                │
│   ┌────────────────────────────────────────────────────────────────────┐   │
│   │                        DOCKER ENGINE                                │   │
│   │                                                                     │   │
│   │   ┌─────────────────────── calc-network ─────────────────────────┐  │   │
│   │   │                                                               │  │   │
│   │   │   ┌───────────────────────┐     ┌───────────────────────┐    │  │   │
│   │   │   │      FRONTEND         │     │       BACKEND         │    │  │   │
│   │   │   │                       │     │                       │    │  │   │
│   │   │   │  ┌─────────────────┐  │     │  ┌─────────────────┐  │    │  │   │
│   │   │   │  │     nginx       │  │     │  │  Spring Boot    │  │    │  │   │
│   │   │   │  │   (порт 80)     │──┼─────┼─▶│   (порт 8080)   │  │    │  │   │
│   │   │   │  └─────────────────┘  │     │  └─────────────────┘  │    │  │   │
│   │   │   │           │           │     │                       │    │  │   │
│   │   │   │  ┌────────▼────────┐  │     │  Endpoints:           │    │  │   │
│   │   │   │  │  React файлы   │  │     │  - POST /api/calc     │    │  │   │
│   │   │   │  │  (HTML/JS/CSS)  │  │     │  - GET /api/health    │    │  │   │
│   │   │   │  └─────────────────┘  │     │                       │    │  │   │
│   │   │   │                       │     │                       │    │  │   │
│   │   │   │  nginx config:        │     │                       │    │  │   │
│   │   │   │  location / → React   │     │                       │    │  │   │
│   │   │   │  location /api/       │     │                       │    │  │   │
│   │   │   │    → backend:8080     │     │                       │    │  │   │
│   │   │   │                       │     │                       │    │  │   │
│   │   │   └───────────────────────┘     └───────────────────────┘    │  │   │
│   │   │            ▲                              ▲                   │  │   │
│   │   │            │                              │                   │  │   │
│   │   │       IP: 172.19.0.3                 IP: 172.19.0.2           │  │   │
│   │   │                                                               │  │   │
│   │   └───────────────────────────────────────────────────────────────┘  │   │
│   │                                                                      │   │
│   │   Проброс портов:                                                    │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │  localhost:3001  ──────────────────────▶  frontend:80       │   │   │
│   │   │  localhost:8080  ──────────────────────▶  backend:8080      │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │                                                                      │   │
│   └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# ЧАСТЬ 7: ЧЕК-ЛИСТ

---

## ✅ Перед началом работы

- [ ] Cursor IDE установлен
- [ ] Docker Desktop установлен и запущен (иконка кита в меню)
- [ ] Git установлен (`git --version` работает)

## ✅ Клонирование проекта

- [ ] Проект склонирован из GitHub
- [ ] Проект открыт в Cursor IDE
- [ ] Видно файловое дерево с папками backend, frontend, tests

## ✅ Сборка образов

- [ ] Backend образ собран (`docker images | grep backend`)
- [ ] Frontend образ собран (`docker images | grep frontend`)

## ✅ Запуск контейнеров

- [ ] Сеть создана (`docker network ls | grep calc`)
- [ ] Backend запущен (`docker ps | grep backend`)
- [ ] Frontend запущен (`docker ps | grep frontend`)
- [ ] Health check работает (`curl localhost:8080/api/health`)

## ✅ Проверка приложения

- [ ] http://localhost:3001 открывается в браузере
- [ ] Калькулятор выполняет вычисления
- [ ] Деление на ноль показывает ошибку

---

**🎉 Поздравляем! Вы полностью развернули Docker-приложение!**
