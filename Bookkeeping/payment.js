const STORAGE_KEY = "dailyPaymentRecords";

const paymentTitle = document.getElementById("paymentTitle");

const paymentSubtitle = document.getElementById("paymentSubtitle");

const detailCount = document.getElementById("detailCount");

const detailAmount = document.getElementById("detailAmount");

const recordAmount = document.getElementById("recordAmount");

const addRecordButton = document.getElementById("addRecord");

const recordsTableBody = document.getElementById("recordsTableBody");

const recordsTableWrapper = document.getElementById("recordsTableWrapper");

const emptyRecords = document.getElementById("emptyRecords");

const recordsDescription = document.getElementById("recordsDescription");

/* =========================================
   支付類型
========================================= */

const paymentTypes = {
  bank: {
    title: "銀行卡支付",
    subtitle: "銀行卡支付記帳明細",
  },

  electronic: {
    title: "電子支付",
    subtitle: "電子支付記帳明細",
  },
};

const params = new URLSearchParams(window.location.search);

let currentType = params.get("type");

if (currentType !== "bank" && currentType !== "electronic") {
  currentType = "bank";
}

/* =========================================
   顯示名稱
========================================= */

const currentPayment = paymentTypes[currentType];

paymentTitle.textContent = currentPayment.title;

paymentSubtitle.textContent = currentPayment.subtitle;

document.title = currentPayment.title;

/* =========================================
   金額
========================================= */

function formatMoney(value) {
  return (
    "$" +
    Number(value || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })
  );
}

/* =========================================
   Storage
========================================= */

function getAllRecords() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    return {
      bank: Array.isArray(data.bank) ? data.bank : [],

      electronic: Array.isArray(data.electronic) ? data.electronic : [],
    };
  } catch (error) {
    return {
      bank: [],
      electronic: [],
    };
  }
}

function saveAllRecords(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* =========================================
   序號
========================================= */

function getNextSequence(records) {
  if (!records.length) {
    return 1;
  }

  let max = 0;

  records.forEach((record) => {
    const number = Number(record.sequence) || 0;

    if (number > max) {
      max = number;
    }
  });

  return max + 1;
}

function formatSequence(number) {
  return String(number).padStart(3, "0");
}

/* =========================================
   日期時間
========================================= */

function getDateTime() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const hour = String(now.getHours()).padStart(2, "0");

  const minute = String(now.getMinutes()).padStart(2, "0");

  const second = String(now.getSeconds()).padStart(2, "0");

  return {
    date: `${year}/${month}/${day}`,

    time: `${hour}:${minute}:${second}`,
  };
}

/* =========================================
   新增
========================================= */

function addRecord() {
  const amount = Number(recordAmount.value);

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("請輸入有效的金額。");

    recordAmount.focus();

    return;
  }

  const allRecords = getAllRecords();

  const records = allRecords[currentType];

  const dateTime = getDateTime();

  const record = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,

    sequence: getNextSequence(records),

    date: dateTime.date,

    time: dateTime.time,

    amount: amount,
  };

  records.push(record);

  allRecords[currentType] = records;

  saveAllRecords(allRecords);

  recordAmount.value = "";

  render();
}

/* =========================================
   刪除
========================================= */

function deleteRecord(id) {
  const confirmDelete = confirm("確定要刪除這筆支付紀錄嗎？");

  if (!confirmDelete) {
    return;
  }

  const allRecords = getAllRecords();

  allRecords[currentType] = allRecords[currentType].filter(
    (record) => record.id !== id,
  );

  saveAllRecords(allRecords);

  render();
}

/* =========================================
   HTML 安全
========================================= */

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* =========================================
   Render
========================================= */

function render() {
  const allRecords = getAllRecords();

  const records = allRecords[currentType];

  recordsTableBody.innerHTML = "";

  if (!records.length) {
    recordsTableWrapper.style.display = "none";

    emptyRecords.style.display = "flex";

    recordsDescription.textContent = "共 0 筆紀錄";

    detailCount.textContent = "0";

    detailAmount.textContent = "$0";

    return;
  }

  recordsTableWrapper.style.display = "block";

  emptyRecords.style.display = "none";

  recordsDescription.textContent = `共 ${records.length} 筆紀錄`;

  let total = 0;

  const sorted = [...records].sort(
    (a, b) => Number(b.sequence) - Number(a.sequence),
  );

  sorted.forEach((record) => {
    total += Number(record.amount) || 0;

    const row = document.createElement("tr");

    row.innerHTML = `

            <td>
                ${escapeHTML(record.date)}
            </td>

            <td>
                ${escapeHTML(record.time)}
            </td>

            <td>
                <span class="record-number">
                    ${formatSequence(record.sequence)}
                </span>
            </td>

            <td>
                <span class="record-money">
                    ${formatMoney(record.amount)}
                </span>
            </td>

            <td>

                <button
                    class="delete-record-btn"
                    data-id="${escapeHTML(record.id)}"
                >
                    刪除
                </button>

            </td>

        `;

    recordsTableBody.appendChild(row);
  });

  detailCount.textContent = records.length.toLocaleString("en-US");

  detailAmount.textContent = formatMoney(total);
}

/* =========================================
   Events
========================================= */

addRecordButton.addEventListener("click", addRecord);

recordAmount.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    addRecord();
  }
});

recordsTableBody.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-record-btn");

  if (!button) {
    return;
  }

  deleteRecord(button.dataset.id);
});

/* =========================================
   Init
========================================= */

render();
