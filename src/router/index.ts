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
            path: '/resetPassword',
            name: 'resetPassword',
            component: () => import('../views/resetPwd.vue')
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
                            component: () => import('../views/work_table/wt-undefine.vue'),
                        },
                    ]
                },
                {
                    path: '/proman/home',
                    name: 'promanHome',
                    component: () => import('../views/project_management/pro-home.vue'),
                    children: [
                        {
                            path: '/proman/allpro',
                            name: 'allPro',
                            component: () => import('../views/project_management/allProject.vue')
                        },
                        {
                            path: '/proman/tbcom',
                            name: 'tbcom',
                            component: () => import('../views/project_management/toBeComplete.vue')
                        }
                    ]
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('../views/user_management/user-home.vue'),
                    children: [
                        {
                            path: '/user/management',
                            name: 'userManagement',
                            component: () => import('../views/user_management/user-management.vue'),
                            children: [
                                {
                                    path: '/user/management/userList',
                                    name: 'userList',
                                    component: () => import('../views/user_management/user-list.vue')
                                },
                                {
                                    path: '/user/management/userQuery',
                                    name: 'userQuery',
                                    component: () => import('../views/user_management/user-query.vue')
                                }
                            ]
                        }
                    ]
                },
                {
                    path: '/role',
                    name: 'role',
                    component: () => import('../views/role_management/role-home.vue'),
                    children: [
                        {
                            path: '/role/management',
                            name: 'roleManagement',
                            component: () => import('../views/role_management/role-management.vue'),
                            children: [
                                {
                                    path: '/role/management/roleList',
                                    name: 'roleList',
                                    component: () => import('../views/role_management/role-list.vue')
                                },
                                {
                                    path: '/role/management/roleQuery',
                                    name: 'roleQuery',
                                    component: () => import('../views/role_management/role-info.vue')
                                }
                            ]
                        }
                    ]
                },

            ]
        },

    ]
})

router.beforeEach((to, from, next) => {
    let token = localStorage.getItem("token")
    let isFirstLogin = localStorage.getItem("isFirstLogin")

    if (!token && to.path !== '/login') {
        ElNotification({
            title: '提示',
            message: '登录失效，请重新登录',
            type: 'warning',
        })
        next('/login')
    } else {
        if (isFirstLogin === 'true' && to.path !== '/resetPassword') {
            ElNotification({
                title: '提示',
                message: '首次登录，请修改密码',
                type: 'warning',
            })
            next('/resetPassword')
        }
        next()
    }

})


export default router;