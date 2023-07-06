// popup.js
function loadBlacklist() {
    chrome.storage.sync.get("blacklist", (data) => {
        const blacklist = data.blacklist || "";
        document.getElementById("blacklist").value = blacklist;
    });
}

loadBlacklist(); // Load the blacklist on popup open

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.blacklist) {
        loadBlacklist();
    }
});

document.getElementById("save").addEventListener("click", () => {
    const blacklist = document.getElementById("blacklist").value;
    chrome.storage.sync.set({ blacklist: blacklist }, () => {
        console.log("Blacklist saved");
    });
});
