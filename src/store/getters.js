const getters = {

  token: state => state.user.token,

  userInfo: state => state.user.userInfo,
  isLogin: state => state.user.isLogin,
  isAdmin: state => state.user.isAdmin,
  menuList: state => state.user.menuList,

}
export default getters
