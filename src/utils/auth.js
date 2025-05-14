import { startHeartbeat, stopHeartbeat } from '@/utils/refreshToken'
import store from '@/store'
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
  // if (getToken()) {
  //   store.dispatch('GetInfo')
  // }
}
export function removeToken() {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('refreshToken');
  // localStorage.getItem("rabbitstore-client");
  localStorage.removeItem('rabbitstore-client');
  stopHeartbeat();
}

