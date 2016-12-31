/*jslint browser:true */
let error_styles =
    'background-color: green; color: white; padding: 2px; border-radius: 4px;';

if (undefined !== gridBGLayer) {
    gridBGLayer.parentNode.removeChild(gridBGLayer);
    console.log('%c gridBGLayer removed ', error_styles);
}

if (undefined !== gridInfoContainer) {
    gridInfoContainer.parentNode.removeChild(gridInfoContainer);

    console.log('%c gridInfoContainer removed ', error_styles);
}
