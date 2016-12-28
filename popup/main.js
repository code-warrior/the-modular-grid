window.onload = function() {
    let powerSwitch = document.getElementById('popup--switch__input');

    chrome.runtime.sendMessage('browserActionIconClicked', function(response) {
        powerSwitch.checked = response.gridIsEnabled;
    });

    powerSwitch.addEventListener('change', function() {
        if (powerSwitch.checked) {
            chrome.runtime.sendMessage('gridEnabled');
        }
        else {
            chrome.runtime.sendMessage('gridDisabled');
        }
    }, false);
};
