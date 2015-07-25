// Include gulp
var gulp = require('gulp')
    , jshint = require('gulp-jshint')
    , stylish = require('jshint-stylish')
    , mocha = require('gulp-mocha')
    , coveralls = require('gulp-coveralls')
    , istanbul = require('gulp-istanbul')
    , nodemon = require('gulp-nodemon')
    , livereload = require('gulp-livereload')
    , notify = require('gulp-notify')
    , plumber = require('gulp-plumber');


// Lint Task
gulp.task('lint', function() {
    return gulp.src(['./app.js', 'models/*.js', 'controllers/*.js', 'services/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});
// Mocha Task
gulp.task('mocha', function(cb){
    // Track src files that should be covered
    return gulp.src(['./app.js', './services/chatio.js'])
        .pipe(istanbul({ includeUntested: true })) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function() {
            // Specify server specs
            gulp.src(['test/**/*.js'], {read: false})
            .pipe(plumber())
            .pipe(mocha({
                reporter: 'nyan',
                timeout: 20000
            }))
            // Write reports to Istanbul
            .pipe(istanbul.writeReports())
            .once('end', function () {
                process.exit();
            })
            .once('error', function () {
                process.exit(1);
            })
    });
});
/*
gulp.task('mocha', function() {
    return gulp.src(['test/*.js'])
        .pipe(mocha({ reporter: 'nyan', timeout: 2000 }));
});
*/
// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['app.js', 'models/*.js', 'controllers/*.js', 'services/*.js'], ['lint']);
    //gulp.watch(['./*.js', 'controllers/*.js', 'models/*.js', 'test/*.js'], ['lint']);
});

// Default Task
gulp.task('default', ['lint', 'watch', 'develop']);
// Testing Taks
gulp.task('test', ['lint', 'mocha']);
// Develop Taks
gulp.task('develop', function () {
    // listen for changes
    livereload.listen();
    // configure nodemon
    nodemon({
        // the script to run the app
        script: 'app.js',
        ext: 'js'
    }).on('restart', function(){
        // when the app has restarted, run livereload.
        gulp.src('app.js')
            .pipe(livereload())
            .pipe(notify('Reloading page, please wait...'));
    })
});
