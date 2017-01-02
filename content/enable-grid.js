/*jslint browser: true */

if (undefined !== modularGrid__Container) {
    body.insertBefore(modularGrid__Container, firstChildOfBody);

    console.log('%c modularGrid__Container %c inserted into body ',
        'background-color: #669; color: white; padding: 2px; border-radius: 4px;',
        'background-color: green; color: white; padding: 2px; border-radius: 4px;');
}

if (undefined !== sideBarPopup__Container) {
    body.appendChild(sideBarPopup__Container);

    console.log('%c sideBarPopup__Container %c inserted into body ',
        'background-color: blue; color: white; padding: 2px; border-radius: 4px;',
        'background-color: green; color: white; padding: 2px; border-radius: 4px;');
}

if (undefined !== stylesheet) {
    head.appendChild(stylesheet);

    console.log('%c stylesheet %c appended to head ',
        'background-color: black; color: white; padding: 2px; border-radius: 4px;',
        'background-color: green; color: white; padding: 2px; border-radius: 4px;');
}

console.log('\n');
