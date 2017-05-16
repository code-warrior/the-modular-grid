/*jslint browser, es6, single, for, devel, multivar */
/*global window, chrome, ga */

// TODO: Up/down arrow keys remain bound to the previous input box. Consequently, when the page is scrolled with the up and down arrow keys, that input box’s value is incremented and decremented, also.

// TODO: Only save all the options when none of the input boxes contain errors.

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

/**
 * Fill the grid-related Sass variables section with values retrieved from storage.
 */
function populateSassGridVariablesWithStorageOptions() {
    'use strict';

    chrome.storage.sync.get(
        null,
        function (settings) {

            let variableValues = document.querySelectorAll('pre span');

            variableValues[0].textContent = settings.gridColumnWidth;
            variableValues[1].textContent = settings.gridGutterWidth;
            variableValues[2].textContent = settings.gridColumnCount;
            variableValues[3].textContent = settings.gridBaselineDistance;
        }
    );
}

//
// Columns
// — Width
//
document.getElementById('column--width-input').addEventListener('focus', function () {
    'use strict';

    document.onkeydown = function (evnt) {
        let columnWidthInputBoxValue = document.getElementById('column--width-input').value,
            columnWidthGridVarValue = document.querySelector('pre > kbd:first-of-type > span'),
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
                columnWidthGridVarValue.textContent = columnWidthInputBoxValue;
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
                    columnWidthGridVarValue.textContent = columnWidthInputBoxValue;
                    saveOptions();
                }
            }

            break;
        }
    };
}, false);

document.getElementById('column--width-input').addEventListener('input', function () {
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
}, false);

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

document.getElementById('column--count-input').addEventListener('input', function () {
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
}, false);

//
// Columns
// — Color
//
document.getElementById('column--color-input').addEventListener('change', function () {
    'use strict';

    saveOptions();
}, false);

//
// Columns
// — Color opacity
//
document.getElementById('column--opacity-input').addEventListener('change', function () {
    'use strict';

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
            gutterWidthInputBox__ErrorMessage =
                    document.getElementById('gutter-width-input--error-message');

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

document.getElementById('gutter--width-input').addEventListener('input', function () {
    'use strict';

    let gutterWidthInputBoxValue =
                document.getElementById('gutter--width-input').value,
        gutterWidthInputBox__ErrorMessage =
                document.getElementById('gutter-width-input--error-message');

    if (isNaN(gutterWidthInputBoxValue)) {
        gutterWidthInputBox__ErrorMessage.style.display = 'inline';
    } else {
        gutterWidthInputBox__ErrorMessage.style.display = 'none';
        saveOptions();
    }
}, false);

//
// Margins
// — Split gutters
//
document.getElementById('margins--split-gutter-input').addEventListener('change', function () {
    'use strict';

    saveOptions();
}, false);

//
// Basline
// — Color
//
document.getElementById('baseline--color-input').addEventListener('change', function () {
    'use strict';

    saveOptions();
}, false);

//
// Basline
// — Vertical distance
//
document.getElementById('baseline--vertical-distance-input').addEventListener('focus', function () {
    'use strict';

    document.onkeydown = function (evnt) {
        let baselineDistanceInputBoxValue = document.getElementById('baseline--vertical-distance-input').value,
            baselineDistanceInputBox__ErrorMessage = document.getElementById('baseline-vertical-distance-input--error-message');

        baselineDistanceInputBoxValue = parseFloat(baselineDistanceInputBoxValue);

        switch (evnt.keyCode) {
        case UP_ARROW_KEY:
            if (isNaN(baselineDistanceInputBoxValue)) {
                baselineDistanceInputBox__ErrorMessage.style.display = 'inline';
            } else {
                baselineDistanceInputBoxValue = baselineDistanceInputBoxValue + 1;

                if (baselineDistanceInputBoxValue > BASELINE_DISTANCE_MAX) {
                    baselineDistanceInputBoxValue = baselineDistanceInputBoxValue - 1;
                    baselineDistanceInputBox__ErrorMessage.style.display = 'inline';
                } else {
                    baselineDistanceInputBox__ErrorMessage.style.display = 'none';
                    document.getElementById('baseline--vertical-distance-input').value = baselineDistanceInputBoxValue;
                    saveOptions();
                }
            }

            break;

        case DOWN_ARROW_KEY:
            if (isNaN(baselineDistanceInputBoxValue)) {
                baselineDistanceInputBox__ErrorMessage.style.display = 'inline';
            } else {
                baselineDistanceInputBoxValue = baselineDistanceInputBoxValue - 1;

                if (baselineDistanceInputBoxValue < BASELINE_DISTANCE_MIN) {
                    baselineDistanceInputBoxValue = baselineDistanceInputBoxValue + 1;
                    baselineDistanceInputBox__ErrorMessage.style.display = 'inline';
                } else {
                    baselineDistanceInputBox__ErrorMessage.style.display = 'none';
                    document.getElementById('baseline--vertical-distance-input').value = baselineDistanceInputBoxValue;
                    saveOptions();
                }
            }

            break;
        }
    };

}, false);

document.getElementById('baseline--vertical-distance-input').addEventListener('input', function () {
    'use strict';

    let patternForBaselineVerticalDistanceInputBox = /^([1][2-9]|[2-9][0-9]|[1][0-2][0-8])$/,
        baselineVerticalDistanceInputBoxValue = document.getElementById('baseline--vertical-distance-input').value,
        baselineVerticalDistanceInputBox__ErrorMessage = document.getElementById('baseline-vertical-distance-input--error-message');

    if (null !== baselineVerticalDistanceInputBoxValue.match(patternForBaselineVerticalDistanceInputBox)) {
        baselineVerticalDistanceInputBox__ErrorMessage.style.display = 'none';
        saveOptions();
    } else {
        baselineVerticalDistanceInputBox__ErrorMessage.style.display = 'inline';
    }
}, false);

document.addEventListener('DOMContentLoaded', populateOptionsFormWithStorageOptions, false);
document.addEventListener('DOMContentLoaded', populateSassGridVariablesWithStorageOptions, false);

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-43177415-4', 'auto');
ga('set', 'checkProtocolTask', function(){});
ga('send', 'pageview', '/options.html');
