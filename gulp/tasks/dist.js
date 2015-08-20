'use strict';

var gulp = require('gulp');
var webpack = require('gulp-webpack');

gulp.task('dist', function () {
  return gulp.src('src/passenger.js')
    .pipe(webpack({
      output: {
        filename: 'passenger.dist.js',
        libraryTarget: 'umd'
      },
    }
  ))
  .pipe(gulp.dest('dist'));
});