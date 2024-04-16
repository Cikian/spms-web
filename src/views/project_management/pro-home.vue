<template>
  <el-container>
    <el-header  style="margin: 0; padding: 0; height: 52px; box-shadow: 0 4px 8px #00000008; z-index: 99">
      <span style="line-height: 52px; padding: 0 20px"><font-awesome-icon style="color: #ffb77d; margin-right: 5px" icon="fa-solid fa-house" />项目管理</span>
    </el-header>
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

          <div class="group-title">项目</div>
          <el-menu-item style="margin:0 0 12px 0;" index="/workTable/reqNeedCom">
            <font-awesome-icon class="list-icons" :icon="['fas', 'list-check']"/>
            <template #title>全部项目</template>
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
  </el-container>
</template>

<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
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