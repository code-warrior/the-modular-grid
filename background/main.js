/* global chrome */

/*
 * This file is called when the browser loads.
 */
let gridEnabled = true;
    // lastTabId,
    //
    // Structure for holding and reserving project settings
    //
    // currentSettings = {
    //     gridIsEnabled : false
    // };

/**
 * Acquiring last tab’s ID
 */
// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     lastTabId = tabs[0].id;
// });

/**
 * Maintaining track of the current tab ID
 */
// chrome.tabs.onSelectionChanged.addListener(function(tabId) {
//     lastTabId = tabId;
// });

/**
 *
 */
chrome.browserAction.onClicked.addListener(function() {
    if (gridEnabled) {
        chrome.tabs.executeScript({file: 'content/disable-grid.js'});
        chrome.browserAction.setIcon({path:"img/extension-icon-19-off.png"});
    } else {
        chrome.tabs.executeScript({file: 'content/enable-grid.js'});
        chrome.browserAction.setIcon({path:"img/extension-icon-19.png"});
    }

    gridEnabled = !gridEnabled;
});
