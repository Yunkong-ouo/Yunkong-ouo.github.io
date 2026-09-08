document.addEventListener("DOMContentLoaded", function () {
  updateDate();

  updateDashboard();

  const clearAllBtn = document.getElementById("clearAllBtn");

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", clearAllData);
  }
});

/* =========================================
   日期
========================================= */

function updateDate() {
  const element = document.getElementById("currentDate");

  if (!element) return;

  const now = new Date();

  element.textContent = now.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

/* =========================================
   首頁統計
========================================= */

function updateDashboard() {
  /* -------------------------------------
       現金
    ------------------------------------- */

  const cashData = JSON.parse(localStorage.getItem("dailyCashData")) || {};

  const denominations = [1, 5, 10, 50, 100, 500, 1000];

  let cashTotal = 0;

  let cashCount = 0;

  denominations.forEach(function (value) {
    const quantity = Number(cashData[value] || 0);

    cashTotal += value * quantity;

    cashCount += quantity;
  });

  const cashTotalElement = document.getElementById("cashTotal");

  const cashCountElement = document.getElementById("cashCount");

  if (cashTotalElement) {
    cashTotalElement.textContent = formatMoney(cashTotal);
  }

  if (cashCountElement) {
    cashCountElement.textContent = cashCount.toLocaleString("zh-TW");
  }

  /* -------------------------------------
       支付
    ------------------------------------- */

  const paymentData = JSON.parse(
    localStorage.getItem("dailyPaymentRecords"),
  ) || {
    bank: [],
    electronic: [],
  };

  const bankRecords = Array.isArray(paymentData.bank) ? paymentData.bank : [];

  const electronicRecords = Array.isArray(paymentData.electronic)
    ? paymentData.electronic
    : [];

  updatePaymentSummary(bankRecords, "bankCount", "bankTotal");

  updatePaymentSummary(electronicRecords, "electronicCount", "electronicTotal");
}

/* =========================================
   支付統計
========================================= */

function updatePaymentSummary(records, countId, totalId) {
  const countElement = document.getElementById(countId);

  const totalElement = document.getElementById(totalId);

  let total = 0;

  records.forEach(function (record) {
    total += Number(record.amount || 0);
  });

  if (countElement) {
    countElement.textContent = records.length.toLocaleString("zh-TW");
  }

  if (totalElement) {
    totalElement.textContent = formatMoney(total);
  }
}

/* =========================================
   金額格式
========================================= */

function formatMoney(value) {
  return (
    "$" +
    Number(value || 0).toLocaleString("zh-TW", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
}

/* =========================================
   清空所有數據
========================================= */

function clearAllData() {
  const confirmed = confirm(
    "確定要清空所有數據嗎？\n\n" +
      "將會清除：\n" +
      "・所有現金統計\n" +
      "・所有銀行卡支付紀錄\n" +
      "・所有電子支付紀錄\n\n" +
      "此操作無法復原。",
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem("dailyCashData");

  localStorage.removeItem("dailyPaymentRecords");

  alert("所有數據已清空。");

  updateDashboard();
}
