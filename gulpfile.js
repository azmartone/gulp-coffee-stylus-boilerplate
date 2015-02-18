var gulp = require('gulp');
var browserify = require('gulp-browserify');
var inject = require("gulp-inject");
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var gutil = require('gulp-util');
var del = require('del');
var nib = require('nib');


gulp.task('scripts', function() {
	del(['./build/scripts/**/*.*']);
	
	return gulp.src('src/scripts/main.coffee', { read: false })
		.pipe(browserify({
			transform: ['coffeeify'],
			extensions: ['.coffee']
		}))
		.pipe(rename('main.js'))
		.pipe(gulp.dest('./build/scripts/'))
});

 
gulp.task('styles', function () {
	del(['./build/styles/**/*.*']);

	return gulp.src('./src/styles/*.styl')
		.pipe(stylus({
			use: nib(),
			compress: true
		}))
		.pipe(gulp.dest('./build/styles/'));
});


gulp.task('copy', function () {
	del(['./build/*.*']);

	return gulp.src('./src/root/**/*.*')
		.pipe(gulp.dest('./build/'));
});


gulp.task('watch', function() {
    gulp.watch('./src/scripts/**/*.coffee', ['scripts']);
    gulp.watch('./src/styles/**/*.stylus', ['styles']);
});

//ToDo:
//ImageMin
//Copy Media
//JS Concat
//JS Minify
//Bower

gulp.task('default', ['scripts', 'styles', 'copy', 'watch'], function () {
	var target = gulp.src('./build/index.html');

	var sources = gulp.src(['./build/scripts/**/*.js', './build/styles/**/*.css'],
		{read: false});

	return target.pipe(inject(sources, {addRootSlash:false, ignorePath:'build'}))
		.pipe(gulp.dest('./build'));
});
