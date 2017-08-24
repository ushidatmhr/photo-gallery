var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function () {
    browserify('./src/script/app.jsx', { debug: true })
        .transform(babelify)
        .bundle()
        .on("error", function (err) { console.log("Error : " + err.message); })
        .pipe(source('app.js'))
        .pipe(gulp.dest('./app/js'))
});

gulp.task('watch', function () {
    gulp.watch('./*.jsx', ['browserify'])
});

gulp.task('default', ['browserify', 'watch']);