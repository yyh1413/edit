import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

let hasRoutes = false;

NProgress.configure({ showSpinner: false })
const whiteList = [
  "/redirect",
  "/login",
  "/register",
  "/retrievePassword",
  '/404',
  '/agreement',
]

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('accessToken');

  if (whiteList.includes(to.path)) {
    hasRoutes = false;
    return next();
  }

  if (!token) {
    // 未登录：设置公共路由
    if (!hasRoutes) {
      await store.dispatch('SetCommonRouter');
      hasRoutes = true;
      return next({ ...to, replace: true }); // 替换跳转，避免历史记录堆叠
    }
    return next();
  }

  // 已登录：添加权限路由
  if (!hasRoutes) {
    try {
      await store.dispatch('GetInfo');
      hasRoutes = true;
      return next({ ...to, replace: true }); // 添加完动态路由后重新匹配
    } catch (e) {
      console.error('权限获取失败', e);
      return next('/login');
    }
  }

  next();
});
// router.afterEach(() => {
//   NProgress.done()
// })
