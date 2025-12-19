"""
═══════════════════════════════════════════════════════════════════════════════
test_ui_selenium.py — UI-тесты с Selenium
═══════════════════════════════════════════════════════════════════════════════

Что такое Selenium?
───────────────────────────────────────────
Selenium — это инструмент для автоматизации браузера.
Он позволяет программно управлять настоящим браузером:
- Открывать страницы
- Кликать кнопки
- Заполнять формы
- Проверять содержимое страницы

Зачем UI-тесты, если есть API-тесты?
───────────────────────────────────────────
API-тесты проверяют backend напрямую.
Но пользователь работает с UI! 

Проблемы, которые найдут только UI-тесты:
- Кнопка не кликабельна (перекрыта другим элементом)
- JavaScript-ошибка не даёт отправить форму
- CSS сломал отображение результата
- Неправильный placeholder
- Элементы не появляются после AJAX-запроса

Как запустить:
───────────────────────────────────────────
# С Selenium Grid (Docker)
docker compose -f docker-compose.selenium.yml up --build --abort-on-container-exit

# Только Selenium-тесты
docker compose -f docker-compose.selenium.yml run tests pytest -m ui_selenium
═══════════════════════════════════════════════════════════════════════════════
"""

# ═══════════════════════════════════════════════════════════════════════════════
# ИМПОРТЫ
# ═══════════════════════════════════════════════════════════════════════════════

import pytest
import re  # Регулярные выражения для извлечения чисел

# Selenium imports
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

# Наши настройки
from test_config import FRONTEND_URL


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE OBJECT — Абстракция над UI
# ═══════════════════════════════════════════════════════════════════════════════

