// 當網頁載入完成時
document.addEventListener('DOMContentLoaded', () => {
    
    const title = document.getElementById('mainTitle');
    
    // 滑鼠移到標題時的小互動
    title.addEventListener('mouseover', () => {
        title.style.transition = '0.3s';
        title.style.letterSpacing = '10px';
    });

    title.addEventListener('mouseout', () => {
        title.style.letterSpacing = 'normal';
    });

    // 點擊格子時觸發一個平滑的淡出效果
    const cards = document.querySelectorAll('.nav-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // 如果你想要在跳轉前做點什麼，可以寫在這裡
            console.log('正在跳轉至：' + card.href);
        });
    });
});