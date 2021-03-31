import $axios from "@/API/AxiosHelper"
import {Log} from "@/utils";

export default async function ({store, route, redirect, error, params, req, app}) {
//用户路由拦截
  if (store.state.isLogin) {
    //已经登陆了
    if ((route.fullPath === '/login') || route.fullPath === '/register') {
      return redirect('/')
    }
  } else {
    //如果没有登录，则查看token是否存在，如果有，使用token进行登录
    const $cookie = require('js-cookie');
    const token = $cookie.get('Authorization');
    if (token) {
      const {data} = await $axios.get("/v1/user/selfInfo")
      if (data.code === 200) {
        //登陆成功
        store.commit(`login`, data.data)
      } else {
        //登陆失败，清除token
        $cookie.remove("Authorization")
        //todo 加一个登录过期或失败的提示页面
      }
    }

  }
}
