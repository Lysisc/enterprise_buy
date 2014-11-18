'use strict';
module.exports = function (gulp, $) {
    var saveLicense = require('uglify-save-license');
    gulp.task('styles', function () {
        return gulp.src('app/styles/*.scss').pipe($.plumber()).pipe($.sass()).pipe($.autoprefixer('last 3 version')).pipe(gulp.dest('.tmp/styles')).pipe($.size({
            title: '------------------------- [ Styles ]'
        }));
    });
    gulp.task('scripts', function () {
        return gulp.src('app/scripts/**/*.js').pipe($.jshint()).pipe($.jshint.reporter('jshint-stylish')).pipe($.jshint.reporter('fail')).pipe($.size({
            title: '------------------------- [ Scripts ]'
        }));
    });
    gulp.task('partials', function () {
        return gulp.src('app/scripts/**/*.html').pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        })).pipe($.ngHtml2js({
            moduleName: "EPBUY",
            prefix: "scripts/"
        })).pipe(gulp.dest(".tmp/partials")).pipe($.size({
            title: '------------------------- [ Templates ]'
        }));
    });
    gulp.task('html', ['styles', 'scripts', 'partials'], function () {
        var jsFilter = $.filter('**/*.js');
        var cssFilter = $.filter('**/*.css');
        var assets = $.useref.assets();
        return gulp.src('app/*.html').pipe($.inject(gulp.src('.tmp/partials/**/*.js'), {
            read: false,
            starttag: '<!-- inject:partials -->',
            addRootSlash: false,
            addPrefix: '../'
        })).pipe($.inject(gulp.src('app/scripts/**/*.js'), {
            read: false,
            ignorePath: 'app',
            addRootSlash: false
        })).pipe(assets).pipe(jsFilter).pipe($.ngAnnotate()).pipe($.uglify({
            preserveComments: saveLicense
        })).pipe($.replace(/"use strict";/g, '')).pipe(jsFilter.restore()).pipe(cssFilter).pipe($.csso()).pipe(cssFilter.restore()).pipe(assets.restore()).pipe($.useref()).pipe($.revReplace()).pipe(gulp.dest('dist')).pipe($.size({
            title: '------------------------- [ Full Size ]'
        }));
    });
    gulp.task('images', function () {
        return gulp.src('app/images/**/*').pipe($.cache($.imagemin({
            optimizationLevel: 6,
            progressive: true,
            interlaced: true
        }))).pipe(gulp.dest('dist/images')).pipe($.size({
            title: '------------------------- [ Images ]'
        }));
    });
    gulp.task('fonts', function () {
        return gulp.src('app/fonts/*.{ttf,woff}').pipe($.flatten()).pipe(gulp.dest('dist/fonts')).pipe(gulp.dest('.tmp/fonts')).pipe($.size({
            title: '------------------------- [ Fonts ]'
        }));
    });
    gulp.task('clean', function () {
        return gulp.src(['.tmp', 'dist/*', '!dist/.git*'], {
            read: false
        }).pipe($.rimraf());
    });
    gulp.task('build', ['html', 'partials', 'images', 'fonts']);
    gulp.task('cleanbuild', ['clean'], function () {
        return gulp.start('build');
    });
    gulp.task('jshint', ['scripts']);
};
