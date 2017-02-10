/*jslint browser, es6, single, for, devel, multivar */
/*global window, chrome */

/**
 * Initiate the default settings.
 */
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

/**
 * Set the off icon when the extension is initially installed.
 */
chrome.browserAction.setIcon({path: 'img/extension-icon-19-off.png'});

/**
 * Fired when the browser action icon is clicked, this method enables/disables the
 * grid.
 */
chrome.browserAction.onClicked.addListener(function () {
    'use strict';

    chrome.storage.sync.get(
        {gridIsEnabled: false},
        function (settings) {
            let _gridIsEnabled = settings.gridIsEnabled;

            if (_gridIsEnabled) {
                chrome.browserAction.setIcon({path: 'img/extension-icon-19-off.png'});
            } else {
                chrome.browserAction.setIcon({path: 'img/extension-icon-19.png'});
            }

            _gridIsEnabled = !settings.gridIsEnabled;

            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        isGridEnabledViaBrowserAction: _gridIsEnabled
                    }
                );
            });

            chrome.storage.sync.set({gridIsEnabled: _gridIsEnabled});
        }
    );
});

/**
 * Fired when the three-key command defined in manifest.json is executed, this method
 * enables/disables the grid.
 */
chrome.commands.onCommand.addListener(function () {
    'use strict';

    chrome.storage.sync.get(
        {gridIsEnabled: false},
        function (settings) {
            let _gridIsEnabled = settings.gridIsEnabled;

            if (_gridIsEnabled) {
                chrome.browserAction.setIcon({path: 'img/extension-icon-19-off.png'});
            } else {
                chrome.browserAction.setIcon({path: 'img/extension-icon-19.png'});
            }

            _gridIsEnabled = !settings.gridIsEnabled;

            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        isGridEnabledViaBrowserAction: _gridIsEnabled
                    }
                );
            });

            chrome.storage.sync.set({gridIsEnabled: _gridIsEnabled});
        }
    );
});

/**
 * Open the options page in a new tab.
 */
chrome.runtime.onMessage.addListener(function (response) {
    'use strict';

    if ('openOptions' === response) {
        chrome.tabs.create({url: chrome.extension.getURL('options.html')});
    }
});
