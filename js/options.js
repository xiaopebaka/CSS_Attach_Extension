let attachStyleListInStorage;

window.addEventListener("load", async function () {
  await chrome.storage.local.get(["attachStyleList"], function (result) {
    attachStyleListInStorage = filterAttachStyleList(result.attachStyleList);
    loadAttachStyleList(attachStyleListInStorage);
  });
});

document.querySelector("#add-button").addEventListener("click", function () {
  console.log("add button clicked");
  addAttachStyle();
});

document.querySelector("#save-button").addEventListener("click", function () {
  saveAttachStyle();
});

class AttachStyle {
  constructor() {
    this.id = generateUUID();
    this.url = null;
    this.css = null;
    this.isEnable = true;
  }
}

function addAttachStyle() {
  const attachStyleListElement = document.querySelector("#attach-style-list");
  const listItem = createListItemElement(null);
  attachStyleListElement.prepend(listItem);
}

async function saveAttachStyle() {
  const listItems = document.querySelectorAll("#attach-style-list li");
  let newAttachStyleList = [];

  listItems.forEach((list) => {
    const enableCheck = list.querySelector(".enable").checked;
    const urlText = list.querySelector(".url-input").value.trim();
    const cssText = list.querySelector(".css-textarea").value.trim();
    if (!urlText || !cssText) {
      return;
    }
    const newAttachStyle = new AttachStyle();
    newAttachStyle.url = urlText;
    newAttachStyle.css = cssText;
    newAttachStyle.isEnable = enableCheck;
    if (!newAttachStyle.id) {
      newAttachStyle.id = generateUUID();
    }
    newAttachStyleList.push(newAttachStyle);
  });

  try {
    await setStorage({ attachStyleList: newAttachStyleList });
    window.alert("保存に成功しました。");
  } catch (e) {
    window.alert("保存に失敗しました。");
  }
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
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

function filterAttachStyleList(ListInStorage) {
  const attachStyleList = [];
  if (ListInStorage != null) {
    for (let list of ListInStorage) {
      const attachStyle = new AttachStyle();
      attachStyle.id = list.id;
      attachStyle.url = list.url;
      attachStyle.css = list.css;
      attachStyle.isEnable = list.isEnable;
      attachStyleList.push(attachStyle);
    }
  }
  return attachStyleList;
}

function loadAttachStyleList(attachStyleListInStorage) {
  for (let attachStyle of attachStyleListInStorage) {
    createAttachStyleList(attachStyle);
  }
}

function createAttachStyleList(attachStyle) {
  const listItem = createListItemElement(attachStyle);
  const attachStyleListElement = document.querySelector("#attach-style-list");
  attachStyleListElement.appendChild(listItem);
}

function createListItemElement(attachStyle) {
  if (!attachStyle) {
    attachStyle = new AttachStyle();
  }
  const template = document.querySelector("#attach-style-list li.template");
  const listItem = template.cloneNode(true);
  listItem.classList.remove("template");

  const icon = listItem.querySelector("img.icon");
  icon.src = getDefaultFaviconUrl(attachStyle.url);

  const urlInput = listItem.querySelector(".url-input");
  urlInput.value = attachStyle.url;

  const cssTextarea = listItem.querySelector(".css-textarea");
  cssTextarea.value = attachStyle.css;

  const enableCheck = listItem.querySelector(".enable");
  enableCheck.checked = attachStyle.isEnable;

  const deleteButton = listItem.querySelector(".delete");
  deleteButton.onclick = function (e) {
    e.target.closest("li").remove(listItem);
  };
  console.log(listItem);
  return listItem;
}

function getDefaultFaviconUrl(urlPattern) {
  let normalizedPattern = "";
  try {
    normalizedPattern = urlPattern.replace(/^\*:\/\//, "http://");
  } catch (e) {
    console.log(e, "\n" + "URLパターンを通常のURLに変換できませんでした。");
    return "";
  }
  const urlObj = new URL(normalizedPattern);
  return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
}
