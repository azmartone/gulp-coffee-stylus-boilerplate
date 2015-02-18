var gulp = require('gulp');
var browserify = require('gulp-browserify');
var inject = require("gulp-inject");
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var gutil = require('gulp-util');
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


// gulp.task('copy', function () {
//   gulp.src('./src/root/**/*.*')
//     .pipe(gulp.dest('./build/'));

//   var target = gulp.src('./build/index.html');
//   // It's not necessary to read the files (will speed up things), we're only after their paths: 
//   var sources = gulp.src(['./build/scripts/**/*.js', './build/styles/**/*.css'], {read: false});
 
//   return target.pipe(inject(sources))
//     .pipe(gulp.dest('./build'));
// });

gulp.task('copy', function () {
  gulp.src('./src/root/**/*.*')
    .pipe(gulp.dest('./build/'));
});

gulp.task('index', function () {
  var target = gulp.src('./build/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./build/scripts/**/*.js', './build/styles/**/*.css'], {read: false});
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./build'));
});


gulp.task('default', ['scripts', 'styles', 'copy', 'index'], function() {
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