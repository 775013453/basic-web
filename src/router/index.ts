/**
 * description：路由配置
 * organization：self
 * author: almostSir
 * date：2024-07-17 18:05:40
 */

import Home from '@/example/Home.vue';
import * as VueRouter from 'vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: 'table',
        component: () => import('@/example/Table.vue')
      },
      {
        path: 'noFound',
        component: () => import('@/example/NotFound.vue')
      },
      {
        path: 'formTree',
        component: () => import('@/example/FormTree.vue')
      },
      {
        path: 'dagMap',
        component: () => import('@/example/DagMap.vue')
      },
      {
        path: 'transferInput',
        component: () => import('@/example/TransferInput.vue')
      },
      {
        path: 'ganttChartExam',
        component: () => import('@/example/GanttChartExam.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/example/NotFound.vue') // 配置404页面
  }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

export default router;
