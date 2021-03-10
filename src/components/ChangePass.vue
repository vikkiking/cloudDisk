<template>
  <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="6em"
      class="demo-ruleForm"
      size="medium"
  >
    <el-form-item
        label="邮箱"
        prop="mail"
    >
      <el-input v-model="ruleForm.mail"/>
    </el-form-item>
    <el-form-item
        label="密码"
        prop="pass"
    >
      <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
          :show-password="true"
      />
    </el-form-item>
    <el-form-item
        label="确认密码"
        prop="checkPass"
    >
      <el-input
          type="password"
          v-model="ruleForm.checkPass"
          autocomplete="off"
          :show-password="true"
      />
    </el-form-item>
    <el-form-item
        label="验证码"
        prop="authCode"
    >
      <el-input
          v-model.number="ruleForm.authCode"
          type="text"
          max-length="6"
          :style="'width:7em;float:left'"/>
      <el-button
          id="send_changePass"
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
          @click="submitForm('ruleForm')"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";

const login = require('../public')

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (!value) return callback(new Error('密码不能为空'))
      setTimeout(() => {
        if (/[0-9]{2,}/.test(value) && /[A-Z]+/.test(value) &&
            /[a-z]+/.test(value) && /[#&*?@]+/.test(value)) callback()
        else callback(new Error('密码应包含大小写字母、至少两个数字、特殊字符如#&*?@'))
      }, 100)
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        mail: '',
        pass: '',
        checkPass: '',
        authCode: ''
      },
      rules: {
        mail: [{required: true, message: '邮箱不能为空'}],
        pass: [{required: true, validator: validatePass, trigger: 'blur'}],
        checkPass: [{required: true, validator: validatePass2, trigger: 'blur'}],
        authCode: [{required: true, validator: login.checkCode, trigger: 'blur'}]
      },
      loading: false
    }
  },
  methods: {
    sendCode() {
      let button = document.querySelector('#send_changePass')
      button.innerText = '发送'
      button.disabled = true
      this.loading = true
      axios.post(this.$store.state.api.getCode, login.json2Fd({email: this.ruleForm.mail})).then(res => {
        this.loading = false
        if (res.data.message === 'success') {
          login.countDOwn(button)
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message.success('修改成功，现在你可以使用新密码登录了')
        } else {
          this.$message.error('请检查输入')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
