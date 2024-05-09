<template>
  <div class="common-layout">
    <el-container>
      <el-header style="margin: 0; padding: 0; height: 52px">
        <el-menu
            class="el-menu-demo"
            mode="horizontal"
            style="height: 52px; padding: 0 20px"
            :router="true"
        >
          <span style="line-height: 52px;">
            <font-awesome-icon class="home-icon" style="color: #75ff87;margin-right: 5px" icon="fa-solid fa-file-lines"/>
            测试管理
          </span>
          <Notification/>
          <AvatarMenu/>
        </el-menu>
      </el-header>
      <el-main style="margin: 0; padding: 0">
        <el-scrollbar max-height="calc(100vh - 55px)">
          <router-view/>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AvatarMenu from "../../compoment/AvatarMenu.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted} from "vue";
import router from "../../router";
import Notification from "../../compoment/Notification.vue";

onMounted(() => {
  router.push("/test/list")
})
</script>

<style scoped>

</style>