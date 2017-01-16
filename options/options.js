/*jslint browser, es6, single, for, devel, multivar */
/*global window, chrome */

/**
 * Save options.
 */
function save_options() {
    'use strict';

    let gridColumn =
                document.getElementById('column--width-input').value,
        gridGutter =
                document.getElementById('gutter--width-input').value,
        baselineColor =
                document.getElementById('baseline--color-input').value,
        baselineDistance =
                document.getElementById('baseline--vertical-distance-input').value,
        userWantsSplitGutters =
                document.getElementById('margins--split-gutter-input').value,
        columnColor =
                document.getElementById('column--color-input').value,
        columnColorTransparency =
                document.getElementById('column--opacity-input').value;

    chrome.storage.sync.set({
        gridColumn: gridColumn,
        gridGutter: gridGutter,
        baselineColor: baselineColor,
        baselineDistance: baselineDistance,
        userWantsSplitGutters: userWantsSplitGutters,
        columnColor: columnColor,
        columnColorTransparency: columnColorTransparency
    }, function () {
        let status = document.getElementById('status');

        status.textContent = 'Options saved.';

        setTimeout(function () {
            status.textContent = '';
        }, 1500);
    });
}

/**
 * Retrieve options.
 */
function retrieve_options() {
    'use strict';

    chrome.storage.sync.get({
        gridColumn: '60',
        gridGutter: '20',
        baselineColor: '#29abe2',
        baselineDistance: '24',
        userWantsSplitGutters: 'true',
        columnColor: '#c80000',
        columnColorTransparency: 0.2
    }, function (settings) {
        document.getElementById('column--width-input').value =
                settings.gridColumn;
        document.getElementById('baseline--color-input').value =
                settings.baselineColor;
        document.getElementById('baseline--vertical-distance-input').value =
                settings.baselineDistance;
        document.getElementById('gutter--width-input').value =
                settings.gridGutter;
        document.getElementById('margins--split-gutter-input').value =
                settings.userWantsSplitGutters;
        document.getElementById('column--color-input').value =
                settings.columnColor;
        document.getElementById('column--opacity-input').value =
                settings.columnColorTransparency;
    });
}

document.addEventListener('DOMContentLoaded', retrieve_options);
document.getElementById('save-options').addEventListener('click', save_options);
