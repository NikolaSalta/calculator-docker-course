/*
 * ═══════════════════════════════════════════════════════════════════════════
 * setupTests.js — Настройка тестового окружения
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Что делает этот файл?
 * Этот файл автоматически выполняется ПЕРЕД каждым тестом.
 * react-scripts ищет его по умолчанию в src/setupTests.js.
 *
 * Зачем нужен @testing-library/jest-dom?
 * Добавляет удобные матчеры (проверки) для работы с DOM:
 * - toBeInTheDocument() — элемент есть в DOM
 * - toBeDisabled() — элемент отключён
 * - toHaveValue() — элемент имеет значение
 * - toBeVisible() — элемент видим
 * - toHaveTextContent() — элемент содержит текст
 *
 * Без этого пришлось бы писать:
 *   expect(element).not.toBeNull()
 *   expect(element.disabled).toBe(true)
 *
 * С jest-dom:
 *   expect(element).toBeInTheDocument()
 *   expect(element).toBeDisabled()
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Подключаем расширенные матчеры для DOM
import '@testing-library/jest-dom';

