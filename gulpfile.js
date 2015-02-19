var browserSync = require('browser-sync');
var debowerify  = require('debowerify');
var del         = require('del');
var gulp        = require('gulp');
var concat      = require('gulp-concat');
var browserify  = require('gulp-browserify');
var Filter      = require('gulp-filter');
var imagemin    = require('gulp-imagemin');
var inject      = require("gulp-inject");
var minifyCSS   = require('gulp-minify-css');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var stylus      = require('gulp-stylus');
var gutil       = require('gulp-util');
var uglify      = require('gulp-uglify');
var pngquant    = require('imagemin-pngquant');
var runSequence = require('run-sequence');
var nib         = require('nib');

var reload = browserSync.reload;

var Config = {
	paths: {
		src:   {
			root:     'src/root',
			styles:   'src/styles',
			scripts:  'src/scripts',
			media:    'src/media'
		},
		build: {
			root:     'build',
			styles:   'build/styles',
			scripts:  'build/scripts',
			media:    'build/media'
		}
	}
}

/***** SCRIPTS *****/

gulp.task('scripts', function() {
	del([ Config.paths.build.scripts + '/**/*.*' ]);

	if (Config.mode === 'build'){	
		return gulp.src( Config.paths.src.scripts + '/main.coffee', { read: false })
			.pipe(browserify({
				debug: true,
				transform: ['coffeeify', 'debowerify'],
				extensions: ['.coffee', '.js']
			}))
			.pipe(rename('app.js'))
			.pipe(gulp.dest( Config.paths.build.scripts + '/' ))
			.pipe(browserSync.reload({stream:true}));

	}else if (Config.mode === 'dist'){
		return gulp.src( Config.paths.src.scripts + '/main.coffee', { read: false })
			.pipe(browserify({
					transform: ['coffeeify', 'debowerify'],
					extensions: ['.coffee', '.js']
				}))
			.pipe(uglify())
			.pipe(rename('app.js'))
			.pipe(gulp.dest( Config.paths.build.scripts + '/' ))
			.pipe(browserSync.reload({stream:true}));
	}
});

 
/***** STYLES *****/

gulp.task('styles', function () {
	var filter = Filter('**/*.styl');

	del([ Config.paths.build.styles + '/**/*.*' ]);


// Inline sourcemaps 

	if (Config.mode === 'build'){
		return gulp.src([
				Config.paths.src.styles + '/**/*.styl',
				Config.paths.src.styles + '/**/*.css'
			])
			.pipe(filter)
			.pipe(sourcemaps.init())
			.pipe(stylus({
					use: nib(),
					compress: false
				}))
			.pipe(sourcemaps.write())
			.pipe(filter.restore())
			.pipe(concat('app.css'))
			.pipe(gulp.dest(Config.paths.build.styles + '/'))
			.pipe(browserSync.reload({stream:true}));

	}else if (Config.mode === 'dist'){
		return gulp.src([
				Config.paths.src.styles + '/**/*.styl',
				Config.paths.src.styles + '/**/*.css'
			])
			.pipe(filter)
			.pipe(stylus({
					use: nib(),
					compress: true
				}))
			.pipe(filter.restore())
			.pipe(concat('app.css'))
			.pipe(minifyCSS())
			.pipe(gulp.dest(Config.paths.build.styles + '/'))
			.pipe(browserSync.reload({stream:true}));

	}
});

/***** MEDIA *****/

gulp.task('media', function () {
	if (Config.mode === 'build'){

		return gulp.src( Config.paths.src.media + '/**/*.*' )
			.pipe(gulp.dest( Config.paths.build.media ));

	}else if (Config.mode === 'dist'){

		return gulp.src( Config.paths.src.media + '/**/*.*')
			.pipe(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()]
			}))
			.pipe(gulp.dest( Config.paths.build.media ));
	
	}
});


/**********/

gulp.task('clean', function () {
	del([ Config.paths.build.root + '/*.*' ]);
});


gulp.task('index', function () {
	gulp.src( Config.paths.src.root + '/**/*.*' )
		.pipe(gulp.dest( Config.paths.build.root + '/' ));
});

gulp.task('watch', function() {
	gulp.watch( Config.paths.src.scripts + '/**/*.coffee', ['scripts']);
	gulp.watch( Config.paths.src.styles + '/**/*.styl', ['styles']);
	gulp.watch('./gulpfile.js', ['default']);
});

gulp.task('browser-sync', ['default'], function() {
	browserSync({
		server: {
			baseDir:  Config.paths.build.root
		}
	});
});

gulp.task('inject', function () {
	var target = gulp.src( Config.paths.build.root + '/index.html');

	var sources = gulp.src([ 
			Config.paths.build.scripts + '/**/*.js',
			Config.paths.build.styles + '/**/*.css'],
		{read: false});

	return target.pipe(inject(sources, {addRootSlash:false, ignorePath:'build'}))
		.pipe(gulp.dest( Config.paths.build.root ));
});

/***** MAIN TASKS *****/

gulp.task('serve', ['browser-sync'], function () {

});

// # Based on http://stefanimhoff.de/2014/gulp-tutorial-3-build-clean-jekyll/
var devBuildTask = function(mode) {
  return function(callback) {
    Config.mode = mode;
    return runSequence('clean', ['scripts', 'styles', 'index', 'media', 'watch'], 'inject', callback);
  };
};

gulp.task('default', devBuildTask('build'));
gulp.task('dist', devBuildTask('dist'));
