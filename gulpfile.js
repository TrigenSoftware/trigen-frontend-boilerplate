/**
 * Gulpfile.js with tasks for frontend React.js development.
 */

/**
 * Requirements
 */

const { notify, reportError } = require('./helpers'),
	gulp    = require('gulp'),
	gutil   = require('gulp-util'),
	live    = require('gulp-livereload'),
	replace = require('gulp-replace'),
	sm      = require('gulp-sourcemaps'),
	connect = require('gulp-connect'),
	path    = require('path'),

	inject   = require('gulp-inject-reload'),
	procss   = require('gulp-progressive-css'),
	htmlmin  = require('gulp-htmlmin'),
	htmlLint = require('gulp-html-linter'),

	srcset = require('gulp-srcset'),

	importer  = require('sass-modules-importer'),
	csso      = require('gulp-cssnano'),
	auto      = require('gulp-autoprefixer'),
	sass      = require('gulp-sass'),
	styleLint = require('gulp-stylelint'),

	WebpackDevServer = require('webpack-dev-server'),
	webpack = require('webpack'),
	esLint  = require('gulp-eslint'),

	pkg = require('./package.json'),
	wpk = require('./webpack.config');

/**
 * Configs
 */

const { browsers } = pkg;

const htmlminOptions = {
	removeComments:                true,
	collapseWhitespace:            true,
	collapseBooleanAttributes:     true,
	removeAttributeQuotes:         true,
	removeRedundantAttributes:     true,
	useShortDoctype:               true,
	removeEmptyAttributes:         true,
	removeScriptTypeAttributes:    true,
	removeStyleLinkTypeAttributes: true,
	minifyJS:                      true
};

const paths = {
	html:    'src/*.html',
	images:  'src/images/**/*.{jpg,webp,png,svg,gif}',
	styles:  'src/app/**/*.scss',
	scripts: [
		'src/app/main.js',
		'src/app/**/*.js'
	],
	dest:    {
		root:   'dist',
		app:    'dist/app',
		images: 'dist/images'
	}
};

/**
 * HTML tasks
 */

gulp.task('html:watch', (done) => {
	gulp.watch(paths.html, gulp.series('html:dev'));
	done();
});

gulp.task('html:lint', () =>
	gulp.src(paths.html)
		.pipe(htmlLint())
		.pipe(htmlLint.format())
		.pipe(htmlLint.failOnError())
		.on('error', reportError)
);

gulp.task('html:dev', gulp.parallel('html:lint', () =>
	gulp.src(paths.html)
		.pipe(inject())
		.pipe(gulp.dest(paths.dest.root))
		.pipe(live())
		.pipe(notify('HTML files are updated.'))
));

gulp.task('html:build', gulp.series('html:lint', () =>
	gulp.src(paths.html)
		.pipe(replace('ASSETS_VERSION', new Date().getTime()))
		.pipe(procss({ base: 'dist', useXHR: true }))
		.pipe(htmlmin(htmlminOptions))
		.on('error', reportError)
		.pipe(gulp.dest(paths.dest.root))
		.pipe(notify('HTML files are compiled.'))
));

/**
 * Images tasks
 */

gulp.task('images:watch', (done) => {
	gulp.watch(paths.images, gulp.series('images:dev'));
	done();
});

gulp.task('images:dev', () =>
	gulp.src(paths.images)
		.pipe(srcset([{
			match:  '**/*.jpg',
			format: ['jpg', 'webp']
		}, {
			match:  '**/*.png'
		}]))
		.pipe(gulp.dest(paths.dest.images))
		.pipe(live())
		.pipe(notify('Images are updated.'))
);

gulp.task('images:build', () =>
	gulp.src(paths.images)
		.pipe(srcset([{
			match:  '**/*.jpg',
			format: ['jpg', 'webp']
		}, {
			match:  '**/*.png'
		}]))
		.pipe(gulp.dest(paths.dest.images))
		.pipe(notify('Images are generated.'))
);

