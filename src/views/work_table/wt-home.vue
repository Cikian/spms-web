<template>
  <el-container>
    <el-aside>
      <el-menu
          default-active="/workTable/overView"
          class="el-menu-vertical-demo"
          background-color="#fbfbfb"
          active-text-color="#6698ff"
          :router="true"
          style="padding: 0 12px 20px 12px"
      >
        <div class="home-user" style="padding: 24px 0 24px 12px">
          <div class="user-info">
            <el-avatar style="width: 44px; height: 44px; float: left; margin-right: 12px"
                       :src="userInfo.avatar"/>
            <div class="user-desc">
              <div class="user-name" style="margin-bottom: 4px; font-size: 14px">{{ userInfo.userName }}, 上午好</div>
              <div class="user-role" style="font-size: 12px">今天是{{ currentDate }}, 星期{{ week }}</div>
            </div>
          </div>
        </div>
        <el-divider/>
        <el-menu-item style="margin: 12px 0;" index="/workTable/overView">
          <font-awesome-icon class="list-icons" :icon="['far', 'eye']"/>
          <template #title>概览</template>
        </el-menu-item>
        <el-divider/>
        <div class="group-title">待办</div>
        <el-menu-item style="margin:0 0 12px 0;" index="/workTable/reqNeedCom">
          <font-awesome-icon class="list-icons" :icon="['fas', 'list-check']"/>
          <template #title>待完成需求</template>
        </el-menu-item>
        <el-menu-item style="margin:0 0 12px 0;" index="/workTable/proNeedCom">
          <font-awesome-icon class="list-icons" :icon="['fas', 'terminal']"/>
          <template #title>待完成项目</template>
        </el-menu-item>
        <el-divider/>
        <div class="group-title">我的</div>
        <el-menu-item style="margin:0 0 12px 0;" index="/workTable/myReq">
          <font-awesome-icon class="list-icons" :icon="['far', 'user']"/>
          <template #title>我负责的需求</template>
        </el-menu-item>
        <el-menu-item style="margin:0 0 12px 0;" index="/workTable/partIn">
          <font-awesome-icon class="list-icons" :icon="['far', 'user']"/>
          <template #title>我参与的项目</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="padding: 0">
      <el-scrollbar max-height="calc(100vh - 52px)">
        <router-view></router-view>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import router from "../../router";
import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
onMounted(() => {
  router.push("/workTable/overView")
})


let userInfo = ref(
    {
      userName: '',
      avatar: ''
    }
)
let currentDate: string = ref("")

const date = new Date();
let month = date.getMonth() + 1;
let day = date.getDate();
let week: number = date.getDay();
switch (week) {
  case 1:
    week = "一";
    break;
  case 2:
    week = "二";
    break;
  case 3:
    week = "三";
    break;
  case 4:
    week = "四";
    break;
  case 5:
    week = "五";
    break;
  case 6:
    week = "六";
    break;
  case 0:
    week = "日";
    break;
}
currentDate = month + '月' + day + '日';

const getUserInfo = () => {
  let userDetail = localStorage.getItem("userInfo")
  userInfo.value.avatar = JSON.parse(userDetail).avatar
  userInfo.value.userName = JSON.parse(userDetail).userName
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.el-menu-vertical-demo {
  width: 260px;
  min-height: calc(100vh - 52px);
}

.home-user {
  width: 100%;
  height: 144px;
}

.el-divider {
  margin: auto;
}

.el-menu-item {
  height: 36px;
}

.el-menu-item:hover {
  background-color: #f5f5f5;
  border-radius: 5px;
}

.is-active {
  background-color: #ebf0fb;
  border-radius: 5px;
}

.group-title {
  height: 48px;
  font-size: 11px;
  line-height: 48px;
  color: #999;
}

.list-icons {
  margin-right: 12px;
}
</style>