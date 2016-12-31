/*jslint browser:true */

if (undefined !== gridBGLayer) {
    gridBGLayer.parentNode.removeChild(gridBGLayer);

    console.log('%c gridBGLayer removed ',
        'background-color: green; color: white; padding: 4px; border-radius: 4px;');
}
