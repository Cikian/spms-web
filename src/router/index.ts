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
                    redirect: '/workTable/overView',
                    component: () => import('../views/work_table/workTable.vue'),
                    children: [
                        {
                            path: '/workTable/wtHome',
                            name: 'wtHome',
                            redirect: '/workTable/overView',
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
                    redirect: '/proman/allpro',
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
                    redirect: '/user/management/userList',
                    component: () => import('../views/user_management/user-home.vue'),
                    children: [
                        {
                            path: '/user/management',
                            name: 'userManagement',
                            redirect: '/user/management/userList',
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
                    redirect: '/role/management/roleList',
                    component: () => import('../views/role_management/role-home.vue'),
                    children: [
                        {
                            path: '/role/management',
                            name: 'roleManagement',
                            redirect: '/role/management/roleList',
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
                {
                    path: '/setting',
                    name: 'setting',
                    redirect: '/setting/list/personal',
                    component: () => import('../views/setting/setting-home.vue'),
                    children: [
                        {
                            path: '/setting/list',
                            name: 'settingList',
                            redirect: '/setting/list/personal',
                            component: () => import('../views/setting/setting-list.vue'),
                            children: [
                                {
                                    path: '/setting/list/personal',
                                    name: 'personal',
                                    component: () => import('../views/setting/personal-document.vue')
                                },
                                {
                                    path: '/setting/list/account',
                                    name: 'account',
                                    component: () => import('../views/setting/account-setting.vue')
                                }
                            ]
                        }
                    ]
                },
                {
                    path: '/device',
                    name: 'device',
                    redirect: '/device/management/deviceList',
                    component: () => import('../views/device_management/device-home.vue'),
                    children: [
                        {
                            path: '/device/management',
                            name: 'deviceManagement',
                            redirect: '/device/management/deviceList',
                            component: () => import('../views/device_management/device-management.vue'),
                            children: [
                                {
                                    path: '/device/management/deviceList',
                                    name: 'deviceList',
                                    component: () => import('../views/device_management/device-list.vue')
                                },
                                {
                                    path: '/device/management/deviceQuery',
                                    name: 'deviceQuery',
                                    component: () => import('../views/device_management/device-query.vue')
                                }
                            ]
                        }
                    ]
                },
                {
                    path: '/resourceCost',
                    name: 'resourceCost',
                    redirect: '/resourceCost/management/resourceCostEmployee',
                    component: () => import('../views/resourceCost_management/resourceCost-home.vue'),
                    children: [
                        {
                            path: '/resourceCost/management',
                            name: 'resourceCostManagement',
                            redirect: '/resourceCost/management/resourceCostEmployee',
                            component: () => import('../views/resourceCost_management/resourceCost-management.vue'),
                            children: [
                                {
                                    path: '/resourceCost/management/resourceCostEmployee',
                                    name: 'resourceCostEmployee',
                                    component: () => import('../views/resourceCost_management/resourceCost-employee.vue')
                                },
                                {
                                    path: '/resourceCost/management/resourceCostDevice',
                                    name: 'resourceCostDevice',
                                    component: () => import('../views/resourceCost_management/resourceCost-device.vue')
                                }
                            ]
                        }
                    ]
                },
                {
                    path: '/proDetail',
                    name: 'proDetail',
                    redirect: '/proDetail/overView',
                    component: () => import('../views/pro_details/projectDetail-home.vue'),
                    children: [
                        {
                            path: '/proDetail/overView',
                            name: '项目概览',
                            component: () => import('../views/pro_details/proOverView.vue')
                        },
                        {
                            path: '/proDetail/proDemand',
                            name: '项目需求',
                            component: () => import('../views/pro_details/proDemand.vue')
                        },
                        {
                            path: '/proDetail/proDefect',
                            name: '项目缺陷',
                            component: () => import('../views/pro_details/proDefect.vue')
                        },
                        {
                            path: '/proDetail/proWorkItem',
                            name: '工作项',
                            component: () => import('../views/pro_details/proWorkItem.vue')
                        },
                        {
                            path: '/proDetail/proTest',
                            name: '项目测试',
                            component: () => import('../views/pro_details/proTest.vue')
                        },
                        {
                            path: '/proDetail/proResources',
                            name: '项目资源',
                            component: () => import('../views/pro_details/proResources.vue')
                        },
                    ]
                },
                {
                    path: '/dictionary',
                    name: 'dictionary',
                    redirect: '/dictionary/management/dictionaryList',
                    component: () => import('../views/dictionary_management/dictionary-home.vue'),
                    children: [
                        {
                            path: '/dictionary/management',
                            name: 'dictionaryManagement',
                            redirect: '/dictionary/management/dictionaryList',
                            component: () => import('../views/dictionary_management/dictionary-management.vue'),
                            children: [
                                {
                                    path: '/dictionary/management/dictionaryList',
                                    name: 'dictionaryList',
                                    component: () => import('../views/dictionary_management/dictionary-list.vue')
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