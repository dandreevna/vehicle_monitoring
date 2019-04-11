const gulp = require('gulp');
//подключаем модуль автопрефесер
const autoprefixer = require('gulp-autoprefixer');
//модуль для удаления файлов
const del = require('del');
//модуль для синхронизации с браузером
//чтобы зайти на сайт с телефона подключиться к вайфаю и вбить (найти в npm) External: http://192.168.1.37:3000
const browserSync = require('browser-sync').create();
// чтобы объединить несколько файлов
const concat = require('gulp-concat');
//подключаем модуль для минификации
const cleanCSS = require('gulp-clean-css');
//карта минимизированного css-кода
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
//удаление неиспользуемого css в html - модуль опасный
//const uncss = require('gulp-uncss');
//соединение media-запрос
const gcmq = require('gulp-group-css-media-queries');
// js понятный всем браузерам
const babel = require('gulp-babel');
//минифицировать код js
const uglify = require('gulp-uglify');

const less = require('gulp-less');
const smartgrid = require('smart-grid');

//флажки --dev и --sync для разработки и для синхронизации с браузером вкл/выкл
const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);

/*
	npm run dev - для запуска версии для работы
	npm run build - для запуска версии для продакшена
*/

//порядок следования объединенных файлов
// let cssFiles = [
// 	'./node_modules/normalize.css/normalize.css',
// 	'./src/css/base.css',
// 	'./src/css/profit.css',
// 	'./src/css/media.css'
// ];

const jsFile = [
// не самый профессиональный способ подключить jquery (weback + import / bower)
	'./node_modules/jquery/dist/jquery.min.js',
	'./src/js/script.js',
	// './src/js/script1.js'
]

function clear(){
	return del('build/*');
}

function styles(){
	//от куда что-то берем
	//return gulp.src('./src/css/**/*.css')
	// return gulp.src(cssFiles)
	return gulp.src('./src/css/+(styles|styles-per|styles-ie9).less')
	//в pipe передаем модули gulp
			   .pipe(gulpif(isDev, sourcemaps.init()))
			   .pipe(less())
			   // .pipe(uncss({
		    //         html: ['./src/*.html']
		    //     }))
			   //объединяем cssFile в один style.css
			   //.pipe(concat('style.css'))
			   .pipe(gcmq())
			   .pipe(autoprefixer({
		            browsers: ['> 0.1%'],
		            cascade: false
		        }))
			   .pipe(gulpif(isProd, cleanCSS({
			   		level: 1
			   })))
			   .pipe(gulpif(isDev, sourcemaps.write()))
			   //куда что-то тащим
			   .pipe(gulp.dest('./build/css'))
			   .pipe(gulpif(isSync, browserSync.stream()));
}

function scripts(){
	return gulp.src(jsFile)
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(babel({
            presets: ['@babel/env']
        }))
        //выводим ошибку в консоль
        .on('error', console.error.bind(console))
        .pipe(gulpif(isProd, uglify({
			   		toplevel: true
			   })))
        .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build/js'))
		.pipe(gulpif(isSync, browserSync.stream()));
}

function img(){
	return gulp.src('./src/img/**/*')
			   .pipe(gulp.dest('./build/img'))
}

function font(){
	return gulp.src('./src/font/**/*')
			   .pipe(gulp.dest('./build/font'))
}

function php(){
	return gulp.src('./src/php/**/*')
			   .pipe(gulp.dest('./build/php'))
}

function html(){
	return gulp.src('./src/*.html')
			   .pipe(gulp.dest('./build'))
			   .pipe(gulpif(isSync, browserSync.stream()));
}

//функция для отслеживания изменений файлов в реальном времени
function watch(){
	if(isSync){
		browserSync.init({
			//для php написать proxy
	        server: {
	            baseDir: "./build/",
	        },
	        //появится ссылка на сайт tunnel
	        //tunnel: true
	    });
	}

	gulp.watch('./src/css/**/*.less', styles);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./src/**/*.html', html);
	gulp.watch('./smartgrid.js', grid);
}

function grid(done){
	delete require.cache[require.resolve('./smartgrid.js')];
	let settings = require('./smartgrid.js');
	smartgrid('./src/css', settings);

	// settings.offset = '3.1%';
	// settings.filename = 'smart-grid-per';
	// smartgrid('./src/css', settings);

	done();
}
//настройки SG node_mod/smart-grid/system/defaults/settings.js

//одна задача сразу на серию действий
//задачи пишем в кавычках, функции без кавычек

let build = gulp.series(clear, 
	gulp.parallel(styles, scripts, img, html, font, php)
	//gulp.parallel(styles, img, html,font)
);

//для выхода из watch нажать ctrl+c+c

gulp.task('build', build);
gulp.task('watch', gulp.series(build, watch));
//для формирования сетки вызвать gulp grid
gulp.task('grid', grid);