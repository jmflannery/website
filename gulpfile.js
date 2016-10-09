var gulp = require('gulp'),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect');
    runSequence = require('run-sequence');

gulp.task('clean_html', function() {
  return gulp.src('build/*.html')
    .pipe(clean());
});

gulp.task('clean_css', function() {
  return gulp.src('build/css')
    .pipe(clean());
});

gulp.task('clean_scripts', function() {
  return gulp.src('build/scripts')
    .pipe(clean());
});

gulp.task('clean_img', function() {
  return gulp.src('build/img')
    .pipe(clean());
});

gulp.task('clean_fonts', function() {
  return gulp.src('build/fonts')
    .pipe(clean());
});

gulp.task('clean_temp', function() {
  return gulp.src('temp')
    .pipe(clean());
});

gulp.task('clean', function() {
  return gulp.src('build')
    .pipe(clean());
});

gulp.task('templates', ['clean_html'], function() {
  return gulp.src('./templates/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./build'));
});

gulp.task('less', ['clean_css'], function() {
  return gulp.src('./less/**/*.less')
    .pipe(less())
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./temp/css'));
});

gulp.task('css', ['minify_css'], function() {
  // gulp.run('clean_temp');
  return gulp.src('temp')
    .pipe(clean());
});

gulp.task('minify_css', ['less'], function() {
  return gulp.src(['./css/**/*.css', './temp/css/**/*.css'])
    .pipe(cleancss())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('scripts', function () {
  return gulp.src(['./js/vendor/*.js', './js/*.js'])
    .pipe(uglify())
    .pipe(concat('script.js.min'))
    .pipe(gulp.dest('./build/scripts'));
});

gulp.task('images', function() {
  return gulp.src('./images/**/*')
    .pipe(imagemin({ optimizationLevel: 1 }))
    .pipe(gulp.dest('./build/img'))
});

gulp.task('fonts', function() {
  return gulp.src('./fonts/**/*')
    .pipe(gulp.dest('./build/fonts'))
});

gulp.task('watch', function() {
  gulp.watch('./templates/**/*.pug', ['templates']);
  gulp.watch('./less/**/*.less', ['css']);
  gulp.watch('./js/**/*.js', ['scripts']);
  gulp.watch('./images/**/*', ['images']);
  gulp.watch('./fonts/**/*', ['fonts']);
});

gulp.task('webserver', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('default', function() {
  runSequence(
    'clean',
    [
      'css',
      'scripts',
      'images',
      'fonts',
      'templates',
      'watch',
      'webserver'
    ]
  );
});
