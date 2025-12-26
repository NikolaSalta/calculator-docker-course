#!/bin/bash
# Скрипт запуска VNC и браузера

export DISPLAY=:1

# Запускаем VNC сервер
Xvnc :1 -geometry 1920x1080 -depth 24 -SecurityTypes VncAuth -passwd /home/vncuser/.vnc/passwd &
sleep 2

# Запускаем XFCE
export DISPLAY=:1
startxfce4 &
sleep 5

# Открываем браузер с приложением
chromium --no-sandbox --disable-dev-shm-usage --start-maximized http://localhost:80 &

# Запускаем noVNC
cd /opt/novnc/utils && ./websockify --web=/opt/novnc 6080 localhost:5901

