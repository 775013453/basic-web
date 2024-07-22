/**
 * description：路由配置
 * organization：self
 * author: almostSir
 * date：2024-07-17 18:05:40
 */

import Home from '@/views/Home.vue';
import Table from '@/views/Table.vue';
import * as VueRouter from 'vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/table',
    component: Table
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/NotFound.vue') // 配置404页面
  }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

export default router;
