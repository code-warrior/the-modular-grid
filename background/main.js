/* global chrome */

/*
    This file is called when the browser loads.
 */
let gridEnabled = true;
    // lastTabId,
    //
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

            //
            // The path to both files below is from the root of this project.
            //
            chrome.tabs.insertCSS({file: 'content/main.css'});
            chrome.tabs.executeScript({file: 'content/main.js'});
            chrome.extension.getBackgroundPage();

            break;

        case 'gridDisabled':
            currentSettings.gridIsEnabled = false;

            //
            // The path to both files below is from the root of this project.
            //
            chrome.tabs.executeScript({file: 'content/remove-grid.js'});

/**
 *
 */
chrome.browserAction.onClicked.addListener(function() {
    if (gridEnabled) {
        chrome.tabs.executeScript({file: 'content/disable-grid.js'});
    } else {
        chrome.tabs.executeScript({file: 'content/enable-grid.js'});
    }

    gridEnabled = !gridEnabled;
});
