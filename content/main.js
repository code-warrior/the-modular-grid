/*jslint browser, es6, single, for, devel, multivar */
/*global window, chrome */

const
    SHIFT_KEY = 16,
    CONTROL_KEY = 17,
    ESCAPE_KEY = 27,
    SHOWING_NO_GRID = 0,
    SHOWING_COLUMN_GRID = 1,
    SHOWING_MODULAR_GRID = 2,
    SHOWING_BASELINE_GRID = 3,
    SHOWING_ALL_GRIDS = 4;

let html = document.querySelector('html'),
    body = document.querySelector('body'),
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

    modularGrid__ZIndex = null,

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
    splitGutterWidth = gridGutter / 2,
    gridColumnCount = 16 * (gridColumn + gridGutter),
    userWantsSplitGutters = true,
    pageHeight = (undefined !== document.height)
        ? document.height
        : document.body.offsetHeight,

    // TODO: May not need this any more
    gridChoice = SHOWING_ALL_GRIDS,

    CSS__Classes = {
        columngrid: 'column-grid',
        modulargrid: 'modular-grid',
        baselinegrid: 'baseline-grid',
        allgrids: 'all-grids',
        none: 'none'
    },

    columnColor = '#c80000',
    columnColorTransparency = 0.2,
    colorGridBaseline = '#29abe2',

    baselineDistance = 24;

stylesheet.href = chrome.extension.getURL('content/main.css');
stylesheet.rel = 'stylesheet';
stylesheet.id = 'modular-grid-css';

sideBarPopup__Container.id = 'info-sidebar';

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
sideBarPopup__ColumnAndPageInfo.id = 'column-and-page-info';
sideBarPopup__OptionsLink.className = 'message-box';

sideBarPopup__Instructions.innerHTML =
        'Toggle this section by typing <kbd>Ctrl + Shift</kbd>, and ' +
        'cycle through the grids by pressing <kbd>esc</kbd>.';

