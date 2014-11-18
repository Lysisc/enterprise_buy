'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

require('./gulp/build.js')(gulp, $);
require('./gulp/dist.js')(gulp, $);
require('./gulp/server.js')(gulp, $);
require('./gulp/watch.js')(gulp, $);

gulp.task('default', function () {
    return gulp.start('cleanbuild');
});
