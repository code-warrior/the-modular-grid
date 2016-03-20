/*jslint browser: true, plusplus: true */
/*global window, document */

window.onload = function () {
    'use strict';

    var body = document.querySelector('body'),
        firstChildOfBody = body.firstElementChild,
        modularGrid = document.createElement('div'),
        gridChoice = 0;

    modularGrid.setAttribute('id', 'modular-grid');

    if (null !== firstChildOfBody) {
        body.insertBefore(modularGrid, firstChildOfBody);
    } else {
        body.textContent = 'The body element does not have a child element.';
    }

    document.onkeydown = function (evnt) {
        if (27 === evnt.keyCode) {
            switch (gridChoice) {
            case 0:
                modularGrid.classList.add('column-grid');
                modularGrid.classList.remove('user-supplied-bg-image');

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
                modularGrid.classList.remove('user-supplied-bg-image');
                break;
            }

            if (gridChoice++ === 5) {
                gridChoice = 0;
            }
        }
    };
};
