<template>
  <div id="app">
    <div id="form">
      <div
          :class="{'hide_':A}"
          id="sign_in"
      >
        <h2>欢迎回来！</h2>
        <el-form
            :model="loginForm"
            :rules="rules_"
            ref="loginForm"
            size="medium"
            label-width="6em"
            class="demo-ruleForm"
        >
          <el-form-item
              label="邮箱"
              prop="email"
          >
            <el-input v-model="loginForm.email"/>
          </el-form-item>
          <el-form-item
              label="密码"
              prop="password"
          >
            <el-input
                v-model="loginForm.password"
                type="password"
                :show-password="true"
            />
          </el-form-item>
          <el-form-item>
            <el-button
                type="primary"
                @click="submitLogin"
            >
              立即登录
            </el-button>
            <el-button @click="changePasswd">
              忘记密码
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div
          :class="{'hide_':B}"
          id="sign_up">
        <h2>注册</h2>
        <el-form
            :model="signUpForm"
            :rules="rules"
            ref="signUpForm"
            size="medium"
            label-width="6em"
            class="demo-ruleForm">
          <el-form-item>
            <!--  <el-input v-model="ruleForm.name" :style="'width:12em'"></el-input>-->
            <el-upload
                class="avatar-uploader"
                action="#"
                name="avatar"
                accept="image/*"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleAvatarSuccess"
            >
              <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  class="avatar"
                  alt=""
              >
              <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload>
          </el-form-item>
          <el-form-item
              label="昵称"
              prop="userName"
          >
            <el-input v-model="signUpForm.userName"/>
          </el-form-item>
          <el-form-item
              label="邮箱"
              prop="email"
          >
            <el-input v-model="signUpForm.email"/>
          </el-form-item>
          <el-form-item
              label="密码"
              prop="password"
          >
            <el-input
                v-model="signUpForm.password"
                type="password"
                :show-password="true"
            />
          </el-form-item>
          <el-form-item
              label="验证码"
              prop="authCode"
          >
            <el-input
                v-model.number="signUpForm.authCode"
                type="text"
                max-length="6"
                :style="'width:7em'"
            />
            <el-button
                id="send_signUp"
                @click="sendCode"
                :loading="loading"
                style="position: absolute;right: 20px"
            >
              发送
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
                type="primary"
                @click="submitSignUp">立即注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div
          :class="{'hide_':C}"
          id="changePasswd"
      >
        <change-pass/>
      </div>
    </div>
    <div class="change">
      <div
          :class="{'hide_':D}"
          id="c2_sign_up"
      >
        <h2>还没有帐号?</h2>
        <p>立即注册，云同步你的数据</p>
        <el-button
            @click="c2_signUp"
            class="button"
        >
          现在注册
        </el-button>
      </div>
      <div
          :class="{'hide_':E}"
          id="c2_sign_in"
      >
        <h2>已有帐号?</h2>
        <p>现在就登录吧，好久不见</p>
        <el-button
            @click="c2_signIn"
            class="button"
        >
          现在登录
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import ChangePass from "@/components/ChangePass";
import axios from "axios";
import {mapMutations} from 'vuex'

