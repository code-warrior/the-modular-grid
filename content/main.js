/*jslint browser, es6, single, for, devel */
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
    // Turn off the grid by default
    //
    grid__IsInitiallyShowing = false,

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

    gridChoice = SHOWING_ALL_GRIDS,

    colorGridColumnTransparent = 'rgba(200, 0, 0, .2)',
    colorGridBaseline = '#29abe2',
    baselineDistance = 24;

stylesheet.href = chrome.extension.getURL('content/main.css');
stylesheet.rel = 'stylesheet';
stylesheet.id = 'modular-grid-css';

sideBarPopup__Container.id = 'info-sidebar';

//
// When the extension loads, the sidebar info dialog box shows…
//
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

if (grid__IsInitiallyShowing) {
    head.appendChild(stylesheet);
    body.insertBefore(modularGrid__Container, firstChildOfBody);
    body.appendChild(sideBarPopup__Container);
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
            modularGrid.classList.add('column-grid');
            chrome.storage.sync.get(
                {
                    gridColumn: gridColumn,
                    gridGutter: gridGutter,
                    userWantsSplitGutters: userWantsSplitGutters
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
                        colorGridColumnTransparent + ' ' +
                        settings.gridColumn + 'px, transparent 0); ' +
                        'background-size: ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%; ' +
                        'background-position: ' + splitGutterWidth + 'px 0;');
                }
            );

            // modularGrid.classList.remove(
            //     'user-supplied-bg-image'
            // );
            modularGrid__Container.style.zIndex = '3';

            break;

        case SHOWING_COLUMN_GRID:
            modularGrid.classList.remove('column-grid');
            modularGrid.classList.add('modular-grid');
            chrome.storage.sync.get(
                {
                    gridColumn: gridColumn,
                    gridGutter: gridGutter,
                    baselineColor: colorGridBaseline,
                    baselineDistance: baselineDistance,
                    userWantsSplitGutters: userWantsSplitGutters
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
                        colorGridColumnTransparent + ' ' +
                        settings.gridColumn + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' +
                        settings.baselineColor + ' 100%); ' +
                        'background-size: ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%, 100% ' +
                        settings.baselineDistance + 'px; ' +
                        'background-position: ' + splitGutterWidth + 'px 0;');
                }
            );

            break;

        case SHOWING_MODULAR_GRID:
            modularGrid.classList.remove('modular-grid');
            modularGrid.classList.add('baseline-grid');
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

        case SHOWING_BASELINE_GRID:
            modularGrid.classList.remove('baseline-grid');
            modularGrid.classList.add('all-grids');
            chrome.storage.sync.get(
                {
                    gridColumn: gridColumn,
                    gridGutter: gridGutter,
                    baselineColor: colorGridBaseline,
                    baselineDistance: baselineDistance,
                    userWantsSplitGutters: userWantsSplitGutters
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
                        colorGridColumnTransparent + ' ' +
                        settings.gridColumn + 'px, transparent 0), linear-gradient(0deg, transparent 95%, ' +
                        settings.baselineColor + ' 100%); ' +
                        'background-size: auto auto, ' + (parseInt(settings.gridColumn, 10) + parseInt(settings.gridGutter, 10)) + 'px 100%, 100% ' +
                        settings.baselineDistance + 'px; ' +
                        'background-position: 0 0, ' + splitGutterWidth + 'px 0, 0 0;');
                }
            );

            break;

        case SHOWING_ALL_GRIDS:
            modularGrid.classList.remove('all-grids');
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
