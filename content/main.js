/*jslint browser, es6, single, for, devel, multivar */
/*global window, chrome */

/*
 * TODO
 * If this script is called each time the page is loaded, which I imagine is the
 * case, then this script MUST send a message to the background script asking if the
 * grid is enabled. If it is, then it might also need to check if the info box is
 * enabled, also.
 */

const SHIFT_KEY = 16,
    CONTROL_KEY = 17,
    ESCAPE_KEY = 27,
    SHOWING_NO_GRID = 0,
    SHOWING_COLUMN_GRID = 1,
    SHOWING_MODULAR_GRID = 2,
    SHOWING_BASELINE_GRID = 3,
    SHOWING_ALL_GRIDS = 4;
// SHOWING_USER_SUPPLIED_BG_IMAGE = 5;

let body = document.querySelector('body'),
    firstChildOfBody = body.firstElementChild,
    head = document.querySelector('head'),
    stylesheet = document.createElement('link'),

    //
    // modularGrid__Container is the container of the entire grid that is appended to
    // the <body> element as its first child. The modularGrid variable is appended to
    // modularGrid__Container and is the layer whose background contains the varying
    // grids displayed to the user.
    //
    modularGrid__Container = document.createElement('div'),
    modularGrid = document.createElement('div'),

    //
    // sideBarPopup__Container is the container for the popup box that appears in the
    // upper right hand corner. (Note: Do not confuse the use of “popup” here with
    // the popup feature endemic to a Chrome extension.)
    //
    sideBarPopup__Container = document.createElement('div'),
    sideBarPopup__Instructions = document.createElement('span'),
    sideBarPopup__ColumnAndPageInfo = document.createElement('span'),
    sideBarPopup__OptionsLink = document.createElement('span'),

    //
    // Keyboard-related Booleans
    //
    controlKeyPressed = false,
    shiftKeyPressed = false,

    //
    // Turn on the sidebar popup by default
    //
    sideBarPopup__IsInitiallyShowing = true,

    //
    // Closely related to the sideBarPopup__IsInitiallyShowing Boolean, this variable
    // is used to toggle the sidebar popup by the user.
    //
    sideBarPopup__IsShowing = false,

    //
    // Grid-related variables, of which gridColumn and gridGutter will be updated by
    // the user when choosing the size of columns and gutters.
    //
    gridColumn = 60,
    gridGutter = 20,
    gridUnit = gridColumn + gridGutter,
    splitGutterWidth = gridGutter / 2,
    userWantsSplitGutters = true,
    pageHeight = (undefined !== document.height) ? document.height : document.body.offsetHeight,

    // TODO: May not need this any more
    gridChoice = SHOWING_ALL_GRIDS,

    CSS__Classes = {
        columngrid: 'column-grid',
        modulargrid: 'modular-grid',
        baselinegrid: 'baseline-grid',
        allgrids: 'all-grids'
    },

    columnColor = '#c80000',
    columnColorTransparency = 0.2,
    colorGridBaseline = '#29abe2',

    baselineDistance = 24;

stylesheet.href = chrome.extension.getURL('content/main.css');
stylesheet.rel = 'stylesheet';
stylesheet.id = 'modular-grid-css';

sideBarPopup__Container.id = 'info-sidebar';

//
// When the extension loads, the sidebar info dialog box shows…
//
// TODO: I may not need this
if (sideBarPopup__IsInitiallyShowing) {
    sideBarPopup__Container.style.display = 'block';
    sideBarPopup__IsShowing = true;
}

modularGrid.id = 'modular-grid';
modularGrid.className = 'all-grids';

modularGrid__Container.id = 'modular-grid--container';
modularGrid__Container.appendChild(modularGrid);

sideBarPopup__Instructions.className = 'message-box';
sideBarPopup__ColumnAndPageInfo.className = 'message-box';
sideBarPopup__OptionsLink.className = 'message-box';
sideBarPopup__OptionsLink.classList.add('link');

