const STORAGE_KEY = "dailyCashData";

const denominations = [1, 5, 10, 50, 100, 500, 1000];

const totalAmount = document.getElementById("totalAmount");

const totalCount = document.getElementById("totalCount");

const cashTotal = document.getElementById("cashTotal");

const cashCount = document.getElementById("cashCount");

function formatMoney(value) {
  return (
    "$" +
    Number(value || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })
  );
}

function getData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function saveData() {
  const data = {};

  denominations.forEach((value) => {
    const input = document.getElementById(`qty-${value}`);

    data[value] = Math.max(0, Number(input.value) || 0);
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function updateCash() {
  let amount = 0;

  let count = 0;

  denominations.forEach((value) => {
    const input = document.getElementById(`qty-${value}`);

    const quantity = Math.max(0, Number(input.value) || 0);

    const subtotal = value * quantity;

    const subtotalElement = document.getElementById(`subtotal-${value}`);

    subtotalElement.textContent = formatMoney(subtotal);

    amount += subtotal;

    count += quantity;
  });

  totalAmount.textContent = formatMoney(amount);

  totalCount.textContent = count.toLocaleString("en-US");

  cashTotal.textContent = formatMoney(amount);

  cashCount.textContent = count.toLocaleString("en-US");

  saveData();
}

function loadData() {
  const data = getData();

  denominations.forEach((value) => {
    const input = document.getElementById(`qty-${value}`);

    if (Object.prototype.hasOwnProperty.call(data, value)) {
      input.value = data[value];
    } else {
      input.value = "";
    }
  });

  updateCash();
}

denominations.forEach((value) => {
  const input = document.getElementById(`qty-${value}`);

  input.addEventListener("input", updateCash);
});

loadData();
