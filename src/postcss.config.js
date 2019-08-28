const autoprefixer = require('autoprefixer')
// postcss是后处理css的，css编译完成之后或者stylus编译为css之后，用postcss优化css代码
// 就是用autoprefixer优化代码：一些需要加浏览器前缀的-webkot，自动处理这些属性，不用每一个都加上-webkot
module.exports = {
  plugins: [
    autoprefixer()
  ]
}