sideBarPopup__Instructions.innerHTML =
        'This section can be toggled by typing <kbd>cntrl + shift</kbd>. You ' +
        'can cycle through the various grids by typing <kbd>esc</kbd>.';
sideBarPopup__ColumnAndPageInfo.innerHTML =
        'Column count: <strong>' + Math.floor(body.clientWidth / gridUnit) + '</strong>' +
        '<br>Page width: <strong>' + body.clientWidth + 'px</strong>' +
        '<br>Current grid layer: <strong>' + modularGrid.className + '</strong>';

sideBarPopup__OptionsLink.innerHTML = '<button><a target="_blank" href="' + chrome.extension.getURL('options/index.html') + '">options</a></button>';
sideBarPopup__Container.appendChild(sideBarPopup__Instructions);
sideBarPopup__Container.appendChild(sideBarPopup__ColumnAndPageInfo);
sideBarPopup__Container.appendChild(sideBarPopup__OptionsLink);

//
// On page load, inject into the DOM and render the correct grid. NOT revisited; visited only on page load
//
chrome.storage.sync.get({isGridEnabled: false}, function(settings) {
    'use strict';

    if (settings.isGridEnabled) {
        head.appendChild(stylesheet);
        body.insertBefore(modularGrid__Container, firstChildOfBody);
        body.appendChild(sideBarPopup__Container);

        chrome.storage.sync.get({currentGrid: 'all-grids'}, function(settings) {
            switch (settings.currentGrid) {
            case 'column-grid':

                modularGrid.className = CSS__Classes.columngrid;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridGutter: gridGutter,
                        userWantsSplitGutters: userWantsSplitGutters,
                        columnColor: columnColor,
                        columnColorTransparency: columnColorTransparency
                    },
                    function (settings) {
                        if ('true' === settings.userWantsSplitGutters) {
                            splitGutterWidth = (parseInt(settings.gridGutter, 10) / 2);
                        } else {
                            splitGutterWidth = 0;
                        }

                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: linear-gradient(90deg, ' +
                            convertHexToRGBA(settings.columnColor, settings.columnColorTransparency) + ' ' +
                            settings.gridColumn + 'px, transparent 0); ' +
                            'background-size: ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%; ' +
                            'background-position: ' + splitGutterWidth + 'px 0;');
                    }
                );

                break;

            case 'modular-grid':
                modularGrid.className = CSS__Classes.modulargrid;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridGutter: gridGutter,
                        baselineColor: colorGridBaseline,
                        baselineDistance: baselineDistance,
                        userWantsSplitGutters: userWantsSplitGutters,
                        columnColor: columnColor,
                        columnColorTransparency: columnColorTransparency
                    },
                    function (settings) {
                        if ('true' === settings.userWantsSplitGutters) {
                            splitGutterWidth = (parseInt(settings.gridGutter, 10) / 2);
                        } else {
                            splitGutterWidth = 0;
                        }

                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: linear-gradient(90deg, ' +
                            convertHexToRGBA(settings.columnColor, settings.columnColorTransparency) + ' ' +
                            settings.gridColumn + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' +
                            settings.baselineColor + ' 100%); ' +
                            'background-size: ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%, 100% ' +
                            settings.baselineDistance + 'px; ' +
                            'background-position: ' + splitGutterWidth + 'px 0;');
                    }
                );

                break;

            case 'baseline-grid':
                modularGrid.className = CSS__Classes.baselinegrid;
                chrome.storage.sync.get(
                    {
                        baselineColor: colorGridBaseline,
                        baselineDistance: baselineDistance
                    },
                    function (settings) {
                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: linear-gradient(0deg, transparent 95%, ' +
                            settings.baselineColor + ' 100%); ' +
                            'background-size: 100% ' + settings.baselineDistance + 'px');
                    }
                );

                break;

            case 'all-grids':
                modularGrid.className = CSS__Classes.allgrids;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridGutter: gridGutter,
                        baselineColor: colorGridBaseline,
                        baselineDistance: baselineDistance,
                        userWantsSplitGutters: userWantsSplitGutters,
                        columnColor: columnColor,
                        columnColorTransparency: columnColorTransparency
                    },
                    function (settings) {
                        if ('true' === settings.userWantsSplitGutters) {
                            splitGutterWidth = (parseInt(settings.gridGutter, 10) / 2);
                        } else {
                            splitGutterWidth = 0;
                        }

                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: none, linear-gradient(90deg, ' +
                            convertHexToRGBA(settings.columnColor, settings.columnColorTransparency) + ' ' +
                            settings.gridColumn + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' +
                            settings.baselineColor + ' 100%); ' +
                            'background-size: auto auto, ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%, 100% ' +
                            settings.baselineDistance + 'px; ' +
                            'background-position: 0 0, ' + splitGutterWidth + 'px 0, 0 0;');
                    }
                );

                break;

            }
        });
    }
});



