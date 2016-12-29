/* global chrome */

/*
    This file is called when the browser loads.
 */
let lastTabId,
    // Structure for holding and reserving project settings
    currentSettings = {
        gridIsEnabled : false
    };

// Acquiring last tab’s ID
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
});

// Maintaining track of the current tab ID
chrome.tabs.onSelectionChanged.addListener(function(tabId) {
    lastTabId = tabId;
});

// Message event listener -- To be replaced with a persistent communication port
// instead of a single time message passing
// This is called when the browser action modular grid icon is clicked
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message) {
        case 'browserActionIconClicked':
            sendResponse(currentSettings);

            break;

        case 'gridEnabled':
            currentSettings.gridIsEnabled = true;
            chrome.tabs.insertCSS({file: 'content-layer/main.css'});    // path is to root
            chrome.tabs.executeScript({file: 'content-layer/main.js'}); // path is to root

            //
            // The path to both files below is from the root of this project.
            //
            chrome.extension.getBackgroundPage();

            break;

        case 'gridDisabled':
            currentSettings.gridIsEnabled = false;

            //
            // The path to both files below is from the root of this project.
            //
            chrome.tabs.executeScript({file: 'content-layer/remove-grid.js'});

            break;
    }
});
