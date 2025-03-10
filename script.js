document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".content");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const targetId = item.getAttribute("data-tab");
      pages.forEach(page => page.classList.remove("active"));
      document.getElementById(targetId).classList.add("active");
    });
  });

  const searchInputs = document.querySelectorAll(".search-box");
  searchInputs.forEach(searchBox => {
    searchBox.addEventListener("input", () => {
      const query = searchBox.value.toLowerCase();
      const currentPage = searchBox.closest(".content");
      const rows = currentPage.querySelectorAll("table tr:not(:first-child)");
      rows.forEach(row => {
        const modName = row.querySelector("td:first-child").textContent.toLowerCase();
        row.style.display = modName.includes(query) ? "" : "none";
      });
    });
  });
});
