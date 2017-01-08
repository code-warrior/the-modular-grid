/*jslint browser: true */
/*global window, chrome */

/**
 * Saves options to chrome.storage
 */
function save_options() {
    let gridColumn = document.getElementById('column--width-input').value;
    let baselineColor = document.getElementById('baseline--color-input').value;

    chrome.storage.sync.set({
        gridColumn: gridColumn,
        baselineColor: baselineColor
    }, function() {
        let status = document.getElementById('status');

        status.textContent = 'Options saved.';

        setTimeout(function() {
            status.textContent = '';
        }, 1500);
    });
}

/**
 * Restores settings using the preferences stored in chrome.storage.
 */
function restore_options() {
    chrome.storage.sync.get({
        gridColumn: '60',
        baselineColor: '#29abe2'
    }, function(items) {
        document.getElementById('column--width-input').value = items.gridColumn;
        document.getElementById('baseline--color-input').value = items.baselineColor;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-options').addEventListener('click', save_options);
