/*jslint browser: true, plusplus: true */
/*global window, document */

window.onload = function () {
    'use strict';

    var body                  = document.querySelector('body'),
        modularGridContainer  = document.createElement('div'),
        modularGrid           = document.createElement('div'),
        gridSettingsContainer = document.createElement('section'),
        columnInfo            = document.createElement('p'),
        firstChildOfBody      = body.firstElementChild,
        controlKeyPressed     = false,
        shiftKeyPressed       = false,
        gridSettingsAreShowing= true,
        column                = 60,
        gutter                = column / 3,
        fullColumn            = column + gutter,
        gridChoice            = 0,
        grids = {
            columnGrid:   0,
            modularGrid:  1,
            baselineGrid: 2,
            allGrids:     3,
            userImage:    4,
            noGrid:       5
        },
        keyboard = {
            shiftKey:   16,
            controlKey: 17,
            escapeKey:  27
        };

    modularGridContainer.setAttribute('id', 'modular-grid-container');
    modularGrid.setAttribute('id', 'modular-grid');
    modularGridContainer.appendChild(modularGrid);

    /**
     * Toggle the fixed wrapper containing the grid settings data that appear along
     * the right side of the viewport.
     */
    function toggleGridSettingsDisplay() {
        if (gridSettingsAreShowing) {
            gridSettingsContainer.style.display = 'none';
            gridSettingsAreShowing = false;
        } else {
            gridSettingsContainer.style.display = 'block';
            gridSettingsAreShowing = true;
        }
    }

    /**
     *
     */
    window.onresize = function() {
        columnInfo.innerHTML = 'Column count: ' +
            (Math.ceil((body.clientWidth / fullColumn)) +
            '<br>Page width: ' + body.clientWidth);
    };

    if (null !== firstChildOfBody) {
        body.appendChild(gridSettingsContainer);
        body.insertBefore(modularGridContainer, firstChildOfBody);
    } else {
        body.textContent = 'The body element does not have a child element.';
    }

    /**
     * Pressing the `esc` key cycles through the different grids. Pressing the
     * `cntrl` key followed by the `shift` key toggles the grid settings info layer
     * that appears along the right side of the viewport.
     *
     * @param {Object} keyboard event - The key press entered by the user.
     */
    document.onkeydown = function (evnt) {
        switch (evnt.keyCode) {
            case keyboard.shiftKey:
                shiftKeyPressed = true;

                break;

            case keyboard.controlKey:
                controlKeyPressed = true;

                break;

            case keyboard.escapeKey:
                switch (gridChoice) {
                    case grids.columnGrid:
                        modularGrid.classList.add('column-grid');
                        modularGrid.classList.remove('user-supplied-bg-image');

                        break;

                    case grids.modularGrid:
                        modularGrid.classList.remove('column-grid');
                        modularGrid.classList.add('modular-grid');

                        break;

                    case grids.baselineGrid:
                        modularGrid.classList.remove('modular-grid');
                        modularGrid.classList.add('baseline-grid');

                        break;

                    case grids.allGrids:
                        modularGrid.classList.remove('baseline-grid');
                        modularGrid.classList.add('all-grids');

                        break;

                    case grids.userImage:
                        modularGrid.classList.remove('all-grids');
                        modularGrid.classList.add('user-supplied-bg-image');

                        break;

                    case grids.noGrid:
                        modularGrid.classList.remove('user-supplied-bg-image');

                        break;
                }

                /**
                 * If you have reached the end of the escape key round robin cycle,
                 * set the gridChoice variable to grids.columnGrid, which is
                 * synonymous with the number 0.
                 */
                if (gridChoice++ === grids.noGrid) {
                    gridChoice = grids.columnGrid;
                }

                break;
        }

        if (shiftKeyPressed) {
            if (controlKeyPressed) {
                toggleGridSettingsDisplay();
            }

            controlKeyPressed = shiftKeyPressed = false;
        }
    };
};
