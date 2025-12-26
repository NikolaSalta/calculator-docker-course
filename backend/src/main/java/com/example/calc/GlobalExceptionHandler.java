/*
 * ═══════════════════════════════════════════════════════════════════════════
 * GlobalExceptionHandler.java — Централизованная обработка ошибок
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Что такое @RestControllerAdvice?
 * Это комбинация @ControllerAdvice и @ResponseBody.
 * Позволяет перехватывать исключения из ВСЕХ контроллеров
 * и возвращать единообразные JSON-ответы об ошибках.
 *
 * Зачем это нужно?
 * - Единый формат ошибок для всего API
 * - Клиенту проще обрабатывать ошибки
 * - Логирование ошибок в одном месте
 * - Сокрытие деталей реализации от клиента (безопасность)
 * ═══════════════════════════════════════════════════════════════════════════
 */

package com.example.calc;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    /*
     * ═══════════════════════════════════════════════════════════════════════
     * Обработка IllegalArgumentException
     * ═══════════════════════════════════════════════════════════════════════
     * 
     * Возвращает HTTP 400 Bad Request
     * Используется для ошибок валидации входных данных
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException e) {
        logger.warn("Bad Request: {}", e.getMessage());
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                "error", "Bad Request",
                "message", e.getMessage()
            ));
    }
    
    /*
     * ═══════════════════════════════════════════════════════════════════════
     * Обработка всех остальных исключений
     * ═══════════════════════════════════════════════════════════════════════
     * 
     * Возвращает HTTP 500 Internal Server Error
     * ВАЖНО: Не раскрываем детали ошибки клиенту (безопасность)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericError(Exception e) {
        logger.error("Internal Server Error", e);
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of(
                "error", "Internal Server Error",
                "message", "An unexpected error occurred"
            ));
    }
}

