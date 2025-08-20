// 點擊波紋效果 + 主題切換 + 使用次數記錄（localStorage）

// 小小的按下波紋
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener(
    "click",
    (e) => {
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);

      // 計數使用次數
      try {
        const title =
          card.querySelector("h2")?.textContent?.trim() || card.href;
        const key = "nav-count::" + title;
        const n = Number(localStorage.getItem(key) || 0) + 1;
        localStorage.setItem(key, String(n));
      } catch (_) {}
    },
    { passive: true }
  );
});

// 主題切換：在 <html> 加 .light
const btn = document.querySelector(".theme-toggle");
btn?.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
});

// 以鍵盤也可操作（可及性）
document.querySelectorAll(".card").forEach((card) => {
  card.setAttribute("role", "link");
  card.setAttribute("tabindex", "0");
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });
});

// 動態注入 ripple 樣式（避免混雜到主 CSS）
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
.card { position: relative; overflow: hidden; }
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple .5s ease-out forwards;
  background: rgba(255,255,255,.35);
  pointer-events: none;
  mix-blend-mode: overlay;
}
@keyframes ripple { to { transform: scale(1); opacity: 0; } }
`;
document.head.appendChild(rippleStyle);
