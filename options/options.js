/*jslint browser: true */
/*global window, chrome */

/**
 * Saves options to chrome.storage
 */
function save_options() {
    let gridColumn = document.getElementById('column--width-input').value;

    chrome.storage.sync.set({
        gridColumn: gridColumn
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
        gridColumn: '60'
    }, function(items) {
        document.getElementById('column--width-input').value = items.gridColumn;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-options').addEventListener('click', save_options);
