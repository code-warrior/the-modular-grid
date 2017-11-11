/*jslint browser, es6, single, for, devel, multivar */
/*global window, chrome */

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
    'use strict';

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
            positionOfCurrentHTMLElement = window.document.defaultView
                .getComputedStyle(node, null)
                .getPropertyValue('position');

            if ('static' !== positionOfCurrentHTMLElement) {
                zIndexOfCurrentHTMLElement = window.document.defaultView
                    .getComputedStyle(node, null).getPropertyValue('z-index');

                if (!Number.isNaN(Number(zIndexOfCurrentHTMLElement))) {
                    zIndexOfCurrentHTMLElement =
                            parseInt(zIndexOfCurrentHTMLElement, 10);

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

    let patternForHex = /^#([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])$/;
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
                calculateNibble = (Math.pow(HEX, 1) * previousNumberInNibble +
                        Math.pow(HEX, 0) * currentNumberInNibble);

                //
                // Append the result to the running calculation of the string…
                //
                rgbColor = rgbColor + calculateNibble;

                //
                // And, if we’re not at the end of the hex string, append a comma and
                // a space.
                //
                if (0 !== (index % (END_OF_HEX + 2))) {
                    rgbColor = rgbColor + ', ';
                }
            }

            //
            // Keep track of the previous nibble in order to carry out the conversion
            // in the beginning of the if statement.
            //
            previousNumberInNibble = currentNumberInNibble;
        }

        //
        // We’ve arrived at the end of the conversion, so append the opacity and the
        // closing of the string.
        //
        rgbColor = rgbColor + opacity + ')';
    } else {
        return -1;
    }

    return rgbColor;
}

/**
 * “Delete” the event listeners by employing the only method resembling deletion:
 * null assignment.
 *
 * @returns none
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function removeEventListeners() {
    'use strict';

    document.onkeydown = null;
    window.onresize = null;
}

/**
 * Toggles the info section popup box in the upper right hand corner based on the
 * value of the global Boolean infoSidebarIsShowing.
 *
 * @returns none
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function toggleGridInfo() {
    'use strict';

    chrome.storage.sync.get(
        null,
        function (settings) {
            if (settings.infoSectionIsEnabled) {
                document.getElementById('info-sidebar').style.display = 'none';
                chrome.storage.sync.set({infoSectionIsEnabled: false});
            } else {
                document.getElementById('info-sidebar').style.display = 'block';
                chrome.storage.sync.set({infoSectionIsEnabled: true});
            }
        }
    );
}

/**
 * Shows the sidebar info content along the top right side when the grid is showing.
 *
 * @returns none
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function showColumnInfo() {
    'use strict';

    chrome.storage.sync.get(
        null,
        function (settings) {
            let root = document.querySelector('html'),
                viewportWidth = root.clientWidth,
                widthOfAllColumns = parseInt(settings.gridColumnCount, 10) *
                        (parseInt(settings.gridColumnWidth, 10) +
                        parseInt(settings.gridGutterWidth, 10)),
                columnCount = parseInt(settings.gridColumnCount, 10);

            if (viewportWidth < widthOfAllColumns) {
                columnCount = Math.floor(root.clientWidth /
                        (parseInt(settings.gridColumnWidth, 10) +
                        parseInt(settings.gridGutterWidth, 10)));
            }

            document.getElementById('column-and-page-info').innerHTML =
                    'Column count: <strong>' + columnCount + '</strong><br>' +
                    'Page width: <strong>' + viewportWidth + 'px</strong>';
        }
    );
}

/**
 * Remove the grid, which is comprised of a style sheet, the grid node, and the info
 * side bar, from the page, if either exists.
 *
 * @returns none
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function removeGrid() {
    'use strict';

    let _gridStyleSheet = document.getElementById('modular-grid-css'),
        _modularGridContainer = document.getElementById('modular-grid--container'),
        _infoSideBar = document.getElementById('info-sidebar');

    if (null !== _gridStyleSheet) {
        _gridStyleSheet.parentNode.removeChild(_gridStyleSheet);
    }

    if (null !== _modularGridContainer) {
        _modularGridContainer.parentNode.removeChild(_modularGridContainer);
    }

    if (null !== _infoSideBar) {
        _infoSideBar.parentNode.removeChild(_infoSideBar);
    }
}

/**
 * Attaches a keyboard listener in order for 1) the user to employ the combination of
 * the CONTROL_KEY and the SHIFT_KEY to toggle the upper right hand info boxes, and
 * 2) to employ the ESCAPE_KEY to cycle through the grids.
 *
 * Note: Toggling the grid extension using the three-key combination is not defined
 *       here. Instead, it’s implemented under the “commands” key in manifest.json.
 *
 * @returns none
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function addKeyboardListener() {
    'use strict';

    const
        SHIFT_KEY = 16,
        ESCAPE_KEY = 27,
        SHOWING_MODULAR_GRID = 0,
        SHOWING_COLUMN_GRID = 1,
        SHOWING_BASELINE_GRID = 2;

    let controlKeyPressed = false,
        gridChoice = SHOWING_MODULAR_GRID;

    /**
     * Handles keyboard events that cycle through the various grids (using the `esc`
     * key) and that toggle the sidebar information popup appearing in the upper
     * right hand corner of the browser window (using the `Ctrl` + `Shift` keys).
     *
     * @param evnt is the keyboard event
     */
    document.onkeydown = function (evnt) {

        let key = window.event.keyCode;

        controlKeyPressed = !!window.event.ctrlKey;

        if (controlKeyPressed) {
            if (SHIFT_KEY === key) {
                toggleGridInfo();
            }
        }

        if (ESCAPE_KEY === evnt.keyCode) {
            switch (gridChoice) {
            case SHOWING_MODULAR_GRID:
                chrome.storage.sync.set({currentGrid: 'column-grid'});

                break;

            case SHOWING_COLUMN_GRID:
                chrome.storage.sync.set({currentGrid: 'baseline-grid'});

                break;

            case SHOWING_BASELINE_GRID:
                chrome.storage.sync.set({currentGrid: 'modular-grid'});

                break;
            }

            if (SHOWING_BASELINE_GRID === gridChoice) {
                gridChoice = -1;
            }

            gridChoice += 1;
        }
    };
}

