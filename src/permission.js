import router, { constantRoutes } from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })
const whiteList = [
  "/redirect",
  "/login",
  "/register",
  "/retrievePassword",
  '/404',
  '/agreement',
]
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()

  // if (whiteList.includes(to.path)) {
  //   next()
  // } else {
  //   if (localStorage.getItem('accessToken')) {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }

})

router.afterEach(() => {
  NProgress.done()
})
