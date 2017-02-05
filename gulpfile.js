/*jslint node: true, for */

let gulp = require('gulp'),
    del = require('del'),
    renameFile = require("gulp-rename"),
    htmlMinifier = require('gulp-htmlmin'),
    htmlValidator = require('gulp-html'),
    config = require('./config.json'),
    colors = config.colors;

gulp.task('minifyHTML', function () {
    'use strict';

    return gulp.src(['src/options/index.html'])
        .pipe(htmlMinifier({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(renameFile('options.html'))
        .pipe(gulp.dest('extension'));
});

gulp.task('validateHTML', function () {
    'use strict';

    return gulp.src(['src/options/index.html']).pipe(htmlValidator());
});

gulp.task('copyRawFilesToExtensionFolder', function () {
    'use strict';

    return gulp.src([
        'src/img/**/*',
        'src/_locales/**/*',
        'src/fonts/**/*',
        'src/manifest.json',
        '!src/img/extension-installed.png',
        '!src/img/extension-loaded-into-github-desktop.png',
        '!src/img/folder-and-browser.png',
        '!src/img/saving-repo.png',
        '!src/img/screenshot--baseline-grid.png',
        '!src/img/screenshot--column-grid.png',
        '!src/img/screenshot--modular-grid.png',
        '!src/img/screenshot--settings-1.png',
        '!src/img/screenshot--settings-2.png'
    ], {base: './src/'}).pipe(gulp.dest('extension'));
});

gulp.task('clean', function () {
    'use strict';

    let fs = require('fs'),
        i,
        expendableFolders = ['extension'];

    for (i = 0; i < expendableFolders.length; i += 1) {
        try {
            fs.accessSync(expendableFolders[i], fs.F_OK);
            process.stdout.write('\n\tThe ' + colors.green + expendableFolders[i] +
                    colors.default + ' directory was found and ' + colors.green +
                    'will' + colors.default + ' be deleted.\n');
            del(expendableFolders[i]);
        } catch (error) {
            if (error) {
                process.stdout.write('\n\tThe ' + colors.red +
                        expendableFolders[i] + colors.default +
                        ' directory does ' + colors.red + 'not' + colors.default +
                        ' exist or is ' + colors.red + 'not' + colors.default +
                        ' accessible.\n');
            }
        }
    }

    process.stdout.write('\n');
});

gulp.task('default', function () {
    'use strict';

    let exec = require('child_process').exec;

    exec('gulp --tasks', function (error, stdout, stderr) {
        if (null !== error) {
            process.stdout.write('An error was likely generated when invoking ' +
                    'the `exec` program in the default task.');
        }

        if ('' !== stderr) {
            process.stdout.write('Content has been written to the stderr stream ' +
                    'when invoking the `exec` program in the default task.');
        }

        process.stdout.write('\n\tThis default task does ' + colors.red +
                'nothing' + colors.default + ' but generate this message. The ' +
                'available tasks are:\n\n' + stdout);
    });
});
