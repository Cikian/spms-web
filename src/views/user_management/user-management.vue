<template>
  <div class="common-layout">
    <el-container>
      <el-header style="margin: 0; padding: 0; height: 52px">
        <el-menu
            default-active="/user/management/userList"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            style="height: 52px; padding: 0 20px"
            :router="true"
        >
          <span style="line-height: 52px;">
            <font-awesome-icon style="color: #38c6ff;margin-right: 5px" icon="fa-solid fa-user"/>
            用户管理
            <el-divider style="margin: 0 16px" direction="vertical"/>
          </span>
          <el-menu-item class="h-menu-item" index="/user/management/userList">用户列表</el-menu-item>
          <el-menu-item class="h-menu-item" index="/user/management/userAdd">新增用户</el-menu-item>
        </el-menu>
      </el-header>
      <el-main style="margin: 0; padding: 0">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import router from "../../router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

router.push("/user/management/userList")

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.h-menu-item {
  padding: 0 16px;
  margin-right: 20px;
}
</style>