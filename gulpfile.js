var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
const less = require('gulp-less');
const babel = require('gulp-babel');

// gulp.task('browserify', function () {
//     browserify('./src/script/app.jsx', { debug: true })
//         .transform(babelify)
//         .bundle()
//         .on("error", function (err) { console.log("Error : " + err.message); })
//         .pipe(source('app.js'))
//         .pipe(gulp.dest('./app/js'))
// });

gulp.task('babel', function () {
    gulp.src('./src/script/app.jsx')
        .pipe(babel())
        .pipe(gulp.dest('./app'))
});

gulp.task('less', () => {
    return gulp.src('./src/style/*.less')
        .pipe(less())
        .on("error", function (err) { console.log("Error : " + err.message); })
        .pipe(gulp.dest('./app'));
});

gulp.task('watch', function () {
    gulp.watch('./src/style/*.less', ['less']);
    // gulp.watch('./src/script/*.jsx', ['browserify']);
    gulp.watch('./src/script/*.jsx', ['babel']);
});

gulp.task('default', ['babel', 'less', 'watch']);