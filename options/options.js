/*jslint browser: true */
/*global window, chrome */

/**
 * Saves options to chrome.storage
 */
function save_options() {
    let gridColumn =
            document.getElementById('column--width-input').value,
        gridGutter =
            document.getElementById('gutter--width-input').value,
        baselineColor =
            document.getElementById('baseline--color-input').value,
        baselineDistance =
            document.getElementById('baseline--vertical-distance-input').value,
        userWantsSplitGutters =
            document.getElementById('margins--split-gutter').value;

    chrome.storage.sync.set({
        gridColumn: gridColumn,
        gridGutter: gridGutter,
        baselineColor: baselineColor,
        baselineDistance: baselineDistance,
        userWantsSplitGutters: userWantsSplitGutters

    }, function() {
        let status = document.getElementById('status');

        status.textContent = 'Options saved.';

        setTimeout(function() {
            status.textContent = '';
        }, 1500);
    });
}

/**
 * Restores settings from chrome.storage
 */
function restore_options() {
    chrome.storage.sync.get({
        gridColumn: '60',
        gridGutter: '20',
        baselineColor: '#29abe2',
        baselineDistance: '24',
        userWantsSplitGutters: 'true'
    }, function(settings) {
        document.getElementById('column--width-input').value =
            settings.gridColumn;
        document.getElementById('baseline--color-input').value =
            settings.baselineColor;
        document.getElementById('baseline--vertical-distance-input').value =
            settings.baselineDistance;
        document.getElementById('gutter--width-input').value =
            settings.gridGutter;
        document.getElementById('margins--split-gutter').value =
            settings.userWantsSplitGutters;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-options').addEventListener('click', save_options);
