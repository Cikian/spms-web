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
            name: '登录',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/resetPassword',
            name: '重置密码',
            component: () => import('../views/resetPwd.vue')
        },
        {
            path: '/retrievePwd',
            name: '找回密码',
            component: () => import('../views/retrievePwd.vue')
        },
        {
            path: '/home',
            name: '首页',
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
                        },
                        {
                            path: '/proman/mySubmit',
                            name: '我提交的项目',
                            component: () => import('../views/project_management/mySubmit.vue')
                        },
                        {
                            path: '/proman/audit',
                            name: '审核项目',
                            component: () => import('../views/project_management/audit.vue')
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
                                },
                                {
                                    path: '/setting/list/backup',
                                    name: 'backup',
                                    component: () => import('../views/setting/backup.vue')
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
                            redirect: '/proDetail/proDemand/allDemands',
                            component: () => import('../views/pro_details/proDemand.vue'),
                            children: [
                                {
                                    path: '/proDetail/proDemand/allDemands',
                                    name: '全部需求',
                                    component: () => import('../views/pro_details/proDemandViews/allDemands.vue')
                                },
                                {
                                    path: '/proDetail/proDemand/allSpeciality',
                                    name: '全部特性',
                                    component: () => import('../views/pro_details/proDemandViews/allSpeciality.vue')
                                },
                                {
                                    path: '/proDetail/proDemand/allUserStory',
                                    name: '全部用户故事',
                                    component: () => import('../views/pro_details/proDemandViews/allUserStory.vue')
                                },
                                {
                                    path: '/proDetail/proDemand/onGoingDemand',
                                    name: '进行中的需求',
                                    component: () => import('../views/pro_details/proDemandViews/onGoingDemand.vue')
                                },
                                {
                                    path: '/proDetail/proDemand/myDemand',
                                    name: '我负责的需求',
                                    component: () => import('../views/pro_details/proDemandViews/myDemand.vue')
                                },
                                {
                                    path: '/proDetail/proDemand/mySubmitDemand',
                                    name: '我提交的需求',
                                    component: () => import('../views/pro_details/proDemandViews/mySubmitDemand.vue')
                                },
                            ]
                        },
                        {
                            path: '/proDetail/proDefect',
                            name: '项目缺陷',
                            redirect: '/proDetail/proDefect/all',
                            component: () => import('../views/pro_details/proDefect.vue'),
                            children: [
                                {
                                    path: '/proDetail/proDefect/all',
                                    name: '全部缺陷',
                                    component: () => import('../views/pro_details/proDefectViews/allDefects.vue')
                                },
                                {
                                    path: '/proDetail/proDefect/unresolved',
                                    name: '未解决的缺陷',
                                    component: () => import('../views/pro_details/proDefectViews/unresolvedDefects.vue')
                                },
                                {
                                    path: '/proDetail/proDefect/onGoing',
                                    name: '处理中的缺陷',
                                    component: () => import('../views/pro_details/proDefectViews/onGoingDefects.vue')
                                },
                                {
                                    path: '/proDetail/proDefect/my',
                                    name: '我负责的缺陷',
                                    component: () => import('../views/pro_details/proDefectViews/myDefects.vue')
                                },
                                {
                                    path: '/proDetail/proDefect/mySubmit',
                                    name: '我提交的缺陷',
                                    component: () => import('../views/pro_details/proDefectViews/mySubmitDefects.vue')
                                },
                            ]
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
                            component: () => import('../views/pro_details/proResources.vue'),
                            redirect: '/proDetail/proResources/employee',
                            children: [
                                {
                                    path: '/proDetail/proResources/employee',
                                    name: '人力资源',
                                    component: () => import('../views/pro_details/proResourcesViews/employee.vue')
                                },
                                {
                                    path: '/proDetail/proResources/device',
                                    name: '物力资源',
                                    component: () => import('../views/pro_details/proResourcesViews/device.vue')
                                }
                            ]
                        },
                        {
                            path: '/proDetail/proAudit',
                            name: '项目审核',
                            redirect: '/proDetail/proAudit/demand',
                            component: () => import('../views/pro_details/proAudit.vue'),
                            children: [
                                {
                                    path: '/proDetail/proAudit/demand',
                                    name: '需求审核',
                                    component: () => import('../views/pro_details/proAuditViews/auditDemand.vue')
                                },
                                {
                                    path: '/proDetail/proAudit/test',
                                    name: '测试计划审核',
                                    component: () => import('../views/pro_details/proAuditViews/auditTest.vue')
                                }
                            ]
                        },
                        {
                            path: '/proDetail/proTarget',
                            name: '目标',
                            component: () => import('../views/pro_details/proTarget.vue')
                        },
                        {
                            path: '/proDetail/meeting',
                            name: '会议',
                            component: () => import('../views/pro_details/meeting.vue')
                        },
                        {
                            path: '/proDetail/gantt',
                            name: '图表',
                            component: () => import('../views/pro_details/gantt.vue')
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
                {
                    path: '/test',
                    name: 'test',
                    redirect: '/test/list/myTest',
                    component: () => import('../views/test_management/test-home.vue'),
                    children: [
                        {
                            path: '/test/list',
                            name: 'testList',
                            redirect: '/test/list/myTest',
                            component: () => import('../views/test_management/test-list.vue'),
                            children: [
                                {
                                    path: '/test/list/myTest',
                                    name: 'myTest',
                                    component: () => import('../views/test_management/my-test.vue')
                                },
                                {
                                    path: '/test/list/mySubmit',
                                    name: 'mySubmitTest',
                                    component: () => import('../views/test_management/mySubmitTestPlan.vue')
                                },
                                {
                                    path: '/test/list/qualityTarget',
                                    name: 'qualityTarget',
                                    component: () => import('../views/test_management/quality-target.vue')
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

    if (!token){
        // 如果没有token并且访问的不是登录页面或者重置密码页面，跳转到登录页面并给出提示，如果是直接放行
        if (to.path === '/login' || to.path === '/retrievePwd') {
            next()
        }else {
            ElNotification({
                title: '提示',
                message: '登录失效，请重新登录',
                type: 'warning',
            })
            next('/login')
        }
    }else {
        // 如果已经登录，但是是首次登录，跳转到修改密码页面，并给出提示，如果不是直接放行
        if (isFirstLogin === 'true' && to.path !== '/resetPassword') {
            ElNotification({
                title: '提示',
                message: '首次登录，请修改密码',
                type: 'warning',
            })
            next('/resetPassword')
        }else {
            next()
        }
    }
})


export default router;