import {Log} from "../utils";
import {loginSchema} from "../graphql/schema/Account";

let _ = require('lodash');
export const state = () => ({
  user: {},//user信息
  isLogin: false,//是否登陆
  device: "windows",//设备信息
  isMobile: false,//是否是手机端
  purchaseVip: false,//是否要进行会员购买
  title: "",//标题栏

});

export const mutations = {
  setTitle(state, title) {
    state.title = title
  },
  changeDevice(state, device) {
    state.device = device;
    state.isMobile = !(device === 'windows')
  },
  login(state, user) {
    state.user = user;
    if (user.expiredAt === null) {
      //如果未定义
      user.expiredAt = "0";
      user.isVip = false
    } else {
      user.isVip = true
    }
    state.isLogin = true
  },
  logout(state) {
    state.isLogin = false;
    state.user = {}
  },

  setPurchaseVip(state, isPurchase) {
    state.purchaseVip = isPurchase
  }
};
/*

export const actions = {
  async nuxtServerInit(store, {app}) {//在跳转其它的页面或是刷新页面的时候，nuxt会自动调用
    let token = app.$apolloHelpers.getToken();//从apollo中读取token
    if (!_.isEmpty(token)) {//存在token
      //调用登录API
      Log(token);
      try {
        let {data} = await app.apolloProvider.defaultClient.query({
          query: loginSchema
        });
        Log(data);
        store.commit("login", data.signIn.account)
      } catch (e) {
      }
    }
  }
};
*/
