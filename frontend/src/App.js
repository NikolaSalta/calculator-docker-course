/*
 * ═══════════════════════════════════════════════════════════════════════════
 * App.js — Главный компонент калькулятора
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';

function App() {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // СОСТОЯНИЕ (STATE)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState('+');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // ФУНКЦИЯ ВЫЧИСЛЕНИЯ (с улучшенной обработкой ошибок)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const calculate = async () => {
    
    // ─────────────────────────────────────────────────────────────────────────
    // ВАЛИДАЦИЯ НА КЛИЕНТЕ
    // ─────────────────────────────────────────────────────────────────────────
    
    /*
     * ИСПРАВЛЕНИЕ: Валидируем ввод ПЕРЕД отправкой на сервер
     * parseFloat("abc") возвращает NaN
     * isNaN() проверяет, является ли значение NaN
     */
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    
    if (isNaN(numA) || isNaN(numB)) {
      setError('Введите корректные числа');
      setResult(null);  // ИСПРАВЛЕНИЕ: Очищаем результат при ошибке
      return;
    }
    
    // ─────────────────────────────────────────────────────────────────────────
    // ПОДГОТОВКА К ЗАПРОСУ
    // ─────────────────────────────────────────────────────────────────────────
    
    setLoading(true);
    setError(null);
    setResult(null);  // ИСПРАВЛЕНИЕ: Очищаем предыдущий результат
    
    // ─────────────────────────────────────────────────────────────────────────
    // ОТПРАВКА HTTP-ЗАПРОСА
    // ─────────────────────────────────────────────────────────────────────────
    
    try {
      const response = await fetch('/api/calc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          a: numA,  // Используем уже проверенные числа
          b: numB,
          op: op
        })
      });
      
      /*
       * ИСПРАВЛЕНИЕ: Проверяем response.ok
       * 
       * response.ok === true только если статус 200-299
       * Если сервер вернул ошибку (400, 500), нужно её обработать
       */
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Используем сообщение от сервера или статус
        const errorMessage = errorData.message || `Ошибка сервера: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      /*
       * ИСПРАВЛЕНИЕ: Проверяем наличие результата
       */
      if (data.result === undefined) {
        throw new Error('Некорректный ответ от сервера');
      }
      
      setResult(data.result);
      
    } catch (err) {
      /*
       * ИСПРАВЛЕНИЕ: Более информативные сообщения об ошибках
       */
      if (err.message.includes('Division by zero')) {
        setError('Ошибка: деление на ноль');
      } else if (err.message.includes('fetch')) {
        setError('Ошибка соединения с сервером');
      } else {
        setError(err.message || 'Произошла ошибка');
      }
      
      console.error('Calculation error:', err);
      
    } finally {
      /*
       * ИСПРАВЛЕНИЕ: setLoading(false) в finally
       * Гарантированно выполнится и при успехе, и при ошибке
       */
      setLoading(false);
    }
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // СТИЛИ (CSS-in-JS)
  // ═══════════════════════════════════════════════════════════════════════════
  
  const styles = {
    container: {
      maxWidth: '520px',
      margin: '50px auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '20px'
    },
    badge: {
      display: 'inline-block',
      backgroundColor: '#0db7ed',
      color: 'white',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      marginLeft: '10px'
    },
    inputRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px',
      alignItems: 'center'
    },
    input: {
      flex: 1,
      minWidth: 0,
      padding: '10px',
      fontSize: '18px',
      border: '1px solid #ddd',
      borderRadius: '5px'
    },
    select: {
      padding: '10px',
      fontSize: '18px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: 'white',
      width: '90px',
      flexShrink: 0
    },
    button: {
      width: '100%',
      padding: '12px',
      fontSize: '18px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    result: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#e8f5e9',
      borderRadius: '5px',
      textAlign: 'center',
      fontSize: '24px'
    },
    error: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#ffebee',
      borderRadius: '5px',
      textAlign: 'center',
      color: '#c62828'
    }
  };

  // Вычисляем, должна ли кнопка быть отключена
  const isButtonDisabled = loading || !a || !b;

  // ═══════════════════════════════════════════════════════════════════════════
  // РЕНДЕР (JSX)
  // ═══════════════════════════════════════════════════════════════════════════
  
  return (
    <div style={styles.container}>
      
      {/* ЗАГОЛОВОК */}
      <h1 style={styles.title}>
        Калькулятор
        <span style={styles.badge}>Docker</span>
      </h1>
      
      {/* СТРОКА ВВОДА */}
      <div style={styles.inputRow}>
        
        {/* Поле ввода A */}
        <input
          style={styles.input}
          type="number"
          step="any"  /* ИСПРАВЛЕНИЕ: Позволяет вводить дробные числа */
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Число A"
        />
        
        {/* Выбор операции */}
        <select
          style={styles.select}
          value={op}
          onChange={(e) => setOp(e.target.value)}
        >
          <option value="+">+</option>
          <option value="-">−</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
        
        {/* Поле ввода B */}
        <input
          style={styles.input}
          type="number"
          step="any"  /* ИСПРАВЛЕНИЕ: Позволяет вводить дробные числа */
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Число B"
        />
      </div>
      
      {/* КНОПКА ВЫЧИСЛЕНИЯ */}
      <button
        style={{
          ...styles.button,
          ...(isButtonDisabled ? styles.buttonDisabled : {})
        }}
        onClick={calculate}
        disabled={isButtonDisabled}
      >
        {loading ? 'Вычисляю...' : 'Вычислить'}
      </button>
      
      {/* РЕЗУЛЬТАТ - показываем только если нет ошибки */}
      {result !== null && !error && (
        <div style={styles.result}>
          Результат: <strong>{result}</strong>
        </div>
      )}
      
      {/* ОШИБКА */}
      {error && (
        <div style={styles.error}>{error}</div>
      )}
    </div>
  );
}

export default App;