class CalculatorPage:
    """
    Page Object для страницы калькулятора.
    
    Что такое Page Object?
    ─────────────────────────────────────────
    Page Object — это паттерн проектирования для UI-тестов.
    
    Идея: создать класс, который представляет страницу.
    Класс инкапсулирует:
    - Локаторы элементов (как найти кнопку, поле ввода)
    - Методы для действий (ввести число, нажать кнопку)
    
    Зачем это нужно:
    ─────────────────────────────────────────
    БЕЗ Page Object (плохо):
    
        def test_addition():
            driver.find_element(By.CSS_SELECTOR, "input[type='number']").send_keys("10")
            driver.find_element(By.CSS_SELECTOR, "select").click()
            # ... много кода с локаторами ...
        
        def test_multiplication():
            driver.find_element(By.CSS_SELECTOR, "input[type='number']").send_keys("5")
            # ... те же локаторы снова ...
    
    Проблемы:
    - Дублирование локаторов
    - Если UI изменится — нужно менять ВСЕ тесты
    - Тесты трудно читать
    
    С Page Object (хорошо):
    
        def test_addition(browser):
            page = CalculatorPage(browser).open()
            page.enter_numbers(10, 5).select_operation("+").click_calculate()
            assert page.get_result() == 15.0
    
    Преимущества:
    - Локаторы в одном месте
    - Если UI изменится — меняем только Page Object
    - Тесты читаются как спецификация
    
    Method Chaining:
    ─────────────────────────────────────────
    Методы возвращают self, что позволяет цепочки вызовов:
    page.enter_numbers(10, 5).select_operation("+").click_calculate()
    
    Это называется Fluent Interface.
    """
    
    def __init__(self, driver):
        """
        Конструктор Page Object.
        
        Параметры:
        ─────────────────────────────────────────
        driver : WebDriver
            Selenium WebDriver (браузер)
            Передаётся из fixture browser()
        """
        self.driver = driver
        
        # WebDriverWait — умное ожидание
        # В отличие от time.sleep(), которое ждёт ВСЕГДА указанное время,
        # WebDriverWait ждёт пока условие станет истинным (или таймаут).
        self.wait = WebDriverWait(driver, 10)  # Максимум 10 секунд
    
    def open(self):
        """
        Открыть страницу калькулятора в браузере.
        
        Возвращает:
        ─────────────────────────────────────────
        self : CalculatorPage
            Для цепочки вызовов (method chaining)
        """
        # driver.get(url) — открыть URL в браузере
        # Аналог ввода URL в адресную строку
        self.driver.get(FRONTEND_URL)
        
        # Ждём пока кнопка появится на странице
        # Это гарантирует, что React-приложение загрузилось и отрендерилось
        #
        # EC.presence_of_element_located — условие "элемент присутствует в DOM"
        # (By.CSS_SELECTOR, "button") — как искать: CSS-селектор "button"
        self.wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "button"))
        )
        
        return self  # Для цепочки вызовов
    
    def enter_numbers(self, a, b):
        """
        Ввести числа в поля ввода.
        
        Параметры:
        ─────────────────────────────────────────
        a : числовое значение
            Первое число (поле A)
        b : числовое значение
            Второе число (поле B)
        """
        # ─────────────────────────────────────────────────────────────────────
        # ПОИСК ЭЛЕМЕНТОВ
        # ─────────────────────────────────────────────────────────────────────
        #
        # find_elements (множественное число) — найти ВСЕ подходящие элементы
        # Возвращает список (может быть пустым)
        #
        # find_element (единственное число) — найти ОДИН элемент
        # Бросает исключение, если элемент не найден
        #
        # By.CSS_SELECTOR — искать по CSS-селектору
        # "input[type='number']" — все input с type="number"
        # ─────────────────────────────────────────────────────────────────────
        inputs = self.driver.find_elements(
            By.CSS_SELECTOR,
            "input[type='number']"
        )
        
        # ─────────────────────────────────────────────────────────────────────
        # ВЗАИМОДЕЙСТВИЕ С ЭЛЕМЕНТАМИ
        # ─────────────────────────────────────────────────────────────────────
        
        # inputs[0] — первый найденный input (число A)
        # .clear() — очистить поле (удалить предыдущий текст)
        # .send_keys() — "напечатать" текст в поле
        inputs[0].clear()
        inputs[0].send_keys(str(a))  # str() — преобразовать число в строку
        
        # inputs[1] — второй input (число B)
        inputs[1].clear()
        inputs[1].send_keys(str(b))
        
        return self
    
    def select_operation(self, op):
        """
        Выбрать операцию в выпадающем списке.
        
        Параметры:
        ─────────────────────────────────────────
        op : str
            Операция: "+", "-", "*", "/"
        """
        # Находим элемент <select>
        select_element = self.driver.find_element(By.CSS_SELECTOR, "select")
        
        # ─────────────────────────────────────────────────────────────────────
        # Select — специальный класс для работы с <select>
        # ─────────────────────────────────────────────────────────────────────
        #
        # Обычные методы (click, send_keys) не всегда работают с <select>.
        # Selenium предоставляет класс Select для удобной работы:
        #
        # select.select_by_value("value") — выбрать по атрибуту value
        # select.select_by_index(0) — выбрать по индексу (0 = первый)
        # select.select_by_visible_text("Text") — выбрать по видимому тексту
        # ─────────────────────────────────────────────────────────────────────
        select = Select(select_element)
        
        # Выбираем опцию по значению атрибута value
        # <option value="+">+</option> — value="+"
        select.select_by_value(op)
        
        return self
    
    def click_calculate(self):
        """
        Нажать кнопку "Вычислить" и дождаться результата.
        
        Используем explicit wait вместо time.sleep() для надёжности:
        - Ждём пока результат появится или изменится
        - Не тратим время на ожидание, если ответ пришёл быстро
        - Корректно обрабатываем медленные ответы
        """
        # Запоминаем текущий результат (если есть)
        old_result = self._get_result_text()
        
        # Кликаем кнопку
        self.driver.find_element(By.CSS_SELECTOR, "button").click()
        
        # Ждём появления/изменения результата (вместо time.sleep)
        # Условие: текст результата изменился ИЛИ появился новый
        self.wait.until(
            lambda d: self._get_result_text() != old_result
                      or "Результат" in d.page_source
        )
        
        return self
    
    def _get_result_text(self):
        """
        Получить текущий текст результата или пустую строку.
        
        Вспомогательный метод для explicit wait.
        """
        try:
            elements = self.driver.find_elements(
                By.XPATH,
                "//*[contains(text(), 'Результат')]"
            )
            return elements[0].text if elements else ""
        except Exception:
            return ""
    
    def get_result(self):
        """
        Получить результат вычисления со страницы.
        
        Возвращает:
        ─────────────────────────────────────────
        float или None
            Числовой результат или None если не найден
        
        Как работает:
        ─────────────────────────────────────────
        1. Ищем элемент с текстом "Результат"
        2. Извлекаем текст: "Результат: 42"
        3. С помощью регулярного выражения находим число
        4. Преобразуем в float
        """
        try:
            # ─────────────────────────────────────────────────────────────────
            # XPATH — мощный язык поиска элементов
            # ─────────────────────────────────────────────────────────────────
            #
            # //* — любой элемент в документе
            # [contains(text(), 'Результат')] — содержит текст "Результат"
            #
            # XPATH мощнее CSS-селекторов для поиска по тексту
            # ─────────────────────────────────────────────────────────────────
            elements = self.driver.find_elements(
                By.XPATH,
                "//*[contains(text(), 'Результат')]"
            )
            
            if elements:
                # Получаем текст элемента: "Результат: 42"
                text = elements[0].text
                
                # ─────────────────────────────────────────────────────────────
                # РЕГУЛЯРНОЕ ВЫРАЖЕНИЕ для извлечения числа
                # ─────────────────────────────────────────────────────────────
                #
                # text.split(':')[-1] — берём часть после ":"
                # "Результат: 42" → " 42"
                #
                # re.search(pattern, string) — найти первое совпадение
                #
                # Паттерн: r'[-+]?\d*\.?\d+'
                # [-+]?  — опциональный знак (- или +)
                # \d*    — ноль или более цифр
                # \.?    — опциональная точка
                # \d+    — одна или более цифр
                #
                # Примеры совпадений: "42", "-3.14", "+100", "0.5"
                # ─────────────────────────────────────────────────────────────
                match = re.search(r'[-+]?\d*\.?\d+', text.split(':')[-1])
                
                if match:
                    # match.group() — найденная строка
                    # float() — преобразовать в число
                    return float(match.group())
                    
        except Exception:
            # Если что-то пошло не так — возвращаем None
            pass
        
        return None


