let attachStyleListInStorage;

document.addEventListener("DOMContentLoaded", async function () {
    await chrome.storage.local.get(["attachStyleList"],function (result){
        attachStyleListInStorage=filterAttachStyleList(result.attachStyleList);
        loadAttachStyleList(attachStyleListInStorage);
    })
});

document.querySelector("#addButton").addEventListener("click", function () {
    addRule();
});

class AttachStyle {
    constructor() {
        this.uid = generateUUID();
        this.url = null;
        this.css = null;
        this.isEnable = true;
    }
}


async function addRule() {
    const attachStyleList = document.querySelector("#attachStyleList");
    let attachStyleUrl = document.querySelector("#urlInput");
    let attachStyleCss = document.querySelector("#cssInput");
    const urlText = attachStyleUrl.value.trim();
    const cssText = attachStyleCss.value.trim();

    if (urlText === "" || cssText === "") {
        window.alert("不正です");
        return;
    }
    const newAttachStyle = new AttachStyle();

    newAttachStyle.url = urlText;
    newAttachStyle.css = cssText;
    newAttachStyle.uid = generateUUID();
    newAttachStyle.isEnable = true;

    createAttachStyleList(attachStyleList, newAttachStyle)

    attachStyleUrl.value = "";
    attachStyleCss.value = "";

    attachStyleListInStorage.push(newAttachStyle);
    await setStorage({attachStyleList: attachStyleListInStorage});
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
    const attachStyleListDom = document.querySelector("#attachStyleList");

    for (let attachStyleList of attachStyleListInStorage) {
        createAttachStyleList(attachStyleListDom, attachStyleList);
    }
}

function createAttachStyleList(attachStyleListDom, attachStyle){
    const li = document.createElement("li");

    // 追加
    const urlSpan = document.createElement("span");
    const cssSpan = document.createElement("span");
    urlSpan.textContent = attachStyle.url;
    urlSpan.contentEditable = true;
    urlSpan.id = "url";
    li.appendChild(urlSpan);
    cssSpan.textContent = attachStyle.css;
    cssSpan.contentEditable = true;
    cssSpan.id = "css";
    li.appendChild(cssSpan);

    // 修正ボタン
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = function() {
        let editedUrl = urlSpan.textContent;
        let editedCss = cssSpan.textContent;
        attachStyle.url = editedUrl;
        attachStyle.css = editedCss;
        editAttachStyleList(attachStyle);
    }

    li.appendChild(editBtn);

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function() {
        attachStyleListDom.removeChild(li);
        deleteAttachStyleList(attachStyle);
    }
    li.appendChild(deleteBtn);

    attachStyleListDom.appendChild(li);
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

async function editAttachStyleList(attachStyle) {
    chrome.storage.local.get(['attachStyleList'], function(result) {
        if (result.attachStyleList && Array.isArray(result.attachStyleList)) {
            const updatedList = result.attachStyleList.map(item =>{
                if (item.uid === attachStyle.uid){
                    item.uid = attachStyle.uid;
                    item.url = attachStyle.url;
                    item.css = attachStyle.css;
                    item.isEnable = attachStyle.isEnable;
                }
                return item;
            });

            chrome.storage.local.set({attachStyleList: updatedList}, function() {
                console.log('is updated');
            });
        }
    });

}