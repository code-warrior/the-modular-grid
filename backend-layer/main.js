/* global chrome */

let lastTabId,
    // Structure for holding and reserving project settings
    currentSettings = {
        gridIsEnabled : false
    };

// Acquiring last tab’s ID
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
});

// Maitaining track of the current tab ID
chrome.tabs.onSelectionChanged.addListener(function(tabId) {
    lastTabId = tabId;
});

// Message event listener -- To be replaced with a persistent communication port
// instead of a single time message passing
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message) {
        case 'settingsOpened':
            sendResponse(currentSettings);

            break;

        case 'enableGrid':
            currentSettings.gridIsEnabled = true;
            chrome.tabs.insertCSS(null, {file: 'content-layer/main.css'});
            chrome.tabs.executeScript(null, {file: 'content-layer/main.js'});

            break;

        case 'disableGrid':

            currentSettings.gridIsEnabled = false;

            break;
    }
});
