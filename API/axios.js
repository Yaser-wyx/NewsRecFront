import qs from 'qs'
import axios from 'axios'

let _ = require('lodash')
let $store
axios.defaults.timeout = 10000 // ms
axios.defaults.baseURL = 'http://localhost:8080'
//请求拦截
axios.interceptors.request.use(config => {
  if (!!$store) {
    let token
    token = 'Bearer ' + $store.state.token//在请求头部加上token，用于用户认证
    config.headers.Authorization = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {

  const {response} = error

  return Promise.reject(error)
})

export default {//导出方法
  get (url, params = {}, headers = {}) {
    return axios.get(url, {params}, {headers: headers})
  },
  post (url, params, headers = {'Content-Type': 'application/x-www-form-urlencoded'}) {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      params = qs.stringify(params)
    }
    return axios.post(url, params, {headers: headers})
  },
  put (url, params, headers = {}) {
    return axios.put(url, qs.stringify(params), {headers: headers})
  },
  patch (url, params, headers = {}) {
    return axios.patch(url, qs.stringify(params), {headers: headers})
  },
  delete (url, params, headers = {}) {
    return axios.delete(url, {params}, {headers: headers})
  },
  setStore (store) {//注意：如果api要调用axios就必须要先设置store才行
    if (!_.isUndefined(store)) {
      if (_.isUndefined($store) || !_.isEqual($store, store)) {
        $store = store
      }
    }
  }
}

