# Modular Grid Chrome Extension
(v1.0.0)

### Beta Repository URL
[`https://github.com/code-warrior/column-baseline-grid/tree/ver1.0.0-rc1`](https://github.com/code-warrior/column-baseline-grid/tree/ver1.0.0-rc1)

## Beta Release Date
29 January 2017

## Installing the Beta
Installing this extension requires downloading a folder and “feeding” it to Chrome. I’ll discuss how to do this through a command line interface.

### Command Line Interface (CLI) Installation
1. Launch your CLI and navigate to a folder into which to download the extension.
2. Clone the repository:

        git clone git@github.com:code-warrior/column-baseline-grid.git

3. Switch to the version 1.0.0., release candidate 1 branch:

        git checkout ver1.0.0-rc1

4. Launch Chrome.
5. Type `chrome://extensions` into the address bar.
6. Locate the `column-baseline-grid` folder that was created when you cloned this project in step `2`.
7. Drag the folder over the `Chrome Extensions` window.
8. A greyish, grid-like icon should now appear to the right of the address bar. Click it to toggle the grid on/off.

### Updates
Once the project is stable, it will be released via the Chrome Web Store. In the meantime, you can pull updates periodically via the `git pull` command.

### Keyboard Shortcuts
`Cntrl+Shift` enables/disables the sidebar info boxes in the upper right hand corner.

`Command+Shift+A` enables/disables the extension.

## Development

### Compiling

#### Sass
````bash
\sass \
   --sourcemap=none \
   --unix-newlines \
   --no-cache \
   --style compressed \
   --watch content/main.scss:content/main.css \
      options/main.scss:options/main.css
````

### Linting

#### Sass
````bash
sass-lint -c .sass-lint.yml -v -s .
````
