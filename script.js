window.addEventListener("load", function () {
  document.querySelector("#to_option").addEventListener("click", function () {
    window.open(chrome.runtime.getURL("options.html"));
  });

  displayAttachStyleList();
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

async function displayAttachStyleList() {
  const storageData = await chrome.storage.local.get("attachStyleList");
  const attachStyleList = await filterAttachStyleList(storageData.attachStyleList);

  insertAttachStyleDisables(attachStyleList);
}

function insertAttachStyleDisables(attachStyleList) {
  const template = document.querySelector(".attach-list ul li.template");

  attachStyleList.forEach((row) => {
    const listItem = template.cloneNode(true);
    listItem.classList.add("row", "row-" + row.id);
    listItem.classList.remove("template");

    const checkbox = listItem.querySelector('input[type="checkbox"]');
    checkbox.checked = !row.disable;
    checkbox.addEventListener("click", () => {
      changeDisabeled(row);
    });

    const urlView = listItem.querySelector(".url-pattern");
    urlView.innerText = row.url;

    const cssView = listItem.querySelector(".css");
    cssView.innerText = row.css;

    document.querySelector(".attach-list ul").appendChild(listItem);
  });
}

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

async function changeDisabeled(row) {
	const storageData = await chrome.storage.local.get("attachStyleList");
  const newAttachStyleList = [];
  storageData.attachStyleList.forEach((obj) => {
    if (obj.id === row.id) {
      obj.disable = !row.disable;
			console.log("obj.disable = row.disable;")
    }
    newAttachStyleList.push(obj);
  });
	// なぜか一回目の切り替え時しかcontent側に反映されないため修正予定
  try {
    await setStorage({ attachStyleList: newAttachStyleList });
		chrome.storage.local.get(null, function(items) {
			console.log(items);
	});
    // content.jsへのアクション
    const currentTab = await getCurrentTab();
    chrome.tabs.sendMessage(currentTab.id, {
      type: "CONTENT",
      action: "UPDATE_ATTACH_STYLE",
    });
  } catch (error) {
    console.error("Error while updating storage or sending message:", error);
  }
}
