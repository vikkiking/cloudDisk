<template>
  <el-header style="height: 64px">
    <a
        class="logo"
        href=""
    >
      <img
          src="../assets/logo.png"
          alt="logo"
      >
      <span>XX网盘</span>
    </a>
    <el-autocomplete
        class="inline-input"
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="在网盘中搜索"
        @select="handleSelect"
    >
      <i
          slot="prefix"
          class="el-input__icon el-icon-search"
      />
    </el-autocomplete>
    <el-dropdown
        class="avatar"
        trigger="click"
    >
      <el-avatar :src="$store.state.me.avatarURL">
        {{ $store.state.me.username }}
      </el-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
            icon="el-icon-setting"
            @click.native="settingVisible=true"
        >
          设置
        </el-dropdown-item>
        <el-dropdown-item icon="el-icon-user">
          <a
              href="/login"
              target="_blank"
          >登录/注册</a>
        </el-dropdown-item>
        <el-dropdown-item
            icon="el-icon-switch-button"
            @click.native="handleLogout"
        >
          注销
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
        title="设置"
        :visible.sync="settingVisible"
        width="80%"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
    >
      <el-tabs :tab-position="tabPosition">
        <el-tab-pane label="修改邮箱">
          <el-form
              :model="mailForm"
              :rules="ruleForm"
              size="medium">
            <el-form-item>
              邮箱
            </el-form-item>
            <el-form-item
                label="验证码"
                prop="authCode"
            >
              <el-input
                  v-model.number="mailForm.authCode"
                  type="text"
                  max-length="6"
                  :style="'width:7em;float:left'"
              />
              <el-button
                  id="send_changeMail"
                  @click="sendCode"
                  :loading="loading"
                  style="position: absolute;right: 20px;"
              >
                发送
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                  type="primary"
                  @click="handleChangeMail">
                提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码">
          <change-pass style="/*width: 70%*/"/>
        </el-tab-pane>
        <el-tab-pane label="联系我们"/>
      </el-tabs>
    </el-dialog>
  </el-header>
</template>
<script>
import ChangePass from '@/components/ChangePass'
import axios from "axios";

const login = require('../public')

export default {
  components: {ChangePass},
  data() {
    return {
      restaurants: [],
      state: '',
      timeout: null,
      settingVisible: false,
      tabPosition: document.body.clientWidth >= 730 ? 'left' : 'top',
      mailForm: {email: localStorage.getItem('mail'), authCode: ''},
      ruleForm: {
        mail: [{required: true, message: '邮箱不能为空'}],
        authCode: [{required: true, validator: login.checkCode, trigger: 'blur'}]
      },
      loading: false
    };
  },
  mounted() {
    this.restaurants = this.loadAll()
    const _this = this
    window.onresize = () => {
      return (() => {
        this.$nextTick(() => {
          _this.tabPosition = document.body.clientWidth >= 730 ? 'left' : 'top'
        })
      })()
    }
  },
  methods: {
    sendCode() {
      let button = document.querySelector('#send_changeMail')
      button.innerText = '发送'
      button.disabled = true
      this.loading = true
      let fd = new FormData()
      fd.append('email', this.mailForm.email)
      axios.post(this.$store.state.api.getCode, fd).then(res => {
        this.loading = false
        if (res.data.message === 'success') {
          login.countDOwn(button)
        }
      })
    },
    loadAll() {
      return [
        {"value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号"},
        {"value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号"},
      ];
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      //openFolder(path)
    },
    handleLogout() {
      localStorage.removeItem('Authorization')
      localStorage.removeItem('username')
      localStorage.removeItem('avatarURL')
      localStorage.removeItem('email')
      window.location.href = '/login'
    },
    handleChangeMail() {
      let fd = new FormData()
      fd.append('mail', this.mail)
      axios.post(this.$store.state.api.changeMail, fd).then(res => {
        if (res.data.message === 'success')
          this.$message.success('修改成功')
        else this.$message.error('修改失败，请重试或联系我们')
      })
    }
  },
}
</script>
<style>
.el-tab-pane {
  height: 315px;
  width: 100%;
  margin: 0 auto;
}

.el-dialog {
  z-index: 12;
}

.el-loading-mask {
  z-index: 1 !important;
}

.el-header {
  /*background: #21a675;*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  position: sticky;
  top: 0;
  z-index: 3;
  border-bottom: 1px solid #dadce0;
}

.el-autocomplete {
  width: 50% !important;
  height: 46px !important;
}

.el-input, .el-input input {
  height: 46px !important;
  border: none;
  background-color: #f1f3f4;
  font-size: 16px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo > img {
  width: 40px;
  height: 40px;
}

.logo > span {
  font-size: 22px;
  line-height: 24px;
  color: #2c3e50;
}

.avatar {

}

.avatar > img {
  width: 40px;
  height: 40px;
}

.avatar:hover {
  cursor: pointer;
}
</style>
