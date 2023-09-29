// ストレージから取得する
async function getStorageData() {
  return await chrome.storage.local.get("attachStyleList");
}

// ストレージに保存する
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

// 現在のURLパスに一致するスタイルのみ抽出する
async function filterAttachStyleList(attachStyleList) {
  const currentTab = await getCurrentTab();
  const matchingPatterns = [];

  if (!attachStyleList) return;
  
  attachStyleList.forEach((attachStyle) => {
    const regexPattern = new RegExp(attachStyle.url);
    if (regexPattern.test(currentTab.url)) {
      matchingPatterns.push(attachStyle);
    }
  });
  return matchingPatterns;
}

// 現在のアクティブなタブを取得する
async function getCurrentTab() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "GET_CURRENT_TAB" }, (response) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
    });
  });
}

// UUIDを生成する
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
