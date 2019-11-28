import Vue from 'vue';
import App from './App';
import Router from './router';
import store from './store/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as Http from '@/assets/js/axios.js';
import Viser from 'viser-vue';
import { formatTime } from './assets/util';

Vue.use(Viser);

let router = null;
let instance = null;

export async function bootstrap() {
  debugger;
  console.log('vue app bootstraped');
}

export async function mount(props) {
  console.log('props from main framework', props);
  router = Router;

  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}

export async function unmount() {
  instance.$destroy();
  instance = null;
  router = null;
}

// const cookie = document.cookie;
// const arr = location.pathname.split('/');
// const flag = arr.length > 2 ? arr[2] != 'balance' : true;
// if (cookie.indexOf('ypsso_uid=') === -1 && flag) {
//     window.location.replace('https://open.zhuanzhuan.com')
// } else {
//     Vue.prototype.$http = Http;
//     Vue.use(ElementUI);
//     Vue.config.productionTip = false;
//     Vue.filter('formatTime', (value) => value ? formatTime(value) : '');

//     new Vue({
//         router,
//         store,
//         render: h => h(App)
//     }).$mount('#app')
// }
