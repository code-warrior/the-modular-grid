/*jslint browser, es6, single, for, devel, multivar */
/*global window, chrome */

//
// TODO: This variable should be removed in favor of inspecting the settings variable
// isGridEnabled in chrome.browserAction.onClicked and chrome.commands.onCommand
//
let isGridEnabled = false;

//
// Initiate the default settings
//
chrome.storage.sync.set({
    gridIsEnabled: false,
    gridColumnWidth: 60,
    gridColumnCount: 16,
    gridColumnColor: '#c80000',
    gridGutterWidth: 20,
    gridBaselineColor: '#29abe2',
    gridBaselineDistance: 24,
    gridColumnColorOpacity: 0.2,
    gridMargin: 10,
    marginsAreEnabled: true,
    currentGrid: 'modular-grid'
});

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

    chrome.storage.sync.set({isGridEnabled: isGridEnabled});
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                isGridEnabledViaBrowserAction: isGridEnabled
            }
        );
    });
});

/**
 *
 */
chrome.commands.onCommand.addListener(function () {
    'use strict';

    if (isGridEnabled) {
        chrome.browserAction.setIcon({path: 'img/extension-icon-19-off.png'});
    } else {
        chrome.browserAction.setIcon({path: 'img/extension-icon-19.png'});
    }

    isGridEnabled = !isGridEnabled;

    chrome.storage.sync.set({isGridEnabled: isGridEnabled});
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                isGridEnabledViaBrowserAction: isGridEnabled
            }
        );
    });
});

/**
 *
 */
chrome.runtime.onMessage.addListener(function (response) {
    'use strict';

    if ('openOptions' === response) {
        chrome.tabs.create({url: chrome.extension.getURL('options.html')});
    }
});
