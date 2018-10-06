// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('../src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('../src/css'))
});

gulp.task('default', ['sass'], function() {
    gulp.watch('../src/sass/*.scss', ['sass']);
})