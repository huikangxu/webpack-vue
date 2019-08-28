import Vue from 'vue'
import App from './app.vue'

import './assets/styles/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
  render: (h) => h(App)
}).$mount(root)
// 只是声明了组件是app的内容
// 还需要挂载到app节点上，加上￥mount（）？？