// ウィンドウが読み込まれたときのイベントリスナーを設定
window.addEventListener("load", async function () {
  attachStyle();
});

// Chrome拡張機能のメッセージリスナーを追加
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "UPDATE_ATTACH_STYLE") {
    updateAttachStyle(false);
  }
  if (message.action === "ALL_STYLE_ACTIVATE_SWITCH") {
    updateAttachStyle(true);
  }
});

// スタイルを適用する
async function attachStyle() {
  const storageData = await getStorageData();

  const filteredAttachStyleList = await filterAttachStyleList(storageData.attachStyleList);
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
  styleElement.type = "text/css";
  styleElement.id = "css_attach_extension";
  styleElement.textContent = stringStyle;
  headerElement.appendChild(styleElement);
}

// 適用するスタイルを更新する
function updateAttachStyle(switchFlag) {
  const cssElement = document.querySelector("#css_attach_extension");
  if(cssElement) {
    cssElement.remove();
    if(switchFlag) {
      return;
    }
  }
  attachStyle();
}
