import { startHeartbeat, stopHeartbeat } from '@/utils/refreshToken'
import store from '@/store'
import router, { constantRoutes } from '@/router' // 你项目中基础路由（不需要权限的）
import Router from 'vue-router';


export function resetRouter() {
  const newRouter = new Router({
    mode: 'history',
    routes: constantRoutes,
  });

  router.matcher = newRouter.matcher; // 重置 matcher
}

export function getToken() {
  return window.localStorage.getItem('accessToken')
}
export function getRefreshToken() {
  return window.localStorage.getItem('refreshToken')
}

export function setToken(accessToken, refreshToken) {
  if (accessToken) {
    window.localStorage.setItem('accessToken', accessToken);
  }
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken);
  }
  startHeartbeat();
}


export const handleLoginGetInfo = () => {
  if (getToken()) {
    store.dispatch('GetInfo')
  }
}
export function removeToken() {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  // localStorage.getItem("rabbitstore-client");
  localStorage.removeItem('rabbitstore-client');
  stopHeartbeat();
}

