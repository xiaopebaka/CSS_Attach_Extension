window.addEventListener("load", function () {
  // テストデータ作成　ストレージ保存
  const sampleList = [
    {
      url: "https://github.com/*",
      css: "body{display: flex;}",
    },
    {
      url: "https://qiita.com/*",
      css: "body{display: block;}",
    },
  ];
  chrome.storage.local.set({ attachStyleList: sampleList });

  // スタイル当て込み
  attachStyle();
});

function getAttachStyleList(callback) {
  return new Promise((resolve) => {
    chrome.storage.local.get(["attachStyleList"], function (value) {
      const attachStyleList = filterAttachStyleList(value.attachStyleList);
      resolve(attachStyleList);
    });
  });
}

function filterAttachStyleList(attachStyleList) {
  // 現在のURLを取得
  const currentURL = window.location.href;

  // 一致するパターンを格納する配列
  const matchingPatterns = [];

  attachStyleList.forEach(attachStyle => {
    const regexPattern = new RegExp(attachStyle.url);
    if (regexPattern.test(currentURL)) {
        matchingPatterns.push(attachStyle);
    }
  });
  return matchingPatterns;
}

async function attachStyle() {
  // chrome.storageが非同期の関係でとりあえず動くようにコードを書いてある
  // 後で分かりやすく修正
  getAttachStyleList().then((attachStyleList) => {
    let stringStyle = "";
    attachStyleList.forEach(function (row) {
      stringStyle += row.css;
    });
    insertCSS(stringStyle);
  });
}

function insertCSS(stringStyle) {
  const headerElement = document.querySelector("head");
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.textContent = stringStyle;
  headerElement.appendChild(styleElement);
}
