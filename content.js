
function inject() {
    console.log("Passive Bounty Hunter is running 2...");
    const observer = new MutationObserver((mutationsList, _observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const elements = Array.from(node.getElementsByTagName('*'));
                        elements.forEach(element => {
                            const attributes = Array.from(element.attributes).filter(attr => attr.name.startsWith('ng-'));

                            let found = false;
                            attributes.forEach(attr => {

                                if (attr.value.includes('alert(1)')) {
                                    found = true;
                                }
                                const initData = attr.value;

                                console.log(
                                    `Bounty: %c ${attr.name} ${initData}`, 'background: #222; color: #bada55'

                                );
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