/**
 * Listen for the resizing of the viewport, updating the content in the upper right
 * info popup box on resize.
 *
 * @returns none
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function addViewportResizeListener() {
    'use strict';

    window.onresize = function () {
        showColumnInfo();
    };
}

/**
 * Paints the grid by injecting three nodes into the DOM: modularGrid__Container,
 * gridStyleSheet, and infoSection__Container.
 *
 * @returns none
 * @author Roy Vanegas <roy@thecodeeducators.com>
 */
function paintGrid() {
    'use strict';

    chrome.storage.sync.get(
        null,
        function (settings) {
            if (settings.gridIsEnabled) {
                removeGrid();

                if (settings.eventListenersEnabled) {
                    addKeyboardListener();
                    addViewportResizeListener();
                    chrome.storage.sync.set({eventListenersEnabled: !settings.eventListenersEnabled});
                }

                let html = document.querySelector('html'),
                    viewportWidth = html.clientWidth,
                    body = document.querySelector('body'),
                    firstChildOfBody = body.firstElementChild,

                    head = document.querySelector('head'),
                    gridStyleSheet = document.createElement('link'),

                    pageHeight = (undefined !== document.height)
                        ? document.height
                        : Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight ),

                    // Settings
                    _gridColumnWidth = parseFloat(settings.gridColumnWidth),
                    _gridColumnCount = parseInt(settings.gridColumnCount, 10),
                    _gridColumnColor = settings.gridColumnColor,
                    _gridGutterWidth = parseFloat(settings.gridGutterWidth),
                    _gridBaselineColor = settings.gridBaselineColor,
                    _gridBaselineDistance = settings.gridBaselineDistance,
                    _gridColumnColorOpacity = settings.gridColumnColorOpacity,
                    _gridMargin = parseFloat(settings.gridMargin),
                    _currentGrid = settings.currentGrid,

                    gridUnit = (_gridColumnWidth + _gridGutterWidth),
                    widthOfAllColumns = _gridColumnCount * gridUnit,
                    gridColumnColorRGBA = convertHexToRGBA(_gridColumnColor, _gridColumnColorOpacity),

                    //
                    // modularGrid__Container is the container of the entire grid and
                    // is appended to the <body> element as its first child. The
                    // modularGrid variable is appended to modularGrid__Container and
                    // is the layer whose background contains the varying grids
                    // displayed to the user.
                    //
                    modularGrid__Container = document.createElement('div'),
                    modularGrid = document.createElement('div'),

                    modularGrid__ZIndex,

                    //
                    // infoSection__Container is the container for the informational
                    // popup boxes that appear in the upper right hand corner. (Note:
                    // Do not confuse the use of “popup” here with the popup feature
                    // endemic to a Chrome extension.)
                    //
                    infoSection__Container = document.createElement('div'),
                    infoSection__Instructions = document.createElement('span'),
                    infoSection__ColumnAndPageInfo = document.createElement('span'),
                    infoSection__OptionsLink = document.createElement('span');

                if (viewportWidth < widthOfAllColumns) {
                    _gridColumnCount = Math.floor(viewportWidth / (_gridColumnWidth + _gridGutterWidth));
                }

                gridStyleSheet.href = chrome.extension.getURL('content.css');
                gridStyleSheet.rel = 'stylesheet';
                gridStyleSheet.id = 'modular-grid-css';

                infoSection__Container.id = 'info-sidebar';

                chrome.storage.sync.get(
                    null,
                    function (settings) {
                        if (settings.infoSectionIsEnabled) {
                            infoSection__Container.style.display = 'block';
                        } else {
                            infoSection__Container.style.display = 'none';
                        }
                    }
                );

                modularGrid.id = 'modular-grid';
                modularGrid.className = _currentGrid;

                modularGrid__Container.id = 'modular-grid--container';
                modularGrid__Container.appendChild(modularGrid);

                infoSection__Instructions.className = 'message-box';
                infoSection__ColumnAndPageInfo.className = 'message-box';
                infoSection__ColumnAndPageInfo.id = 'column-and-page-info';
                infoSection__OptionsLink.className = 'message-box';

                infoSection__Instructions.innerHTML =
                        'Type <kbd>Ctrl + Shift</kbd> to toggle this section. ' +
                        'Press <kbd>esc</kbd> to cycle through the grids.';
                infoSection__ColumnAndPageInfo.innerHTML =
                        'Column count: <strong>' + _gridColumnCount + '</strong><br>' +
                        'Page width: <strong>' + viewportWidth + 'px</strong>';
                infoSection__OptionsLink.innerHTML = 'Options';

                infoSection__Container.appendChild(infoSection__Instructions);
                infoSection__Container.appendChild(infoSection__ColumnAndPageInfo);
                infoSection__Container.appendChild(infoSection__OptionsLink);

                infoSection__OptionsLink.addEventListener('click', function () {
                    chrome.runtime.sendMessage('openOptions');
                }, false);

                modularGrid__ZIndex = getLargestZIndexOfNonStaticElements(body);

                if (null !== modularGrid__ZIndex) {
                    modularGrid__Container.setAttribute('style', 'display: block !important; z-index: ' + modularGrid__ZIndex);
                    modularGrid.style.zIndex = modularGrid__ZIndex;
                    infoSection__Container.style.zIndex = (modularGrid__ZIndex + 1);
                } else {
                    modularGrid__Container.style.zIndex = 'auto';
                    modularGrid.style.zIndex = 'auto';
                    infoSection__Container.style.zIndex = 'auto';
                }

                head.appendChild(gridStyleSheet);
                body.insertBefore(modularGrid__Container, firstChildOfBody);
                body.appendChild(infoSection__Container);

                switch (_currentGrid) {
                case 'modular-grid':
                    modularGrid.className = 'modular-grid';

                    modularGrid.setAttribute('style',
                            'display: block !important; ' +
                            'height: ' + pageHeight + 'px !important; ' +
                            'background-image: linear-gradient(90deg, ' + gridColumnColorRGBA + ' ' + _gridColumnWidth + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' + _gridBaselineColor + ' 100%) !important; ' +
                            'background-size: ' + gridUnit + 'px 100%, 100% ' + _gridBaselineDistance + 'px !important; ' +
                            'background-position: ' + _gridMargin + 'px 0 !important; ' +
                            'max-width: ' + widthOfAllColumns + 'px !important;');

                    break;

                case 'column-grid':
                    modularGrid.className = 'column-grid';

                    modularGrid.setAttribute('style',
                            'display: block !important; ' +
                            'height: ' + pageHeight + 'px !important; ' +
                            'background-image: linear-gradient(90deg, ' + gridColumnColorRGBA + ' ' + _gridColumnWidth + 'px, transparent 0) !important; ' +
                            'background-size: ' + gridUnit + 'px 100% !important; ' +
                            'background-position: ' + _gridMargin + 'px 0 !important; ' +
                            'max-width: ' + widthOfAllColumns + 'px !important;');

                    break;

                case 'baseline-grid':
                    modularGrid.className = 'baseline-grid';

                    modularGrid.setAttribute('style',
                            'display: block !important; ' +
                            'height: ' + pageHeight + 'px !important; ' +
                            'background-image: linear-gradient(0deg, transparent 95%, ' + _gridBaselineColor + ' 100%) !important; ' +
                            'background-size: 100% ' + _gridBaselineDistance + 'px !important; ' +
                            'max-width: ' + widthOfAllColumns + 'px !important;');

                    break;
                }
            } else {
                if (!settings.eventListenersEnabled) {
                    removeEventListeners();
                    chrome.storage.sync.set({eventListenersEnabled: !settings.eventListenersEnabled});
                }

                removeGrid();
            }
        }
    );
}

chrome.storage.sync.get(
    null,
    function (settings) {
        'use strict';

        if (settings.gridIsEnabled) {
            paintGrid();
            addKeyboardListener();
            addViewportResizeListener();
            chrome.storage.sync.set({eventListenersEnabled: true});
        } else {
            removeEventListeners();
            chrome.storage.sync.set({eventListenersEnabled: false});
        }
    }
);

chrome.storage.onChanged.addListener(paintGrid);
