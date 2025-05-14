// import {login, logout, smsLogin} from '@/api/login'
import { getInfo, login, logout, smsLogin, getIpLocationApi } from '@/api/login'
import { getToken, removeToken, setToken, resetRouter } from '@/utils/auth'
import { myMemberInfo } from "@/api/user/member";
import router from '@/router';
import { commonRoutes, adminRoutes } from '@/router';
const user = {
  state: {
    token: getToken(),
    userInfo: undefined,
    isLogin: false,
    isAdmin: false,
    menuList: [],
  },

  mutations: {
    USER_INFO: (state, user) => {
      state.userInfo = user
      state.isLogin = true
    },
    SET_ROLES: (state, roles) => {
      state.isAdmin = roles.includes('admin')
    },

    SET_TOKEN: (state, token) => {
      state.token = token
    },

    CLEAR_INFO: (state, token) => {
      state.userInfo = undefined
      state.isLogin = false
      state.isAdmin = false
      state.token = ''
    },
    SET_MENU_LIST: (state, menuList) => {
      state.menuList = menuList
    }
  },

  actions: {
    // 获取会员信息
    MyMemberInfo({ commit }) {
      return new Promise((resolve, reject) => {
        myMemberInfo().then((res) => {
          commit('SET_MYMEMBER', res.data)
          resolve()
        });
      })
    },
    // 登录
    Login({ commit }, userInfo) {

      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          setToken(res.token, res.refreshToken)
          commit('SET_TOKEN', res.token)
          //设置是否显示助力信息
          if (res.isSupport) {
            commit('SET_ISSUPPORT', res.isSupport)
          }
          localStorage.setItem('isreload', false)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit }, flag) {
      return getInfo().then(res => {
        const user = res.user;
        commit('USER_INFO', user);
        commit('SET_ROLES', res.roles);

        const arr = res.roles.includes('admin') ? adminRoutes : commonRoutes;
        router.addRoutes([arr]);
        commit('SET_MENU_LIST', arr.children[0].children);

        return res;
      });
    },

    SetCommonRouter({ commit }) {
      const arr = commonRoutes;
      router.addRoutes([arr]);
      commit('SET_MENU_LIST', arr.children[0].children);
      return Promise.resolve();
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('CLEAR_INFO')
        removeToken()
        resetRouter()
        router.push({ path: '/login' })
        // logout(state.token).then(() => {
        //   commit('CLEAR_INFO')
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },


  }
}
export default user
