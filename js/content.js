window.addEventListener("load", async function () {
  attachStyle();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "CONTENT") {
    if (message.action === "UPDATE_ATTACH_STYLE") {
      updateAttachStyle();
    }
  }
});

async function attachStyle() {
  const storageData = await getStorageData();

  const filteredAttachStyleList = await filterAttachStyleList(storageData.attachStyleList);
  let stringStyle = "";
  filteredAttachStyleList.forEach(function (row) {
    if (row.isEnable) {
      stringStyle += row.css;
    }
  });
  insertCSS(stringStyle);
}

function insertCSS(stringStyle) {
  const headerElement = document.querySelector("head");
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.id = "css_attach_extension";
  styleElement.textContent = stringStyle;
  headerElement.appendChild(styleElement);
}

function updateAttachStyle() {
  document.querySelector("#css_attach_extension").remove();
  attachStyle();
}
