
const urlSet = new Set();

let blacklist = [];

function updateBlacklist() {
    chrome.storage.sync.get("blacklist", (data) => {
        blacklist = data.blacklist ? data.blacklist.split("\n") : [];
        console.log("Blacklist commands:", blacklist);
        // Add logic using the blacklist array
    });
}

updateBlacklist(); // Load the blacklist on extension startup

chrome.storage.onChanged.addListener((changes, areaName) => {
    console.log("Storage changes:", changes, areaName);
    if (areaName === "sync" && changes.blacklist) {
        updateBlacklist();
    }
});

function getStringHash(...strings) {
    let combinedString = strings.join('');
    let hash = 0;

    for (let i = 0; i < combinedString.length; i++) {
        const charCode = combinedString.charCodeAt(i);
        hash = (hash << 5) - hash + charCode;
        hash |= 0;
    }

    return hash;
}


function NotifyNGEvent(attr, initData, element) {


    const currentHash = getStringHash(window.location.href, attr.name, initData);

    if (!urlSet.has(currentHash)) {
        console.log(
            `Bounty: %c ${attr.name} ${initData}`, 'background: #222; color: #bada55'
        );
        urlSet.add(currentHash);
    }
}

function inject() {
    console.log("Passive Bounty Hunter is running...");
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const elements = Array.from(node.getElementsByTagName('*'));
                        elements.forEach(element => {
                            const attributes = Array.from(element.attributes).filter(attr => attr.name.startsWith('ng-'));

                            let found = false;
                            attributes.forEach(attr => {

                                if (blacklist.includes(attr.name)) {
                                    return;
                                }

                                if (attr.value.includes('alert(1)')) {
                                    found = true;
                                }
                                const initData = attr.value;

                                if (initData === "") return;

                                NotifyNGEvent(attr, initData, element);
                            });

                            if (attributes.length > 0 && found) {
                                element.style.backgroundColor = 'yellow';
                                element.style.border = '1px solid black';
                            }
                        });
                    }
                });
            }
        }
    });

    observer.observe(document, {childList: true, subtree: true});
}


console.log("Injecting...")
inject();

