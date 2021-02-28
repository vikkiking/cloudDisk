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
            href="/login.html"
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
      <el-tabs tab-position="left">
        <el-tab-pane label="修改邮箱">
          <span style="display: inline-flex;width: 70%">
            <label style="width: 100px;line-height: 36px">邮箱</label>
            <el-input
              v-model="mail"
              style="line-height: 36px"
            />
            <el-button
              style="margin-left: 20px"
              type="primary"
              @click=""
            >修改</el-button>
          </span>
        </el-tab-pane>
        <el-tab-pane label="修改密码">
          <change-pass style="width: 70%" />
        </el-tab-pane>
        <el-tab-pane label="联系我们" />
      </el-tabs>
    </el-dialog>
  </el-header>
</template>
<script>
import ChangePass from '@/components/ChangePass'
import axios from "axios";

export default {
  components: {ChangePass},
  data() {
    return {
      restaurants: [],
      state: '',
      timeout: null,
      settingVisible: false,
      mail: localStorage.getItem('mail')
    };
  },
  methods: {
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
      /*localStorage.removeItem('Authorization')
      localStorage.removeItem('username')
      localStorage.removeItem('avatarURL')*/
      localStorage.clear()
      window.location.href = '/login.html'
    },
    handleChangeMail() {
      axios.post(this.$store.state.api.changeMail, {
        mail: this.mail
      }).then(res => {
        if (res.data.message === 'success')
          this.$message.success('修改成功')
        else this.$message.error('修改失败，请重试或联系我们')
      })
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
  }
}
</script>
<style>
.el-tab-pane {
  height: 315px;
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
