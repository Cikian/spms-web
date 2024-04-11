import {createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('../views/home.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../views/home.vue'),
            children: [
                {
                    path: '/workTable',
                    name: 'workTable',
                    component: () => import('../views/work_table/workTable.vue'),
                    children: [
                        {
                            path: '/workTable/wtHome',
                            name: 'wtHome',
                            component: () => import('../views/work_table/wt-home.vue'),
                            children: [
                                {
                                    path: '/workTable/overView',
                                    name: 'overView',
                                    component: () => import('../views/work_table/overView.vue')
                                },
                                {
                                    path: '/workTable/reqNeedCom',
                                    name: 'reqNeedCom',
                                    component: () => import('../views/work_table/reqNeedComplete.vue')
                                },
                                {
                                    path: '/workTable/proNeedCom',
                                    name: 'proNeedCom',
                                    component: () => import('../views/work_table/proNeedComplete.vue')
                                },
                                {
                                    path: '/workTable/myReq',
                                    name: 'myReq',
                                    component: () => import('../views/work_table/myReq.vue')
                                },
                                {
                                    path: '/workTable/partIn',
                                    name: 'partIn',
                                    component: () => import('../views/work_table/partInPro.vue')
                                }
                            ]
                        },
                        {
                            path: '/workTable/wtPanel',
                            name: 'wtPanel',
                            component: () => import('../views/work_table/wt-panel.vue')
                        },
                        {
                            path: '/workTable/wtUndefine',
                            name: 'wtUndefine',
                            component: () => import('../views/work_table/wt-undefine.vue')
                        },
                    ]
                },
                {
                    path: '/proman/home',
                    name: 'promanHome',
                    component: () => import('../views/project_management/pro-home.vue')
                }
            ]
        },

    ]
})


export default router;