chrome.extension.onMessage.addListener(function(msg) {
    if (msg.isGridEnabledViaBrowserAction) {
        head.appendChild(stylesheet);
        body.insertBefore(modularGrid__Container, firstChildOfBody);
        body.appendChild(sideBarPopup__Container);

        chrome.storage.sync.get({currentGrid: 'all-grids'}, function(settings) {
            switch (settings.currentGrid) {
            case 'column-grid':
                modularGrid.className = CSS__Classes.columngrid;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridGutter: gridGutter,
                        userWantsSplitGutters: userWantsSplitGutters,
                        columnColor: columnColor,
                        columnColorTransparency: columnColorTransparency
                    },
                    function (settings) {
                        if ('true' === settings.userWantsSplitGutters) {
                            splitGutterWidth = (parseInt(settings.gridGutter, 10) / 2);
                        } else {
                            splitGutterWidth = 0;
                        }

                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: linear-gradient(90deg, ' +
                            convertHexToRGBA(settings.columnColor, settings.columnColorTransparency) + ' ' +
                            settings.gridColumn + 'px, transparent 0); ' +
                            'background-size: ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%; ' +
                            'background-position: ' + splitGutterWidth + 'px 0;');
                    }
                );

                break;

            case 'modular-grid':
                modularGrid.className = CSS__Classes.modulargrid;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridGutter: gridGutter,
                        baselineColor: colorGridBaseline,
                        baselineDistance: baselineDistance,
                        userWantsSplitGutters: userWantsSplitGutters,
                        columnColor: columnColor,
                        columnColorTransparency: columnColorTransparency
                    },
                    function (settings) {
                        if ('true' === settings.userWantsSplitGutters) {
                            splitGutterWidth = (parseInt(settings.gridGutter, 10) / 2);
                        } else {
                            splitGutterWidth = 0;
                        }

                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: linear-gradient(90deg, ' +
                            convertHexToRGBA(settings.columnColor, settings.columnColorTransparency) + ' ' +
                            settings.gridColumn + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' +
                            settings.baselineColor + ' 100%); ' +
                            'background-size: ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%, 100% ' +
                            settings.baselineDistance + 'px; ' +
                            'background-position: ' + splitGutterWidth + 'px 0;');
                    }
                );

                break;

            case 'baseline-grid':
                modularGrid.className = CSS__Classes.baselinegrid;
                chrome.storage.sync.get(
                    {
                        baselineColor: colorGridBaseline,
                        baselineDistance: baselineDistance
                    },
                    function (settings) {
                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: linear-gradient(0deg, transparent 95%, ' +
                            settings.baselineColor + ' 100%); ' +
                            'background-size: 100% ' + settings.baselineDistance + 'px');
                    }
                );

                break;

            case 'all-grids':
                modularGrid.className = CSS__Classes.allgrids;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridGutter: gridGutter,
                        baselineColor: colorGridBaseline,
                        baselineDistance: baselineDistance,
                        userWantsSplitGutters: userWantsSplitGutters,
                        columnColor: columnColor,
                        columnColorTransparency: columnColorTransparency
                    },
                    function (settings) {
                        if ('true' === settings.userWantsSplitGutters) {
                            splitGutterWidth = (parseInt(settings.gridGutter, 10) / 2);
                        } else {
                            splitGutterWidth = 0;
                        }

                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: none, linear-gradient(90deg, ' +
                            convertHexToRGBA(settings.columnColor, settings.columnColorTransparency) + ' ' +
                            settings.gridColumn + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' +
                            settings.baselineColor + ' 100%); ' +
                            'background-size: auto auto, ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%, 100% ' +
                            settings.baselineDistance + 'px; ' +
                            'background-position: 0 0, ' + splitGutterWidth + 'px 0, 0 0;');
                    }
                );

                break;
            }
        });
    } else {
        modularGrid__Container.parentNode.removeChild(modularGrid__Container);
        sideBarPopup__Container.parentNode.removeChild(sideBarPopup__Container);
        stylesheet.parentNode.removeChild(stylesheet);
    }
});


