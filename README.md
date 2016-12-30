# Modular Grid Chrome Extension

## Beta Release Date
Late January 2017

## Website
Pending

## Repository URL
https://github.com/code-warrior/column-baseline-grid

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
`cntrl + shift` (in succession): Shows and hides the most important information, which can be populated by the user via the settings section.

### Options

#### Grid Flexibility
Options: `fluid` or `fixed`.

#### Leading
Options: `36px`, `24px`, or user-specified.

#### Columns
##### Width
Options: `75px`, `60px`,`48px` or user-specified.

As a hint, choosing `75px` should generate a `25px` gutter width, choosing`60px` should generate a `20px` gutter width, and `48px` should generate a `16px` gutter width.

#### Gutters

##### Width
Options: `25px`, `20px`, `16px`, or user-specified.

#### Image Comparator
The Grid should give the user the ability to load an image and place it anywhere in the page’s stacking context. It’s important that the user be made aware of the stacking context. Notify the user of the under “glass” problem when the grid is at the top of the stacking context.

When an image is loaded for comparison, the user should be given the ability to choose whether the page’s content or the comparison image will dictate the height of the page.

#### Grid Layer
The Grid should give the user the ability to place the layer anywhere in the page’s stacking context. Again, it’s important that the user be made aware of the stacking context. Notify the user of the under “glass” problem when the grid is at the top of the stacking context.

## Linting

### Sass

````
sass-lint -c .sass-lint.yml -v -s .
````
