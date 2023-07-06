// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "createNotification") {
        const options = {
            type: "basic",
            title: "ng-init Data Found",
            message: `ng-init data: ${request.initData}`,
            iconUrl: "images/icon16.png",
        };

        chrome.notifications.create(options, (notificationId) => {
            sendResponse(`Notification created with ID: ${notificationId}`);
        });

        return true; // Required to use sendResponse asynchronously
    }
});
