import axios from 'axios'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import { handleRefreshToken } from '@/utils/refreshToken'
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 100000000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  const accessToken = getToken()
  if (accessToken && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + accessToken // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && value !== undefined) {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            if (value[key] !== null && value[key] !== undefined) {
              url += part + encodeURIComponent(value[key]) + "&";
            }
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }

  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
    const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
      return config;
    }
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  // 二进制数据则直接返回
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }

  const originalRequest = res.config;
  const msg = res.data?.msg || '网络异常请联系管理员'
  if (code === 401 && !originalRequest._retry) {
    // 标记原始请求已被重试，避免重复刷新
    originalRequest._retry = true;

    return handleRefreshToken(res, service);
  } else if (code === 403) {
    handleConfirmLogout();

    return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
  } else if (code === 500) {
    Message({ message: msg, type: 'error' })
    return Promise.reject(new Error(msg))
  } else if (code === 601) {
    Message({ message: msg, type: 'warning' })
    return Promise.reject('error')
  } else if (code !== 200) {
    Notification.error({ title: msg })
    return Promise.reject('error')
  } else {
    return res.data
  }
},
  error => {
    // console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

export const handleConfirmLogout = () => {
  // if (!isRelogin.show) {
    store.dispatch('LogOut').then(() => {
      location.href = '/login';
    })
    
    // isRelogin.show = true;
    // MessageBox.confirm('登录状态已过期，重新登录', '系统提示', { confirmButtonText: '重新登录', type: 'warning' }).then(() => {
    //   isRelogin.show = false;
    //   store.dispatch('LogOut').then(() => {
    //     location.href = '/login';
    //   })
    // }).finally(() => {
    //   isRelogin.show = false;
    //   store.dispatch('LogOut').then(() => {
    //     location.href = '/login';
    //   })
    // })
  // }
}
export default service
