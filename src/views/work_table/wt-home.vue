<template>
  <el-container>
    <el-aside width=" ">
      <el-menu
          default-active="/workTable/overView"
          class="el-menu-vertical-demo"
          background-color="#fbfbfb"
          active-text-color="red"
          :router="true"
      >
        <div class="home-user"></div>
        <el-menu-item index="/workTable/overView">
          <el-icon>
            <location/>
          </el-icon>
          <template #title>概览</template>
        </el-menu-item>
        <el-menu-item index="/workTable/reqNeedCom">
          <el-icon>
            <icon-menu/>
          </el-icon>
          <template #title>待完成需求</template>
        </el-menu-item>
        <el-menu-item index="/workTable/proNeedCom">
          <el-icon>
            <document/>
          </el-icon>
          <template #title>待完成项目</template>
        </el-menu-item>
        <el-menu-item index="/workTable/myReq">
          <el-icon>
            <setting/>
          </el-icon>
          <template #title>我负责的需求</template>
        </el-menu-item>
        <el-menu-item index="/workTable/partIn">
          <el-icon>
            <setting/>
          </el-icon>
          <template #title>我参与的项目</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">

import {Document, Location, Setting} from "@element-plus/icons-vue";
</script>

<style scoped>

</style>