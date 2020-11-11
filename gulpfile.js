const { src,dest,watch,series } = require('gulp');
const sass = require('gulp-sass')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const del = require('del')
const spritesmith = require('gulp.spritesmith')
const svgSprite = require('gulp-svg-sprites')
const concat = require('gulp-concat')
const minify = require('gulp-minify')
const cssmin = require('gulp-cssmin')
    

function styles(cb) {
    return src('src/sass/style.scss')
    	.pipe(sass({outputStyle: 'compact'}).on('error',sass.logError))
        .pipe(dest('src/css'))
        
    cb();
}

/* gulp.task('sass', function(){
    return gulp.src('src/sass/style.scss')
    	.pipe(sass({outputStyle: 'compact'}).on('error',sass.logError))
    	.pipe(gulp.dest('src/css'))
}); */

function svg(cb) {
    return src('src/images/svg/*.svg')
    .pipe(svgSprite({
        mode: 'symbols',
        svg: {
            svgPath: "../svg/svg/%f"
        }
    }))
    .pipe(dest("src/svg"));

    cb();
}
/* gulp.task('svg', function () {
    return gulp.src('src/images/svg/*.svg')
    .pipe(svgSprite({
        mode: 'symbols',
        svg: {
            svgPath: "../svg/svg/%f"
        }
    }))
    .pipe(.dest("src/svg"));
}); */


function sprite(cb) {
    return src('src/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        padding: 10,
        algorithm: 'top-down',
        imgPath: '../images/sprite/sprite.png'
    }))
    .pipe(dest('src/images/sprite/'));

    cb();
}
/* gulp.task('sprite', function () {
  var spriteData = gulp.src('src/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    padding: 10,
    algorithm: 'top-down',
    imgPath: '../images/sprite/sprite.png'
  }));
  return spriteData.pipe(gulp.dest('src/images/sprite/'));
}); */


// function watcher() {
//     watch('src/sass/**/*.scss', series(svg, sprite, styles));
//     watch('src/images/icons/*.png', sprite);
//     watch('src/images/svg/*.svg', svg);
// }

// gulp.task('watch', function() {
//     gulp.watch('src/sass/**/*.scss', ['svg', 'sprite', 'sass']); // Наблюдение за sass файлами в папке sass
//     gulp.watch('src/images/icons/*.png', ['sprite']);
//     gulp.watch('src/images/svg/*.svg', ['svg']);
//     // gulp.watch('src/*.html'); // Наблюдение за HTML файлами в корне проекта
//     // gulp.watch('src/js/**/*.js');   // Наблюдение за JS файлами в папке js
// });


exports.svg = svg;
exports.styles = styles;
exports.sprite = sprite;
exports.default = function() {
    watch('src/sass/**/*.scss', series(sprite, styles));
    watch('src/images/icons/*.png', sprite);
    watch('src/images/svg/*.svg', svg);
  };


/* gulp.task('concatStyles', function() {
    return gulp.src('src/css/libs/*.css')
        .pipe(concat('libs.minify.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('src/css/'));
}); */


/* gulp.task('concatJS', function() {
    return gulp.src('src/js/libs/*.js')
        .pipe(concat('libs.concat.js'))
        .pipe(minify({
            ext:{
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('src/js/'));
}); */



/* gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
}); */


// gulp.task('img', function() {
//     return gulp.src('src/images/examples/**/*') // Берем все изображения из src
//         .pipe(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
//             interlaced: true,
//             progressive: true,
//             optimizationLevel: 2,
//             svgoPlugins: [{removeViewBox: false}],
//             use: [pngquant()]
//         }))
//         .pipe(gulp.dest('dist/images/examples')); // Выгружаем на продакшен
// });


// gulp.task('build', ['clean', 'img', 'sass'], function() {

//     var buildCss = gulp.src('src/css/**/*.css')
//     .pipe(gulp.dest('dist/css'))

//     var buildFonts = gulp.src('src/fonts/**/*') // Переносим шрифты в продакшен
//     .pipe(gulp.dest('dist/fonts'))

//     var buildJs = gulp.src('src/js/**/*') // Переносим скрипты в продакшен
//     .pipe(gulp.dest('dist/js'))

//     var buildImgs = gulp.src(['!src/images/examples/**/*','src/images/**/*']) // Переносим картинки в продакшен
//     .pipe(gulp.dest('dist/images'))

//     var buildHtml = gulp.src('src/*.html') // Переносим HTML в продакшен
//     .pipe(gulp.dest('dist'));

//     var buildOther = gulp.src('src/.htaccess') // Переносим htaccess в продакшен
//     .pipe(gulp.dest('dist'));
// });


// gulp.task('default', ['watch']);