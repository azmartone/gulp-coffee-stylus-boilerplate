var browserSync = require('browser-sync');
var debowerify = require('debowerify');
var gulp = require('gulp');
var browserify = require('gulp-browserify');
var inject = require("gulp-inject");
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var gutil = require('gulp-util');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var del = require('del');
var nib = require('nib');


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
		},
		dist: {
			root:     'dist',
			styles:   'dist/styles',
			scripts:  'dist/scripts',
			media:    'dist/media'
		}
	}
}

/***** SCRIPTS *****/

gulp.task('scripts', function() {
	del([ Config.paths.build.scripts + '/**/*.*' ]);
	
	return gulp.src( Config.paths.src.scripts + '/main.coffee', { read: false })
		.pipe(browserify({
			transform: ['coffeeify', 'debowerify'],
			extensions: ['.coffee', '.js']
		}))
		.pipe(rename('main.js'))
		.pipe(gulp.dest( Config.paths.build.scripts + '/' ))
        .pipe(browserSync.reload({stream:true}));
});

 
/***** STYLES *****/

gulp.task('styles', function () {
	del([ Config.paths.build.styles + '/**/*.*' ]);

	return gulp.src( Config.paths.src.styles + '/**/*.styl' )
		.pipe(stylus({
			use: nib(),
			compress: true
		}))
		.pipe(gulp.dest( Config.paths.build.styles + '/' ))
		.pipe(browserSync.reload({stream:true}));
});

/***** MEDIA *****/

gulp.task('media', function () {
	gulp.src( Config.paths.src.media + '/**/*.*' )
		.pipe(gulp.dest( Config.paths.build.media ));
});

gulp.task('media-deploy', function () {
    return gulp.src( Config.paths.src.media + '/**/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest( Config.paths.build.media ));
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


/***** MAIN TASKS *****/

gulp.task('serve', ['browser-sync'], function () {

});

gulp.task('default', ['scripts', 'styles', 'index', 'media', 'watch'], function () {
	var target = gulp.src( Config.paths.build.root + '/index.html');

	var sources = gulp.src([ 
			Config.paths.build.scripts + '/**/*.js',
			Config.paths.build.styles + '/**/*.css'],
		{read: false});

	return target.pipe(inject(sources, {addRootSlash:false, ignorePath:'build'}))
		.pipe(gulp.dest( Config.paths.build.root ));
});


gulp.task('deploy', ['clean', 'scripts', 'styles', 'index', 'media-deploy', 'watch'], function () {
	//ToDo:
	//Deploy Stuff
	//Config folder for deploy
	//ImageMin
	//JS Concat
	//JS Minify
});