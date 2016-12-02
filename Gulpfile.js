
var gulp = require('gulp'),
    stripComments = require('gulp-strip-comments'),
    uglify = require('gulp-uglify');


//Test folder

gulp.task('clear_test', ()=>{

    gulp.src('Test/**/*.js')
        .pipe(stripComments())
        .pipe(gulp.dest('Test'))


});



//Src folder

gulp.task('clear_source', ()=>{

    gulp.src('Src/**/*.js')
        .pipe(stripComments())
        .pipe(gulp.dest('Src'))

});

