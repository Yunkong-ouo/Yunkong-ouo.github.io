document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      document.title = data.title;
      document.getElementById("pageTitle").textContent = data.title;
      document.getElementById("topBar").textContent = data.title + " 總覽";
      const navContainer = document.getElementById("navContainer");
      const pagesContainer = document.getElementById("pagesContainer");
      data.nav.forEach((navItem, index) => {
        const button = document.createElement("button");
        button.className = "nav-item" + (index === 0 ? " active" : "");
        button.setAttribute("data-tab", navItem.dataTab);
        button.textContent = navItem.name;
        navContainer.appendChild(button);
      });
      data.nav.forEach((navItem, index) => {
        const category = navItem.name;
        const pageId = navItem.dataTab;
        const contentDiv = document.createElement("div");
        contentDiv.className = "content" + (index === 0 ? " active" : "");
        contentDiv.id = pageId;
        const h2 = document.createElement("h2");
        h2.textContent = category;
        contentDiv.appendChild(h2);
        if (Array.isArray(data.pages[category])) {
          const searchInput = document.createElement("input");
          searchInput.id = "search" + pageId;
          searchInput.className = "search-box";
          searchInput.type = "text";
          searchInput.placeholder = "🔍 搜尋模組...";
          contentDiv.appendChild(searchInput);
          const table = document.createElement("table");
          const thead = document.createElement("thead");
          const headerRow = document.createElement("tr");
          ["名稱", "官網", "下載", "版本"].forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);
          const tbody = document.createElement("tbody");
          data.pages[category].forEach(item => {
            const tr = document.createElement("tr");
            const tdName = document.createElement("td");
            tdName.textContent = item["名稱"];
            const tdWebsite = document.createElement("td");
            const aWebsite = document.createElement("a");
            aWebsite.href = item["官網"];
            aWebsite.target = "_blank";
            aWebsite.textContent = "官網";
            tdWebsite.appendChild(aWebsite);
            const tdDownload = document.createElement("td");
            const aDownload = document.createElement("a");
            aDownload.href = item["下載"];
            aDownload.target = "_blank";
            aDownload.textContent = "下載";
            tdDownload.appendChild(aDownload);
            const tdVersion = document.createElement("td");
            tdVersion.textContent = item["版本"];
            tr.appendChild(tdName);
            tr.appendChild(tdWebsite);
            tr.appendChild(tdDownload);
            tr.appendChild(tdVersion);
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);
          contentDiv.appendChild(table);
          searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();
            const rows = tbody.querySelectorAll("tr");
            rows.forEach(row => {
              const modName = row.querySelector("td:first-child").textContent.toLowerCase();
              row.style.display = modName.includes(query) ? "" : "none";
            });
          });
        } else if (typeof data.pages[category] === "object") {
          const container = document.createElement("div");
          const aWebsite = document.createElement("a");
          aWebsite.href = data.pages[category]["官網"];
          aWebsite.target = "_blank";
          aWebsite.textContent = "🔗 " + category + " 官網";
          container.appendChild(aWebsite);
          const p = document.createElement("p");
          p.textContent = data.pages[category]["描述"];
          container.appendChild(p);
          contentDiv.appendChild(container);
        }
        pagesContainer.appendChild(contentDiv);
      });
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
    })
    .catch(error => {
      console.error("Error loading JSON data:", error);
    });
});
