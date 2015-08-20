'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
 
gulp.task('minify', function() {
	return gulp.src('src/passenger.js')
    .pipe(uglify())
    .pipe(rename("passenger.min.js"))
    .pipe(gulp.dest('dist'));
});