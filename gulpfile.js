var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var ghandlebars = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var browserify = require('browserify');
var remapify = require('remapify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var xtend = require('xtend');

gulp.task('scss', function () {
	gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('html', function () {
	gulp.src('app/**/*.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('fonts', function () {
	return gulp.src()
});

gulp.task('jshint', function () {
	return gulp.src('app/scripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('templates', function () {
	gulp.src('app/templates/**/*.hbs')
		.pipe(ghandlebars())
		.pipe(defineModule('node'))
		.pipe(gulp.dest('.tmp/templates'))
});

var watching = false;
gulp.task('enable-watch-mode', function () { watching = true });

gulp.task('scripts', ['jshint', 'templates'], function () {
	var opts = {
		entries: './app/scripts/main.js',
		debug: (gutil.env.type === 'development')
	}
	if (watching) {
		opts = xtend(opts, watchify.args);
	}
	var bundler = browserify(opts);
	if (watching) {
		bundler = watchify(bundler);
	}
	// optionally transform
	// bundler.transform('transformer');

	bundler.plugin(remapify, [{
		src: './**/*.js',
		expose: 'templates',
		cwd: '.tmp/templates'
	}]);

	bundler.on('update', function (ids) {
		gutil.log('File(s) changed: ' + gutil.colors.cyan(ids));
		gutil.log('Rebunlding...');
	});

	function rebundle() {
		return bundler
			.bundle()
			.on('error', function (e) {
				gutil.log(gutil.colors.red('Browserify ' + e));
			})
			.pipe(source('main.js'))
			.pipe(gulp.dest('dist/scripts'));
	}
	return rebundle();
});

gulp.task('build', ['html', 'scss', 'scripts']);

gulp.task('dist', ['build']);

gulp.task('watch', ['enable-watch-mode', 'scripts', 'scss'], function () {
	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch('app/templates/**/*.hbs', ['scripts']);
})