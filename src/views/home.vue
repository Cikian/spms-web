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
            active-text-color="red"
            text-color="#d2d2d2"
            style="border: none"
            :router="true"
        >
          <div style="width: 100%; height: 72px">1</div>
          <el-menu-item index="/workTable">
            <el-icon>
              <location/>
            </el-icon>
            <template #title>工作台</template>
          </el-menu-item>
          <el-menu-item index="/proman/home">
            <el-icon>
              <icon-menu/>
            </el-icon>
            <template #title>项目管理</template>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon>
              <document/>
            </el-icon>
            <template #title>测试管理</template>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon>
              <setting/>
            </el-icon>
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

.ddd {
  width: 500px;
  height: 500px;
  background-color: aqua;
}

.change-btn{
  float: right;
}
</style>
