let attachStyleListInStorage;

document.addEventListener("DOMContentLoaded", async function () {
    await chrome.storage.local.get(["attachStyleList"],function (result){
        attachStyleListInStorage=filterAttachStyleList(result.attachStyleList);
        loadAttachStyleList(attachStyleListInStorage);
    })
});

document.querySelector("#addButton").addEventListener("click", function () {
    addAttachStyle();
});

document.querySelector("#saveButton").addEventListener("click", function () {
    setAttachStyle();
});

class AttachStyle {
    constructor() {
        this.uid = generateUUID();
        this.url = null;
        this.css = null;
        this.isEnable = true;
    }
}

function addAttachStyle(){
    const toparea = document.querySelector("#toparea");
    toparea.insertAdjacentHTML('afterend', '<div class="attachStyle"><input type="text" class="urlInput" placeholder="URLを入力してください"><textarea class="cssTextarea" rows="1" cols="30" placeholder="CSSを入力してください"></textarea></div>');
}

async function setAttachStyle() {
    const inputs = document.querySelectorAll('.urlInput');
    const textareas = document.querySelectorAll('.cssTextarea');
    const urls = document.querySelectorAll('.url');
    const csses = document.querySelectorAll('.css');
    let newAttachStyleList = [];

    if (Array.from(inputs).some(input => !input.value.trim()) &&
        Array.from(textareas).some(textarea => !textarea.value.trim())){

    }else if (Array.from(inputs).some(input => !input.value.trim()) ||
        Array.from(textareas).some(textarea => !textarea.value.trim())){
        window.alert("不正です");
    } else {
        for (let i = 0; i < inputs.length; i++) {
            const urlText = inputs[i].value.trim();
            const cssText = textareas[i].value.trim();
            const newAttachStyle = new AttachStyle();
            newAttachStyle.url = urlText;
            newAttachStyle.css = cssText;
            if (newAttachStyle.uid === undefined)
                newAttachStyle.uid = generateUUID();
            if (newAttachStyle.uid === undefined)
                newAttachStyle.isEnable = true;
            newAttachStyleList.push(newAttachStyle);
        }
    }

    if (urls !== null && csses !== null){
        if (Array.from(urls).some(url => !url.value.trim()) ||
            Array.from(csses).some(css => !css.value.trim())){
            window.alert("不正です");
        } else {
            for (let i = 0; i < urls.length; i++) {
                const urlText = urls[i].value.trim();
                const cssText = csses[i].value.trim();
                const newAttachStyle = new AttachStyle();
                newAttachStyle.url = urlText;
                newAttachStyle.css = cssText;
                newAttachStyle.uid = generateUUID();
                newAttachStyle.isEnable = true;
                newAttachStyleList.push(newAttachStyle);
            }
        }
    }

    attachStyleListInStorage = newAttachStyleList;
    try {
        await setStorage({attachStyleList: attachStyleListInStorage});
        window.alert("保存は成功しました。")
    } catch (e) {
        window.alert("保存は失敗しました。")
    }

}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
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

function filterAttachStyleList(ListInStorage){
    const attachStyleList= [] ;
    if (ListInStorage != null) {
        for(let list of ListInStorage){
            const attachStyle = new AttachStyle();
            attachStyle.uid = list.uid;
            attachStyle.url = list.url;
            attachStyle.css = list.css;
            attachStyle.isEnable = list.isEnable;
            attachStyleList.push(attachStyle);
        }
    }
    return attachStyleList;
}

function loadAttachStyleList(attachStyleListInStorage){
    const attachStyleListElement = document.querySelector("#attachStyleList");

    for (let attachStyleList of attachStyleListInStorage) {
        createAttachStyleList(attachStyleListElement, attachStyleList);
    }
}

function createAttachStyleList(attachStyleListElement, attachStyle){
    const li = document.createElement("li");

    // 追加
    const urlInput = document.createElement("input");
    const cssTextarea = document.createElement("textarea");
    urlInput.type = "text";
    urlInput.value = attachStyle.url
    urlInput.className = "url"
    li.appendChild(urlInput);

    cssTextarea.value = attachStyle.css;
    cssTextarea.className = "css";
    li.appendChild(cssTextarea);

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function() {
        attachStyleListElement.removeChild(li);
        deleteAttachStyleList(attachStyle);
    }
    li.appendChild(deleteBtn);

    attachStyleListElement.appendChild(li);
}

async function deleteAttachStyleList(attachStyle) {
    await chrome.storage.local.get(['attachStyleList'], function (result) {
        if (result.attachStyleList && Array.isArray(result.attachStyleList)) {
            const updatedList = result.attachStyleList.filter(item => item.uid !== attachStyle.uid);
            chrome.storage.local.set({attachStyleList: updatedList}, function () {
                console.log('is deleted');
            });
        }
    });
}
