/*jslint node: true */

var gulp = require('gulp'),
    config = require('./config.json'),
    colors = config.colors;

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

gulp.task('default', function () {
    'use strict';

    var exec = require('child_process').exec;

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
