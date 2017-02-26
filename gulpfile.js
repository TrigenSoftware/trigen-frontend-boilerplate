/**
 * Gulpfile.js with tasks for frontend development.
 */

/**
 * Requirements
 */

const { notify, reportError } = require('./helpers'),
	gulp    = require('gulp'),
	replace = require('gulp-replace'),
	sm      = require('gulp-sourcemaps'),
	connect = require('gulp-connect'),

	procss   = require('gulp-progressive-css'),
	htmlmin  = require('gulp-htmlmin'),
	htmlLint = require('gulp-html-linter'),

	srcset = require('gulp-srcset'),

	importer  = require('sass-modules-importer'),
	csso      = require('gulp-cssnano'),
	auto      = require('gulp-autoprefixer'),
	sass      = require('gulp-sass'),
	styleLint = require('gulp-stylelint'),

	pkg = require('./package.json');

/**
 * Configs
 */

const { browsers } = pkg;

const paths = {
	html:   'src/*.html',
	images: 'src/images/**/*.{jpg,webp,png,svg,gif}',
	styles: 'src/app/**/*.scss',
	dest:   {
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
		.pipe(gulp.dest(paths.dest.root))
		.pipe(connect.reload())
		.pipe(notify('HTML files are updated.'))
));

gulp.task('html:build', gulp.series('html:lint', () =>
	gulp.src(paths.html)
		.pipe(replace('ASSETS_VERSION', new Date().getTime()))
		.pipe(procss({ base: 'dist', useXHR: true }))
		.pipe(htmlmin({ collapseWhitespace: true }))
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
		.pipe(connect.reload())
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
		.pipe(connect.reload())
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
 * Main tasks
 */

gulp.task('server', (done) => {
	connect.server({
		root:       'dist',
		livereload: true
	});
	done();
});

gulp.task('watch', gulp.parallel(
	'html:watch',
	'images:watch',
	'style:watch'
));

gulp.task('dev', gulp.series(
	'server',
	gulp.parallel(
		gulp.series(
			'style:dev',
			'html:dev'
		),
		'images:dev'
	),
	'watch'
));

gulp.task('build', gulp.parallel(
	gulp.series(
		'style:build',
		'html:build'
	),
	'images:build'
));

gulp.task('default', gulp.series('dev'));
