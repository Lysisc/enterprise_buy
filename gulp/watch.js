'use strict';
module.exports = function(gulp) {
	
	gulp.task('watch', ['scripts', 'styles', 'fonts'], function() {
		gulp.watch('app/**/*.scss', ['styles']);
		gulp.watch('app/images/**/*', ['images']);
	});

};