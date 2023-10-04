// ページの読み込み完了時に実行
window.addEventListener("load", async function () {
  // ストレージから取得したスタイルリストを表示
  displayAttachStyleList();
});

// 追加ボタンがクリックされたときのイベントリスナー
document.querySelector("#add-button").addEventListener("click", function () {
  addAttachStyle();
});

// 保存ボタンがクリックされたときのイベントリスナー
document.querySelector("#save-button").addEventListener("click", function () {
  saveAttachStyle();
});

// スタイルリストに新たなスタイルを追加する関数
function addAttachStyle() {
  const attachStyleListElement = document.querySelector("#attach-style-list");
  const listItem = createListItemElement(null);
  attachStyleListElement.prepend(listItem);
}

// スタイルリストをストレージに保存する関数
async function saveAttachStyle() {
  const listItems = document.querySelectorAll("#attach-style-list li:not(.template)");
  let newAttachStyleList = [];
  let saveFlag = true;

  // スタイルデータの数だけ繰り返しストレージ保存用オブジェクトを作成する
  listItems.forEach((list) => {
    const enableCheck = list.querySelector(".enable").checked;
    const urlText = list.querySelector(".url-input").value.trim();
    const cssText = list.querySelector(".css-textarea").value.trim();

    // 入力済みかチェックする
    if (!urlText || !cssText) {
      saveFlag = false;
      return;
    }

    const newAttachStyle = {
      id: generateUUID(),
      url: urlText,
      css: cssText,
      isEnable: enableCheck,
    };
    newAttachStyleList.push(newAttachStyle);
  });

  // 未入力がある場合アラートを表示する
  if (!saveFlag) {
    window.alert("URLまたはCSSが未入力の項目が存在します。");
    return;
  }

  try {
    await setStorage({ attachStyleList: newAttachStyleList });
    window.alert("保存に成功しました。");
  } catch (error) {
    window.alert("保存に失敗しました。");
    console.error(error);
  }
}

// スタイルリストを一覧表示する関数
async function displayAttachStyleList() {
  const storageData = await getStorageData();

  if (!storageData.attachStyleList) return;
  
  for (let attachStyle of storageData.attachStyleList) {
    const listItem = createListItemElement(attachStyle);
    document.querySelector("#attach-style-list").appendChild(listItem);
  }
}

// スタイルデータを元に、新しいリスト項目要素を作成する関数
function createListItemElement(attachStyle) {
  if (!attachStyle) {
    attachStyle = {
      id: generateUUID(),
      url: "",
      css: "",
      isEnable: true,
    };
  }
  const template = document.querySelector("#attach-style-list li.template");
  const listItem = template.cloneNode(true);
  listItem.classList.remove("template");

  // アイコンを設定
  const icon = listItem.querySelector("img.icon");
  icon.src = getDefaultFaviconUrl(attachStyle.url);

  // URLを設定
  const urlInput = listItem.querySelector(".url-input");
  urlInput.value = attachStyle.url;

  // CSSを設定
  const cssTextarea = listItem.querySelector(".css-textarea");
  cssTextarea.value = attachStyle.css;

  // 有効・無効チェックボックスを設定
  const enableCheck = listItem.querySelector(".enable");
  enableCheck.checked = attachStyle.isEnable;

  // 削除ボタン設定
  const deleteButton = listItem.querySelector(".delete");
  deleteButton.onclick = function (e) {
    e.target.closest("li").remove(listItem);
  };

  return listItem;
}

// 指定されたURLパターンから、デフォルトのfaviconのURLを取得する関数
function getDefaultFaviconUrl(urlPattern) {
  let normalizedPattern = "";
  try {
    normalizedPattern = urlPattern.replace(/^\*:\/\//, "http://");
    const urlObj = new URL(normalizedPattern);
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch (error) {
    console.error("URLパターンを通常のURLに変換できませんでした。", error);
    return "";
  }
}
