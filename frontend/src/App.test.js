/*
 * ═══════════════════════════════════════════════════════════════════════════
 * App.test.js — Unit-тесты компонента калькулятора
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Что такое unit-тест?
 * Unit-тест проверяет ОДИН компонент изолированно от других.
 * Мы тестируем React-компонент App, мокая (подменяя) fetch-запросы.
 *
 * Используемые библиотеки:
 * ───────────────────────────────────────────
 * @testing-library/react — рендеринг React-компонентов в тестах
 *   - render() — отрендерить компонент
 *   - screen — доступ к отрендеренным элементам
 *   - waitFor() — ждать асинхронных изменений
 *
 * @testing-library/user-event — симуляция действий пользователя
 *   - userEvent.type() — ввод текста
 *   - userEvent.click() — клик мышью
 *   - userEvent.selectOptions() — выбор в select
 *
 * jest — тестовый фреймворк (встроен в react-scripts)
 *   - describe() — группировка тестов
 *   - test() — отдельный тест
 *   - expect() — проверка условия
 *   - jest.fn() — создание mock-функции
 *
 * Как запустить тесты:
 * ───────────────────────────────────────────
 *   npm test          # Watch mode (интерактивно)
 *   npm run test:ci   # CI mode (один раз, с coverage)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// ИМПОРТЫ
// ─────────────────────────────────────────────────────────────────────────────

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';


// ─────────────────────────────────────────────────────────────────────────────
// SETUP & TEARDOWN
// ─────────────────────────────────────────────────────────────────────────────

/*
 * beforeEach — выполняется ПЕРЕД каждым тестом
 *
 * Мокаем (подменяем) глобальную функцию fetch.
 * Это изолирует тесты от реального backend:
 * - Тесты не зависят от сети
 * - Тесты выполняются быстро
 * - Можно симулировать разные ответы сервера
 */
beforeEach(() => {
  global.fetch = jest.fn();
});

/*
 * afterEach — выполняется ПОСЛЕ каждого теста
 *
 * Сбрасываем все моки, чтобы тесты не влияли друг на друга.
 */
afterEach(() => {
  jest.resetAllMocks();
});


// ─────────────────────────────────────────────────────────────────────────────
// ТЕСТЫ
// ─────────────────────────────────────────────────────────────────────────────

/*
 * describe — группа связанных тестов
 *
 * Помогает организовать тесты и видеть структуру в отчётах:
 *   Calculator App
 *     ✓ рендерит заголовок калькулятора
 *     ✓ рендерит два поля ввода
 *     ...
 */
