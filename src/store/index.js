import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        role: '',
        admin: {
            Authorization: localStorage.getItem('adminToken') ? localStorage.getItem('adminToken') : '',
            adminName: localStorage.getItem('adminName') ? localStorage.getItem('adminName') : '',

        },
        me: {
            Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
            mail: localStorage.getItem('mail') ? localStorage.getItem('mail') : '',
            username: localStorage.getItem('username') ? localStorage.getItem('username') : '',
            avatarURL: localStorage.getItem('avatarURL') ? localStorage.getItem('avatarURL') : ''
        },
        api: {
            post: '/user/uploadFile',//上传文件ok
            get: '/user/get',//获取文件列表
            checkName: '/user/checkName',//检查昵称是否被占用ok
            login: '/user/login',//登录ok
            getCode: '/user/getCode',//发送验证码ok
            signUp: '/user/register',//注册ok
            delete: '/user/delete',//删除文件或文件夹
            move: '/user/move',//移动文件或文件夹到目标位置
            rename: '/user/rename',//重命名文件或文件夹
            changeMail: '/user/update',//修改绑定邮箱
            createFolder: '/user/createFolder',//创建文件夹
            pendingList: '/pendingList',//待审核列表,
            pass: '/pass',//通过审核
            //completedList: '/completedList',//最近审核完的列表，容量上限待定
        }
    },
    mutations: {
        keepLogin(state, user) {
            if (user.role === 'admin') {
                state.admin.Authorization = user.Authorization
                state.admin.adminName = user.adminName
                localStorage.setItem('adminToken', user.Authorization)
                localStorage.setItem('adminName', user.adminName)
            } else {
                state.me.Authorization = user.Authorization
                state.me.username = user.username
                state.me.avatarURL = user.avatarURL
                localStorage.setItem('Authorization', user.Authorization)
                localStorage.setItem('username', user.username)
                localStorage.setItem('avatarURL', user.avatarURL)
                localStorage.setItem('email', user.email)
            }
        }
    },
    actions: {},
    modules: {}
})
