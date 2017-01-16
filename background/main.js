/* global chrome */

/*
 * This file is called each time a new browser window loads.
 */

//
// TODO: This variable should be removed in favor of inspecting the settings variable
// isGridEnabled in chrome.browserAction.onClicked and chrome.commands.onCommand
//
let isGridEnabled = false;
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

    if (isGridEnabled) {
        chrome.browserAction.setIcon({path: 'img/extension-icon-19-off.png'});
    } else {
        chrome.browserAction.setIcon({path: 'img/extension-icon-19.png'});
    }

    isGridEnabled = !isGridEnabled;
});

// TODO: remove “command” arg
chrome.commands.onCommand.addListener(function(command) {
        chrome.tabs.executeScript({file: 'content/disable-grid.js'});
    if (isGridEnabled) {
        chrome.browserAction.setIcon({path: 'img/extension-icon-19-off.png'});
    } else {
        chrome.browserAction.setIcon({path: 'img/extension-icon-19.png'});
    }

    isGridEnabled = !isGridEnabled;

    // TODO: remove
    console.log('onCommand event received for message: ', command);
});

//
// Set the initial grid
//
chrome.storage.sync.set({currentGrid: 'all-grids'});
