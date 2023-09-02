console.log("Hello");
function changeHeaderStyle(styleList) {
    const headerElement = document.querySelector("head");
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.textContent = styleList;
    headerElement.appendChild(styleElement);
}