# ═══════════════════════════════════════════════════════════════════════════════
# UI TESTS
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.mark.ui_selenium  # Маркер для фильтрации: pytest -m ui_selenium
class TestCalculatorUI:
    """
    UI-тесты калькулятора через Selenium.
    
    Каждый тест получает свежий браузер через fixture "browser".
    Fixture определена в conftest.py и применяется автоматически.
    """
    
    def test_page_loads(self, browser):
        """
        Страница калькулятора загружается.
        
        Что проверяем:
        ─────────────────────────────────────────
        1. Страница открывается без ошибок
        2. Заголовок "Калькулятор" присутствует
        
        Параметры:
        ─────────────────────────────────────────
        browser : WebDriver
            Selenium WebDriver из fixture
            pytest автоматически вызывает fixture и передаёт результат
        """
        # Создаём Page Object и открываем страницу
        page = CalculatorPage(browser).open()
        
        # browser.page_source — весь HTML-код страницы
        # Проверяем что заголовок есть (на русском или английском)
        assert "Калькулятор" in browser.page_source or "Calculator" in browser.page_source
    
    def test_addition(self, browser):
        """
        Сложение через UI: 25 + 17 = 42.
        
        Это полный end-to-end тест:
        1. Открываем страницу
        2. Вводим числа
        3. Выбираем операцию
        4. Кликаем кнопку
        5. Проверяем результат
        """
        page = CalculatorPage(browser).open()
        
        # Method chaining — цепочка вызовов
        # Каждый метод возвращает self, что позволяет:
        page.enter_numbers(25, 17).select_operation("+").click_calculate()
        
        # Проверяем результат
        assert page.get_result() == 42.0
    
    def test_multiplication(self, browser):
        """
        Умножение через UI: 7 × 8 = 56.
        """
        page = CalculatorPage(browser).open()
        page.enter_numbers(7, 8).select_operation("*").click_calculate()
        assert page.get_result() == 56.0
    
    def test_subtraction(self, browser):
        """
        Вычитание через UI: 100 - 37 = 63.
        """
        page = CalculatorPage(browser).open()
        page.enter_numbers(100, 37).select_operation("-").click_calculate()
        assert page.get_result() == 63.0
    
    def test_division(self, browser):
        """
        Деление через UI: 144 ÷ 12 = 12.
        """
        page = CalculatorPage(browser).open()
        page.enter_numbers(144, 12).select_operation("/").click_calculate()
        assert page.get_result() == 12.0
    
    def test_decimal_numbers(self, browser):
        """
        Работа с десятичными числами: 3.5 + 2.5 = 6.0
        """
        page = CalculatorPage(browser).open()
        page.enter_numbers(3.5, 2.5).select_operation("+").click_calculate()
        
        # pytest.approx для сравнения float
        assert page.get_result() == pytest.approx(6.0, rel=0.01)
    
    def test_negative_numbers(self, browser):
        """
        Работа с отрицательными числами: -10 + 5 = -5
        """
        page = CalculatorPage(browser).open()
        page.enter_numbers(-10, 5).select_operation("+").click_calculate()
        assert page.get_result() == -5.0
    
    def test_sequential_calculations(self, browser):
        """
        Несколько вычислений подряд.
        
        Проверяем что калькулятор корректно работает
        при многократном использовании без перезагрузки страницы.
        """
        page = CalculatorPage(browser).open()
        
        # Первое вычисление
        page.enter_numbers(10, 5).select_operation("+").click_calculate()
        assert page.get_result() == 15.0
        
        # Второе вычисление (без перезагрузки страницы)
        page.enter_numbers(20, 4).select_operation("*").click_calculate()
        assert page.get_result() == 80.0
        
        # Третье вычисление
        page.enter_numbers(100, 25).select_operation("/").click_calculate()
        assert page.get_result() == 4.0
