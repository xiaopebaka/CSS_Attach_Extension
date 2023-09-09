window.addEventListener("load", async function () {
  // テストデータ作成　ストレージ保存
  const sampleList = [
    {
      id: "53552fd5-008c-443b-b1fc-c23b6e3eb2e8",
      url: "https://github.com/*",
      css: "body{filter: blur(1px);}",
      disable: true
    },
    {
      id: "4478d40c-037a-496b-9c28-37c105b4b395",
      url: "https://qiita.com/*",
      css: "body{filter: contrast(0.5);}",
      disable: true
    },
    {
      id: "df4814c0-b61a-4f53-ad7c-e51852c707ad",
      url: "https://qiita.com/official-events*",
      css: ".mainWrapper{font-weight: bold;}",
      disable: true
    },
  ];
  await setStorage({ attachStyleList: sampleList });

  // スタイル当て込み
  attachStyle();
});

function setStorage(data) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve();
      }
    });
  });
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CONTENT") {
    if(message.action === "UPDATE_ATTACH_STYLE") {
      updateAttachStyle();
    }
  }
})

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
  const storageData = await chrome.storage.local.get("attachStyleList");
  
  const filteredAttachStyleList = filterAttachStyleList(storageData.attachStyleList);
  let stringStyle = "";
  filteredAttachStyleList.forEach(function (row) {
    if(!row.disable) {
      stringStyle += row.css;
    }
  });
  insertCSS(stringStyle);
}

function insertCSS(stringStyle) {
  const headerElement = document.querySelector("head");
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.id = "css_attach_extension"
  styleElement.textContent = stringStyle;
  headerElement.appendChild(styleElement);
}

function updateAttachStyle() {
  document.querySelector("#css_attach_extension").remove();
  attachStyle();
}
