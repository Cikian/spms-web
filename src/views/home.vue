<template>
  <div class="common-layout">
    <el-container>
      <el-aside width=" ">

        <el-menu
            default-active="/workTable"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
            background-color="#1c2b45"
            text-color="#d2d2d2"
            style="border: none"
            :router="true"
        >
          <div style="width: 100%; height: 72px">1</div>
          <el-menu-item index="/workTable">
            <font-awesome-icon class="home-icon" icon="fa-solid fa-layer-group" />
            <template #title>工作台</template>
          </el-menu-item>
          <el-menu-item index="/proman/home">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-diagram-project" />
            <template #title>项目管理</template>
          </el-menu-item>
          <el-menu-item index="3">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-file-lines" />
            <template #title>测试管理</template>
          </el-menu-item>
          <el-menu-item index="4">
            <font-awesome-icon class="home-icon" icon="fa-solid fa-gear" />
            <template #title>设置</template>
          </el-menu-item>
          <el-button class="change-btn" text @click="changeMenu">{{ btext }}</el-button>
        </el-menu>
      </el-aside>
      <el-main style="margin: 0; padding: 0;">
        <router-view />
      </el-main>
    </el-container>
  </div>


</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import router from "../router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import axios from "axios";
import {login} from "../api/homeApi.ts";

router.push("/workTable")
const isCollapse = ref(true)
const btext = ref("展开")
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const changeMenu = () => {
  isCollapse.value = !isCollapse.value
  if (btext.value == "展开") {
    btext.value = "收起"
  } else {
    btext.value = "展开"
  }

  login(1).then(res => {

  })
}

</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
}

.el-menu--collapse {
  min-height: 100vh;
}

.is-active{
  background-color: #21324e;
}

.change-btn{
  float: right;
}
.home-icon{
  font-size: 18px;
  margin-right: 20px;
}

</style>