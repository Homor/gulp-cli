var gulp = require("gulp");
// 合并
var concat = require("gulp-concat");
// 压缩
var uglify = require("gulp-uglify");
// es6转义
var babel = require("gulp-babel");
// log
var gutil = require("gulp-util");
// 去除console.log
var stripDebug = require("gulp-strip-debug");

//压缩css 
var cleanCss = require("gulp-clean-css");
// 删除文件
var del = require("del");

// html
// html压缩

var htmlmin = require('gulp-htmlmin'); //html压缩组件
// 删除特定标签
var removeHtmlTag = require("gulp-remove-html");
//清除空白行
var removeEmptyLines = require("gulp-remove-empty-lines");

// 标签替换
var htmlReplace = require("gulp-html-replace");

//  <!-- build:css -->
//   <link rel="stylesheet" href="./css/index.css">
// <!-- endbuild -->

//    <!-- build:js -->
// <script src="./js/config.js"></script>
// <script src="./js/e3d_wraper_util.js"></script>
// <script src="./js/weChatShare.js"></script>
// <script src="./js/index.js"></script>
//     <!-- endbuild -->


// 比较文件是否改变
var changed = require("gulp-changed");

var configs = require('./config.json');

// 设置代码头的信息
// 项目配置信息
// using data from package.json

var pkg = configs.pkg;
var date = new Date();
var year = date.getUTCFullYear();
var month = date.getUTCMonth();

pkg.time = year + "/" + (month + 1);

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @author <%= pkg.author %>',
    // ' * @license <%= pkg.license %>',
    ' * @time <%= pkg.time %>',
    ' */',
    ''
].join('\n');


// 设置指导
var header = require('gulp-header');

var packInfo = configs.pack;

var workDirectory = packInfo.workDirectory;
var outPut = packInfo.outPut;
// 第三方js库
var js_libs = packInfo.js_libs;
// 要合并的js库
var js_self = packInfo.js_self;
// 单独的js文件
var js_independent = packInfo.js_independent;
//  生产环境下要取出的文件
var dev_dependencies = packInfo.dev_dependencies;
// css
var css_libs = packInfo.css_libs;
var css_self = packInfo.css_self;


// js_independent.forEach((d,i){
//      deleteFile.push(outPut+d);
// })
// 相对路径下的,第三方js库
js_libs_a = [];

js_libs.forEach(function (d, i) {
    js_libs_a[i] = workDirectory + "/js/" + d;
});


// 相对路径下的,要合并的js库
var js_self_a = [];
var js_self_to_a = [];

js_self.forEach(function (d, i) {
    js_self_a[i] = workDirectory + "/js/" + d;
    js_self_to_a[i] = outPut + "/js/" + d;
});


// 相对路径下的,要合并的css库

var css_self_a = [];

var css_self_to_a = [];

css_self.forEach(function (d, i) {
    css_self_to_a[i] = outPut + "/css/" + d;
    css_self_a[i] = workDirectory + "/css/" + d;
});


// 相对路径下的,要合并的css库
css_libs_a = [];

css_libs.forEach(function (d, i) {
    css_libs_a[i] = workDirectory + "/css/" + d;
});


// var initJsPathDesc="./project/js/init.js";
// var d3JsPathDesc="./project/plugin/main.js";


var initJsPathDist = "./dist/js/init.js";
var d3JsPathDist = "./dist/plugin/main.js";

// 绝对路径下的js文件
// js_libs_a
// js_self_a

// 绝对路径下的css文件
// css_self_a
// css_libs_a

// 目的路径相关
// js_self_to_a
// css_self_to_a

// 要删除的列表
var deleteFile = js_self_to_a.concat(css_self_to_a);

// 要删去的js库
js_independent.forEach(function (d, i) {
    // console.log(d);
    deleteFile.push(outPut + d);
})

dev_dependencies.forEach(function (d, i) {
    // console.log(d);
    deleteFile.push(outPut + d);
})



// copyAll
gulp.task("copyAll", function () {

    // js
    gulp.src([
        workDirectory + "js/**",
    ], {
        dot: true
    }).pipe(gulp.dest(outPut + "js/"));

    // css
    gulp.src([
        workDirectory + "css/**",
    ], {
        dot: true
    }).pipe(gulp.dest(outPut + "css/"));


    // html
    gulp.src([workDirectory + "/*.html", ], {
            dot: true
        })
        .pipe(gulp.dest(outPut));

    // img
    gulp.src([workDirectory + "/img/**", ], {
            dot: true
        })
        .pipe(changed(outPut + "img/"))
        .pipe(gulp.dest(outPut + "img/"));

    // plugin
    gulp.src([workDirectory + "/plugin/**", ], {
        dot: true
    })
    .pipe(changed(outPut + "plugin/"))
    .pipe(gulp.dest(outPut + "plugin/"));

});



// init.js
gulp.task("mini_ugli_init_js", function () {
    // 合并压缩
    gulp.src([workDirectory + js_independent[0]])
        // .pipe(concat("init.min.js"))
        .pipe(uglify())
        .pipe(stripDebug())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest(outPut + "/js"))
});

// index.js
gulp.task("mini_ugli_index_JS", function () {
    // 合并压缩
    gulp.src(js_self_a)
        .pipe(babel({
            presets: ['es2015'] // es5检查机制
        }))
        .pipe(concat("index.min.js"))
        .pipe(uglify())
        .pipe(stripDebug())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(outPut + "/js"))
});


gulp.task('mini_css', () => {
    return gulp.src(css_self_a)
        .pipe(concat("index.min.css"))
        .pipe(cleanCss({
            compatibility: 'ie8'
        }))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(outPut + '/css'));
});

function cb() {
    console.log("deleteFile");
}
// 删除文件
gulp.task('delFile', function (cb) {
    del(deleteFile, cb)
});


//html压缩
gulp.task('html', function () {

    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"

        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };


    gulp.src(workDirectory + '/index.html')
        .pipe(removeHtmlTag()) //清除特定标签
        .pipe(htmlReplace({
            'css': './css/index.min.css',
            'js': './js/index.min.js'
        }))
        .pipe(removeEmptyLines({
            removeComments: true
        })) //清除空白行
        .pipe(htmlmin(options))
        .pipe(gulp.dest(outPut));
});

//1. "copyAll"

//2. 打包
gulp.task("pack", ["delFile", "mini_ugli_init_js", "mini_ugli_index_JS", "mini_css", "html"]);



gulp.task("default", function () {

})