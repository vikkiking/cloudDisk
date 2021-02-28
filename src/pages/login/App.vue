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
            prop="mail"
          >
            <el-input v-model="loginForm.mail" />
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
        id="sign_up"
      >
        <h2>注册</h2>
        <el-form
          :model="signUpForm"
          :rules="rules"
          ref="signUpForm"
          size="medium"
          label-width="6em"
          class="demo-ruleForm"
        >
          <el-form-item>
            <!--  <el-input v-model="ruleForm.name" :style="'width:12em'"></el-input>-->
            <el-upload
              class="avatar-uploader"
              action="#"
              accept="image/*"
              :show-file-list="false"
              :file-list="signUpForm.avatar"
              :auto-upload="false"
              :on-change="handleChange"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
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
            prop="nickname"
          >
            <el-input v-model="signUpForm.nickname" />
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="mail"
          >
            <el-input v-model="signUpForm.mail" />
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
            prop="validCode"
          >
            <el-input
              v-model.number="signUpForm.validCode"
              type="text"
              max-length="6"
              :style="'width:7em'"
            />
            <el-button
              @click="sendCode"
              style="position: absolute;right: 20px"
            >
              发送
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitSignUp"
            >
              立即注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div
        :class="{'hide_':C}"
        id="changePasswd"
      >
        <change-pass />
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
        mail: '',
        password: ''
      },
      signUpForm: {
        avatar: null,
        mail: '',
        nickname: '',
        password: '',
        validCode: ''
      },
      rules_: {
        mail: [{required: true, validator: login.checkMail, trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
      },
      rules: {
        mail: [{required: true, validator: login.checkMail, trigger: 'blur'}],
        nickname: [{required: true, validator: login.checkName, trigger: 'blur'}],
        password: [{required: true, validator: login.checkPasswd, trigger: 'blur'}],
        validCode: [{required: true, validator: login.checkCode, trigger: 'blur'}]
      },
      A: false,
      B: true,
      C: true,
      D: false,
      E: true,
      publicPath: process.env.BASE_URL,
      imageUrl: '',
    };
  },
  methods: {
    ...mapMutations(['keepLogin']),
    sendCode(){
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
          axios.post(this.$store.state.api.login, this.loginForm
          ).then(result => {
            result = result.data
            if (result['message'] === 'success') {
              //console.log(JSON.stringify(result, null, ' '))
              //存储token
              this.userToken = result['token']
              this.keepLogin({
                Authorization: result['token'],
                username: result['username'],
                avatarURL: result['img'],
                mail: this.loginForm.mail
              })
              //this.$router.push('/user/' + result['username'] + '/disk')
              window.location.href = '/user/' + result['username'] + '/disk'
            } else {
              console.log(result['error'])
            }
          })
        } else {
          this.$message.error('请检查输入')
        }
      });
    },
    handleChange(file, fileList) {
      this.signUpForm.avatar = file
      let fileReader = new FileReader()
      fileReader.readAsDataURL(file.raw)
      fileReader.onload = () => {
        this.imageUrl = fileReader.result
      }
    },
    submitSignUp() {
      this.$refs['signUpForm'].validate((valid) => {
        if (valid) {
          axios.post(this.$store.state.api.signUp, this.signUpForm)
              .then(res => {
                res = res.data
                if (res['message'] === 'success') {
                  this.userToken = result['Authorization']
                  this.keepLogin({
                    Authorization: result['Authorization'],
                    username: result['username'],
                    avatarURL: result['img'],
                    mail: this.signUpForm.mail
                  })
                  //this.$router.push('/user/' + result['username'] + '/disk')
                  window.location.href = '/user/' + result['username'] + '/disk'
                }
              })
        } else this.$message.error('请检查输入')
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isImg && isLt2M;
    }
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
