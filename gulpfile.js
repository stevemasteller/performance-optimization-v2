/**********************************************************
*
*  gulpfile.js
*
* Implements a gulp build for development and deployment. 
* The process does the following:
*	- Concatenates and minifies the JavaScript files.
*	- Compiles SCSS into CSS, concatenates and minifies.
*	- Generates JavaScript and CSS source maps.
*	- Compresses JPEG and PNG files.
* Output for development is in the home directory structure 
* gulp-build-v1. Output for deployment or distribution is 
* in the dist folder at gulp-buil-v1/dist.
*
* Author: Steve Masteller
*
************************************************************/
'use strict';

var gulp 	= require('gulp'),
    concat 	= require('gulp-concat'),		// concatenate files
    uglify 	= require('gulp-uglify'),		// minify JavaScript
    rename 	= require('gulp-rename'),		// rename a file
    cssnano = require('gulp-cssnano'),		// minify CSS
    imagemin = require('gulp-imagemin'),	// minify images
	del 	= require('del'),				// delete directories and files
    useref 	= require('gulp-useref');		// replace css and js references in html
//browserSync = require('browser-sync').create(); // for starting the server

// Concatenate the .js sources into a single file
// and put it in js/global.js. js/global.js 
// is used for development.
gulp.task('concatScripts', function() {
	return gulp.src([
        'js/jquery.js',
        'js/fastclick.js',
        'js/foundation.js',
        'js/foundation.equalizer.js',
        'js/foundation.reveal.js',
        'js/scripts.js'])
	.pipe(concat('global.js'))
	.pipe(gulp.dest('js'));
});

// minify global.js and store the result
// in dist/scripts/all.min.js.  all.min.js is used
// for deployment.
gulp.task('minifyScripts', ['concatScripts'], function() {
	return gulp.src(['js/global.js'])
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(gulp.dest('dist/js'));
});

// Concatenate the .css sources into a single file
// and put it in css/global.css. js/global.css 
// is used for development.
gulp.task('concatCss', function() {
	return gulp.src([
        'css/normalize.css',
        'css/foundation.min.css',
        'css/basics.css',
        'css/menu.css',
        'css/hero.css',
        'css/photo-grid.css',
        'css/modals.css',
        'css/footer.css'])
	.pipe(concat('global.css'))
	.pipe(gulp.dest('css'));
});

// Minify css/global.css, and write the result to
// dist/styles/all.min.css.  all.min.css is used for
// deployment.
gulp.task('minifyCss', ['concatCss'], function() {
	return gulp.src(['css/global.css'])
	.pipe(cssnano())
	.pipe(rename('all.min.css'))
	.pipe(gulp.dest('dist/css'));
});

// Minify the images in images/* and write the 
// results to dist/images/*.  These minified images
// are used for deployment.
gulp.task('minifyImages', function() {
	return gulp.src(['img/photos/**', 
					'img/avatars/**'], {base: './'})
	.pipe(imagemin())
	.pipe(gulp.dest('dist'));
});

// Take the index.html file used for development and
// replace the .css and .js file calls with the versions 
// used for deployment. Store the resulting index.html file
// in the dist folder.
gulp.task('html', ['minifyScripts', 'minifyCss', 'minifyImages'], function() {
	return gulp.src('index.html')
	.pipe(useref())
	.pipe(gulp.dest('dist'));
});

// Remove all generated files and folders.
gulp.task('clean', function() {
	return del([
		'dist',
		'css/global.css',
		'js/global.js*']);
});

// full build for development and deployment
gulp.task('build', ['html'], function() {
	return gulp.src(['css/Arvo/**', 'css/Ubuntu/**'], {base:'./'})
		.pipe(gulp.dest('dist'));
});

// starts server on localhost:3000
//gulp.task('serve', function() {
//	browserSync.init({
//		server: {
//			baseDir: "dist"
//		}
//		
//	});
//});

// defualts 'gulp build' to just 'gulp'
gulp.task('default', ['clean'], function() {
	gulp.start('build');
});