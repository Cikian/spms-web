<template>
  <div class="common-layout">
    <el-container>
      <el-header style="margin: 0; padding: 0; height: 52px; z-index: 98">
        <el-menu
            default-active="/proDetail/proDemand/allDemands"
            class="el-menu-demo"
            mode="horizontal"
            style="height: 46px; padding: 0 20px; font-size: 14px; box-shadow: rgba(0, 0, 0, 0.1) 0 0 3px"
            :router="true"
            text-color="#606266"
        >
          <template #default>
            <el-menu-item class="h-menu-item" index="/proDetail/proDemand/allDemands">
              <template #default>
                <span class="little-menu-item">全部需求</span>
              </template>
            </el-menu-item>
            <el-menu-item class="h-menu-item" index="/proDetail/proDemand/allSpeciality">
              <template #default>
                <span class="little-menu-item">全部特性</span>
              </template>
            </el-menu-item>
            <el-menu-item class="h-menu-item" index="/proDetail/proDemand/allUserStory">
              <template #default>
                <span class="little-menu-item">全部用户故事</span>
              </template>
            </el-menu-item>
            <el-menu-item class="h-menu-item" index="/proDetail/proDemand/onGoingDemand">
              <template #default>
                <span class="little-menu-item">进行中的需求</span>
              </template>
            </el-menu-item>
            <el-menu-item class="h-menu-item" index="/proDetail/proDemand/myDemand">
              <template #default>
                <span class="little-menu-item">我负责的需求</span>
              </template>
            </el-menu-item>
            <el-menu-item class="h-menu-item" index="/proDetail/proDemand/mySubmitDemand">
              <template #default>
                <span class="little-menu-item">我提交的需求</span>
              </template>
            </el-menu-item>
          </template>

        </el-menu>
      </el-header>
      <el-main style="margin: 0; padding: 0">
        <el-scrollbar max-height="calc(100vh - 130px)">
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