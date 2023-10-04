// ページの読み込み完了時に実行
window.addEventListener("load", function () {
  // オプションページへのリンクがクリックされたときに、オプションページを開く
  document.querySelector("#to_option").addEventListener("click", function () {
    window.open(chrome.runtime.getURL("html/options.html"));
  });

  // ストレージから取得したスタイルリストを表示
  displayAttachStyleList();
});

// スタイルリストを一覧表示する関数
async function displayAttachStyleList() {
  // ストレージからデータを取得
  const storageData = await getStorageData();
  // スタイルリストをフィルタリング
  const attachStyleList = await filterAttachStyleList(storageData.attachStyleList);

  const template = document.querySelector("#attach-style-list li.template");
  
  if (!attachStyleList) return;
  
  attachStyleList.forEach((row) => {
    // テンプレートをクローンして新しいリスト項目を作成
    const listItem = template.cloneNode(true);
    listItem.classList.remove("template");

    // 有効・無効チェックボックスを設定
    const checkbox = listItem.querySelector(".enable");
    checkbox.checked = row.isEnable;
    checkbox.addEventListener("click", (e) => {
      // チェックボックスがクリックされたときに状態を変更
      changeEnabled(row);
    });

    // URLを設定
    const urlView = listItem.querySelector(".url-pattern");
    urlView.innerText = row.url;

    // CSSの表示/非表示を切り替えるトグルボタンの設定
    const cssToggleButton = listItem.querySelector(".css-view .css-toggle");
    cssToggleButton.addEventListener("click", (e) => {
      cssTextElement = e.target.parentElement.querySelector(".css-text");
      if (cssTextElement.classList.contains("open")) {
        cssTextElement.classList.remove("open");
      } else {
        cssTextElement.classList.add("open");
      }
    });

    // CSSを設定
    const cssView = listItem.querySelector(".css-view .css-text");
    cssView.innerText = row.css;

    // リスト項目をDOMに追加
    document.querySelector("#attach-style-list").appendChild(listItem);
  });
}

// 指定されたアタッチスタイルの有効/無効状態を変更する関数
async function changeEnabled(row) {
  // ストレージからデータを取得
  const storageData = await getStorageData(); /** 候補 */
  const newAttachStyleList = [];
  storageData.attachStyleList.forEach((obj) => {
    // 指定されたアタッチスタイルの有効/無効状態を変更
    if (obj.id === row.id) {
      obj.isEnable = !obj.isEnable;
    }
    newAttachStyleList.push(obj);
  });

  try {
    // 更新されたスタイルリストをストレージに保存
    await setStorage({ attachStyleList: newAttachStyleList });
    const currentTab = await getCurrentTab(); /** 候補 */
    // 現在のタブにメッセージを送信して、コンテンツスクリプトを更新
    chrome.tabs.sendMessage(currentTab.id, {
      action: "UPDATE_ATTACH_STYLE"
    });                                       /** 候補 */
  } catch (error) {
    console.error("メッセージの送信に失敗しました。", error);
  }
}
