/*jslint browser: true */
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

/*global window, chrome */


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

    //
    // Keyboard-related Booleans
    //
    controlKeyPressed = false,
    shiftKeyPressed = false,

    sideBarPopup__IsShowing = true,

    gridColumn = 60,
    gridGutter = 20,
    gridUnit = gridColumn + gridGutter,

    gridChoice = SHOWING_ALL_GRIDS;

stylesheet.href = chrome.extension.getURL('content/main.css');
stylesheet.rel = 'stylesheet';
stylesheet.id = 'modular-grid-css';

sideBarPopup__Container.id = 'info-sidebar';

if (sideBarPopup__IsShowing) {
    sideBarPopup__Container.style.display = 'block';
}

modularGrid.id = 'modular-grid';
modularGrid.className = 'all-grids';

modularGrid__Container.id = 'modular-grid--container';
modularGrid__Container.appendChild(modularGrid);

sideBarPopup__Instructions.className = 'message-box';
sideBarPopup__ColumnAndPageInfo.className = 'message-box';

sideBarPopup__Instructions.innerHTML =
    'This section can be toggled by typing <kbd>cntrl + shift</kbd>. You ' +
    'can cycle through the various grids by typing <kbd>esc</kbd>.';
sideBarPopup__ColumnAndPageInfo.innerHTML = 'Column count: ' +
    Math.ceil(body.clientWidth / gridUnit) +
    '<br>Page width: ' + body.clientWidth;
sideBarPopup__Container.appendChild(sideBarPopup__Instructions);
sideBarPopup__Container.appendChild(sideBarPopup__ColumnAndPageInfo);

if (null !== firstChildOfBody) {
    body.appendChild(sideBarPopup__Container);
    head.appendChild(stylesheet);
    body.insertBefore(modularGrid__Container, firstChildOfBody);
} else {
    body.textContent = 'The body element does not have a child element.';
}

/**
 * TOGGLE GRID INFO
 */
function toggleGridInfo() {
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
    sideBarPopup__ColumnAndPageInfo.innerHTML = 'Column count: ' +
        Math.floor(body.clientWidth / gridUnit) +
        '<br>Page width: ' + body.clientWidth;
}

/**
 *
 */
window.onresize = function () {
    showColumnInfo();
};

/**
 *
 * @param evnt
 */
document.onkeydown = function (evnt) {
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
                    modularGrid.classList.remove(
                        'user-supplied-bg-image'
                    );
                    modularGrid__Container.style.zIndex = '3';

                    break;

                case SHOWING_COLUMN_GRID:
                    modularGrid.classList.remove('column-grid');
                    modularGrid.classList.add('modular-grid');

                    break;

                case SHOWING_MODULAR_GRID:
                    modularGrid.classList.remove('modular-grid');
                    modularGrid.classList.add('baseline-grid');

                    break;

                case SHOWING_BASELINE_GRID:
                    modularGrid.classList.remove('baseline-grid');
                    modularGrid.classList.add('all-grids');

                    break;

                case SHOWING_ALL_GRIDS:
                    modularGrid.classList.remove('all-grids');
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
