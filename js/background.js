chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_CURRENT_TAB") {
    getCurrentTab()
      .then((tab) => {
        sendResponse(tab);
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });
    return true;
  }
});

async function getCurrentTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve(tabs[0]);
      }
    });
  });
}