/**
 * Style tasks
 */

gulp.task('style:watch', (done) => {
	gulp.watch(paths.styles, gulp.series('style:dev'));
	done();
});

gulp.task('style:lint', () =>
	gulp.src(paths.styles)
		.pipe(styleLint({
			reporters:      [{ formatter: 'string', console: true }],
			failAfterError: true
		}))
		.on('error', reportError)
);

gulp.task('style:dev', gulp.parallel('style:lint', () =>
	gulp.src(paths.styles)
		.pipe(sm.init())
			.pipe(sass({ importer: importer() }))
			.on('error', reportError)
			.pipe(auto({ browsers }))
		.pipe(sm.write())
		.pipe(gulp.dest(paths.dest.app))
		.pipe(live())
		.pipe(notify('Styles are updated.'))
));

gulp.task('style:build', gulp.series('style:lint', () =>
	gulp.src(paths.styles)
		.pipe(sass({ importer: importer() }))
		.on('error', reportError)
		.pipe(auto({ browsers }))
		.pipe(csso({
			reduceIdents: false,
			zindex:       false
		}))
		.pipe(gulp.dest(paths.dest.app))
		.pipe(notify('Styles are compiled.'))
));

/**
 * Webpack compilers
 */

const webpackDevCompiler = webpack(wpk.dev(paths.scripts[0], paths.dest.app)),
	webpackBuildCompiler = webpack(wpk.build(paths.scripts[0], paths.dest.app));

/**
 * JavaScript tasks
 */

gulp.task('script:lint', () =>
	gulp.src(paths.scripts)
		.pipe(esLint())
		.pipe(esLint.format())
		.pipe(esLint.failAfterError())
		.on('error', reportError)
);

/**
 * Webpack tasks
 */

gulp.task('webpack:dev', (done) => {

	const webpackDevServer = new WebpackDevServer(webpackDevCompiler, {
		https:       true,
		overlay:     true,
		hot:         true,
		contentBase: path.join(__dirname, 'dist'),
		publicPath:  webpackDevCompiler.options.output.publicPath,
		stats:       {
			chunks: false,
			colors: true
		}
	});

	webpackDevServer.listen(8080, 'localhost', (error) => {

		if (error) {
			notify.onError(error);
			return done();
		}

		gutil.log(
			`${gutil.colors.cyan('webpack-dev-server')}:`,
			'http://localhost:8080'
		);

		return done();
	});

	gulp.watch(paths.scripts, gulp.series('script:lint'))
		.on('change', () => {
			notify('Scripts are updated.', true);
		});
});

gulp.task('webpack:build', gulp.series('script:lint', done =>
	webpackBuildCompiler.run((error, stats) => {

		if (error) {
			notify.onError(error);
			return done();
		}

		if (stats.hasErrors()) {
			notify.onError(new Error('Webpack compilation is failed.'));
		} else {
			notify('Scripts are compiled.', true);
		}

		gutil.log(`${gutil.colors.cyan('webpack')}:`, `\n${stats.toString({
			chunks: false,
			colors: true
		})}`);

		return done();
	})
));

/**
 * Main tasks
 */

gulp.task('server', (done) => {
	connect.server({
		root: 'dist'
	});
	done();
});

gulp.task('watch', gulp.parallel(
	(done) => {
		live.listen();
		done();
	},
	'html:watch',
	'images:watch',
	'style:watch'
));

gulp.task('dev', gulp.series(
	gulp.parallel(
		'webpack:dev',
		gulp.series(
			'style:dev',
			'html:dev'
		),
		'images:dev'
	),
	'watch'
));

gulp.task('build', gulp.parallel(
	'webpack:build',
	gulp.series(
		'style:build',
		'html:build'
	),
	'images:build'
));

gulp.task('default', gulp.series('dev'));