/**
 * Accepts a Hex-formatted color and a floating point opacity value; returns its
 * <tt>rgba</tt> equivalent, or <tt>-1</tt> on error.
 *
 * @example
 * convertToRGBA('#bada55', 0.2); // Returns rgba(188, 222, 248, 0.2)
 *
 * @param hex A 7-character color value, ranging from #000000 – #ffffff. Note: this
 * function does not accept 3-character shortcuts, as in #fff, for example.
 * @param opacity A floating point number between 0.0 – 1.0.
 * @returns {string} A CSS3 rgba equivalent to the hex and opacity combination.
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function convertHexToRGBA(hex, opacity) {
    'use strict';

    //
    // TODO: Error-check the opacity variable, then remove the devel JSLint flag
    //

    let patternForHex = /^#([0-9]|[a-fA-F]){1}([0-9]|[a-fA-F]){1}([0-9]|[a-fA-F]){1}([0-9]|[a-fA-F]){1}([0-9]|[a-fA-F]){1}([0-9]|[a-fA-F]){1}$/;
    let currentNumberInNibble = 0;
    let previousNumberInNibble = 0;
    let calculateNibble = 0;
    let rgbColor = 'rgba(';
    let index;

    const HEX = 16;
    const END_OF_HEX = 6;
    const HEX_LENGTH = hex.length;

    if (null !== hex.match(patternForHex)) {
        for (index = 1; index < HEX_LENGTH; index += 1) {
            currentNumberInNibble = hex.substring(index, index + 1);

            switch (currentNumberInNibble) {
            case 'a':
            case 'A':
                currentNumberInNibble = 10;

                break;

            case 'b':
            case 'B':
                currentNumberInNibble = 11;

                break;

            case 'c':
            case 'C':
                currentNumberInNibble = 12;

                break;

            case 'd':
            case 'D':
                currentNumberInNibble = 13;

                break;

            case 'e':
            case 'E':
                currentNumberInNibble = 14;

                break;

            case 'f':
            case 'F':
                currentNumberInNibble = 15;

                break;
            }

            //
            // For every second digit, meaning we’re at the end of a nibble…
            //
            if (0 === (index % 2)) {

                //
                // Perform the math to convert from hex to decimal…
                //
                calculateNibble = (Math.pow(HEX, 1) * previousNumberInNibble + Math.pow(HEX, 0) * currentNumberInNibble);

                //
                // Append the result to the running calculation of the string…
                //
                rgbColor = rgbColor + calculateNibble;

                //
                // And, if we’re not at the end of the hex string, append a comma and a space.
                //
                if (0 !== (index % (END_OF_HEX + 2))) {
                    rgbColor = rgbColor + ', ';
                }
            }

            //
            // Keep track of the previous nibble in order to carry out the conversion in the beginning of the if
            // statement.
            //
            previousNumberInNibble = currentNumberInNibble;
        }

        //
        // We’ve arrived at the end of the conversion, so append the opacity and the closing of the string.
        //
        rgbColor = rgbColor + opacity + ')';
    } else {
        return -1;
    }

    return rgbColor;
}

/**
 * TOGGLE GRID INFO
 */
