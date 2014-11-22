### 初始化开发环境

开发环境所需组件：

1. http://nodejs.org
2. http://bowerjs.com
3. http://gulpjs.com

初始化项目目录：

1. `npm install`
2. `bower install`

### 开发命令

1. 启动开发服务器：`gulp serve`
2. 启动开发服务器（部署版本）：`gulp serve:dist`
3. 编译项目（编译结果输出至 dist 目录）：`gulp build`
4. 清理编译及临时目录：`gulp clean`
5. 执行JSHint：`gulp jshint`

### 编译过程说明

1. 压缩 CSS 和 JS 和图片
2. 所有 CSS 和 JS 都会自动在文件名中添加校验码签名（解决缓存刷新问题，另外分离 vendor.css 和 main.css 则是为了提高缓存效率）
3. 自动添加浏览器特征前缀（-webkit- 等）
4. 对于 Angular 添加了 ng-annotate 过程，依赖注入可以简化 `[$http, ..., function($http, ...){}]` 的数组写法

### 关于 dist 分支

（不执行发布的话可以忽略此部分） 

dist 分支是个独立分支，专用于发布编译后的代码。

* `gulp dist:init` 初始化 dist 目录（克隆仓库之后只需执行一次）
* `gulp dist` 执行下列操作：
    1. 清理 /dist 目录
    2. 编译 /app 中的项目源码，到 /dist 目录
    3. 将 /dist 目录中的文件推送到服务器的 dist 分支
