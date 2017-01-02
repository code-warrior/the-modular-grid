/*jslint browser: true */

if (undefined !== modularGrid__Container) {
    modularGrid__Container.parentNode.removeChild(modularGrid__Container);

    console.log('%c modularGrid__Container %c removed ',
        'background-color: #669; color: white; padding: 2px; border-radius: 4px;',
        'background-color: red; color: white; padding: 2px; border-radius: 4px;');
}

if (undefined !== sideBarPopup__Container) {
    sideBarPopup__Container.parentNode.removeChild(sideBarPopup__Container);

    console.log('%c sideBarPopup__Container %c removed ',
        'background-color: blue; color: white; padding: 2px; border-radius: 4px;',
        'background-color: red; color: white; padding: 2px; border-radius: 4px;');
}

if (undefined !== stylesheet) {
    stylesheet.parentNode.removeChild(stylesheet);

    console.log('%c stylesheet %c removed from head ',
        'background-color: black; color: white; padding: 2px; border-radius: 4px;',
        'background-color: red; color: white; padding: 2px; border-radius: 4px;');
}

console.log('\n');
