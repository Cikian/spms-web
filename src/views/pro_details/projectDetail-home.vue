<template>
  <div class="common-layout">
    <el-container>
      <el-header style="margin: 0; padding: 0; height: 52px; box-shadow: 0 4px 8px #00000008; z-index: 99">
        <el-menu
            default-active="/proDetail/overView"
            class="el-menu-demo"
            mode="horizontal"
            style="height: 52px; padding: 0 20px"
            :router="true"
        >
          <span style="line-height: 52px;"><font-awesome-icon style="color: #ffb77d; margin-right: 5px"
                                                              icon="fa-solid fa-house"/>工作台<el-divider
              style="margin: 0 16px" direction="vertical"/></span>
          <el-menu-item class="h-menu-item" index="/proDetail/overView">概览</el-menu-item>
          <el-menu-item class="h-menu-item" index="/proDetail/proDemand">需求</el-menu-item>
          <el-menu-item class="h-menu-item" index="/proDetail/proDefect">缺陷</el-menu-item>
          <el-menu-item class="h-menu-item" index="/proDetail/proWorkItem">工作项</el-menu-item>
          <el-menu-item class="h-menu-item" index="/proDetail/proTest">测试</el-menu-item>
          <el-menu-item class="h-menu-item" index="/proDetail/proResources">资源</el-menu-item>

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
import {onMounted} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import AvatarMenu from "../../compoment/AvatarMenu.vue";
import router from "../../router";

onMounted(() => {
  // router.push("/proDetail/overView")
})


</script>

<style scoped>
.el-menu-vertical-demo {
  width: 260px;
  min-height: calc(100vh - 52px);
}
</style>