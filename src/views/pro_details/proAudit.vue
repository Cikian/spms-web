<template>
  <div class="common-layout">
    <el-container>
      <el-header style="margin: 0; padding: 0; height: 52px; z-index: 98">
        <el-menu
            default-active="/proDetail/proAudit/demand"
            class="el-menu-demo"
            mode="horizontal"
            style="height: 46px; padding: 0 20px; font-size: 14px; box-shadow: rgba(0, 0, 0, 0.1) 0 0 3px"
            :router="true"
            text-color="#606266"
        >
          <template #default>
            <el-menu-item class="h-menu-item" index="/proDetail/proAudit/demand">
              <template #default>
                <span class="little-menu-item">需求</span>
              </template>
            </el-menu-item>
            <el-menu-item class="h-menu-item" index="/proDetail/proAudit/test">
              <template #default>
                <span class="little-menu-item">测试计划</span>
              </template>
            </el-menu-item>
          </template>

        </el-menu>
      </el-header>
      <el-main style="margin: 0; padding: 0">
        <el-scrollbar max-height="calc(100vh - 98px)">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import router from "../../router";

const proId = ref('')

onMounted(() => {
  let currentProId = localStorage.getItem('proDetailId')
  if (currentProId) {
    proId.value = currentProId
  }
})
</script>

<style scoped>
.little-menu-item{
  font-size: 13px;
}
</style>