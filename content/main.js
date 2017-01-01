/*jslint browser: true */
/*global window */

/*
Requires an if statement to check if the grid element has already been created.
 */
'use strict';

const SHIFT_KEY = 16,
    CONTROL_KEY = 17,
    ESCAPE_KEY = 27;

let body = document.querySelector('body'),
    modularGridContainer = document.createElement('div'),
    modularGrid = document.createElement('div'),

    gridInfoContainer = document.createElement('div'),
    instructions = document.createElement('span'),
    columnInfo = document.createElement('span'),
    firstChildOfBody = body.firstElementChild,

    //
    // Keyboard-related Booleans
    //
    controlKeyPressed = false,
    shiftKeyPressed = false,
    gridInfoIsShowing = true,

    column = 60,
    gutter = 20,
    gridUnit = column + gutter,

    gridChoice = 3;

gridInfoContainer.style.display = 'block';

modularGrid.classList.add('all-grids');

// The modular grid that is round-robin cycled via the esc key
modularGrid.id = 'modular-grid';
modularGridContainer.id = 'modular-grid--container';
modularGridContainer.appendChild(modularGrid);

// The information sidebar that is toggled by the key sequence cntrl + shift
gridInfoContainer.id = 'info-sidebar';

// The first message box inside the sidebar
instructions.setAttribute('class', 'message-box');

// The second message box displaying the grid information
columnInfo.setAttribute('class', 'message-box');
instructions.innerHTML =
    'This section can be toggled by typing <kbd>cntrl + shift</kbd>. You ' +
    'can cycle through the various grids by typing <kbd>esc</kbd>.';
columnInfo.innerHTML = 'Column count: ' +
    Math.ceil(body.clientWidth / gridUnit) +
    '<br>Page width: ' + body.clientWidth;
gridInfoContainer.appendChild(instructions);
gridInfoContainer.appendChild(columnInfo);

if (null !== firstChildOfBody) {
    body.appendChild(gridInfoContainer);
    body.insertBefore(modularGridContainer, firstChildOfBody);
} else {
    body.textContent = 'The body element does not have a child element.';
}

/**
 * TOGGLE GRID INFO
 */
function toggleGridInfo() {
    if (gridInfoIsShowing) {
        gridInfoContainer.style.display = 'none';
        gridInfoIsShowing = false;
    } else {
        gridInfoContainer.style.display = 'block';
        gridInfoIsShowing = true;
    }
}

/**
 * SHOW COLUMN INFO
 *
 * Shows the amount of columns and the width of the viewport in a popup box
 * along the right of the viewport.
 */
function showColumnInfo() {
    columnInfo.innerHTML = 'Column count: ' +
        Math.floor(body.clientWidth / gridUnit) +
        '<br>Page width: ' + body.clientWidth;
}

window.onresize = function () {
    showColumnInfo();
};

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
                case 0:
                    modularGrid.classList.add('column-grid');
                    modularGrid.classList.remove(
                        'user-supplied-bg-image'
                    );
                    modularGridContainer.style.zIndex = '3';

                    break;

                case 1:
                    modularGrid.classList.remove('column-grid');
                    modularGrid.classList.add('modular-grid');

                    break;

                case 2:
                    modularGrid.classList.remove('modular-grid');
                    modularGrid.classList.add('baseline-grid');

                    break;

                case 3:
                    modularGrid.classList.remove('baseline-grid');
                    modularGrid.classList.add('all-grids');

                    break;

                case 4:
                    modularGrid.classList.remove('all-grids');
                    modularGrid.classList.add('user-supplied-bg-image');

                    break;

                case 5:
                    modularGrid.classList.remove(
                        'user-supplied-bg-image'
                    );
                    modularGridContainer.style.zIndex = '-1';

                    break;
            }

            gridChoice += 1;

            if (6 === gridChoice) {
                gridChoice = 0;
            }

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