chrome.storage.sync.get(
    {
        currentGrid: CSS__Classes.allgrids,
        gridColumn: gridColumn,
        gridGutter: gridGutter
    },
    function(settings) {
        sideBarPopup__ColumnAndPageInfo.innerHTML =
            'Column count: <strong>' + Math.floor(html.clientWidth / (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + '</strong>' +
            '<br>Page width: <strong>' + html.clientWidth + 'px</strong>' +
            '<br>Current grid layer: <strong>' + settings.currentGrid + '</strong>';
    }
);

sideBarPopup__Container.appendChild(sideBarPopup__Instructions);
sideBarPopup__Container.appendChild(sideBarPopup__ColumnAndPageInfo);
sideBarPopup__Container.appendChild(sideBarPopup__OptionsLink);

sideBarPopup__OptionsLink.innerHTML = 'Options';
sideBarPopup__OptionsLink.addEventListener('click', function() {
    'use strict';

    chrome.runtime.sendMessage('openOptions');
});
/**
 * Returns the largest z-index of all non-static elements in the tree whose root is
 * at the HTML element named in node.
 *
 * @example
 * let body = document.getElementsByTagName('body')[0],
 *     largestZIndex = getLargestZIndexOfNonStaticElements(body);
 *
 * @param node is the root node at which to start traversing the DOM, inspecting for
 * z-index values.
 * @returns {*} an integer representing the largest z-index in the DOM, or null if
 * one is not calculated.
 */
function getLargestZIndexOfNonStaticElements(node) {
    let largestZIndexThusFar = null,
        zIndexOfCurrentHTMLElement = 0,
        occurrencesOfAuto = 0,
        positionOfCurrentHTMLElement = '';

    const HTML_ELEMENT = 1;

    if (undefined === node.nodeType) {
        console.error(node + ' is not a valid HTML node.');

        return;
    }

    function calculateLargestZIndex(node) {
        if (HTML_ELEMENT === node.nodeType) {
            positionOfCurrentHTMLElement = window.document.defaultView.getComputedStyle(node, null).getPropertyValue('position');

            if ('static' !== positionOfCurrentHTMLElement) {
                zIndexOfCurrentHTMLElement = window.document.defaultView.getComputedStyle(node, null).getPropertyValue('z-index');

                if (!Number.isNaN(Number(zIndexOfCurrentHTMLElement))) {
                    zIndexOfCurrentHTMLElement = parseInt(zIndexOfCurrentHTMLElement, 10);

                    if (null === largestZIndexThusFar) {
                        largestZIndexThusFar = zIndexOfCurrentHTMLElement;
                    } else {
                        if (zIndexOfCurrentHTMLElement > largestZIndexThusFar) {
                            largestZIndexThusFar = zIndexOfCurrentHTMLElement;
                        }
                    }
                } else {
                    //
                    // Note: The “inherit” case is not handled.
                    //
                    if ('auto' === zIndexOfCurrentHTMLElement) {
                        occurrencesOfAuto = occurrencesOfAuto + 1;
                    }
                }
            }

            node = node.firstChild;

            while (node) {
                calculateLargestZIndex(node);
                node = node.nextSibling;
            }
        }
    }

    calculateLargestZIndex(node);

    if (null === largestZIndexThusFar) {
        return occurrencesOfAuto;
    } else {
        return largestZIndexThusFar + occurrencesOfAuto;
    }
}

modularGrid__ZIndex = getLargestZIndexOfNonStaticElements(body);

if (null !== modularGrid__ZIndex) {
    modularGrid__Container.style.zIndex = modularGrid__ZIndex;
    modularGrid.style.zIndex = modularGrid__ZIndex;
    sideBarPopup__Container.style.zIndex = (modularGrid__ZIndex + 1);
} else {
    modularGrid__Container.style.zIndex = 'auto';
    modularGrid.style.zIndex = 'auto';
    sideBarPopup__Container.style.zIndex = 'auto';
}

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
 * Invoked when the page is loaded
 */
chrome.storage.sync.get(
    {
        isGridEnabled: false,
        gridColumn: gridColumn,
        gridColumnCount: gridColumnCount,
        gridGutter: gridGutter,
        baselineColor: colorGridBaseline,
        baselineDistance: baselineDistance,
        userWantsSplitGutters: userWantsSplitGutters,
        columnColor: columnColor,
        columnColorTransparency: columnColorTransparency,
        currentGrid: SHOWING_ALL_GRIDS
    },
    function (settings) {
        'use strict';

        if (settings.isGridEnabled) {
            head.appendChild(stylesheet);
            body.insertBefore(modularGrid__Container, firstChildOfBody);
            sideBarPopup__ColumnAndPageInfo.innerHTML =
                'Column count: <strong>' + Math.floor(html.clientWidth / (parseInt(settings.gridColumn,10) + parseInt(settings.gridGutter,10))) + '</strong>' +
                '<br>Page width: <strong>' + html.clientWidth + 'px</strong>' +
                '<br>Current grid layer: <strong>' + settings.currentGrid + '</strong>';

            body.appendChild(sideBarPopup__Container);

            switch (settings.currentGrid) {
            case 'column-grid':
                modularGrid.className = CSS__Classes.columngrid;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridColumnCount: gridColumnCount,
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
                            'background-position: ' + splitGutterWidth + 'px 0; ' +
                            'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');
                    }
                );

                break;

            case 'modular-grid':
                modularGrid.className = CSS__Classes.modulargrid;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridColumnCount: gridColumnCount,
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
                            'background-position: ' + splitGutterWidth + 'px 0; ' +
                            'max-width: ' + parseInt(settings.gridColumnCount, 10) + 'px');
                    }
                );

                break;

            case 'baseline-grid':
                modularGrid.className = CSS__Classes.baselinegrid;
                chrome.storage.sync.get(
                    {
                        gridColumnCount: gridColumnCount,
                        baselineColor: colorGridBaseline,
                        baselineDistance: baselineDistance
                    },
                    function (settings) {
                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: linear-gradient(0deg, transparent 95%, ' +
                            settings.baselineColor + ' 100%); ' +
                            'background-size: 100% ' + settings.baselineDistance + 'px; ' +
                            'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');
                    }
                );

                break;

            case 'all-grids':
                modularGrid.className = CSS__Classes.allgrids;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridColumnCount: gridColumnCount,
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
                            'background-position: 0 0, ' + splitGutterWidth + 'px 0, 0 0; ' +
                            'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');
                    }
                );

                break;
            }
        }
    }
);

