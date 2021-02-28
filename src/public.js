import axios from "axios";
import Store from '../src/store/index'

window.oncontextmenu = function () {
    return false
}
axios.defaults.withCredentials = true

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('Authorization'))
            config.headers.Authorization = localStorage.getItem('Authorization')
        // console.log(config)
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
axios.interceptors.response.use(function (response) {
    return response
}, function (error) {
    return Promise.reject(error)
})

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
    setTimeout(() => {
        if (/[a-zA-Z0-9_]{6,}/.test(value)) {
            axios.get(Store.state.api.checkName, {nickname: value}).then(res => {
                if (res.data.message)
                    callback()
                else callback(new Error('昵称已被占用'))
            })
        } else callback(new Error('昵称至少为6位字母、数字、下划线'))
    }, 200)
}
let checkCode = (rule, value, callback) => {
    if (!value) return callback(new Error('请输入验证码'))
    setTimeout(() => {
        axios.post(this.$store.state.api.validCode, {mail: this.ruleForm.mail})
            .then(res => {
                if (res.data.message === 'success')
                    callback()
                else callback(new Error('验证码错误'))
            })
    }, 100)
}
export {
    checkMail, checkPasswd, checkName,checkCode
}
