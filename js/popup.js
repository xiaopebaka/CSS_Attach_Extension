window.addEventListener("load", function () {
  document.querySelector("#to_option").addEventListener("click", function () {
    window.open(chrome.runtime.getURL("html/options.html"));
  });

  displayAttachStyleList();
});

async function displayAttachStyleList() {
  const storageData = await getStorageData();
  const attachStyleList = await filterAttachStyleList(storageData.attachStyleList);

  const template = document.querySelector("#attach-style-list li.template");

  attachStyleList.forEach((row) => {
    const listItem = template.cloneNode(true);
    listItem.classList.add("row", "row-" + row.id);
    listItem.classList.remove("template");

    const checkbox = listItem.querySelector(".enable");
    checkbox.checked = row.isEnable;
    checkbox.addEventListener("click", (e) => {
      changeDisabeled(row);
    });

    const urlView = listItem.querySelector(".url-pattern");
    urlView.innerText = row.url;

    const cssToggleButton = listItem.querySelector(".css-view .css-toggle");
    cssToggleButton.addEventListener("click", (e) => {
      cssTextElement = e.target.parentElement.querySelector(".css-text");
      if (cssTextElement.classList.contains("open")) {
        cssTextElement.classList.remove("open");
      } else {
        cssTextElement.classList.add("open");
      }
    });
    const cssView = listItem.querySelector(".css-view .css-text");
    cssView.innerText = row.css;

    document.querySelector("#attach-style-list").appendChild(listItem);
  });
}

async function changeDisabeled(row) {
  const storageData = await getStorageData();
  const newAttachStyleList = [];
  storageData.attachStyleList.forEach((obj) => {
    if (obj.id === row.id) {
      obj.isEnable = !obj.isEnable;
    }
    newAttachStyleList.push(obj);
  });

  try {
    await setStorage({ attachStyleList: newAttachStyleList });
    const currentTab = await getCurrentTab();
    chrome.tabs.sendMessage(currentTab.id, {
      type: "CONTENT",
      action: "UPDATE_ATTACH_STYLE",
    });
  } catch (error) {
    console.error("Error while updating storage or sending message:", error);
  }
}
