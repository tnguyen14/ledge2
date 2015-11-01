var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var xtend = require('xtend');
var $ = require('gulp-load-plugins')();

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('scss', function () {
	return gulp.src('./app/scss/**/*.scss')
		.pipe($.plumber({
			errorHandler: function (err) {
				$.util.log($.util.colors.red('Styles error:\n' + err.message));
				// emit end so the stream can resume https://github.com/dlmanning/gulp-sass/issues/101
				if (this.emit) {
					this.emit('end');
				}
			}
		}))
		.pipe($.sass())
		.pipe($.autoprefixer())
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('copy', function () {
	return gulp.src(['./app/**/*.html', './app/manifest.json'])
		.pipe(gulp.dest('./dist'));
});

gulp.task('fonts', function () {
	return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
		.pipe($.filter('**/*.{eot,svg,ttf,woff}'))
		.pipe($.flatten())
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('jshint', function () {
	return gulp.src('./app/scripts/**/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter(require('jshint-stylish')));
});

var watching = false;
gulp.task('enable-watch-mode', function () {
	watching = true;
});

var dev = false;
gulp.task('enable-dev-mode', function () {
	dev = true;
});

gulp.task('scripts', ['jshint'], function () {
	var opts = {
		entries: ['./app/scripts/main.js'],
		debug: dev
	};
	if (watching) {
		opts = xtend(opts, watchify.args);
	}
	var bundler = browserify(opts);
	if (watching) {
		bundler = watchify(bundler);
	}

	var aliasify = require('aliasify').configure({
		aliases: {
			'config': './config' + (dev ? '.dev' : '') + '.json'
		},
		configDir: __dirname
	});
	bundler.transform(aliasify);

	bundler.on('update', function (ids) {
		$.util.log('File(s) changed: ' + $.util.colors.cyan(ids));
		$.util.log('Rebunlding...');
		rebundle();
	});

	function rebundle () {
		return bundler
			.bundle()
			.on('error', function (e) {
				$.util.log($.util.colors.red('Browserify ' + e));
			})
			.pipe(source('main.js'))
			.pipe(gulp.dest('./dist/scripts'));
	}
	return rebundle();
});

gulp.task('build', ['copy', 'fonts', 'scss', 'scripts']);

gulp.task('watch', ['enable-watch-mode', 'enable-dev-mode', 'build'], function () {
	gulp.watch('./app/scss/**/*.scss', ['scss']);
	gulp.watch('./app/**/*.html', ['copy']);
});

gulp.task('deploy', ['build'], function () {
	return gulp.src('./dist/**/*')
		.pipe($.ghPages());
});

gulp.task('serve', function () {
	$.nodemon({
		script: 'server/index.js',
		ext: 'js'
	});
});

gulp.task('default', ['clean', 'serve'], function () {
	gulp.start('watch');
});
