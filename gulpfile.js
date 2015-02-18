var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var nib = require('nib');


// gulp.task('scripts', function() {
// 	gulp.src('./src/scripts/*.coffee')
// 		.pipe(coffee({bare: true}).on('error', gutil.log))
// 		.pipe(gulp.dest('./build/scripts/'))
// });

gulp.task('scripts', function() {
  gulp.src('src/scripts/main.coffee', { read: false })
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }))
    .pipe(rename('main.js'))
    .pipe(gulp.dest('./build/scripts/'))
});

// Options 
// Options compress 
gulp.task('styles', function () {
  gulp.src('./src/styles/*.styl')
    .pipe(stylus({
      use: nib(),
      compress: true
    }))
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('copy', function () {
  gulp.src('./src/root/**/*.*')
    .pipe(gulp.dest('./build/'));
});


gulp.task('default', ['scripts', 'styles', 'copy'], function() {
    // //a list of watchers, so it will watch all of the following files waiting for changes
    // gulp.watch('app/scripts/src/**', ['scripts']);
    // gulp.watch('app/styles/scss/**', ['styles']);
    // gulp.watch('app/images/**', ['images']);
    // gulp.watch('app/*.html', ['html']);
});

//this is our deployment task, it will set everything for deployment-ready files
// gulp.task('deploy', ['clean'], function () {
//   gulp.start('scripts-deploy', 'styles-deploy', 'html-deploy', 'images-deploy');
// });