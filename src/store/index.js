import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
  },
  getters,
  plugins: [
    createPersistedState({
      // key是存储数据的键名
      key: 'rabbitstore-client',
      // paths是存储state中的那些数据，如果是模块下具体的数据需要加上模块名称，例如user.name
      paths: ['user'],

    })
  ],
})

export default store
