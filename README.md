# gulp-cli

## 运行

### 1.全局安装gulp
```
npm install gulp -g
```

### 2.进入gulp-cli目录下，安装依赖包
```
npm install
```

### 3.将所有src中的资源复制到project中
```
gulp copyAll
```

### 4.对资源代码打包
```
gulp pack
```


##依赖包说明

###本地gulp
gulp
### 合并
gulp-concat
### 压缩js
gulp-uglify
###  js代码es6转义
gulp-babel
###  常用方法库
gulp-util
###去除console.log
gulp-strip-debug
### 压缩css 
gulp-clean-css
### 删除文件
del
### html压缩
gulp-htmlmin
### 删除特定标签
gulp-remove-html
### 清除空白行
gulp-remove-empty-lines
### 标签替换
gulp-html-replace

##配置说明

###源文件目录
"workDirectory":"./src/",
###输出的文件目录
"outPut":"./project/",
###用到js库
"js_libs":["jquery-3.1.1.min.js","pixi.min.js","js/vconsole.min.js"],
###自己的js代码(要压缩打包到一起的代码)
"js_self":["common.js","index.js"],
###自己的js代码（需要单独打包的js文件）
"js_independent":["/js/init.js"],
###用到css库
"css_libs":[],
###自己的css库
"css_self":["index.css"],
####开发时，用到的一些数据
"dev_dependencies":[]
