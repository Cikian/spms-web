<template>
  <el-container>
    <el-aside width=" ">
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
            <el-avatar style="width: 44px; height: 44px; float: left; margin-right: 12px" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
            <div class="user-desc">
              <div class="user-name" style="margin-bottom: 4px; font-size: 14px">{{ name }}, 上午好</div>
              <div class="user-role" style="font-size: 12px">今天是{{currentDate}}, 星期{{week}}</div>
            </div>
          </div>
        </div>
        <el-divider />
        <el-menu-item style="margin: 12px 0;" index="/workTable/overView">
          <el-icon>
            <location/>
          </el-icon>
          <template #title>概览</template>
        </el-menu-item>
        <el-divider />
        <div class="group-title">待办</div>
        <el-menu-item style="margin:0 0 12px 0;" index="/workTable/reqNeedCom">
          <el-icon>
            <icon-menu/>
          </el-icon>
          <template #title>待完成需求</template>
        </el-menu-item>
        <el-menu-item style="margin:0 0 12px 0;" index="/workTable/proNeedCom">
          <el-icon>
            <document/>
          </el-icon>
          <template #title>待完成项目</template>
        </el-menu-item>
        <el-divider />
        <div class="group-title">我的</div>
        <el-menu-item style="margin:0 0 12px 0;" index="/workTable/myReq">
          <el-icon>
            <setting/>
          </el-icon>
          <template #title>我负责的需求</template>
        </el-menu-item>
        <el-menu-item style="margin:0 0 12px 0;" index="/workTable/partIn">
          <el-icon>
            <setting/>
          </el-icon>
          <template #title>我参与的项目</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="padding: 0">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {Document, Location, Setting} from "@element-plus/icons-vue";
import router from "../../router";
import { ref } from "vue";

router.push('/workTable/overView')

const name = ref("Cikian")
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
.el-divider{
  margin: auto;
}
.el-menu-item{
  height: 36px;
}
.el-menu-item:hover{
  background-color: #f5f5f5;
  border-radius: 5px;
}
.is-active{
  background-color: #ebf0fb;
  border-radius: 5px;
}
.group-title{
  height: 48px;
  font-size: 11px;
  line-height: 48px;
  color: #999;
}
</style>