/*jslint browser: true, plusplus: true */
/*global window, document */

window.onload = function () {
    'use strict';

    var body = document.querySelector('body'),
        firstChildOfBody = body.firstElementChild,
        modularGrid = document.createElement('div'),
        gridChoice = 0;

        grids = {
            columnGrid:   0,
            modularGrid:  1,
            baselineGrid: 2,
            allGrids:     3,
            userImage:    4,
            noGrid:       5
        };

    modularGrid.setAttribute('id', 'modular-grid');

    if (null !== firstChildOfBody) {
        body.insertBefore(modularGrid, firstChildOfBody);
    } else {
        body.textContent = 'The body element does not have a child element.';
    }

    document.onkeydown = function (evnt) {
        if (27 === evnt.keyCode) {
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
        }
    };
};
