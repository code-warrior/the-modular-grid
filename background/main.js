/* global chrome */

/*
 * This file is called each time a new browser window loads.
 */
let gridEnabled = false;
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

chrome.browserAction.setIcon({path: 'img/extension-icon-19-off.png'});

/**
 *
 */
chrome.browserAction.onClicked.addListener(function () {
    'use strict';

    if (gridEnabled) {
        chrome.tabs.executeScript({file: 'content/disable-grid.js'});
        chrome.browserAction.setIcon({path: 'img/extension-icon-19-off.png'});
    } else {
        chrome.tabs.executeScript({file: 'content/enable-grid.js'});
        chrome.browserAction.setIcon({path: 'img/extension-icon-19.png'});
    }

    gridEnabled = !gridEnabled;
});

// TODO: remove “command” arg
chrome.commands.onCommand.addListener(function(command) {
    if (gridEnabled) {
        chrome.tabs.executeScript({file: 'content/disable-grid.js'});
        chrome.browserAction.setIcon({path: 'img/extension-icon-19-off.png'});
    } else {
        chrome.tabs.executeScript({file: 'content/enable-grid.js'});
        chrome.browserAction.setIcon({path: 'img/extension-icon-19.png'});
    }

    gridEnabled = !gridEnabled;

    // TODO: remove
    console.log('onCommand event received for message: ', command);
});
