<template>
  <div id="app">
    <el-header>
      <el-autocomplete
          style="left: 50%;transform: translateX(-50%)"
          placeholder="搜索"
          :fetch-suggestions="search"
          @select="handleSelect"
          v-model="state">
        <i
            slot="prefix"
            class="el-input__icon el-icon-search"
        />
      </el-autocomplete>
      <a style="cursor: pointer;float: right;height: 46px;line-height:46px " @click="handleLogout">退出登录</a>
    </el-header>
    <h1>后台审核</h1>
    <file-list :api="$store.state.api.pendingList" ref="list"/>
    <el-dialog title="登录"
               :show-close="false"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               :visible.sync="dialogFormVisible">
      <el-form :model="loginForm" :rules="ruleForm" ref="loginForm">
        <el-form-item label="账号" label-width="4em" prop="admin">
          <el-input type="text" v-model="loginForm.admin"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="4em" prop="password">
          <el-input type="password" :show-password="true"
                    v-model="loginForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitLogin">登录</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import {mapMutations} from 'vuex'
import FileList from '@/pages/admin/FileList'

const store = require('../../store')

const login = require('../../public')
export default {
  components: {FileList},
  data() {
    return {
      dialogFormVisible: true,
      loginForm: {
        admin: '',
        password: ''
      },
      ruleForm: {
        admin: [{required: true, message: '请输入管理员账号', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码，忘记密码请联系后台', trigger: 'blur'}]
      },
      state: '',
      searchResults: [],
    }
  },
  created() {
    if (this.store.state.admin.Authorization)
      this.dialogFormVisible = false
  },
  methods: {
    ...mapMutations(['keepLogin']),
    submitLogin() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          axios.post(this.$store.state.api.login, login.json2Fd(this.loginForm))
              .then(res => {
                res = res.data
                if (res['message'] === 'success') {
                  this.keepLogin({
                    role: 'admin',
                    adminName: this.loginForm.admin,
                    Authorization: res.data['token']
                  })
                  this.dialogFormVisible = false
                } else this.$message.error('输入有误')
              })
        } else {
          this.$message.error('请检查输入')
        }
      })
    },
    handleLogout() {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminName')
      this.$router.go(0)
    },
    myFilter(query) {
      return (state, index) => {
        let t = state.nameFormat.indexOf(query.toLowerCase())
        if (t !== -1) {
          this.searchResults.push({'index': index, 'value': state.nameFormat})
          return true
        }
        return false
      }
    },
    search(query, cb) {
      this.searchResults = []
      let datas = this.$refs['list'].tableData
      query ? datas.filter(this.myFilter(query)) : datas
      cb(this.searchResults)
    },
    handleSelect(item) {
      this.$refs['list'].currentPage = Math.ceil(item.index / 15)
      setTimeout(() => {
        this.$refs['list'].singleSelect(this.$refs['list'].currentTable[item.index % 15])
      }, 100)
    },
  }
}
</script>

<style>
h1 {
  text-align: center;
}

.el-autocomplete .el-input input {
  height: 46px !important;
  border: none;
  background-color: #f1f3f4;
  font-size: 16px;
}

.el-autocomplete {
  width: 50% !important;
  height: 46px !important;
}


</style>
