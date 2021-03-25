<template>
  <div class="content-wrap">
    <div class="pc-wrap hidden-sm-and-down">
      <div class="icon-wrap-pc">
        <nuxt-link to="/">
          <v-icon color="#FF9800" size="100" class="my-inline-div">iconfont icon-link</v-icon>
          <div class="my-inline-div web-font-pingfang font-45 icon-text">JumpLinker</div>
        </nuxt-link>
      </div>
      <div class="register-wrap pt-5 elevation-10">
        <div class="login-register-wrap ">
          <div>
            <nuxt-link class="grey--text" to="/login">登录</nuxt-link>
            ·
            注册
          </div>
        </div>
        <div class="form-wrap">
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field label="用户名" class="pt-1 px-3 text" v-model="user.userName" :rules="userNameRules"
                          prepend-icon="account_circle" @keyup.enter="register"
                          required/>
            <v-text-field
              class="pt-1 px-3"
              prepend-icon="phone"
              v-model="user.phone"
              :rules="phoneRules"
              :error="phoneError"
              label="手机号" :error-messages="phoneMsg"
              required
              @keyup.enter="register"
            />
            <v-text-field
              class="pt-1 px-3"
              prepend-icon="email"
              v-model="user.email"
              :rules="emailRules"
              :error="emailError"
              :error-messages="emailMsg"
              label="邮箱"
              required
              @keyup.enter="register"
            />
            <v-text-field
              class="pt-1 px-3"
              prepend-icon="iconfont icon-yaoqing"
              v-model="inviteCode"
              label="邀请码(非必填项)"
              @keyup.enter="register"
            />
            <v-text-field :type="show1?'text':'password'"
                          :append-icon="show1?'visibility_off':'visibility'"
                          prepend-icon="lock"
                          class="pt-1 px-3"
                          v-model="password1"
                          :rules="passwordRules"
                          label="输入密码"
                          :error="passwordError"
                          :error-messages="errorMsg"
                          @click:append="show1=!show1"
                          @input="passwordStrength"
                          required
                          @keyup.enter="register"/>
            <v-text-field :type="show2?'text':'password'"
                          class="pt-1 px-3"
                          :append-icon="show2?'visibility_off':'visibility'"
                          prepend-icon="lock"
                          v-model="password2"
                          :rules="passwordRules"
                          label="再次输入密码"
                          :error="passwordError"
                          :error-messages="errorMsg"
                          @click:append="show2=!show2"
                          @keyup.enter="register"
                          required/>
            <div class="action-wrap web-font-pingfang-thin">
              <v-progress-linear stream :value="strength" :color="strengthColor"/>
            </div>
            <div class="btn-wrap">
              <v-btn :disabled="!valid" @click="register" class="display-1" block large outlined rounded color="green">
                注册
              </v-btn>
            </div>
          </v-form>

        </div>
      </div>
    </div>

    <div class="mobile-wrap hidden-md-and-up">
      <div class="icon-wrap-mobile">
        <nuxt-link to="/">
          <v-icon color="#FF9800" size="25" class="my-left">iconfont icon-link</v-icon>
          <div class="icon-title-2 text-md-left">JumpLinker</div>
        </nuxt-link>
      </div>
      <div class="mobile-form-wrap">
        <v-form v-model="valid" ref="form2" lazy-validation>
          <v-text-field
            label="用户名" class="pa-0" v-model="user.userName" :rules="userNameRules"
            prepend-icon="account_circle" @keyup.enter="register"
            required/>
          <v-text-field
            class="pa-0 text-item-wrap"
            prepend-icon="phone"
            v-model="user.phone"
            :rules="phoneRules"
            :error="phoneError"
            label="手机号" :error-messages="phoneMsg"
            required
            @keyup.enter="register"
          />
          <v-text-field
            class="pa-0 text-item-wrap"
            prepend-icon="email"
            v-model="user.email"
            :rules="emailRules"
            :error="emailError"
            :error-messages="emailMsg"
            label="邮箱"
            required
            @keyup.enter="register"
          />
          <v-text-field
            class="pa-0 text-item-wrap"
            :type="show1?'text':'password'"
            :append-icon="show1?'visibility_off':'visibility'"
            prepend-icon="lock"
            v-model="password1"
            :rules="passwordRules"
            label="输入密码"
            :error="passwordError"
            :error-messages="errorMsg"
            @click:append="show1=!show1"
            @input="passwordStrength"
            required
            @keyup.enter="register"/>
          <v-text-field
            class="pa-0 text-item-wrap"
            :type="show2?'text':'password'"
            :append-icon="show2?'visibility_off':'visibility'"
            prepend-icon="lock"
            v-model="password2"
            :rules="passwordRules"
            label="再次输入密码"
            :error="passwordError"
            :error-messages="errorMsg"
            @click:append="show2=!show2"
            @keyup.enter="register"
            required/>
          <v-text-field
            class="pa-0 text-item-wrap"
            prepend-icon="iconfont icon-yaoqing"
            v-model="inviteCode"
            label="邀请码(非必填项)"
            @keyup.enter="register"
          />
        </v-form>
      </div>
      <div class="mobile-btn-wrap">
        <v-btn :disabled="!valid" block rounded depressed class="white-text font-20 " color="light-blue "
               @click="register">注册
        </v-btn>
      </div>

      <div class="mobile-bottom web-font-pingfang-thin">
        <v-btn class="ma-0  " nuxt to="/login" depressed text
               color="#5D6D7E">用户登录
        </v-btn>
        <v-btn class=" ma-0 " nuxt to="/forget" style="float: right" depressed text
               color="#4EA1FF">忘记密码?
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import AccountApi from "../graphql/api/AccountApi";

  let $md5;
  let $strength;
  let $cookie;
  export default {
    head: {
      title: "JumpLinker - 注册"
    },
    layout: 'signIn',
    mixins: [AccountApi],
    mounted() {
      $strength = require('zxcvbn');
      $md5 = require('js-md5');
      $cookie = require('js-cookie');
      const code = this.$route.query.inviteId;
      if (code !== undefined) {
        this.inviteCode = code
      }
    },
    methods: {
      //处理密码强度
      passwordStrength() {
        this.flag = true
        let score = $strength(this.password1).score;
        let process;
        if (score === 0) {
          process = 0
        } else if (score === 1) {
          process = 25
        } else if (score === 2) {
          process = 50
        } else if (score === 3) {
          process = 75
        } else if (score === 4) {
          process = 100
        }
        this.changeProcess(score, process)
      },
      changeProcess(score, process) {
        let timer = setInterval(() => {
          if (this.strength === process || $strength(this.password1).score !== score) {
            clearInterval(timer)
          } else {
            if (this.strength > process) {
              this.strength--
            } else {
              this.strength++
            }
          }
        }, 15)
      },
      //用户注册
      register() {
        let form = this.$refs.form
        if (this.$store.state.isMobile) {
          form = this.$refs.form2
        }
        if (form.validate() && this.valid) {
          if (this.strength < 25) {//如果密码强度太低，则进行提示用户加强
            this.$message.warning('密码太简单啦，加强一下吧！')
          } else {//通过验证后
            if (this.inviteCode.length !== 0&& !isNaN(Number.parseInt(this.inviteCode))) {
              this.user.inviteCode = Number.parseInt(this.inviteCode);
            }
            this.registerApi(this.user).then(() => {
              this.$message.success("注册成功");
              //跳转到登录页面
              this.$router.push({path: `/login`})
            })
          }
        }
      },
    },
    computed: {
      passwordError: function () {
        if (this.password1.length > 0 && this.password2.length > 0 && this.password1 !== this.password2) {
          this.errorMsg = '两次密码不一致';
          return true
        }
        this.errorMsg = '';
        this.user.password = this.password1;
        return false
      },
      phoneError: function () {
        const pattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (typeof (this.user.phone) === 'undefined' || pattern.test(this.user.phone) || this.user.phone.length === 0) {
          this.phoneMsg = '';
          return false
        }
        this.phoneMsg = '请输入正确的手机号';
        return true
      },
      emailError: function () {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (typeof (this.user.email) === 'undefined' || pattern.test(this.user.email) || this.user.email.length === 0) {
          this.emailMsg = '';
          return false
        }
        this.emailMsg = '请输入正确的邮箱';
        return true
      },
      strengthColor: function () {
        if (!this.flag) {
          return 'grey'
        }
        if (this.strength <= 25) {
          return '#E74C3C'
        } else if (this.strength > 25 && this.strength <= 50) {
          return '#F1C40F'
        } else if (this.strength > 50 && this.strength <= 75) {
          return '#F39C12'
        } else if (this.strength > 75 && this.strength <= 100) {
          return '#28B463'
        }
      },
    },
    data: function () {
      return {
        valid: false,
        strength: 0,
        show1: false,
        show2: false,
        flag: false,
        user: {
          userName: "",
          password: "",
          phone: "",
          email: "",
        },
        inviteCode: "",
        password1: '',
        password2: '',
        errorMsg: "",
        phoneMsg: "",
        emailMsg: '',
        passwordRules: [
          v => !!v || '密码不为空',
          v => {
            if (typeof (v) === 'undefined') {
              return true
            }
            return v.length >= 8 || '密码不得少于8位'
          },
          v => {
            if (typeof (v) === 'undefined') {
              return true
            }
            return v.length <= 16 || '密码不得超过16位'
          }
        ],
        userNameRules: [
          v => !!v || '用户名不为空',
          v => {
            if (typeof (v) === 'undefined') {
              return true
            }
            return v.length >= 3 || '用户名不得少于3位'
          },
          v => {
            if (typeof (v) === 'undefined') {
              return true
            }
            return v.length <= 10 || '用户名不得超过10位'
          }
        ],
        phoneRules: [
          v => !!v || '手机号不可为空'
        ],
        emailRules: [
          v => !!v || '邮箱不可为空'
        ]
      }
    }

  }
