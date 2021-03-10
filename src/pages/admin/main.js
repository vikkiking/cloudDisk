import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import App from '@/pages/admin/App'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

require('../../public')
Vue.use(Element, {size: 'small', zIndex: 3000})
Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm) => {
    console.log('抛出异常')
    console.log(vm)
    console.log(err)
}
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

Vue.prototype.$throw = (err) => Vue.config.errorHandler(err, this)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
