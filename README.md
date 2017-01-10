# Modular Grid Chrome Extension
(v1.0.0)

### Beta Repository URL
[`https://github.com/code-warrior/column-baseline-grid/tree/ver1.0.0-rc1`](https://github.com/code-warrior/column-baseline-grid/tree/ver1.0.0-rc1)

## Beta Release Date
Mid January 2017

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

## Architecture
Modular Grid Chrome Browser Extension, similar to any other chrome extension follows Chrome Extension Architecture model. We divide the entire application into three sub sections.

The first, is the **Settings Layer** through which the users will modify and manipulate the characteristics, preferences and features of the Grid for their individual and different projects. In other words, this is the user interface of the extension. This layer, can be implemented through variety of methods and designs. So far we have considered several options. It might be ideal for the users to interact with the Grid settings via a **semi transparent side-tray** that overlays on the project that they are working on, or maybe all the setting should be set in a **separate tab in chrome developers toolbar**. It could also be handled through an **external page/tab**. Or maybe it should be modified through a **website on cloud** accessible to different stakeholders of the project ( designers or visual artists ). Similarly, **hybrid solutions** can also be valuable for consideration. For the alpha version of this extension, we are aiming for the overlaying side-tray which will contain all the Grid preferences/settings.

The second section is the **Content Layer**. Content layer contains all the scripts and styles that will run in the context of the user's web page/application. This layer is in charge of overlaying the Grid system on the current web page. This function is handled by injecting the Grid system and DOM elements into the current page's DOM. It also handles some inputs and interactions from users like listeners for shortcuts or changing Grid states and sizes.

The third one is the **Backend Layer**. This is where all the logic of the application lives. This layer is in charge of authentication, session handling, storage related tasks, server communication tasks and most importantly it behaves as a bridge between the **Settings Layer** and the **Content Layer**. Every change in the **Settings Layer** will essentially result in request to **Backend Layer**. Let's say the user changes the column width. That modification will translate into a request to **Backend Layer** and after the request has been resolved and confirmed there, **Backend Layer** will then trigger a request to the **Content Layer** so that it draws the grid with the new column width.

## Backend Layer
This layer is under `./background/`.

## Content Layer
This layer is under `./content/`.

## Settings Layer
This layer is under `./settings/`.

### Interactions

#### Through Keyboard Shortcuts
`esc`: Cycles through the various grids in round-robin fashion.
`cntrl + shift`: Shows and hides the most important information, which can be populated by the user via the settings section.

### Options

#### Grid Flexibility
Options: `fluid` or `fixed`.

#### Image Comparator
The Grid should give the user the ability to load an image and place it anywhere in the page’s stacking context. It’s important that the user be made aware of the stacking context. Notify the user of the under “glass” problem when the grid is at the top of the stacking context.

When an image is loaded for comparison, the user should be given the ability to choose whether the page’s content or the comparison image will dictate the height of the page.

#### Grid Layer
The Grid should give the user the ability to place the layer anywhere in the page’s stacking context. Again, it’s important that the user be made aware of the stacking context. Notify the user of the under “glass” problem when the grid is at the top of the stacking context.

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
