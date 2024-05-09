<template>
  <div class="common-layout">
    <el-container>
      <el-header style="margin: 0; padding: 0; height: 52px">
        <el-menu
            default-active="/resourceCost/management/resourceCostEmployee"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            style="height: 52px; padding: 0 20px"
            :router="true"
        >
          <span style="line-height: 52px;">
            <font-awesome-icon style="color: #e6b141; margin-right: 5px" icon="fa-solid fa-coins" />
            资源成本管理
            <el-divider style="margin: 0 16px" direction="vertical"/>
          </span>
          <el-menu-item class="h-menu-item" index="/resourceCost/management/resourceCostEmployee">人力资源成本配置</el-menu-item>
          <el-menu-item class="h-menu-item" index="/resourceCost/management/resourceCostDevice">设备资源成本配置</el-menu-item>
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
import router from "../../router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted} from "vue";
import AvatarMenu from "../../compoment/AvatarMenu.vue";
import Notification from "../../compoment/Notification.vue";

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

onMounted(() => {
  router.push("/resourceCost/management/resourceCostEmployee")
})

</script>

<style scoped>
.h-menu-item {
  padding: 0 16px;
  margin-right: 20px;
}
</style>