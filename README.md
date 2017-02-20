# The Modular Grid — A Chrome Extension
(v1.0.0)

This extension provides a series of grid overlays in web pages so web authors can better implement design translations into web pages. Some key options include the ability to change column widths and colors, gutter widths, and baseline/leading distances. The grid’s `options` page shows more, and feature requests are encouraged via GitHub issues.

- [Installation](#installation)
   * [Via GitHub Desktop Client](#github-desktop-installation)
   * [Via The Command Line](#command-line-installation)
- [Updates](#updates)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Development](#development)

![](img/screenshot--baseline-grid.png)

![](img/screenshot--modular-grid.png)

![](img/screenshot--column-grid.png)

![](img/screenshot--settings-1.png)

![](img/screenshot--settings-2.png)

## Beta Release Date
29 January 2017

## Official Release Date
Late spring 2017

## <a name="installation">Installing the Beta</a>
Installing this extension requires downloading a folder and “feeding” it to Chrome. I’ll discuss how to do this through the GitHub Desktop client and via a command line interface.

**Note**: Like most extensions, this extension is not designed to work on the extensions page found at `chrome://extensions`. Thus, do not confuse this with a bug.

### <a name="github-desktop-installation">GitHub Desktop Installation</a>
(Burden: ~8 minutes)

1. Launch [GitHub Desktop](https://desktop.github.com/).

2. Load the repo into GitHub Desktop by clicking the appropriate link below for your operating system.

   **Mac**: [`github-mac://openRepo/https://github.com/code-warrior/the-modular-grid`](github-mac://openRepo/https://github.com/code-warrior/the-modular-grid)

   **Windows**: [`github-windows://openRepo/https://github.com/code-warrior/the-modular-grid`](github-windows://openRepo/https://github.com/code-warrior/the-modular-grid)

3. Unless you choose a different name and/or location for the repo, click the blue `Clone` button.

      ![](img/saving-repo.png)

4. You should see something akin to the following:

      ![](img/extension-loaded-into-github-desktop.png)

5. Open Chrome’s extensions page by typing [`chrome://extensions`](chrome://extensions) into the address bar:

      ![](img/chromes-extensions-page.png)

6. Open the folder into which you cloned the `the-modular-grid` repo from step `3`, then locate the `extension` folder.

      ![](img/the-extension-folder-inside-the-modular-grid-folder.png)

7. Drag the `extension` folder over the `Chrome Extensions` window until a dialog box says **Drop to install**.
8. The extension is now installed.

      ![](img/extension-installed.png)

9. Click the greyish, grid-like icon to the right of the address bar to toggle the grid on/off.

### <a name="command-line-installation">Command Line Interface (CLI) Installation</a>
(Burden: ~4 minutes)

1. Launch your CLI and navigate to a folder into which to download the extension.
2. Clone the repository:

        git clone git@github.com:code-warrior/the-modular-grid

3. Switch to the version 1.0.0., release candidate 1, branch, which should be the default:

        git checkout ver1.0.0-rc1

4. Launch Chrome.
5. Type `chrome://extensions` into the address bar.
6. Locate the `the-modular-grid` folder that was created when you cloned this project in step `2`.
7. Double-click `the-modular-grid` and find the `extension` folder.
8. Drag the `extension` folder over the `Chrome Extensions` window until a dialog box says **Drop to install**.
9. The extension is now installed.
10. Click the greyish, grid-like icon to the right of the address bar to toggle the grid on/off.

### <a name="updates">Updates</a>
Once the project is stable, it will be released via the Chrome Web Store. In the meantime, you can pull updates periodically. In your CLI, simply `git pull`, and in the GitHub Desktop client, click the `Sync` icon in the upper right hand corner.

### <a name="keyboard-shortcuts">Keyboard Shortcuts</a>
`Command+Shift+E` toggles the extension in Mac.

`Alt+Shift+E` toggles the extension in Windows 10.

`Alt+Shift+E` toggles the extension in Fedora Linux.

`Ctrl+Shift` toggles the sidebar info boxes in the upper right hand corner when the extension is enabled. This shortcut is universal across all operating systems.

All text input boxes in the options page can be updated with the `↑` and `↓` arrow keys, and all options are automatically saved when values are changed.

## <a name="development">Development</a>

All development is now done via Gulp. This includes compiling CSS via Sass, compressing HTML and CSS, and linting JavaScript via ESLint.

Make sure to have Java installed, then proceed with the [installation of Node](https://nodejs.org/en/) and [Gulp](http://gulpjs.com/).

Lastly, run `npm install` to install the `node_modules`, then `gulp serve`. (Run `gulp --tasks` to see all the available development tasks.)
