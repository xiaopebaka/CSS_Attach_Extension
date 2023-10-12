// ウィンドウが読み込まれたときのイベントリスナーを設定
window.addEventListener("load", attachStyle);

// TODO 問題3：[ ポップアップの有効/無効切り替えで表示中ページのCSS制御しよう ]
// ・Chrome拡張機能のメッセージリスナーを追加
// ・メッセージ受信後updateAttachStyle関数呼び出し


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
