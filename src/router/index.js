import Vue from 'vue'
import Router from 'vue-router'
import constantRoutes from './constantRoutes'
import routesWithPerm from './routesWithPerm'
import { getPerm } from '@/api/perm'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

let router
export const createRouter = () => {
  // 缓存router及权限获取请求
  if (router) { return Promise.resolve(router) }
  if (createRouter.cachedPromise) { return createRouter.cachedPromise }
  createRouter.cachedPromise = new Promise((resolve) => {
    getPerm().then((permList) => {
      let routes = []
      const dynamicRoutes = filterRoutesByPerm(routesWithPerm, permList)
      routes = [...constantRoutes, ...dynamicRoutes]
      router = new Router({
        mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes
      })
      resolve(router)
    })
  })
  return createRouter.cachedPromise
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  createRouter().then((newRouter) => {
    router.matcher = newRouter.matcher // reset router
  })
}

// 根据权限过滤路由
function filterRoutesByPerm(routes = [], permList, flatten = true) {
  let flattenedPermList = []
  if (flatten) {
    permList.forEach((v) => {
      v.split('/').forEach((k) => {
        if (!flattenedPermList.includes(k)) {
          flattenedPermList.push(k)
        }
      })
    })
  } else {
    flattenedPermList = permList
  }
  const result = routes.filter((v) => {
    const perm = v?.meta?.perm || []
    const children = v.children || []
    if (children.length) {
      v.children = filterRoutesByPerm(children, flattenedPermList, false)
    }
    if (v.children && !v.children.length) {
      return false
    }
    return perm.length ? !!perm.filter((k) => flattenedPermList.includes(k)).length : true
  })
  return result
}
