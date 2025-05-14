import Vue from "vue";
import Router from "vue-router";
/* Layout */
import Layout from "@/layout";

// 子页面路由组件

Vue.use(Router);

export const commonRoutes = {
  path: "",
  component: Layout,
  redirect: "/",
  children: [
    {
      path: "/",
      component: () => import("@/views/index/index"),
      name: "Index",
      children: [{
        path: "/",
        component: () => import("@/views/index/views/main"),
        name: "home-main",
        meta: { title: "首页", icon: "el-icon-menu", menu: true },
      },
      {
        path: "/dataCenter",
        component: () => import("@/views/dataCenter"),
        name: "data-center",
        meta: { title: "数据中心", icon: "el-icon-s-platform", menu: true, isLogin: true },
      },
      {
        path: "/processNotebook",
        component: () => import("@/views/index/views/main"),
        name: "process-notebook",
        meta: { title: "流程Notebook", icon: "el-icon-s-data", menu: true },
      },
      {
        path: "/visNotebook",
        component: () => import("@/views/index/views/main"),
        name: "vis-notebook",
        meta: { title: "可视化Notebook", icon: "el-icon-s-marketing", menu: true },
      },
      {
        path: "/toolNotebook",
        component: () => import("@/views/index/views/main"),
        name: "tool-notebook",
        meta: { title: "工具notebook", icon: "el-icon-s-open", menu: true },
      },],
    },
    {
      path: "/detailsNotebook/:id",
      component: () => import("@/views/index/views/details/index"),
      name: "details-notebook",
      meta: { title: "工详情notebook", menu: false },
    },
  ],
}

export const adminRoutes = {
  path: "",
  component: Layout,
  redirect: "/",
  children: [
    {
      path: "/",
      component: () => import("@/views/index/index"),
      name: "Index",
      children: [{
        path: "/",
        component: () => import("@/views/template"),
        name: "template-admin",
        meta: { title: "模版管理", icon: "el-icon-s-open", menu: true },
      },
      ]
    }
  ]
}

// 公共路由
export const constantRoutes = [

  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register/index"),
    hidden: true,
  },
  {
    path: "/retrievePassword",
    component: () => import("@/views/register/retrievePassword"),
    hidden: true,
  },
  {
    path: "/bind/phone",
    component: () => import("@/views/register/bindPhone"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    hidden: true,
  },
  {
    path: '/agreement',
    name: 'AgreementList',
    component: () => import("@/views/agreement/agreement.vue"),
  },
  {
    path: "/edit",
    component: () => import("@/views/edit/index"),
    name: "edit",
  },

];

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
let routerReplace = Router.prototype.replace;
// push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((err) => err);
};
// replace
Router.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch((err) => err);
};

export default new Router({
  mode: "history", // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});
