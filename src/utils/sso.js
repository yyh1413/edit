import request from "@/utils/request";
import { getToken, handleLoginGetInfo } from '@/utils/auth'
import { setToken } from '@/utils/auth'
import store from '@/store'

const getSystemUrl = (type) => {
  if (!type) return;
  const systemUlr = {
    main: process.env.VUE_APP_MAIN,
    wiki: process.env.VUE_APP_WIKI,
    toutiao: process.env.VUE_APP_TOUTIAO,
  }
  return systemUlr[type]
}
// 跳转到其他系统方法，url为跳转路径，type为系统类型，main为官网，wiki为wiki，toutiao为头条
//  示例：this.routerSSOPage('/blog', 'toutiao') =>https://toutiao.bio-ky.com/blog
export const routerSSOPage = async (url, type) => {

  if (!type || !getSystemUrl(type)) return;
  const link = url ? url.replace(/^\/+/, "") : '';
  const domain = getSystemUrl(type) + link;

  // const domain = 'http://localhost:8080/' + link;
  let urlObject = new URL(domain);
  if (getToken()) {
    const res = await request({
      url: "/cacheToken",
      method: "get",
    })
    if (res.code != 200) return;
    urlObject.searchParams.set('ssoid', res?.data?.key)
  }
  window.open(urlObject.toString());
}


export const handleSingleSignOn = () => {
  return new Promise((resolve) => {


    const query = window.location.search;
    const params = new URLSearchParams(query);
    const ssoid = params.get('ssoid');


    if (ssoid) {
      deleteSsoId();
      if (getToken()) {
        handleLoginGetInfo();
        resolve();
      } else {
        handleRefreshToken(ssoid, resolve);
      }
    } else {
      resolve();
    }

  })
}
const handleRefreshToken = async (ssoid, resolve) => {
  try {
    const ssoidRes = await request({
      url: "/getCacheToken?key=" + ssoid,
      method: "get",
    });
    if (ssoidRes.code != 200) {
      return;
    };
    const refreshToken = ssoidRes.data?.refreshToken.replace(/^Bearer\s*/, '')
    const tokenRes = await request({
      url: "/refreshToken",
      method: "post",
      data: { refreshToken },
    });

    if (tokenRes?.code === 200) {
      setToken(tokenRes.data, refreshToken);
      store.commit('SET_TOKEN', tokenRes.data)
      store.commit('SET_REFRESHTOKEN', refreshToken)
      handleLoginGetInfo();
    }
  } finally {

    resolve();
  }
}

const deleteSsoId = () => {
  setTimeout(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('ssoid');
    window.history.replaceState(null, '', url.toString());
  });
}