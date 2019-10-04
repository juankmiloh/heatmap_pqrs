var gulp = require('gulp'),
browserSync = require('browser-sync').create();

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: 'public'
    },
    // port: 6000,
    // reloadOnRestart: true
  });
});

gulp.task('publish', function () {
    gulp.src(['src/*.html', 'src/**/*.js', 'src/**/*.css', 'src/**/*.*'])
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
    gulp.watch(['src/*.html', 'src/**/*.js', 'src/**/*.css', 'src/**/*.*'], ['publish', browserSync.reload]);
});

gulp.task('default', ['watch', 'publish', 'browser-sync'], function () {

});
