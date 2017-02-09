/*jslint browser, es6, single, for, devel, multivar */
/*global window, chrome */

const
    UP_ARROW_KEY = 38,
    DOWN_ARROW_KEY = 40,
    COLUMN_WIDTH_MIN = 1.0,
    COLUMN_COUNT_MIN = 1,
    GUTTER_WIDTH_MIN = 1.0,
    BASELINE_DISTANCE_MIN = 12,
    BASELINE_DISTANCE_MAX = 128;

/**
 * Save options.
 */
function saveOptions() {
    'use strict';

    chrome.storage.sync.get(
        null,
        function (settings) {
            let marginsAreEnabled = document.getElementById('margins--split-gutter-input').value,
                gridMargin = 0;

            if ('true' === marginsAreEnabled) {
                gridMargin = parseFloat(settings.gridGutterWidth) / 2;
                marginsAreEnabled = 'true';
            } else {
                gridMargin = 0;
                marginsAreEnabled = 'false';
            }

            chrome.storage.sync.set({
                gridColumnWidth:
                    document.getElementById('column--width-input').value,

                gridColumnCount:
                    document.getElementById('column--count-input').value,

                gridGutterWidth:
                    document.getElementById('gutter--width-input').value,

                gridBaselineColor:
                    document.getElementById('baseline--color-input').value,

                gridBaselineDistance:
                    document.getElementById('baseline--vertical-distance-input').value,

                marginsAreEnabled:
                    marginsAreEnabled,

                gridColumnColor:
                    document.getElementById('column--color-input').value,

                gridColumnColorOpacity:
                    document.getElementById('column--opacity-input').value,

                gridMargin:
                    gridMargin

            }, function () {
                let status = document.getElementById('status');

                status.style.display = 'block';

                setTimeout(function () {
                    status.style.display = 'none';
                }, 1500);
            });
        }
    );
}

/**
 * Retrieve the options from storage and fill the options form with those values.
 */
function populateOptionsFormWithStorageOptions() {
    'use strict';

    chrome.storage.sync.get(
        null,
        function (settings) {
            document.getElementById('column--width-input').value =
                settings.gridColumnWidth;

            document.getElementById('column--count-input').value =
                settings.gridColumnCount;

            document.getElementById('baseline--color-input').value =
                settings.gridBaselineColor;

            document.getElementById('baseline--color-input').title =
                settings.gridBaselineColor;

            document.getElementById('baseline--vertical-distance-input').value =
                settings.gridBaselineDistance;

            document.getElementById('gutter--width-input').value =
                settings.gridGutterWidth;

            document.getElementById('margins--split-gutter-input').value =
                settings.marginsAreEnabled;

            document.getElementById('column--color-input').value =
                settings.gridColumnColor;

            document.getElementById('column--color-input').title =
                settings.gridColumnColor;

            document.getElementById('column--opacity-input').value =
                settings.gridColumnColorOpacity;

            document.getElementById('column--opacity-input').title =
                settings.gridColumnColorOpacity;
        }
    );
}

//
// Columns
// — Width
//
document.getElementById('column--width-input').addEventListener('focus', function () {
    document.onkeydown = function (evnt) {
        let columnWidthInputBoxValue = document.getElementById('column--width-input').value,
            columnWidthInputBox__ErrorMessage = document.getElementById('width-input--error-message');

        columnWidthInputBoxValue = parseFloat(columnWidthInputBoxValue);

        switch (evnt.keyCode) {
        case UP_ARROW_KEY:
            if (isNaN(columnWidthInputBoxValue)) {
                columnWidthInputBox__ErrorMessage.style.display = 'inline';
            } else {
                columnWidthInputBox__ErrorMessage.style.display = 'none';
                columnWidthInputBoxValue = columnWidthInputBoxValue + 1;
                document.getElementById('column--width-input').value = columnWidthInputBoxValue;
                saveOptions();
            }

            break;

        case DOWN_ARROW_KEY:
            if (isNaN(columnWidthInputBoxValue)) {
                columnWidthInputBox__ErrorMessage.style.display = 'inline';
            } else {
                if (columnWidthInputBoxValue < (COLUMN_WIDTH_MIN + 1)) {
                    columnWidthInputBox__ErrorMessage.style.display = 'inline';
                    columnWidthInputBoxValue = columnWidthInputBoxValue - 1;
                } else {
                    columnWidthInputBox__ErrorMessage.style.display = 'none';
                    columnWidthInputBoxValue = columnWidthInputBoxValue - 1;
                    document.getElementById('column--width-input').value = columnWidthInputBoxValue;
                    saveOptions();
                }
            }

            break;
        }
    };
}, false);

document.getElementById('column--width-input').addEventListener('blur', function () {
    'use strict';

    let columnWidthInputBoxValue = document.getElementById('column--width-input').value,
        columnWidthInputBox__ErrorMessage = document.getElementById('width-input--error-message');

    columnWidthInputBoxValue = parseFloat(columnWidthInputBoxValue);

    if (isNaN(columnWidthInputBoxValue)) {
        columnWidthInputBox__ErrorMessage.style.display = 'inline';
    } else {
        columnWidthInputBox__ErrorMessage.style.display = 'none';
        saveOptions();
    }
});

