import axios from "axios";
import store from '../src/store'

let result
/*window.oncontextmenu = function () {
    return false
}*/
//axios.defaults.headers.common['Authorization'] = localStorage.getItem('Authorization')
axios.defaults.baseURL = 'http://120.25.105.43:8080/CloudDisk-1.0-SNAPSHOT'
axios.defaults.withCredentials = true
axios.interceptors.request.use(
    config => {
        if (store.state.me.Authorization)
            config.headers.Authorization = store.state.me.Authorization
        return config
    },
    error => {
        Promise.reject = (e => {
            alert(e.response.status)
        })
        return Promise.reject(error)
    }
)
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.clear()
                    if (confirm('登录超时，请重新登录'))
                        window.location.href = '/login'
                    break
                case 500:
                    alert('服务器内部错误')
                    break
                case 304:
                    alert('请手动清除浏览器缓存')
                    break
                default:
                    alert('出现错误！')
            }
        }
        return Promise.reject(error.response.data)
    }
)
let checkMail = (rule, value, callback) => {
    if (!value) return callback(new Error('邮箱不能为空'))
    setTimeout(() => {
        if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-]+)(.[a-zA-Z0-9_-]+)$/.test(value))
            callback()
        else callback(new Error('请检查邮箱格式'))
    }, 100)
}
let checkPasswd = (rule, value, callback) => {
    if (!value) return callback(new Error('密码不能为空'))
    setTimeout(() => {
        if (/[0-9]{2,}/.test(value) && /[A-Z]+/.test(value) &&
            /[a-z]+/.test(value) && /[#&*?@]+/.test(value)) callback()
        else callback(new Error('密码应包含大小写字母、至少两个数字、特殊字符如#&*?@'))
    }, 100)
}
let checkName = (rule, value, callback) => {
    if (!value) return callback(new Error('昵称不能为空'))
    if (/[a-zA-Z0-9_]{6,}/.test(value)) return callback()
    else return callback(new Error('昵称至少为6位字母、数字、下划线'))
}
let checkCode = (rule, value, callback) => {
    if (!value) return callback(new Error('请输入验证码'))
    else return callback()
}
let countDOwn = (button) => {
    let time = 120
    let countDown = setInterval(() => {
        if (time > 0) {
            time--
            button.innerText = time + '秒'
        } else {
            button.innerText = '发送'
            button.disabled = false
            result = ''
            clearInterval(countDown)
        }
    }, 1000)
}
let json2Fd = (form) => {
    let fd = new FormData()
    for (let k in form) {
        fd.append(k, form[k])
    }
    return fd
}
export {
    checkMail, checkPasswd, checkName, checkCode, countDOwn, json2Fd
}
