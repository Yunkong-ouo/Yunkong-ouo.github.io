const display = document.getElementById("calculatorDisplay");

const expressionDisplay = document.getElementById("calculatorExpression");

let expression = "";

let lastExpression = "";

let justCalculated = false;

/* =========================================
   顯示
========================================= */

function updateDisplay() {
  expressionDisplay.textContent = expression || lastExpression || "";
}

/* =========================================
   數字
========================================= */

function inputNumber(number) {
  if (justCalculated) {
    expression = "";

    lastExpression = "";

    justCalculated = false;

    display.textContent = "0";
  }

  if (display.textContent === "0") {
    display.textContent = number;
  } else {
    display.textContent += number;
  }
}

/* =========================================
   小數
========================================= */

function inputDecimal() {
  if (justCalculated) {
    expression = "";

    lastExpression = "";

    justCalculated = false;

    display.textContent = "0";
  }

  if (display.textContent.includes(".")) {
    return;
  }

  display.textContent += ".";
}

/* =========================================
   運算子
========================================= */

function inputOperator(operator) {
  if (justCalculated) {
    expression = display.textContent;

    lastExpression = "";

    justCalculated = false;
  } else {
    if (display.textContent !== "0" || expression === "") {
      expression += display.textContent;
    }
  }

  if (/[+\-*/]$/.test(expression)) {
    expression = expression.slice(0, -1);
  }

  expression += operator;

  display.textContent = "0";

  updateDisplay();
}

/* =========================================
   百分比
========================================= */

function inputPercent() {
  const value = Number(display.textContent);

  if (Number.isNaN(value)) {
    return;
  }

  display.textContent = String(value / 100);
}

/* =========================================
   括號
========================================= */

function inputParentheses() {
  const current = display.textContent;

  let fullExpression = expression;

  if (current !== "0") {
    fullExpression += current;
  }

  const open = (fullExpression.match(/\(/g) || []).length;

  const close = (fullExpression.match(/\)/g) || []).length;

  const last = fullExpression.slice(-1);

  /* 空白 */

  if (!fullExpression) {
    expression += "(";

    display.textContent = "0";

    updateDisplay();

    return;
  }

  /* 右括號 */

  if (open > close && /[\d)]/.test(last)) {
    if (current !== "0") {
      expression += current;
    }

    expression += ")";

    display.textContent = "0";

    updateDisplay();

    return;
  }

  /* 數字後自動乘 */

  if (/[\d)]/.test(last)) {
    if (current !== "0") {
      expression += current;
    }

    expression += "*(";
  } else {
    expression += "(";
  }

  display.textContent = "0";

  updateDisplay();
}

/* =========================================
   Backspace
========================================= */

function backspace() {
  if (justCalculated) {
    expression = "";

    lastExpression = "";

    justCalculated = false;

    display.textContent = "0";

    updateDisplay();

    return;
  }

  const current = display.textContent;

  if (current !== "0" && current.length > 1) {
    display.textContent = current.slice(0, -1);

    return;
  }

  if (current !== "0") {
    display.textContent = "0";

    return;
  }

  if (expression.length) {
    expression = expression.slice(0, -1);

    updateDisplay();
  }
}

/* =========================================
   AC
========================================= */

function clearCalculator() {
  expression = "";

  lastExpression = "";

  justCalculated = false;

  display.textContent = "0";

  updateDisplay();
}

/* =========================================
   計算
========================================= */

function calculate() {
  let finalExpression = expression;

  const current = display.textContent;

  if (current !== "0" || finalExpression === "") {
    finalExpression += current;
  }

  if (!finalExpression) {
    return;
  }

  /* 自動補齊括號 */

  const open = (finalExpression.match(/\(/g) || []).length;

  const close = (finalExpression.match(/\)/g) || []).length;

  if (open > close) {
    finalExpression += ")".repeat(open - close);
  }

  /* 安全檢查 */

  if (!/^[0-9+\-*/().\s]+$/.test(finalExpression)) {
    showError();

    return;
  }

  try {
    const result = Function(`"use strict"; return (${finalExpression})`)();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      throw new Error("Invalid result");
    }

    const formatted = Number(result.toPrecision(12)).toString();

    lastExpression = finalExpression + " =";

    display.textContent = formatted;

    expression = "";

    justCalculated = true;

    updateDisplay();
  } catch (error) {
    showError();
  }
}

/* =========================================
   Error
========================================= */

function showError() {
  display.textContent = "錯誤";

  expression = "";

  lastExpression = "";

  justCalculated = true;

  updateDisplay();
}

/* =========================================
   Buttons
========================================= */

document.querySelectorAll(".calc-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    const value = button.dataset.value;

    if (action === "clear") {
      clearCalculator();

      return;
    }

    if (action === "backspace") {
      backspace();

      return;
    }

    if (action === "equals") {
      calculate();

      return;
    }

    if (action === "percent") {
      inputPercent();

      return;
    }

    if (action === "parentheses") {
      inputParentheses();

      return;
    }

    if (value === ".") {
      inputDecimal();

      return;
    }

    if (/^[0-9]$/.test(value)) {
      inputNumber(value);

      return;
    }

    if (/^[+\-*/]$/.test(value)) {
      inputOperator(value);
    }
  });
});

/* =========================================
   Keyboard
========================================= */

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) {
    event.preventDefault();

    inputNumber(event.key);

    return;
  }

  if (event.key === ".") {
    event.preventDefault();

    inputDecimal();

    return;
  }

  if (["+", "-", "*", "/"].includes(event.key)) {
    event.preventDefault();

    inputOperator(event.key);

    return;
  }

  if (event.key === "(" || event.key === ")") {
    event.preventDefault();

    inputParentheses();

    return;
  }

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();

    calculate();

    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();

    backspace();

    return;
  }

  if (event.key === "%") {
    event.preventDefault();

    inputPercent();
  }
});
