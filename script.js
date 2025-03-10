document.addEventListener("DOMContentLoaded", function () {
  const mainTabs = document.querySelectorAll(".main-tab");
  const mainContents = document.querySelectorAll(".main-content");
  const subTabs = document.querySelectorAll(".sub-tab");
  const subContents = document.querySelectorAll(".tab-content");
  const searchInput = document.getElementById("modSearch");

  // 主選單切換
  mainTabs.forEach(button => {
      button.addEventListener("click", function () {
          const tabId = this.getAttribute("data-tab");

          mainTabs.forEach(btn => btn.classList.remove("active"));
          mainContents.forEach(content => content.classList.remove("active"));

          document.getElementById(tabId).classList.add("active");
          this.classList.add("active");

          // 預設開啟該分類內的第一個子選單
          const firstSubTab = document.querySelector(`#${tabId} .sub-tab`);
          if (firstSubTab) {
              firstSubTab.click();
          }
      });
  });

  // 子選單切換
  subTabs.forEach(button => {
      button.addEventListener("click", function () {
          const tabId = this.getAttribute("data-tab");
          const parent = this.closest(".main-content");

          parent.querySelectorAll(".sub-tab").forEach(btn => btn.classList.remove("active"));
          parent.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

          document.getElementById(tabId).classList.add("active");
          this.classList.add("active");
      });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchText = searchInput.value.toLowerCase();
      const tables = document.querySelectorAll(".tab-content table");

      tables.forEach(table => {
        const rows = table.querySelectorAll("tr");

        rows.forEach((row, index) => {
          if (index === 0) return; // 跳过表头

          const modName = row.querySelector("td:first-child").textContent.toLowerCase();

          if (modName.includes(searchText)) {
            row.style.display = ""; // 显示匹配的行
          } else {
            row.style.display = "none"; // 隐藏不匹配的行
          }
        });
      });
    });
  }
});
