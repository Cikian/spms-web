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
          <el-menu-item class="h-menu-item" index="/user/management/userQuery">查询用户</el-menu-item>

          <AvatarMenu/>
        </el-menu>
      </el-header>
      <el-main style="margin: 0; padding: 0">
        <el-scrollbar max-height="calc(100vh - 52px)">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import router from "../../router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted} from "vue";
import AvatarMenu from "../../compoment/AvatarMenu.vue";

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

onMounted(() => {
  router.push("/user/management/userList")
})

</script>

<style scoped>
.h-menu-item {
  padding: 0 16px;
  margin-right: 20px;
}

.header-avatar-container {
  position: absolute;
  right: 20px;
  top: 0;
  height: 52px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.profile-bg {
  width: 100%;
  height: 155px;
  border-radius: 10px 10px 0 0;
}

.profile-bg img {
  border-radius: 10px 10px 0 0;
}

.avatar-border {
  border: 5px solid;
  position: absolute;
  top: 85px;
  left: calc(50% - 35px);
}

.username {
  font-size: 20px;
  font-weight: 100;
  color: #000000;
  text-align: center;
  margin: 10px 0;
}

.my-divider {
  width: 80%;
  margin: 5px auto;
}

.user-menu-item {
  height: 40px;
}

.user-logout {
  margin-bottom: 10px;
  color: red;
}

.el-menu-item:hover {
  background-color: #f5f5f5 !important;
}

.user-menu-icon {
  margin-left: 20px;
  margin-right: 10px;
}

</style>