//
// Columns
// — Count
//
document.getElementById('column--count-input').addEventListener('focus', function () {
    'use strict';

    document.onkeydown = function (evnt) {
        let columnCountInputBoxValue = document.getElementById('column--count-input').value,
            columnCountInputBox__ErrorMessage = document.getElementById('column-count-input--error-message');

        columnCountInputBoxValue = parseInt(columnCountInputBoxValue, 10);

        switch (evnt.keyCode) {
        case UP_ARROW_KEY:
            if (isNaN(columnCountInputBoxValue)) {
                columnCountInputBox__ErrorMessage.style.display = 'inline';
            } else {
                columnCountInputBox__ErrorMessage.style.display = 'none';
                columnCountInputBoxValue = columnCountInputBoxValue + 1;
                document.getElementById('column--count-input').value = columnCountInputBoxValue;
                saveOptions();
            }

            break;

        case DOWN_ARROW_KEY:
            if (isNaN(columnCountInputBoxValue)) {
                columnCountInputBox__ErrorMessage.style.display = 'inline';
            } else {
                if (columnCountInputBoxValue < (COLUMN_COUNT_MIN + 1)) {
                    columnCountInputBox__ErrorMessage.style.display = 'inline';
                    columnCountInputBoxValue = columnCountInputBoxValue - 1;
                } else {
                    columnCountInputBox__ErrorMessage.style.display = 'none';
                    columnCountInputBoxValue = columnCountInputBoxValue - 1;
                    document.getElementById('column--count-input').value = columnCountInputBoxValue;
                    saveOptions();
                }
            }

            break;
        }
    };

}, false);

document.getElementById('column--count-input').addEventListener('blur', function () {
    'use strict';

    let columnCountInputBoxValue = document.getElementById('column--count-input').value,
        columnCountInputBox__ErrorMessage = document.getElementById('column-count-input--error-message');

    columnCountInputBoxValue = parseInt(columnCountInputBoxValue, 10);

    if (isNaN(columnCountInputBoxValue)) {
        columnCountInputBox__ErrorMessage.style.display = 'inline';
    } else {
        columnCountInputBox__ErrorMessage.style.display = 'none';
        saveOptions();
    }
});

//
// Columns
// — Color
//
document.getElementById('column--color-input').addEventListener('change', function () {
    saveOptions();
}, false);

//
// Columns
// — Color opacity
//
document.getElementById('column--opacity-input').addEventListener('change', function () {
    saveOptions();
}, false);

//
// Columns
// — Width
//
document.getElementById('gutter--width-input').addEventListener('focus', function () {
    'use strict';

    document.onkeydown = function (evnt) {
        let gutterWidthInputBoxValue =
                document.getElementById('gutter--width-input').value,
            gutterWidthInputBox__ErrorMessage = document.getElementById('gutter-width-input--error-message');

        gutterWidthInputBoxValue = parseFloat(gutterWidthInputBoxValue);

        switch (evnt.keyCode) {
        case UP_ARROW_KEY:
            if (isNaN(gutterWidthInputBoxValue)) {
                gutterWidthInputBox__ErrorMessage.style.display = 'inline';
            } else {
                gutterWidthInputBox__ErrorMessage.style.display = 'none';
                gutterWidthInputBoxValue = gutterWidthInputBoxValue + 1;
                document.getElementById('gutter--width-input').value =
                    gutterWidthInputBoxValue;
                saveOptions();
            }

            break;

        case DOWN_ARROW_KEY:
            if (isNaN(gutterWidthInputBoxValue)) {
                gutterWidthInputBox__ErrorMessage.style.display = 'inline';
            } else {
                if (gutterWidthInputBoxValue < (GUTTER_WIDTH_MIN + 1)) {
                    gutterWidthInputBox__ErrorMessage.style.display = 'inline';
                    gutterWidthInputBoxValue = gutterWidthInputBoxValue - 1;
                } else {
                    gutterWidthInputBox__ErrorMessage.style.display = 'none';
                    gutterWidthInputBoxValue = gutterWidthInputBoxValue - 1;
                    document.getElementById('gutter--width-input').value =
                        gutterWidthInputBoxValue;
                    saveOptions();
                }
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
    } else {
        gutterWidthInputBox__ErrorMessage.style.display = 'inline';
    }
});

//
// Margins
// — Split gutters
//
document.getElementById('margins--split-gutter-input').addEventListener('change', function () {
    saveOptions();
}, false);

//
// Basline
// — Color
//
document.getElementById('baseline--color-input').addEventListener('change', function () {
    saveOptions();
}, false);

//
// Basline
// — Vertical distance
//
document.getElementById('baseline--vertical-distance-input').addEventListener('keyup', function () {
    saveOptions();
}, false);

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
    } else {
        baselineVerticalDistanceInputBox__ErrorMessage.style.display = 'inline';
    }
});

document.addEventListener('DOMContentLoaded', populateOptionsFormWithStorageOptions);