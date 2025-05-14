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
  // NProgress.start()

  if (whiteList.includes(to.path)) {
    hasRoutes = false;
    next()
  } else {
    if (!localStorage.getItem('accessToken')) {
      return next('/login');
      // hasRoutes = true;
      // await store.dispatch('SetCommonRouter')
      // if (!localStorage.getItem('isLogin')) {
      //   next({ ...to, replace: true }); // ✅ 重新导航，确保路由生效
      //   window.location.reload();
      //   localStorage.setItem('isLogin', true)
      // }
      // return
    }
    next()
    if (!hasRoutes) {
      try {
        const userInfo = await store.dispatch('GetInfo'); // 调接口拿权限信息
        hasRoutes = true;
        // ❗ 关键：重新导航一次，才能匹配上刚才 addRoutes 的路由
        console.log('111');
        if (!localStorage.getItem('isLogin')) {
          window.location.reload();
          localStorage.setItem('isLogin', true)

        }
        // next({ ...to, replace: true });

      } catch (e) {
        console.error('权限获取失败', e);
        return next('/login');
      }
    }


  }

})

// router.afterEach(() => {
//   NProgress.done()
// })