</script>

<style scoped>
  a {
    text-decoration: none;
  }

  .icon-wrap-mobile {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .icon-wrap-pc {
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .content-wrap {
    width: 100%;
    height: 100%;
  }

  .pc-wrap {
    width: 100%;
    height: 750px;
    margin-top: 20px;
  }

  .register-wrap {
    background-color: white;
    border-radius: 3px;
    height: 600px;
    width: 420px;
    margin-left: auto;
    margin-right: auto;
  }

  .btn-wrap {
    margin-top: 15px;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
  }

  .login-register-wrap {
    width: 100%;
    height: 50px;
    text-align: center;
    font-size: 44px;
  }

  .icon-text {
    color: #30304D;
  }


  .form-wrap {
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    width: 95%;
    text-align: center;
  }

  .mobile-form-wrap {
    margin-top: 10px;
    width: 100%;
    text-align: center;
  }

  .action-wrap {
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    width: 95%;
    height: 20px;
  }

  .mobile-wrap {
    height: 100%;
    width: 90%;
    margin-right: auto;
    margin-left: auto;
    position: relative;
  }

  .mobile-btn-wrap {
    margin-top: 10px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }

  .mobile-bottom {
    position: absolute;
    height: 50px;
    width: 100%;
    bottom: 0;
  }

  .text-item-wrap {
    margin-top: 20px;
  }
</style>
