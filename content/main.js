/*jslint browser: true */
/*global window */

/*
Requires an if statement to check if the grid element has already been created.
 */
'use strict';

let body = document.querySelector('body'),
    gridBGLayer = document.createElement('div'),
    columnBaselineGrid = document.createElement('div'),
    gridInfoContainer = document.createElement('div'),
    instructions = document.createElement('span'),
    columnInfo = document.createElement('span'),
    firstChildOfBody = body.firstElementChild,
    controlKeyPressed = false,
    shiftKeyPressed = false,
    gridInfoIsShowing = true,
    column = 60,
    gutter = 20,
    fullColumn = column + gutter,
    gridChoice = 3;

gridInfoContainer.style.display = 'block';

columnBaselineGrid.classList.add('all-grids');

// The modular grid that is round-robin cycled via the esc key
columnBaselineGrid.setAttribute('id', 'column-baseline-grid');
gridBGLayer.setAttribute('id', 'grid-bg');
gridBGLayer.appendChild(columnBaselineGrid);

// The information sidebar that is toggled by the key sequence cntrl + shift
gridInfoContainer.setAttribute('id', 'info-sidebar');

// The first message box inside the sidebar
instructions.setAttribute('class', 'message-box');

// The second message box displaying the grid information
columnInfo.setAttribute('class', 'message-box');
instructions.innerHTML =
    'This section can be toggled by typing <kbd>cntrl + shift</kbd>. You ' +
    'can cycle through the various grids by typing <kbd>esc</kbd>.';
columnInfo.innerHTML = 'Column count: ' +
    Math.ceil(body.clientWidth / fullColumn) +
    '<br>Page width: ' + body.clientWidth;
gridInfoContainer.appendChild(instructions);
gridInfoContainer.appendChild(columnInfo);

if (null !== firstChildOfBody) {
    body.appendChild(gridInfoContainer);
    body.insertBefore(gridBGLayer, firstChildOfBody);
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
        Math.floor(body.clientWidth / fullColumn) +
        '<br>Page width: ' + body.clientWidth;
}

window.onresize = function () {
    showColumnInfo();
};

/**
 * Keyboard mapping:
 *
 * 16 = The shift key
 * 17 = The control key
 * 27 = The esc key
 */
document.onkeydown = function (evnt) {
    switch (evnt.keyCode) {
        case 16:
            shiftKeyPressed = true;

            break;

        case 17:
            controlKeyPressed = true;

            break;

        case 27:
            switch (gridChoice) {
                case 0:
                    columnBaselineGrid.classList.add('column-grid');
                    columnBaselineGrid.classList.remove(
                        'user-supplied-bg-image'
                    );
                    gridBGLayer.style.zIndex = '3';

                    break;

                case 1:
                    columnBaselineGrid.classList.remove('column-grid');
                    columnBaselineGrid.classList.add('modular-grid');

                    break;

                case 2:
                    columnBaselineGrid.classList.remove('modular-grid');
                    columnBaselineGrid.classList.add('baseline-grid');

                    break;

                case 3:
                    columnBaselineGrid.classList.remove('baseline-grid');
                    columnBaselineGrid.classList.add('all-grids');

                    break;

                case 4:
                    columnBaselineGrid.classList.remove('all-grids');
                    columnBaselineGrid.classList.add('user-supplied-bg-image');

                    break;

                case 5:
                    columnBaselineGrid.classList.remove(
                        'user-supplied-bg-image'
                    );
                    gridBGLayer.style.zIndex = '-1';

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
