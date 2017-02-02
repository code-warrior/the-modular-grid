/*jslint browser, es6, single, for, devel, multivar */
/*global window, chrome */

//
// TODO: The settings here should drive the form, not the other way around.
//

let inputErrorsIn = {
    columnWidth: false,
    gutterWidth: false,
    columnCount: false,
    baselineVerticalDistance: false
};

const
    UP_ARROW_KEY = 38,
    DOWN_ARROW_KEY = 40,
    COLUMN_WIDTH_MIN = 1.0,
    COLUMN_WIDTH_MAX = 128.9,
    COLUMN_COUNT_MIN = 1,
    COLUMN_COUNT_MAX = 24,
    GUTTER_WIDTH_MIN = 1.0,
    GUTTER_WIDTH_MAX = 128.9,
    BASELINE_DISTANCE_MIN = 12,
    BASELINE_DISTANCE_MAX = 128;

/**
 * Save options.
 */
function saveOptions() {
    'use strict';

    let gridColumn =
                document.getElementById('column--width-input').value,
        gridColumnCount =
                document.getElementById('column--count-input').value,
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
        isGridEnabled: false,
        gridColumnWidth: gridColumn,
        gridColumnCount: gridColumnCount,
        gridGutter: gridGutter,
        baselineColor: baselineColor,
        baselineDistance: baselineDistance,
        userWantsSplitGutters: userWantsSplitGutters,
        gridColumnColor: columnColor,
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
function retrieveOptions() {
    'use strict';

    chrome.storage.sync.get({
        gridColumnWidth: '60',
        gridColumnCount: '16',
        gridGutter: '20',
        baselineColor: '#29abe2',
        baselineDistance: '24',
        userWantsSplitGutters: 'true',
        columnColor: '#c80000',
        columnColorTransparency: 0.2
    }, function (settings) {
        document.getElementById('column--width-input').value =
                settings.gridColumnWidth;
        document.getElementById('column--count-input').value =
                settings.gridColumnCount;
        document.getElementById('baseline--color-input').value =
                settings.baselineColor;
        document.getElementById('baseline--color-input').title =
            settings.baselineColor;
        document.getElementById('baseline--vertical-distance-input').value =
                settings.baselineDistance;
        document.getElementById('gutter--width-input').value =
                settings.gridGutter;
        document.getElementById('margins--split-gutter-input').value =
                settings.userWantsSplitGutters;
        document.getElementById('column--color-input').value =
                settings.columnColor;
        document.getElementById('column--color-input').title =
                settings.columnColor;
        document.getElementById('column--opacity-input').value =
                settings.columnColorTransparency;
        document.getElementById('column--opacity-input').title =
            settings.columnColorTransparency;
    });
}

function toggleSaveButtonBasedOnInputErrors() {
    'use strict';

    let saveOptionsSubmitButton = document.getElementById('save-options'),
        errorFound = false;

    for (let key in inputErrorsIn) {
        if (true === inputErrorsIn[key]) {
            errorFound = true;

            break;
        }
    }

    if (errorFound) {
        saveOptionsSubmitButton.style.display = 'none';
    } else {
        saveOptionsSubmitButton.style.display = 'inline';
    }
}

document.getElementById('column--width-input').addEventListener('focus', function () {
    'use strict';

    document.onkeydown = function (evnt) {
        let columnWidth = document.getElementById('column--width-input').value;

        switch (evnt.keyCode) {
            case UP_ARROW_KEY:
                columnWidth = parseInt(columnWidth, 10) + 1;

                if (columnWidth > COLUMN_WIDTH_MAX) {
                    columnWidth = columnWidth - 1;
                } else {
                    document.getElementById('column--width-input').value++;
                    saveOptions();
                }

                break;

            case DOWN_ARROW_KEY:
                columnWidth = parseInt(columnWidth, 10) - 1;

                if (columnWidth < COLUMN_WIDTH_MIN) {
                    columnWidth = columnWidth - 1;
                } else {
                    document.getElementById('column--width-input').value = columnWidth;
                    saveOptions();
                }

                break;
        }
    };

}, false);

document.getElementById('column--width-input').addEventListener('blur', function () {
    'use strict';

    let patternForColumnWidthInputBox = /^([1-9]|[1-9][0-9]|[1][0-2][0-8])([.][0-9])?$/,
        columnWidthInputBox = document.getElementById('column--width-input').value,
        columnWidthInputBox__ErrorMessage = document.getElementById('width-input--error-message');

    if (null !== columnWidthInputBox.match(patternForColumnWidthInputBox)) {
        columnWidthInputBox__ErrorMessage.style.display = 'none';
        inputErrorsIn.columnWidth = false;
    } else {
        columnWidthInputBox__ErrorMessage.style.display = 'inline';
        inputErrorsIn.columnWidth = true;
    }

    toggleSaveButtonBasedOnInputErrors();
});

document.getElementById('gutter--width-input').addEventListener('focus', function () {
    'use strict';

    document.onkeydown = function (evnt) {
        let gutterWidthInput = document.getElementById('gutter--width-input').value;

        switch (evnt.keyCode) {
            case UP_ARROW_KEY:
                gutterWidthInput = parseInt(gutterWidthInput, 10) + 1;

                if (gutterWidthInput > GUTTER_WIDTH_MAX) {
                    gutterWidthInput = gutterWidthInput - 1;
                } else {
                    document.getElementById('gutter--width-input').value = gutterWidthInput;
                    saveOptions();
                }

                break;

            case DOWN_ARROW_KEY:
                gutterWidthInput = parseInt(gutterWidthInput, 10) - 1;

                if (gutterWidthInput < GUTTER_WIDTH_MIN) {
                    gutterWidthInput = gutterWidthInput + 1;
                } else {
                    document.getElementById('gutter--width-input').value = gutterWidthInput;
                    saveOptions();
                }

                break;
        }
    };

}, false);

document.getElementById('gutter--width-input').addEventListener('blur', function () {
    'use strict';

    let patternForGutterWidthInputBox = /^([1-9]|[1-9][0-9]|[1][0-2][0-8])([.][0-9])?$/,
        gutterWidthInputBox = document.getElementById('gutter--width-input').value,
        gutterWidthInputBox__ErrorMessage = document.getElementById('gutter-width-input--error-message');

    if (null !== gutterWidthInputBox.match(patternForGutterWidthInputBox)) {
        gutterWidthInputBox__ErrorMessage.style.display = 'none';
        inputErrorsIn.gutterWidth = false;
    } else {
        gutterWidthInputBox__ErrorMessage.style.display = 'inline';
        inputErrorsIn.gutterWidth = true;
    }

    toggleSaveButtonBasedOnInputErrors();
});

document.getElementById('column--count-input').addEventListener('focus', function () {
    'use strict';

    document.onkeydown = function (evnt) {
        let columnCount = document.getElementById('column--count-input').value;

        switch (evnt.keyCode) {
            case UP_ARROW_KEY:
                columnCount = parseInt(columnCount, 10) + 1;

                if (columnCount > COLUMN_COUNT_MAX) {
                    columnCount = columnCount - 1;
                } else {
                    document.getElementById('column--count-input').value = columnCount;
                    saveOptions();
                }

                break;

            case DOWN_ARROW_KEY:
                columnCount = parseInt(columnCount, 10) - 1;

                if (columnCount < COLUMN_COUNT_MIN) {
                    columnCount = columnCount + 1;
                } else {
                    document.getElementById('column--count-input').value = columnCount;
                    saveOptions();
                }

                break;
        }
    };

}, false);

document.getElementById('column--count-input').addEventListener('blur', function () {
    'use strict';

    let patternForColumnCountInputBox = /^([1-9]|[1][0-9]|[2][0-4])$/,
        columnCountInputBox = document.getElementById('column--count-input').value,
        columnCountInputBox__ErrorMessage = document.getElementById('column-count-input--error-message');

    if (null !== columnCountInputBox.match(patternForColumnCountInputBox)) {
        columnCountInputBox__ErrorMessage.style.display = 'none';
        inputErrorsIn.columnCount = false;
    } else {
        columnCountInputBox__ErrorMessage.style.display = 'inline';
        inputErrorsIn.columnCount = true;
    }

    toggleSaveButtonBasedOnInputErrors();
});

document.getElementById('baseline--vertical-distance-input').addEventListener('focus', function () {
    'use strict';

    document.onkeydown = function (evnt) {
        let baselineDistance = document.getElementById('baseline--vertical-distance-input').value;

        switch (evnt.keyCode) {
            case UP_ARROW_KEY:
                baselineDistance = parseInt(baselineDistance, 10) + 1;

                if (baselineDistance > BASELINE_DISTANCE_MAX) {
                    baselineDistance = baselineDistance - 1;
                } else {
                    document.getElementById('baseline--vertical-distance-input').value = baselineDistance;
                    saveOptions();
                }

                break;

            case DOWN_ARROW_KEY:
                baselineDistance = parseInt(baselineDistance, 10) - 1;

                if (baselineDistance < BASELINE_DISTANCE_MIN) {
                    baselineDistance = baselineDistance + 1;
                } else {
                    document.getElementById('baseline--vertical-distance-input').value = baselineDistance;
                    saveOptions();
                }

                break;
        }
    };

}, false);

document.getElementById('baseline--vertical-distance-input').addEventListener('blur', function () {
    'use strict';

    let patternForBaselineVerticalDistanceInputBox = /^([1][2-9]|[2-9][0-9]|[1][0-2][0-8])$/,
        baselineVerticalDistanceInputBox = document.getElementById('baseline--vertical-distance-input').value,
        baselineVerticalDistanceInputBox__ErrorMessage = document.getElementById('baseline-vertical-distance-input--error-message');

    if (null !== baselineVerticalDistanceInputBox.match(patternForBaselineVerticalDistanceInputBox)) {
        baselineVerticalDistanceInputBox__ErrorMessage.style.display = 'none';
        inputErrorsIn.baselineVerticalDistance = false;
    } else {
        baselineVerticalDistanceInputBox__ErrorMessage.style.display = 'inline';
        inputErrorsIn.baselineVerticalDistance = true;
    }

    toggleSaveButtonBasedOnInputErrors();
});

document.addEventListener('DOMContentLoaded', retrieveOptions);
document.getElementById('save-options').addEventListener('click', saveOptions);
