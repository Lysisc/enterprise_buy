'use strict';
module.exports = function(gulp) {
    var browserSync = require('browser-sync');
    var httpProxy = require('http-proxy');
    /* This configuration allow you to configure browser sync to proxy your backend */
    var proxyTarget = 'http://server/context/'; // The location of your backend
    var proxy = httpProxy.createProxyServer({
        target: proxyTarget
    });

    function browserSyncInit(baseDir, files, browser) {
        browser = browser === undefined ? 'default' : browser;
        browserSync.instance = browserSync.init(files, {
            notify: false,
            startPath: '/',
            server: {
                baseDir: baseDir
            },
            browser: browser
        });
    }
    // Prepare api dir for dev server
    gulp.task('api-copy', function() {
        return gulp.src('app/api/**/*').pipe(gulp.dest('dist/api'));
    });
    // Inject scripts to html for dev server.
    var inject = require('gulp-inject');
    gulp.task('html-inject', function() {
        return gulp.src('app/*.html').pipe(inject(gulp.src('app/scripts/**/*.js'), {
            read: false,
            ignorePath: 'app',
            addRootSlash: false
        })).pipe(gulp.dest('.tmp'));
    });
    gulp.task('serve', ['watch', 'html-inject'], function() {
        browserSyncInit(['.tmp', 'app'], ['app/*.html', '.tmp/styles/**/*.css', 'app/scripts/**/*.js', 'app/partials/**/*.html', 'app/images/**/*']);
    });
    gulp.task('serve:dist', ['build', 'api-copy'], function() {
        browserSyncInit('dist');
    });
    gulp.task('serve:e2e', function() {
        browserSyncInit(['.tmp', 'app'], null, []);
    });
    gulp.task('serve:e2e-dist', ['watch'], function() {
        browserSyncInit('dist', null, []);
    });
};