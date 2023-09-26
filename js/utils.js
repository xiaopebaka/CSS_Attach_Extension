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

async function filterAttachStyleList(attachStyleList) {
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
