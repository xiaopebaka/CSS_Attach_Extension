// ウィンドウが読み込まれたときのイベントリスナーを設定
window.addEventListener("load", attachStyle);

// Chrome拡張機能のメッセージリスナーを追加
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "UPDATE_ATTACH_STYLE") {
    updateAttachStyle();
  }
});                                     /** 候補 */

// スタイルを適用する
async function attachStyle() {
  const storageData = await getStorageData();

  const filteredAttachStyleList = await filterAttachStyleList(storageData.attachStyleList);
  if (!filteredAttachStyleList) return;
  let stringStyle = "";
  filteredAttachStyleList.forEach(function (row) {
    if (row.isEnable) {
      stringStyle += row.css;
    }
  });
  insertCSS(stringStyle);
}

// 表示中のページにCSSを挿入する
function insertCSS(stringStyle) {
  const headerElement = document.querySelector("head");
  const styleElement = document.createElement("style");
  styleElement.id = "css_attach_extension";
  styleElement.textContent = stringStyle;
  headerElement.appendChild(styleElement);
}

// 適用するスタイルを更新する
function updateAttachStyle() {
  document.querySelector("#css_attach_extension").remove();
  attachStyle();
}
