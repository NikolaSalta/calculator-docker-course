/*
 * ═══════════════════════════════════════════════════════════════════════════
 * CalcApplication.java — Точка входа Spring Boot приложения
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Что такое Spring Boot?
 * Spring Boot — это фреймворк для создания Java-приложений.
 * Он упрощает настройку и запуск, делая многое "из коробки":
 * - Встроенный веб-сервер (Tomcat)
 * - Автоматическая конфигурация
 * - Управление зависимостями
 *
 * Этот файл — минимальная точка входа. Spring Boot автоматически:
 * - Сканирует пакет com.example.calc на наличие компонентов
 * - Находит CalcController и регистрирует его эндпоинты
 * - Запускает встроенный Tomcat на порту 8080
 * ═══════════════════════════════════════════════════════════════════════════
 */

// package — объявление пакета (как папка для классов)
// Все классы в com.example.calc логически связаны
package com.example.calc;

// Импорты — подключаем классы из Spring Boot
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*
 * @SpringBootApplication — "магическая" аннотация Spring Boot
 * 
 * Она объединяет три аннотации:
 * 
 * 1. @Configuration — этот класс содержит конфигурацию Spring
 * 
 * 2. @EnableAutoConfiguration — включить автоконфигурацию
 *    Spring Boot автоматически настроит приложение на основе
 *    зависимостей в classpath. Есть spring-boot-starter-web?
 *    Значит настроим веб-сервер!
 * 
 * 3. @ComponentScan — сканировать пакет на наличие компонентов
 *    Spring найдёт все классы с @Controller, @Service, @Repository
 *    и зарегистрирует их как "бины" (управляемые объекты)
 */
@SpringBootApplication
public class CalcApplication {
    
    /*
     * main — точка входа в Java-программу
     * 
     * Когда выполняется: java -jar app.jar
     * JVM ищет метод: public static void main(String[] args)
     * И вызывает его.
     * 
     * Параметры:
     *   args — аргументы командной строки (если есть)
     */
    public static void main(String[] args) {
        /*
         * SpringApplication.run() — запускает Spring Boot приложение
         * 
         * Что происходит внутри:
         * 1. Создаётся ApplicationContext (контейнер Spring)
         * 2. Сканируются классы с аннотациями
         * 3. Создаются и настраиваются бины
         * 4. Запускается встроенный Tomcat
         * 5. Приложение готово принимать HTTP-запросы
         * 
         * Параметры:
         *   CalcApplication.class — класс с @SpringBootApplication
         *   args — аргументы командной строки
         */
        SpringApplication.run(CalcApplication.class, args);
    }
}
