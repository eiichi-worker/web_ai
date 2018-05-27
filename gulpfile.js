var gulp = require('gulp')
var nunjucksRender = require('gulp-nunjucks-render')
var runSequence = require('run-sequence')
var del = require('del')
var browserSync = require('browser-sync')
var reload = browserSync.reload
var ghPages = require('gulp-gh-pages-will')
var exec = require('gulp-exec');
var sitemap = require('gulp-sitemap');

gulp.task('default', function(callback) {
  return runSequence(
    'clean', [
      'nunjucks',
      'es6-tfjs-mnist',
      'es6-tfjs-chest',
      'es6-game-reversi',
      'static'
    ],
    'sitemap',
    callback
  )
})

gulp.task('deploy', function(callback) {
  return runSequence(
    'clean', [
      'nunjucks',
      'es6-tfjs-mnist',
      'es6-tfjs-chest',
      'es6-game-reversi',
      'static'
    ],
    'sitemap',
    'github-page-push',
    callback
  )
})

gulp.task('clean', function(cb) {
  return del(['dist/**/*'], cb)
})

gulp.task('nunjucks', function() {
  return gulp.src([
    'src/template/**/*.njk',
    '!src/template/_layout/**/*.njk',
    '!src/template/_parts/**/*.njk'
  ]).pipe(nunjucksRender({
    path: ['src/template/']
  })).pipe(gulp.dest('dist'))
})

gulp.task('es6-tfjs-mnist', function() {
  var options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
    src: ['src/es6/tfjs/mnist/index.es6'], // content passed to lodash.template()
    dist: "dist/js/tfjs/mnist/" // content passed to lodash.template()
  }
  var reportOptions = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
  }

  return gulp.src(options.src)
    .pipe(exec('parcel build <%= file.path %> --no-minify -d <%= options.dist %>', options))
    .pipe(exec.reporter(reportOptions))
})

gulp.task('es6-game-reversi', function() {
  var options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
    src: ['src/es6/game/reversi/index.es6'], // content passed to lodash.template()
    dist: "dist/js/game/reversi/" // content passed to lodash.template()
  }
  var reportOptions = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
  }

  return gulp.src(options.src)
    .pipe(exec('parcel build <%= file.path %> --no-minify -d <%= options.dist %>', options))
    .pipe(exec.reporter(reportOptions))
})

gulp.task('es6-tfjs-chest', function() {
  var options = {
    continueOnError: false, // default = false, true means don't emit error event
    pipeStdout: false, // default = false, true means stdout is written to file.contents
    src: ['src/es6/tfjs/chest/index.es6'], // content passed to lodash.template()
    dist: "dist/js/tfjs/chest/" // content passed to lodash.template()
  }
  var reportOptions = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
  }

  return gulp.src(options.src)
    .pipe(exec('parcel build <%= file.path %> --no-minify -d <%= options.dist %>', options))
    .pipe(exec.reporter(reportOptions))
})


gulp.task('static', function() {
  return gulp.src('src/static/**/*').pipe(gulp.dest('dist/'))
})

gulp.task('sitemap', function () {
  gulp.src('dist/**/*.html', {
          read: false
      })
      .pipe(sitemap({
          siteUrl: 'http://ai.noraneko.work'
      }))
      .pipe(gulp.dest('./dist'));
});

gulp.task('server', function() {
  browserSync({
    notify: false,
    server: {
      baseDir: 'dist'
    }
  })
 
  gulp.watch('src/static/**/*', ['static'])
  gulp.watch('src/template/**/*', ['nunjucks'])
  gulp.watch('src/es6/**/*', [
    'es6-tfjs-mnist',
    'es6-tfjs-chest',
    'es6-game-reversi',
  ])
  gulp.watch('dist/**/*.html', ['sitemap'])
  gulp.watch('dist/**/*', reload)
})

gulp.task('github-page-push', function() {
  return gulp.src('dist/**/*')
    .pipe(ghPages())
})
