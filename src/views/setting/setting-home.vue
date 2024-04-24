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
            <font-awesome-icon class="home-icon" style="color: #ff7575;margin-right: 5px" icon="fa-solid fa-gear"/>
            设置
          </span>
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

onMounted(() => {
  router.push("/setting/list")
})
</script>

<style scoped>

</style>