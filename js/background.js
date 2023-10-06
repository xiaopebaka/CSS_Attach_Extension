// Chrome拡張機能のメッセージリスナーを追加
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

// 現在のアクティブなタブを取得する
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

// ショートカットコマンドにリスナーを追加
chrome.commands.onCommand.addListener(async function(command) {
  if (command === "ALL_STYLE_ACTIVATE_SWITCH") {
    try {
      const currentTab = await getCurrentTab();
       // 現在のタブにメッセージを送信して、コンテンツスクリプトを更新
      chrome.tabs.sendMessage(currentTab.id, {
        action: "ALL_STYLE_ACTIVATE_SWITCH"
      });
    } catch (error) {
      console.error("メッセージの送信に失敗しました。", error);
    }
  }
});
