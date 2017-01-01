/*jslint browser:true */

let error_styles =
    'background-color: green; color: white; padding: 2px; border-radius: 4px;';

if (undefined !== modularGridContainer) {
    modularGridContainer.parentNode.removeChild(modularGridContainer);

    console.log('%c modularGridContainer removed ', error_styles);
}

if (undefined !== gridInfoContainer) {
    gridInfoContainer.parentNode.removeChild(gridInfoContainer);

    console.log('%c gridInfoContainer removed ', error_styles);
}
