const {src, dest, series, parallel, watch} = require('gulp')
const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()
const del = require('del')
const imagemin = require('gulp-imagemin')
const uglify = require('gulp-uglify-es').default
const rename = require('gulp-rename')

function html() {
    return src('./src/html/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('./dist'))
        .pipe(browserSync.stream())
}

function scss() {
    return src('src/scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({
            suffix: '.min',
            extname: '.css'
        }))
        .pipe(dest('./dist/css'))
        .pipe(browserSync.stream())
}

function script() {
    return src('./src/js/**.js', {sourcemaps: true})
        .pipe(rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe(uglify())
        .pipe(dest('./dist/js', {sourcemaps: '.'}))
        .pipe(browserSync.stream())
}

function images() {
    return src(['src/images/**/**.*', '!src/images/svg-animated/**/*'])
        .pipe(imagemin())
        .pipe(dest('./dist/images'))     
}

function animatedSvg() {
    return src('./src/images/svg-animated/**/*')
        .pipe(dest('./dist/images/svg-animated'))
}



function watcher() {
    watch('./src/html/*.html', html)
    watch('src/scss/*.scss', scss)
    watch('src/images', images)
    watch('src/js/**.js', script)   
}

function server() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    })
}

function clear() {
    return del('./dist')
}




exports.default = series(
    clear,
    parallel(html, scss, script, images, animatedSvg),
    parallel(watcher, server)
)