describe('Calculator App', () => {

  // ═══════════════════════════════════════════════════════════════════════════
  // ТЕСТЫ РЕНДЕРИНГА — проверяем что элементы отображаются
  // ═══════════════════════════════════════════════════════════════════════════

  test('рендерит заголовок калькулятора', () => {
    /*
     * render(<App />) — рендерит компонент в виртуальный DOM
     *
     * После этого можно искать элементы через screen:
     * - screen.getByText() — найти по тексту (бросает ошибку если не найден)
     * - screen.queryByText() — найти по тексту (возвращает null если не найден)
     * - screen.findByText() — асинхронный поиск (возвращает Promise)
     */
    render(<App />);
    
    /*
     * screen.getByText(/калькулятор/i)
     *
     * /калькулятор/i — регулярное выражение
     * i — флаг case-insensitive (регистронезависимый)
     *
     * Найдёт: "Калькулятор", "калькулятор", "КАЛЬКУЛЯТОР"
     */
    expect(screen.getByText(/калькулятор/i)).toBeInTheDocument();
  });

  test('рендерит два поля ввода чисел', () => {
    render(<App />);
    
    /*
     * screen.getAllByRole('spinbutton')
     *
     * Роль 'spinbutton' соответствует <input type="number">
     * getAllByRole возвращает массив ВСЕХ найденных элементов
     *
     * Роли (roles) — это семантические описания элементов:
     * - 'button' → <button>
     * - 'textbox' → <input type="text">
     * - 'spinbutton' → <input type="number">
     * - 'combobox' → <select>
     * - 'heading' → <h1>, <h2>, ...
     */
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);
  });

  test('рендерит выпадающий список операций', () => {
    render(<App />);
    
    // 'combobox' — роль для <select>
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('рендерит кнопку "Вычислить"', () => {
    render(<App />);
    
    // Ищем кнопку по тексту (name)
    expect(screen.getByRole('button', { name: /вычислить/i })).toBeInTheDocument();
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // ТЕСТЫ СОСТОЯНИЯ КНОПКИ
  // ═══════════════════════════════════════════════════════════════════════════

  test('кнопка отключена при пустых полях', () => {
    render(<App />);
    
    const button = screen.getByRole('button', { name: /вычислить/i });
    
    /*
     * toBeDisabled() — матчер из @testing-library/jest-dom
     * Проверяет что элемент имеет атрибут disabled
     */
    expect(button).toBeDisabled();
  });

  test('кнопка активна при заполненных полях', async () => {
    /*
     * userEvent.setup() — создаёт экземпляр для симуляции пользователя
     *
     * Рекомендуется создавать в начале теста.
     * userEvent более реалистично симулирует действия пользователя,
     * чем устаревший fireEvent.
     */
    const user = userEvent.setup();
    render(<App />);
    
    const inputs = screen.getAllByRole('spinbutton');
    
    /*
     * user.type(element, text) — симуляция ввода текста
     *
     * Это асинхронная операция (пользователь вводит по одному символу).
     * Нужно использовать await.
     */
    await user.type(inputs[0], '10');
    await user.type(inputs[1], '5');
    
    const button = screen.getByRole('button', { name: /вычислить/i });
    expect(button).toBeEnabled();
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // ТЕСТЫ ОТПРАВКИ ЗАПРОСА
  // ═══════════════════════════════════════════════════════════════════════════

  test('отправляет правильный запрос при сложении', async () => {
    /*
     * Настраиваем мок fetch для возврата успешного ответа
     *
     * mockResolvedValueOnce — вернуть значение один раз
     * (следующий вызов fetch вернёт undefined, если не настроить)
     * 
     * ВАЖНО: ok: true необходим для проверки response.ok в App.js
     */
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: 15.0, operation: '10.0 + 5.0' })
    });

    const user = userEvent.setup();
    render(<App />);
    
    const inputs = screen.getAllByRole('spinbutton');
    await user.type(inputs[0], '10');
    await user.type(inputs[1], '5');
    
    const button = screen.getByRole('button', { name: /вычислить/i });
    await user.click(button);
    
    /*
     * Проверяем что fetch вызван с правильными параметрами
     *
     * toHaveBeenCalledWith(url, options) — проверка аргументов
     */
    expect(global.fetch).toHaveBeenCalledWith('/api/calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a: 10, b: 5, op: '+' })
    });
  });

  test('отправляет правильный запрос при умножении', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: 50.0, operation: '10.0 * 5.0' })
    });

    const user = userEvent.setup();
    render(<App />);
    
    const inputs = screen.getAllByRole('spinbutton');
    await user.type(inputs[0], '10');
    await user.type(inputs[1], '5');
    
    // Выбираем операцию умножения в select
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '*');
    
    await user.click(screen.getByRole('button', { name: /вычислить/i }));
    
    /*
     * expect.objectContaining() — частичное совпадение объекта
     * Проверяем только body, игнорируя остальные свойства
     */
    expect(global.fetch).toHaveBeenCalledWith('/api/calc',
      expect.objectContaining({
        body: JSON.stringify({ a: 10, b: 5, op: '*' })
      })
    );
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // ТЕСТЫ ОТОБРАЖЕНИЯ РЕЗУЛЬТАТА
  // ═══════════════════════════════════════════════════════════════════════════

  test('показывает результат после успешного вычисления', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: 42.0, operation: '35.0 + 7.0' })
    });

    const user = userEvent.setup();
    render(<App />);
    
    const inputs = screen.getAllByRole('spinbutton');
    await user.type(inputs[0], '35');
    await user.type(inputs[1], '7');
    
    await user.click(screen.getByRole('button', { name: /вычислить/i }));
    
    /*
     * waitFor() — ждать пока условие станет истинным
     *
     * Нужен для асинхронных обновлений UI.
     * React может обновить DOM не сразу после изменения состояния.
     *
     * waitFor повторяет проверку каждые 50ms (по умолчанию)
     * до успеха или таймаута (1000ms по умолчанию).
     */
    await waitFor(() => {
      expect(screen.getByText(/42/)).toBeInTheDocument();
    });
  });

  test('показывает ошибку при сбое сети', async () => {
    /*
     * mockRejectedValueOnce — симуляция ошибки
     * fetch бросит исключение, как при реальном сбое сети
     */
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const user = userEvent.setup();
    render(<App />);
    
    const inputs = screen.getAllByRole('spinbutton');
    await user.type(inputs[0], '10');
    await user.type(inputs[1], '5');
    
    await user.click(screen.getByRole('button', { name: /вычислить/i }));
    
    // Ждём появления сообщения об ошибке
    await waitFor(() => {
      expect(screen.getByText(/ошибка/i)).toBeInTheDocument();
    });
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // ТЕСТЫ ИНДИКАТОРА ЗАГРУЗКИ
  // ═══════════════════════════════════════════════════════════════════════════

  test('показывает "Вычисляю..." во время загрузки', async () => {
    /*
     * Создаём "зависающий" Promise
     * Он никогда не разрешится, что позволяет проверить состояние loading
     */
    let resolvePromise;
    global.fetch.mockReturnValueOnce(new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    const user = userEvent.setup();
    render(<App />);
    
    const inputs = screen.getAllByRole('spinbutton');
    await user.type(inputs[0], '10');
    await user.type(inputs[1], '5');
    
    await user.click(screen.getByRole('button', { name: /вычислить/i }));
    
    // Пока запрос "в полёте", должен показываться текст "Вычисляю..."
    expect(screen.getByText(/вычисляю/i)).toBeInTheDocument();
    
    // Разрешаем Promise чтобы тест не завис
    resolvePromise({
      json: () => Promise.resolve({ result: 15.0 })
    });
  });


  // ═══════════════════════════════════════════════════════════════════════════
  // ТЕСТЫ ГРАНИЧНЫХ СЛУЧАЕВ
  // ═══════════════════════════════════════════════════════════════════════════

  test('работает с отрицательными числами', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: -5.0, operation: '-10.0 + 5.0' })
    });

    const user = userEvent.setup();
    render(<App />);
    
    const inputs = screen.getAllByRole('spinbutton');
    await user.type(inputs[0], '-10');
    await user.type(inputs[1], '5');
    
    await user.click(screen.getByRole('button', { name: /вычислить/i }));
    
    expect(global.fetch).toHaveBeenCalledWith('/api/calc',
      expect.objectContaining({
        body: JSON.stringify({ a: -10, b: 5, op: '+' })
      })
    );
  });

  test('работает с десятичными числами', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: 6.0, operation: '3.5 + 2.5' })
    });

    const user = userEvent.setup();
    render(<App />);
    
    const inputs = screen.getAllByRole('spinbutton');
    await user.type(inputs[0], '3.5');
    await user.type(inputs[1], '2.5');
    
    await user.click(screen.getByRole('button', { name: /вычислить/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/6/)).toBeInTheDocument();
    });
  });
});

