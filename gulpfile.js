var gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require("gulp-notify"),
    bower = require('gulp-bower');

var config = {
    sassPath: './resources/sass',
    bowerDir: './bower_components'
}

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest('./public/assets/fonts'));
});

gulp.task('css', function() {
    return gulp.src(config.sassPath + '/style.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: [
                './resources/sass',
                config.bowerDir + '/bootstrap-sass/assets/stylesheets',
                config.bowerDir + '/font-awesome/scss',
            ]
        })
           .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('js', function() {
    return gulp.src([
            'resources/js/*.js',
            config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            config.bowerDir + '/jquery/dist/jquery.min.js',
        ])
        .pipe(gulp.dest('./public/assets/js'));
});

gulp.task('watch-css', function() {
    gulp.watch(config.sassPath + '/**/*.scss', ['css'])
});

gulp.task('watch-js', function() {
    gulp.watch('resources/js/*.js', ['js'])
});

gulp.task('default', ['bower', 'icons', 'css', 'js', 'watch-css', 'watch-js']);
