const path = require('path') // path是node.js的基本包，处理路径
// const VueLoaderPlugin = require('vue-loader/lib/plugin'); 加上这行会报错说已经声明了，没懂，只有这行声明了
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web', //这行作用没懂？
  // 以js文件作为入口，此处声明js文件的绝对路径；绝对路径不容易出错
  // 不能以app.vue为入口文件，因为这是个组件，不能挂载到html？
  // path.join是把_dirname和后面的路径拼接成绝对路径
  entry: path.join(__dirname, 'src/index.js'), 
  output: {
    filename: 'bundle.[hash:8].js', //开发环境用hash，正式环境用chunkhash？？不理解
    path: path.join(__dirname, 'dist') // 绝对路径
  },
  // 输入这个文件，，输出index.js 和其依赖的vue和app.vue，通过webpack打包成完整的bundle.js，就是浏览器能够直接运行的js代码
  
  //加module这个配置：解决不支持处理.vue文件的问题：
  module: {
    rules: [
      {
        test: /\.vue$/, //test检测文件类型，是一个正则表达式，此处检测.vue结尾的文件
        loader: 'vue-loader' //vue-loader 处理.vue文件，输出正确的js代码
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      //用的是stylus，所以这部分可以去掉
      // {
      //   test: /\.css$/, // 正则表达式中.需要转义
      //   use: [
      //     'style-loader',
      //     'css-loader'
      //   ]
      // },
      
      //用的是extract-text-webpack-plugins对css单独打包，需要根据环境设置这部分，放在下面if(idDev)部分
      // { 
      //   // css预处理器：stylus
      //   //先是stylus-loader处理stylus代码为css，再给css-loader处理，再给style-loader
      //   test: /\.styl/,
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     { // 加上这段，是，，，，效率更高点，既定的用法，之后看下官方说明
      //       loader: 'postcss-loader',
      //       options: {
      //         sourceMap: true,
      //       }
      //     },
      //     'stylus-loader'
      //   ]
      // },
      {
        test: /\.(gif|jpg|jpeg|png)$/,
        use: [
          {  //这里使用一个对象声明，loader可以配置选项，就使用对象生命，option配置
            loader: 'url-loader', // 把图片转义为1464代码？
            options: {
              limit: 10240,
              name: '[name]-aa.[ext]' // 输出的文件的名字,[name]-aaa.[ext]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // 这两个单词要加上双引号
      //如果不加双引号，使用的时候变为：process.env.NODE_ENV = development,此处development没有定义会报错
      'process.env.': {
        NODE_ENV: isDev ? '"development"' : '"production"' // 这两个单词要加上双引号
      }
    }),
    new VueLoaderPlugin(),
    new HTMLPlugin() //配置项可以看文档
  ]
}

if (isDev) {
  config.module.rules.push({
    test: /\.styl/,
    use: [
      'style-loader',
      'css-loader',
      { // 加上这段，是，，，，效率更高点，既定的用法，之后看下官方说明
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        }
      },
      'stylus-loader'
    ]
  })
  config.devtool = '#cheap-module-eval-source-map' // 这个配置是因为：代码是vue，es6，浏览器解析后调试看到的代码看不懂，用这个官方推荐的设置
  config.devServer = {
    port: 8000,
    host: '0.0.0.0', //设置为0.0，可以通过localhost访问，也可以通过内网ip访问
    overlay: {
      errors: true, // 将错误显示在页面上
    },
    hot: true //单页面应用：只渲染修改的某组件，不会让整个页面都重新加载
  }
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.entry = {
    app: path.join(__dirname,'src/index.js'),
    vendor: ['vue']
  }
  config.output.filename = '[name].[chunkhash:8].js' //开发环境用hash，正式环境用chunkhash
  config.module.rules.push(
    {
      test: /\.styl/,
      use: ExtractPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
          'stylus-loader'
        ]
      })
    },
  )
  config.plugins.push(
    new ExtractPlugin('styles.[md5:contenthash:hex:8].css'),
    new webpack.optimize.SplitChunksPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.RuntimeChunkPlugin({
      name: 'runtime'
    })
  )
}
module.exports = config