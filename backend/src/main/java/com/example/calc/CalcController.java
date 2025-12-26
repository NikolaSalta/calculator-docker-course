/*
 * ═══════════════════════════════════════════════════════════════════════════
 * CalcController.java — REST API контроллер калькулятора
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Что такое REST API?
 * REST (Representational State Transfer) — стиль архитектуры API.
 * Основные принципы:
 * - Клиент-сервер: клиент отправляет запрос, сервер отвечает
 * - Stateless: сервер не хранит состояние между запросами
 * - Единообразный интерфейс: стандартные HTTP-методы (GET, POST, PUT, DELETE)
 *
 * Что такое контроллер?
 * Контроллер — это класс, который обрабатывает HTTP-запросы.
 * Каждый метод контроллера соответствует определённому URL (эндпоинту).
 * ═══════════════════════════════════════════════════════════════════════════
 */

package com.example.calc;

// Импорты Spring Web
import org.springframework.web.bind.annotation.*;
// Логирование
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Map — структура данных "ключ-значение" (как словарь)
import java.util.Map;

/*
 * @RestController — аннотация, объединяющая:
 * 
 * 1. @Controller — этот класс обрабатывает HTTP-запросы
 * 
 * 2. @ResponseBody — возвращаемое значение методов автоматически
 *    преобразуется в JSON и отправляется клиенту
 */
@RestController
@RequestMapping("/api")

/*
 * @CrossOrigin — настройка CORS (Cross-Origin Resource Sharing)
 * 
 * БЕЗОПАСНОСТЬ: Используем конфигурируемый список origins из application.properties
 * вместо "*" (все домены). В продакшене укажите конкретные домены.
 * 
 * ${cors.allowed-origins:http://localhost:3000} означает:
 * - Взять значение из property cors.allowed-origins
 * - Если не найдено, использовать http://localhost:3000 по умолчанию
 */
@CrossOrigin(origins = "${cors.allowed-origins:http://localhost:3000}")
public class CalcController {
    
    /*
     * Logger — для записи логов
     * 
     * Уровни логирования:
     * - TRACE: самый детальный
     * - DEBUG: для отладки
     * - INFO: информационные сообщения
     * - WARN: предупреждения
     * - ERROR: ошибки
     */
    private static final Logger logger = LoggerFactory.getLogger(CalcController.class);
    
    /*
     * ═══════════════════════════════════════════════════════════════════════
     * POST /api/calc — выполнить вычисление
     * ═══════════════════════════════════════════════════════════════════════
     */
    @PostMapping("/calc")
    public Map<String, Object> calculate(@RequestBody Map<String, Object> request) {
        
        logger.debug("Получен запрос: {}", request);
        
        // ═══════════════════════════════════════════════════════════════════
        // ВАЛИДАЦИЯ ВХОДНЫХ ДАННЫХ
        // ═══════════════════════════════════════════════════════════════════
        
        /*
         * Проверяем наличие обязательных полей
         * Без этой проверки request.get("a") вернёт null
         * и вызовет NullPointerException
         */
        if (!request.containsKey("a") || !request.containsKey("b") || !request.containsKey("op")) {
            logger.warn("Отсутствуют обязательные поля в запросе: {}", request);
            throw new IllegalArgumentException("Missing required fields: a, b, op");
        }
        
        Object aObj = request.get("a");
        Object bObj = request.get("b");
        Object opObj = request.get("op");
        
        /*
         * Проверяем типы данных
         * Клиент может отправить строку "abc" вместо числа
         */
        if (!(aObj instanceof Number)) {
            logger.warn("Поле 'a' не является числом: {}", aObj);
            throw new IllegalArgumentException("Field 'a' must be a number");
        }
        if (!(bObj instanceof Number)) {
            logger.warn("Поле 'b' не является числом: {}", bObj);
            throw new IllegalArgumentException("Field 'b' must be a number");
        }
        if (!(opObj instanceof String)) {
            logger.warn("Поле 'op' не является строкой: {}", opObj);
            throw new IllegalArgumentException("Field 'op' must be a string");
        }
        
        // ═══════════════════════════════════════════════════════════════════
        // ИЗВЛЕЧЕНИЕ И ВЫЧИСЛЕНИЕ
        // ═══════════════════════════════════════════════════════════════════
        
        double a = ((Number) aObj).doubleValue();
        double b = ((Number) bObj).doubleValue();
        String op = (String) opObj;
        
        logger.info("Вычисление: {} {} {}", a, op, b);
        
        /*
         * Вычисляем результат с улучшенной обработкой ошибок
         */
        double result = switch (op) {
            case "+" -> a + b;
            case "-" -> a - b;
            case "*" -> a * b;
            case "/" -> {
                /*
                 * ИСПРАВЛЕНИЕ: Деление на ноль теперь бросает исключение
                 * вместо возврата NaN. Это позволяет клиенту получить
                 * понятное сообщение об ошибке.
                 */
                if (b == 0) {
                    logger.warn("Попытка деления на ноль: {} / {}", a, b);
                    throw new IllegalArgumentException("Division by zero");
                }
                yield a / b;
            }
            default -> {
                logger.warn("Неизвестная операция: {}", op);
                throw new IllegalArgumentException("Unknown operation: " + op);
            }
        };
        
        logger.info("Результат: {} {} {} = {}", a, op, b, result);
        
        return Map.of(
            "result", result,
            "operation", a + " " + op + " " + b
        );
    }
    
    /*
     * ═══════════════════════════════════════════════════════════════════════
     * GET /api/health — проверка здоровья сервиса
     * ═══════════════════════════════════════════════════════════════════════
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
            "status", "OK",
            "service", "calc-backend"
        );
    }
}
