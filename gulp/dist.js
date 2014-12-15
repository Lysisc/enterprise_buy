'use strict';
module.exports = function (gulp, $) {
    gulp.task('cleanbuild', ['clean'], function () {
        gulp.start('build');
    });
    var repo = 'git@github.com:Lysisc/enterprise_buy.git';
    /**
     * 初始化发布目录：`gulp dist:init`
     */
    gulp.task('dist:init', function () {
        var cmd = ['rm -rf dist', 'mkdir dist && cd dist', 'git init', 'git remote add -t dist origin ' + repo, 'git fetch', 'git checkout dist'].join(' && ');
        $.run(cmd).exec();
    });
    /**
     * 编译代码并发布到指定分支
     *
     * - `gulp dist:release` 发布到 dist 分支
     */
    function pushToBranch(branch) {
        var ts = new Date;
        var commitMsg = 'Build: ' + [ts.toISOString().replace(/T.*/, ''), ts.toLocaleTimeString()].join('/');
        var cmd = ['cd dist', 'git fetch', 'git reset --soft origin/' + branch, 'git checkout ' + branch, 'git add -A', 'git commit -m "' + commitMsg + '"', 'git push origin ' + branch].join(' && ');
        return $.run(cmd).exec();
    }

    gulp.task('dist:push-to-dist', ['build'], function () {
        pushToBranch('dist');
    });
    gulp.task('dist:release', ['clean'], function () {
        gulp.start('dist:push-to-dist');
    });
};
