import { setToken, getRefreshToken } from '@/utils/auth'
import { handleConfirmLogout } from './request'
import request from "@/utils/request";
import store from '@/store'

let isRefreshing = false;
let refreshSubscribers = []; // 存储等待队列

const onRrefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addSubscriber = (callback, url) => {
  refreshSubscribers.push(callback);
};

export const handleRefreshToken = async (res, service) => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return handleConfirmLogout();
  if (!isRefreshing) {
    isRefreshing = true;
    service({
      url: "/refreshToken",
      method: "post",
      data: { refreshToken },
    }).then(response => {
      isRefreshing = false; // 解锁
      if (response && response.code === 200) {
        setToken(response.data);
        store.commit('SET_TOKEN', response.data)
        onRrefreshed(response.data);
      } else {
        return Promise.reject();
      }
    });
  }

  return new Promise((resolve) => {
    addSubscriber((newToken,) => {
      res.config.headers['Authorization'] = `Bearer ${newToken}`;
      resolve(service(res.config));
    }, res.request.responseURL);
  });
}


const refreshToken = () => {
  const refreshToken = getRefreshToken();
  request({
    url: "/refreshToken",
    method: "post",
    data: { refreshToken },
  }).then(response => {
    if (response && response.code === 200) {
      setToken(response.data);
    }
  });
}

let heartbeatInterval = null; // 心跳定时器

// 启动心跳机制
export const startHeartbeat = () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(async () => {
    refreshToken();
  }, 20 * 60 * 1000);
  // }, 5000);
};

// 停止心跳机制
export const stopHeartbeat = () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
};
