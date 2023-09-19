window.addEventListener("load", function () {
  document.querySelector("#to_option").addEventListener("click", function () {
    window.open(chrome.runtime.getURL("html/options.html"));
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
    checkbox.addEventListener("click", (e) => {
      changeDisabeled(row, e.target.checked);
    });

    const urlView = listItem.querySelector(".url-pattern");
    urlView.innerText = row.url;

    const cssToggleButton = listItem.querySelector(".css-view .css-toggle");
    cssToggleButton.addEventListener("click", (e) => {
      cssTextElement = e.target.parentElement.querySelector(".css-text");
      if (cssTextElement.classList.contains('open')) {
        cssTextElement.classList.remove('open');
      } else {
        cssTextElement.classList.add('open');
      }
    })
    const cssView = listItem.querySelector(".css-view .css-text");
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

async function changeDisabeled(row, disable) {
	const storageData = await chrome.storage.local.get("attachStyleList");
  const newAttachStyleList = [];
  storageData.attachStyleList.forEach((obj) => {
    if (obj.id === row.id) {
      obj.disable = !disable;
    }
    newAttachStyleList.push(obj);
  });
  
  try {
    await setStorage({ attachStyleList: newAttachStyleList });
		chrome.storage.local.get(null, function(items) {
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
