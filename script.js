document.querySelector("#to_option").addEventListener("click", function () {
    window.open(chrome.runtime.getURL("options.html"));
});
