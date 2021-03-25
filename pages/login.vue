<template>
  <div class="content-wrap">
    <div class="pc-wrap hidden-sm-and-down">
      <div class="icon-wrap">
        <nuxt-link to="/">
          <v-icon color="#FF9800" size="100" class="my-inline-div">iconfont icon-link</v-icon>
          <div class="my-inline-div web-font-pingfang font-45 icon-text">JumpLinker</div>
        </nuxt-link>
      </div>
      <div class="login-wrap pt-5 elevation-10">
        <div class="login-register-wrap ">
          <div>登录·
            <nuxt-link class="grey--text" to="/register">注册</nuxt-link>
          </div>
        </div>
        <div class="form-wrap">
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
              class="pt-2 px-3"
              prepend-icon="account_circle"
              v-model="user.userName"
              :rules="userNameRules"
              label="用户名"
              required
              @keyup.enter="login"
            />
            <v-text-field
              class="pt-3 px-3"
              :type="show?'text':'password'"
              :append-icon="show?'visibility_off':'visibility'"
              prepend-icon="lock"
              v-model="user.password"
              :rules="passwordRules"
              label="密码"
              @click:append="show=!show"
              required
              @keyup.enter="login"
            />
            <div class="action-wrap web-font-pingfang-thin">
              <v-checkbox
                class="check-wrap "
                color="#40A1FA"
                v-model="remember"
                label="记住密码"
              />
              <v-btn class="forget-wrap" text color="blue" rounded>
                <nuxt-link class="blue&#45;&#45;text" to="/forget">忘记密码?</nuxt-link>
              </v-btn>
            </div>
          </v-form>
          <div class="btn-wrap">
            <v-btn :disabled="!valid" block rounded depressed large class="white-text font-30 " color="light-blue "
                   @click="login">登录
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <div class="mobile-wrap hidden-md-and-up">
      <div class="icon-wrap">
        <nuxt-link to="/">
          <v-icon color="#FF9800" size="50" class="my-left">iconfont icon-link</v-icon>
          <div class="icon-title-2 text-md-left">JumpLinker</div>
        </nuxt-link>
      </div>
      <div class="mobile-form-wrap">
        <v-form v-model="valid" ref="form2" lazy-validation>
          <v-text-field
            class="pt-2 "
            prepend-icon="account_circle"
            v-model="user.userName"
            :rules="userNameRules"
            label="用户名"
            required
            @keyup.enter="login"
          />
          <v-text-field
            class="mt-4"
            :type="show?'text':'password'"
            :append-icon="show?'visibility_off':'visibility'"
            prepend-icon="lock"
            v-model="user.password"
            :rules="passwordRules"
            label="密码"
            @click:append="show=!show"
            required
            @keyup.enter="login"
          />
        </v-form>
      </div>
      <div class="mobile-btn-wrap">
        <v-btn :disabled="!valid" block rounded depressed large class="white-text font-30 " color="light-blue "
               @click="login">登录
        </v-btn>
      </div>
      <div class="mobile-bottom web-font-pingfang-thin">
        <v-btn class="ma-0" nuxt to="/register" depressed text
               color="#5D6D7E">新用户注册
        </v-btn>
        <v-btn class="ma-0 " nuxt to="/forget" style="float: right" depressed text
               color="#4EA1FF">忘记密码?
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>

  import {Log} from "../utils";

  let $cookie;
  import {login} from "../graphql/schema/Account";
  import AccountApi from "../graphql/api/AccountApi";

  export default {
    head: {
      title: "JumpLinker - 登录"
    },
    mixins: [AccountApi],
    layout: 'signIn',
    data: function () {
      return {
        user: {
          userName: "",
          password: ""
        },
        remember: false,
        valid: false,
        show: false,
        userNameRules: [
          v => !!v || '用户名不可为空',
        ],
        passwordRules:
          [v => !!v || '密码不可为空']
      }
    },
    methods: {
      async login() {
        let form = this.$refs.form;
        if (this.$store.state.isMobile) {
          form = this.$refs.form2
        }
        if (form.validate() && this.valid) {
          this.loginApi(this.user).then(data => {
            Log(data);
            this.handleLoginResult(data)
          })
        }
      },
      handleLoginResult(data) {
        this.$message.success('登录成功！！');
        this.handleRemember();
        //将用户的相关信息存放到store中
        this.$store.commit('login', data);
        //页面跳转
        if (this.$store.state.purchaseVip) {//如果购买，跳转到vip购买页面
          if (this.$store.state.isMobile) {
            this.$router.push({path: `/user_center_mobile/my_center`})
          } else {
            this.$router.push({path: `/user_center/my_center`})
          }
          if (!this.$store.state.isMobile) {
            this.$store.commit("setPurchaseVip", false)
          }
        } else {
          if (this.$store.state.isMobile) {
            this.$router.push({path: `/user_center_mobile`})
          } else {
            this.$router.push({path: `/user_center`})
          }
        }
      },
      handleRemember() {
        //判断是否需要记住密码
        //手机端默认记住密码
        if (this.remember || this.$store.state.isMobile) {
          //将用户信息加密后存入cookie中
          let userName = this.$utils.encrypt(this.user.userName);
          let password = this.$utils.encrypt(this.user.password);
          $cookie.set('userName', userName, {expires: 7});
          $cookie.set('password', password, {expires: 7})
        } else {
          $cookie.remove('userName');
          $cookie.remove('password')
        }
      },
      readCookie() {
        //读取本地cookie信息，查看之前是否有将用户的登录信息存放在cookie中
        let userName = $cookie.get('userName');
        let password = $cookie.get('password');
        if (!_.isUndefined(userName) && !_.isUndefined(password)) {
          //读取到信息，开始解析数据
          userName = this.$utils.decode(userName);
          password = this.$utils.decode(password);
          this.user.userName = userName;
          this.user.password = password;
          this.remember = true
        }
      }
    },
    mounted() {
      //初始化
      $cookie = require('js-cookie');
      this.readCookie()
    }
  }
</script>
<style scoped>
  a {
    text-decoration: none;
  }

  .icon-wrap {
    width: 100%;
    height: 110px;
    line-height: 110px;
    text-align: center;
  }

  .content-wrap {
    width: 100%;
    height: 100%;
  }

  .pc-wrap {
    width: 100%;
    height: 550px;
    margin-top: calc(50vh - 280px);
  }

  .login-wrap {
    background-color: white;
    border-radius: 3px;
    height: 390px;
    width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .check-wrap {
    float: left;
    margin-top: 3px;
    margin-left: 12px;
  }

  .forget-wrap {
    float: right;
    margin-top: 3px;
    margin-right: 5px;
  }

  .btn-wrap {
    margin-top: 10px;
    width: 370px;
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
    width: 390px;
    text-align: center;
  }

  .mobile-form-wrap {
    margin-top: 40px;
    width: 100%;
    text-align: center;

  }

  .action-wrap {
    width: 100%;
    height: 50px;
    margin-top: 15px;
  }

  .mobile-wrap {
    padding-top: 15%;
    height: 100%;
    width: 90%;
    margin-right: auto;
    margin-left: auto;
    position: relative;
  }

  .mobile-btn-wrap {
    margin-top: 30px;
  }

  .mobile-bottom {
    position: absolute;
    height: 50px;
    width: 100%;
    bottom: 0;
  }
</style>
