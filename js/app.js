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
        gridSettingsShowing   = true,
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
        };

    modularGridContainer.setAttribute('id', 'modular-grid-container');
    modularGrid.setAttribute('id', 'modular-grid');
    modularGridContainer.appendChild(modularGrid);

    /**
     *
     */
    function toggleGridSettingsDisplay() {
        if (gridSettingsShowing) {
            gridSettingsContainer.style.display = 'none';
            gridSettingsShowing = false;
        } else {
            gridSettingsContainer.style.display = 'block';
            gridSettingsShowing = true;
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
        body.insertBefore(modularGridContainer, firstChildOfBody);
    } else {
        body.textContent = 'The body element does not have a child element.';
    }

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
