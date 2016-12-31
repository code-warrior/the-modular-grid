/*jslint browser:true */
let error_styles =
    'background-color: green; color: white; padding: 2px; border-radius: 4px;';

if (undefined !== gridBGLayer) {
    gridBGLayer.parentNode.removeChild(gridBGLayer);
    console.log('%c gridBGLayer removed ', error_styles);
}

    console.log('%c gridBGLayer removed ',
        'background-color: green; color: white; padding: 4px; border-radius: 4px;');
}
