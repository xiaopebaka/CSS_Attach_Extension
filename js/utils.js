// ストレージから取得する
async function getStorageData() {
  return await chrome.storage.local.get("attachStyleList");
}

// ストレージに保存する
async function setStorage(data) {
  try {
    await chrome.storage.local.set(data);
  } catch (error) {
    throw new Error(error);
  }
}

// 現在のURLパスに一致するスタイルのみ抽出する
async function filterAttachStyleList(attachStyleList) {
  if (!attachStyleList) return;

  const currentTab = await getCurrentTab();
  const matchingPatterns = [];

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
  try {
    return await chrome.runtime.sendMessage({ action: "GET_CURRENT_TAB" });
  } catch (error) {
    throw new Error(error);
  }
}

// UUIDを生成する
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
