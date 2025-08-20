// 設定可選的標籤
const tags = ["b", "i", "color", "size"];

// 生成富文本
async function generate(e) {
  e.preventDefault();  // 防止表單的默認提交行為

  // 獲取表單中的數據
  const data = new FormData(document.querySelector("#form"));
  // 獲取所有被勾選的標籤
  const tags = data.getAll("tag");
  // 獲取字體顏色、字體大小及文本輸入框的值
  const { colorValue, sizeValue, text } = Object.fromEntries(data.entries());

  let result = text;  // 預設的文本為輸入框中的文本

  // 遍歷所有選中的標籤
  for (const tag of tags) {
    let openTag = `<${tag}`;  // 開始標籤
    if (tag === "color") {
      // 如果選擇了字體顏色，則添加顏色屬性
      openTag += `=${colorValue}>`;
    } else if (tag === "size") {
      // 如果選擇了字體大小，則添加大小屬性
      openTag += `=${sizeValue}>`;
    } else {
      // 其他標籤（如粗體、斜體），不帶屬性
      openTag += ">";
    }
    const closeTag = `</${tag}>`;  // 關閉標籤
    result = `${openTag}${result}${closeTag}`;  // 將標籤包裹到文本周圍
  }

  // 找到輸出區域
  const output = document.querySelector("#output");
  output.value = result;  // 顯示生成的富文本

  // 複製生成的文本到剪貼簿
  if (navigator.clipboard) {
    // 現代瀏覽器支持 Clipboard API
    await navigator.clipboard.writeText(result);
  } else {
    // 舊版瀏覽器使用選擇和複製命令
    output.select();
    document.execCommand("copy");
  }

  // 顯示輸出區域，將其從隱藏狀態切換為可見
  document.querySelector("#outputContainer").removeAttribute("data-hidden");
}

// 當表單提交時觸發生成函數
document.querySelector("#form").addEventListener("submit", generate);
