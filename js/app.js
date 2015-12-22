/*jslint browser: true, plusplus: true */
/*global window, document */

window.onload = function () {
    'use strict';

    var body = document.querySelector('body'),
        firstChildOfBody = body.firstElementChild,
        gridLayer = document.createElement('div'),
        gridChoice = 1;

    gridLayer.setAttribute('id', 'column-baseline-grid');

    if (null !== firstChildOfBody) {
        body.insertBefore(gridLayer, firstChildOfBody);
    } else {
        body.textContent = 'The body element does not have a child element.';
    }

    gridLayer.setAttribute('class', 'all-grids');

    document.onkeydown = function (evnt) {
        if (27 === evnt.keyCode) {
            switch (gridChoice) {
            case 0:
                gridLayer.classList.add('all-grids');

                break;
            case 1:
                gridLayer.classList.remove('all-grids');
                gridLayer.classList.add('modular-grid');

                break;
            case 2:
                gridLayer.classList.remove('modular-grid');
                gridLayer.classList.add('column-grid');

                break;
            case 3:
                gridLayer.classList.remove('column-grid');
                gridLayer.classList.add('baseline-grid');

                break;
            case 4:
                gridLayer.classList.remove('baseline-grid');

                break;
            }

            if (gridChoice++ === 4) {
                gridChoice = 0;
            }
        }
    };
};