const login = require('../../public')
export default {
  name: 'App',
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      signUpForm: {
        avatar: File,
        email: '',
        userName: '',
        password: '',
        authCode: ''
      },
      rules_: {
        email: [{required: true, validator: login.checkMail, trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
      },
      rules: {
        email: [{required: true, validator: login.checkMail, trigger: 'blur'}],
        userName: [{required: true, validator: login.checkName, trigger: 'blur'}],
        password: [{required: true, validator: login.checkPasswd, trigger: 'blur'}],
        authCode: [{required: true, validator: login.checkCode, trigger: 'blur'}]
      },
      A: false,
      B: true,
      C: true,
      D: false,
      E: true,
      publicPath: process.env.BASE_URL,
      imageUrl: '',
      loading: false
    };
  },
  created() {
  },
  methods: {
    ...mapMutations(['keepLogin']),
    sendCode() {
      let button = document.querySelector('#send_signUp')
      button.innerText = '发送'
      button.disabled = true
      this.loading = true
      axios.post(this.$store.state.api.getCode, login.json2Fd({email: this.signUpForm.email})).then(res => {
        this.loading = false
        if (res.data.message === 'success') {
          login.countDOwn(button)
        } else this.$message.error(res.data['error'])
      })
    },
    c2_signUp() {
      this.A = true
      this.B = false
      this.C = true
      this.D = true
      this.E = false
    },
    c2_signIn() {
      this.A = false
      this.B = true
      this.C = true
      this.D = false
      this.E = true
    },
    changePasswd() {
      this.A = true
      this.B = true
      this.C = false
    },
    submitLogin() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          axios.post(this.$store.state.api.login, login.json2Fd(this.loginForm)
          ).then(result => {
            result = result.data
            if (result['message'] === 'success') {
              //存储token
              this.keepLogin({
                Authorization: result.data.token,
                username: result.data.userName,
                avatarURL: result.data.avatar,
                email: result.data.email
              })
              window.location.href = '/user/disk'
            } else {
              this.$message.error(result['error'])
            }
          })
        } else {
          this.$message.error('请检查输入')
        }
      });
    },
    submitSignUp() {
      console.log('注册中。。。请稍等')
      this.$refs['signUpForm'].validate((valid) => {
        if (valid) {
          axios.get(this.$store.state.api.checkName, {
            params: {
              userName: this.signUpForm.userName
            }
          }).then(result => {
            if (result.data.message === 'failed')
              this.$message.error('昵称已被占用')
            else {
              axios.post(this.$store.state.api.signUp, login.json2Fd(this.signUpForm))
                  .then(res => {
                    res = res.data
                    if (res['message'] === 'success') {
                      this.keepLogin({
                        Authorization: result.data.token,
                        username: result.data.userName,
                        avatarURL: result.data.avatar,
                        email: result.data.email
                      })
                      //this.$router.push('/user/' + result['username'] + '/disk')
                      window.location.href = '/user/disk'
                    } else this.$message.error(res['error'])
                  })
            }
          })
        } else this.$message.error('请检查输入')
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(file,fileList) {
      this.signUpForm.avatar = file
      let reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onloadend=() => {
        this.imageUrl = reader.result
      }
    },
  },
  components: {ChangePass}
}
</script>

<style>
body {
  margin: 0;
  background-color: #21a675;
  overflow-y: hidden;
}

.demo-ruleForm {
  width: 100%;
}

#app {
  display: flex;
  width: 50em;
  margin: calc(50vh - 12.5em - 10px) auto;
  padding: 0 20px;
}

.hide_ {
  display: none;
}

#sign_in, #sign_up, #changePasswd {
  width: 80%;
}

/*
@media screen and (min-width: 50em) {
  #app {
    width: 50em;
    height: 25em;
    flex-direction: row;
    margin: calc(50vh - 25vw) auto;
  }
  #form,.change{
    width: 50%;
  }
}
@media screen and (max-width: 50em) {
  #app {
    flex-direction: column;
    width: 20em;
    margin: 0 auto;
  }
  #form,.change{
    width: 100%;
  }
}
*/
#form {
  width: 60%;
  /*height: 30em;*/
  background-color: #fff;
  position: relative;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

h2, a {
  text-align: center;
  width: 100%;
}

.change {
  width: 40%;
  height: 25em;
  color: #fff;
  text-align: center;
  background: url('../../assets/cloudDrivesvg.svg') no-repeat center;
  background-size: 18em;
  position: relative;
}

.button {
  position: absolute;
  bottom: 20px;
  left: calc(50% - 50px);
}

.el-form-item {
  margin-bottom: 30px !important;
}

.avatar-uploader {
  margin-left: calc(50% - 4em);
  width: 100%;
  height: 62px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 14px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px !important;
  text-align: center;
}

.avatar {
  width: 60px;
  height: 60px;
  display: block;
}

.el-form-item:last-child {
  display: flex;
  justify-content: center;
}
</style>