function toggleGridInfo() {
    'use strict';

    if (sideBarPopup__IsShowing) {
        sideBarPopup__Container.style.display = 'none';
        sideBarPopup__IsShowing = false;
    } else {
        sideBarPopup__Container.style.display = 'block';
        sideBarPopup__IsShowing = true;
    }
}

/**
 * SHOW COLUMN INFO
 *
 * Shows the amount of columns and the width of the viewport in a popup box
 * along the right of the viewport.
 */
function showColumnInfo() {
    'use strict';

    let currentGrid = 'none';

    if ('' === modularGrid.className) {
        currentGrid = 'none';
    } else
        currentGrid = modularGrid.className;

    sideBarPopup__ColumnAndPageInfo.innerHTML =
            'Column count: <strong>' + Math.floor(body.clientWidth / gridUnit) + '</strong>' +
            '<br>Page width: <strong>' + body.clientWidth + 'px</strong>' +
            '<br>Current grid layer: <strong>' + currentGrid + '</strong>';
}

/**
 * At every moment of the browser window resize, update the sidebar information
 * popup.
 */
window.onresize = function () {
    'use strict';

    showColumnInfo();
};

/**
 * Handles keyboard events that cycle through the various grids (using the `esc`
 * key) and that toggle the sidebar information popup appearing in the upper right
 * hand corner of the browser window (using the `cntrl` + `shift` keys).
 *
 * @param evnt is the keyboard event
 */