chrome.extension.onMessage.addListener(function (msg) {
    'use strict';

    if (msg.isGridEnabledViaBrowserAction) {
        head.appendChild(stylesheet);
        body.insertBefore(modularGrid__Container, firstChildOfBody);
        body.appendChild(sideBarPopup__Container);

        chrome.storage.sync.get({currentGrid: 'all-grids'}, function (settings) {
            switch (settings.currentGrid) {
            case 'column-grid':
                modularGrid.className = CSS__Classes.columngrid;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridColumnCount: gridColumnCount,
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
                                'background-position: ' + splitGutterWidth + 'px 0; ' +
                                'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');
                    }
                );

                break;

            case 'modular-grid':
                modularGrid.className = CSS__Classes.modulargrid;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridColumnCount: gridColumnCount,
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
                                'background-position: ' + splitGutterWidth + 'px 0; ' +
                                'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');
                    }
                );

                break;

            case 'baseline-grid':
                modularGrid.className = CSS__Classes.baselinegrid;
                chrome.storage.sync.get(
                    {
                        gridColumnCount: gridColumnCount,
                        baselineColor: colorGridBaseline,
                        baselineDistance: baselineDistance
                    },
                    function (settings) {
                        document.getElementById('modular-grid').setAttribute('style',
                                'height: ' + pageHeight + 'px; ' +
                                'background-image: linear-gradient(0deg, transparent 95%, ' +
                                settings.baselineColor + ' 100%); ' +
                                'background-size: 100% ' + settings.baselineDistance + 'px; ' +
                                'max-width: ' + parseInt(settings.gridColumnCount, 10) + 'px');
                    }
                );

                break;

            case 'all-grids':
                modularGrid.className = CSS__Classes.allgrids;
                chrome.storage.sync.get(
                    {
                        gridColumn: gridColumn,
                        gridColumnCount: gridColumnCount,
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
                                'background-position: 0 0, ' + splitGutterWidth + 'px 0, 0 0; ' +
                                'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');
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

function showColumnInfo() {
    'use strict';

    chrome.storage.sync.get(
        {
            currentGrid: CSS__Classes.allgrids,
            gridColumn: gridColumn,
            gridGutter: gridGutter
        },
        function(settings) {
            document.getElementById('column-and-page-info').innerHTML =
                'Column count: <strong>' + Math.floor(html.clientWidth / (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + '</strong>' +
                '<br>Page width: <strong>' + html.clientWidth + 'px</strong>' +
                '<br>Current grid layer: <strong>' + settings.currentGrid + '</strong>';
        }
    );
}

window.onresize = function () {
    'use strict';

    showColumnInfo();
};

/**
 * Handles keyboard events that cycle through the various grids (using the `esc`
 * key) and that toggle the sidebar information popup appearing in the upper right
 * hand corner of the browser window (using the `Ctrl` + `Shift` keys).
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
        chrome.storage.sync.get(
            {
                isGridEnabled: false,
                gridColumn: gridColumn,
                gridColumnCount: gridColumnCount,
                gridGutter: gridGutter,
                baselineColor: colorGridBaseline,
                baselineDistance: baselineDistance,
                userWantsSplitGutters: userWantsSplitGutters,
                columnColor: columnColor,
                columnColorTransparency: columnColorTransparency,
                currentGrid: SHOWING_ALL_GRIDS
            },
            function (settings) {
                'use strict';

                if (settings.isGridEnabled) {
                    switch (gridChoice) {
                    case SHOWING_NO_GRID:
                        modularGrid.classList.add(CSS__Classes.columngrid);

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
                            'background-position: ' + splitGutterWidth + 'px 0; ' +
                            'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');

                        chrome.storage.sync.set({currentGrid: CSS__Classes.columngrid});

                        break;

                    case SHOWING_COLUMN_GRID:
                        modularGrid.classList.remove(CSS__Classes.columngrid);
                        modularGrid.classList.add(CSS__Classes.modulargrid);

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
                            'background-position: ' + splitGutterWidth + 'px 0; ' +
                            'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');

                        chrome.storage.sync.set({currentGrid: CSS__Classes.modulargrid});

                        break;

                    case SHOWING_MODULAR_GRID:
                        modularGrid.classList.remove(CSS__Classes.modulargrid);
                        modularGrid.classList.add(CSS__Classes.baselinegrid);

                        document.getElementById('modular-grid').setAttribute('style',
                            'height: ' + pageHeight + 'px; ' +
                            'background-image: linear-gradient(0deg, transparent 95%, ' +
                            settings.baselineColor + ' 100%); ' +
                            'background-size: 100% ' + settings.baselineDistance + 'px; ' +
                            'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');

                        chrome.storage.sync.set({currentGrid: CSS__Classes.baselinegrid});

                        break;

                    case SHOWING_BASELINE_GRID:
                        modularGrid.classList.remove(CSS__Classes.baselinegrid);
                        modularGrid.classList.add(CSS__Classes.allgrids);

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
                            'background-position: 0 0, ' + splitGutterWidth + 'px 0, 0 0; ' +
                            'max-width: ' + (parseInt(settings.gridColumnCount, 10) * (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10))) + 'px;');

                        chrome.storage.sync.set({currentGrid: CSS__Classes.allgrids});

                        break;

                    case SHOWING_ALL_GRIDS:
                        modularGrid.classList.remove(CSS__Classes.allgrids);
                        modularGrid.removeAttribute('style');

                        chrome.storage.sync.set({currentGrid: CSS__Classes.none});

                        break;

                    }

                    if (SHOWING_ALL_GRIDS === gridChoice) {
                        gridChoice = -1;
                    }

                    gridChoice += 1;

                    showColumnInfo();
                }
            }
        );

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
