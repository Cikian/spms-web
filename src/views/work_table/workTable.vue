<template>
  <div class="common-layout">
    <el-container>
      <el-header style="margin: 0; padding: 0; height: 52px">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            style="height: 52px"
            :router="true"
        >
          <el-menu-item index="">首页</el-menu-item>
          <el-menu-item index="2-1">仪表盘</el-menu-item>
          <el-menu-item index="2-2">item two</el-menu-item>
        </el-menu>
      </el-header>
      <el-main style="margin: 0; padding: 0">
        <router-view />
      </el-main>
    </el-container>
  </div>

</template>

<script setup lang="ts">
import {Document, Location, Setting} from "@element-plus/icons-vue";
import {ref} from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
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
</style>