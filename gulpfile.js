var debowerify = require('debowerify');
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var inject = require("gulp-inject");
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var gutil = require('gulp-util');
var del = require('del');
var nib = require('nib');

var browserSync = require('browser-sync');
var reload = browserSync.reload;


gulp.task('scripts', function() {
	del(['./build/scripts/**/*.*']);
	
	return gulp.src('src/scripts/main.coffee', { read: false })
		.pipe(browserify({
			transform: ['coffeeify', 'debowerify'],
			extensions: ['.coffee', '.js']
		}))
		.pipe(rename('main.js'))
		.pipe(gulp.dest('./build/scripts/'))
        .pipe(browserSync.reload({stream:true}));
});

 
gulp.task('styles', function () {
	del(['./build/styles/**/*.*']);

	return gulp.src('./src/styles/**/*.styl')
		.pipe(stylus({
			use: nib(),
			compress: true
		}))
		.pipe(gulp.dest('./build/styles/'))
        .pipe(browserSync.reload({stream:true}));
});


gulp.task('copy', function () {
	del(['./build/*.*']);

	return gulp.src('./src/root/**/*.*')
		.pipe(gulp.dest('./build/'));
});


gulp.task('watch', function() {
    gulp.watch('./src/scripts/**/*.coffee', ['scripts']);
    gulp.watch('./src/styles/**/*.styl', ['styles']);
    gulp.watch('./gulpfile.js', ['default']);
});

gulp.task('browser-sync', ['default'], function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});

gulp.task('serve', ['browser-sync'], function () {

});

gulp.task('default', ['scripts', 'styles', 'copy', 'watch'], function () {
	var target = gulp.src('./build/index.html');

	var sources = gulp.src(['./build/scripts/**/*.js', './build/styles/**/*.css'],
		{read: false});

	return target.pipe(inject(sources, {addRootSlash:false, ignorePath:'build'}))
		.pipe(gulp.dest('./build'));
});


//ToDo:
//ImageMin
//Copy Media
//JS Concat
//JS Minify