document.onkeydown = function (evnt) {
    'use strict';

    switch (evnt.keyCode) {
    case SHIFT_KEY:
        shiftKeyPressed = true;

        break;

    case CONTROL_KEY:
        controlKeyPressed = true;

        break;

    case ESCAPE_KEY:
        switch (gridChoice) {
        case SHOWING_NO_GRID:
            modularGrid.classList.add(CSS__Classes.columngrid);
            chrome.storage.sync.get(
                {
                    gridColumn: gridColumn,
                    gridGutter: gridGutter,
                    userWantsSplitGutters: userWantsSplitGutters,
                    columnColor: columnColor,
                    columnColorTransparency: columnColorTransparency
                },
                function (settings) {
                    if ('true' === settings.userWantsSplitGutters) {
                        splitGutterWidth = (parseInt(settings.gridGutter, 10) / 2);
                    } else {
                        splitGutterWidth = 0;
                    }

                    document.getElementById('modular-grid').setAttribute('style',
                        'height: ' + pageHeight + 'px; ' +
                        'background-image: linear-gradient(90deg, ' +
                        convertHexToRGBA(settings.columnColor, settings.columnColorTransparency) + ' ' +
                        settings.gridColumn + 'px, transparent 0); ' +
                        'background-size: ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%; ' +
                        'background-position: ' + splitGutterWidth + 'px 0;');
                }
            );

            chrome.storage.sync.set({currentGrid: CSS__Classes.columngrid});

            // modularGrid.classList.remove(
            //     'user-supplied-bg-image'
            // );
            modularGrid__Container.style.zIndex = '3';

            break;

        case SHOWING_COLUMN_GRID:
            modularGrid.classList.remove(CSS__Classes.columngrid);
            modularGrid.classList.add(CSS__Classes.modulargrid);
            chrome.storage.sync.get(
                {
                    gridColumn: gridColumn,
                    gridGutter: gridGutter,
                    baselineColor: colorGridBaseline,
                    baselineDistance: baselineDistance,
                    userWantsSplitGutters: userWantsSplitGutters,
                    columnColor: columnColor,
                    columnColorTransparency: columnColorTransparency
                },
                function (settings) {
                    if ('true' === settings.userWantsSplitGutters) {
                        splitGutterWidth = (parseInt(settings.gridGutter, 10) / 2);
                    } else {
                        splitGutterWidth = 0;
                    }

                    document.getElementById('modular-grid').setAttribute('style',
                        'height: ' + pageHeight + 'px; ' +
                        'background-image: linear-gradient(90deg, ' +
                        convertHexToRGBA(settings.columnColor, settings.columnColorTransparency) + ' ' +
                        settings.gridColumn + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' +
                        settings.baselineColor + ' 100%); ' +
                        'background-size: ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%, 100% ' +
                        settings.baselineDistance + 'px; ' +
                        'background-position: ' + splitGutterWidth + 'px 0;');
                }
            );

            chrome.storage.sync.set({currentGrid: CSS__Classes.modulargrid});

            break;

        case SHOWING_MODULAR_GRID:
            modularGrid.classList.remove(CSS__Classes.modulargrid);
            modularGrid.classList.add(CSS__Classes.baselinegrid);
            chrome.storage.sync.get(
                {
                    baselineColor: colorGridBaseline,
                    baselineDistance: baselineDistance
                },
                function (settings) {
                    document.getElementById('modular-grid').setAttribute('style',
                        'height: ' + pageHeight + 'px; ' +
                        'background-image: linear-gradient(0deg, transparent 95%, ' +
                        settings.baselineColor + ' 100%); ' +
                        'background-size: 100% ' + settings.baselineDistance + 'px');
                }
            );

            chrome.storage.sync.set({currentGrid: CSS__Classes.baselinegrid});

            break;

        case SHOWING_BASELINE_GRID:
            modularGrid.classList.remove(CSS__Classes.baselinegrid);
            modularGrid.classList.add(CSS__Classes.allgrids);
            chrome.storage.sync.get(
                {
                    gridColumn: gridColumn,
                    gridGutter: gridGutter,
                    baselineColor: colorGridBaseline,
                    baselineDistance: baselineDistance,
                    userWantsSplitGutters: userWantsSplitGutters,
                    columnColor: columnColor,
                    columnColorTransparency: columnColorTransparency
                },
                function (settings) {
                    if ('true' === settings.userWantsSplitGutters) {
                        splitGutterWidth = (parseInt(settings.gridGutter, 10) / 2);
                    } else {
                        splitGutterWidth = 0;
                    }

                    document.getElementById('modular-grid').setAttribute('style',
                        'height: ' + pageHeight + 'px; ' +
                        'background-image: none, linear-gradient(90deg, ' +
                        convertHexToRGBA(settings.columnColor, settings.columnColorTransparency) + ' ' +
                        settings.gridColumn + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' +
                        settings.baselineColor + ' 100%); ' +
                        'background-size: auto auto, ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%, 100% ' +
                        settings.baselineDistance + 'px; ' +
                        'background-position: 0 0, ' + splitGutterWidth + 'px 0, 0 0;');
                }
            );

            chrome.storage.sync.set({currentGrid: CSS__Classes.allgrids});

            break;

        case SHOWING_ALL_GRIDS:
            modularGrid.classList.remove(CSS__Classes.allgrids);
            modularGrid.removeAttribute('style');
            modularGrid__Container.style.zIndex = '-1';

            // modularGrid.classList.add('user-supplied-bg-image');

            break;

        // case SHOWING_USER_SUPPLIED_BG_IMAGE:
        //     modularGrid.classList.remove(
        //         'user-supplied-bg-image'
        //     );
        //     modularGrid__Container.style.zIndex = '-1';
        //
        //     break;
        }

        if (SHOWING_ALL_GRIDS === gridChoice) {
            gridChoice = -1;
        }

        gridChoice += 1;

        showColumnInfo();

        break;
    }

    if (shiftKeyPressed) {
        if (controlKeyPressed) {
            toggleGridInfo();
        }

        controlKeyPressed = false;
        shiftKeyPressed = false;
    }
};
