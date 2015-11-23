/*global window */

window.onload = function () {
    'use strict';

    var body = document.querySelector('body'),
        firstChildOfBody = body.firstElementChild,
        gridLayer = document.createElement('div'),
        styleSheet = document.styleSheets[0],
        showingGrid = true;

    gridLayer.setAttribute('id', 'column-baseline-grid');

    styleSheet.insertRule('#column-baseline-grid { height: '
        + document.body.scrollHeight
        + 'px; }', 1);

    if (null !== firstChildOfBody) {
        body.insertBefore(gridLayer, firstChildOfBody);
    } else {
        body.textContent = 'The body element does not have a child element.';
    }

    document.onkeydown = function (evnt) {
        if (27 === evnt.keyCode) {
            if (false === showingGrid) {
                gridLayer.setAttribute('id', 'column-baseline-grid');
            } else {
                gridLayer.removeAttribute('id');
            }

            showingGrid = !showingGrid;
        }
    };
};
