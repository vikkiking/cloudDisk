import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
        me: {
            mail: localStorage.getItem('mail') ? localStorage.getItem('mail') : '',
            username: localStorage.getItem('username') ? localStorage.getItem('username') : '',
            avatarURL: localStorage.getItem('avatarURL') ? localStorage.getItem('avatarURL') : ''
        },
        api: {
            post: 'http://localhost:8080/post',//上传文件
            get: 'http://localhost:9999/get',//获取文件列表
            checkName: 'http://localhost:8080/checkname',//检查昵称是否被占用
            login: 'http://localhost:8080/user/login',//登录
            validCode: 'http://localhost:8080/validcode',//邮箱验证
            signUp: 'http://localhost:8080/signup',//注册
            delete: 'http://localhost:8080/delete',//删除文件或文件夹
            move: 'http://localhost:8080/move',//移动文件或文件夹到目标位置
            rename: 'http://localhost:8080/rename',//重命名文件或文件夹
            changeMail:'',//修改绑定邮箱
            createFolder:''//创建文件夹
        }
    },
    mutations: {
        keepLogin(state, user) {
            state.Authorization = user.Authorization
            state.me.username = user.username
            state.me.avatarURL = user.avatarURL
            localStorage.setItem('Authorization', user.Authorization)
            localStorage.setItem('username', user.username)
            localStorage.setItem('avatarURL', user.avatarURL)
            localStorage.setItem('mail', user.mail)
        }
    },
    actions: {},
    modules: {}
})
