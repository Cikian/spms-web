<template>
  <div class="common-layout">
    <el-container>

      <el-aside width=" ">
        <el-menu
            :default-active="homeMenu?homeMenu:'/workTable'"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
            background-color="#1c2b45"
            text-color="#d2d2d2"
            style="border: none"
            :router="true"
            @select="changeMenuItem"
        >
          <div style="width: 100%; height: 72px; display: flex; align-items: center; justify-content: center">
            <el-image src="https://img-upyun.cikian.cn/develop/simida/static/logo.png"></el-image>
          </div>
          <el-menu-item index="/workTable">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-layer-group"/>
            <template #title>工作台</template>
          </el-menu-item>
          <el-menu-item index="/proman/home">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-diagram-project"/>
            <template #title>项目管理</template>
          </el-menu-item>
          <el-menu-item index="/test">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-file-lines"/>
            <template #title>测试管理</template>
          </el-menu-item>
          <el-menu-item index="/user" v-if="isAdmin">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-user"/>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/role" v-if="isAdmin">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-user-group"/>
            <template #title>角色管理</template>
          </el-menu-item>
          <el-menu-item index="/device" v-if="isAdmin">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-display"/>
            <template #title>设备管理</template>
          </el-menu-item>
          <el-menu-item index="/resourceCost" v-if="isAdmin">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-coins"/>
            <template #title>资源成本管理</template>
          </el-menu-item>
          <el-menu-item index="/dictionary" v-if="isAdmin">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-book"/>
            <template #title>字典管理</template>
          </el-menu-item>
          <el-menu-item index="/setting">
            <font-awesome-icon style="width: 18px" class="home-icon" icon="fa-solid fa-gear"/>
            <template #title>设置</template>
          </el-menu-item>
          <el-menu-item class="change-btn" @click="changeMenu">
            <font-awesome-icon style="width: 18px" class="home-icon show-btn" v-if="isCollapse" icon="fa-solid fa-angles-right"/>
            <font-awesome-icon style="width: 18px" class="home-icon show-btn" v-else icon="fa-solid fa-angles-left"/>
            <template #title>{{ btnText }}</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="margin: 0; padding: 0;">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import router from "../router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

router.push("/workTable")
const isCollapse = ref(true)
const isAdmin = ref(false)
const btnText = ref('展开菜单')

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const changeMenu = () => {
  isCollapse.value = !isCollapse.value
  if (isCollapse.value) {
    btnText.value = '展开菜单'
  } else {
    btnText.value = '收起菜单'
  }

  let showIcon = document.getElementsByClassName('show-btn')
  for (let i = 0; i < showIcon.length; i++) {
    if (isCollapse.value) {
      showIcon[i].classList.add('rotate-right')
      showIcon[i].classList.remove('rotate-left')
    } else {
      showIcon[i].classList.add('rotate-left')
      showIcon[i].classList.remove('rotate-right')
    }
  }
}

const getUserHasRole = () => {
  let hasRole = localStorage.getItem("hasRole")
  if (hasRole && hasRole.indexOf("ROLE_system_admin") != -1) {
    isAdmin.value = true
  }
}
const homeMenu = ref('')
onMounted(() => {
  homeMenu.value = localStorage.getItem('homeMenu')
  getUserHasRole()
})

const changeMenuItem = (key: string, keyPath: string) => {
  localStorage.setItem("homeMenu", key)
  console.log(key, keyPath)
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

.is-active {
  background-color: #21324e;
}

.change-btn {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.home-icon {
  font-size: 18px;
  margin-right: 20px;
  transition: transform 0.3s ease-in-out;
}

.rotate-right {
  transform: rotate(0deg);
}

.rotate-left {
  transform: rotate(180deg);
}

</style>