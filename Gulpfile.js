
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    stripComments = require('gulp-strip-comments'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del= require('del'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;



/*
 ###################################
 # Clear test folder
 ###################################
*/
gulp.task('clear_test', ()=>{

    gulp.src('Test/**/*.js')
        .pipe(stripComments())
        .pipe(gulp.dest('Test'));


});


/*
 ###################################
 # Clear source folder
 ###################################
 */
gulp.task('build:clear-source', ()=>{

    return gulp.src('Src/**/*.js')
               .pipe(stripComments())
               .pipe(gulp.dest('Src'));

});


/*
 ###################################
 # Transpile to ES5 & uglify
 ###################################
 */
gulp.task('build:transpile', ['build:clear-source'], ()=>{

    gulp.src('Src/**/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist_es5'));
});

/*
 ###################################
 # Delete node_modules folder
 ###################################
 */
gulp.task('build:del-node-folder', ()=>{

    del('node_modules').then(()=>{
        console.log('node_modules deleted');
    });

});


/*
 ###################################
 # Build
 ###################################
 */
gulp.task('build', ['build:transpile']);





/*
 ###################################
 # HTML
 ###################################
 */
gulp.task('html', ()=>{

    gulp.src('*.html')
        .pipe(reload({stream:true}));

});

/*
 ###################################
 # CSS
 ###################################
 */
gulp.task('css', ()=>{

    gulp.src('*.css')
        .pipe(reload({stream:true}));

});


/*
 ###################################
 # Browser Sync
 ###################################
 */
gulp.task('browser_sync', ()=>{

        browserSync({
            server : {
                baseDir : './'
            }
        });

});


/*
 ###################################
 # Watch
 ###################################
 */
gulp.task('watch', ()=>{

    gulp.watch('*.html', ['html']);
    gulp.watch('*.css', ['css']);

});




/*
 ###################################
 # DEFAULT
 ###################################
 */

gulp.task('default', ['html', 'css', 'browser_sync', 'watch']);