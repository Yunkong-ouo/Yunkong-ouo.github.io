document.addEventListener("DOMContentLoaded", function () {
  const mainTabs = document.querySelectorAll(".main-tab");
  const mainContents = document.querySelectorAll(".main-content");
  const subTabs = document.querySelectorAll(".sub-tab");
  const subContents = document.querySelectorAll(".tab-content");

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
});
