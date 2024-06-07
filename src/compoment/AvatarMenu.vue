<template>
  <el-popover
      popper-style="padding: 0;border-radius: 10px ;"
      trigger="click"
      placement="bottom"
      width="322"
      :show-arrow="false">
    <template #reference>
      <div class="header-avatar-container">
        <el-avatar
            class="header-avatar"
            size="default"
            :src="userInfo.avatar"/>
      </div>
    </template>
    <div class="user-menu">
      <div class="profile-bg">
        <img src="https://cdn-aliyun.pingcode.com/static/portal/assets/images/user-menu-bg.svg?v=5.85.0" alt="">
      </div>
      <el-avatar class="avatar-border" :src="userInfo.avatar" :size="70"/>
      <div class="username">{{ userInfo.userName }}</div>
      <el-divider class="my-divider"/>

      <el-menu>
        <el-menu-item class="user-menu-item" @click="router.push('/setting/list/account')">
          <font-awesome-icon class="user-menu-icon" :icon="['far', 'user']"/>
          账号设置
        </el-menu-item>
      </el-menu>
      <el-divider class="my-divider"/>
      <el-menu>
        <el-menu-item class="user-menu-item" @click="aboutDialogVisible = true">
          <font-awesome-icon class="user-menu-icon" :icon="['far', 'bookmark']"/>
          关于
        </el-menu-item>
        <el-divider class="my-divider"/>
        <el-menu-item class="user-menu-item user-logout" @click="userLogout">
          <font-awesome-icon class="user-menu-icon" :icon="['fas', 'arrow-right-from-bracket']"/>
          退出登录
        </el-menu-item>
      </el-menu>
    </div>
  </el-popover>

  <el-dialog title="关于" v-model="aboutDialogVisible" width="30%">
    <div style="text-align: center">
      <img src="../../public/logo.png" alt="">
      <div style="margin-top: 20px">SPMS</div>
      <div style="margin-top: 20px">版本号：1.0.0</div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {logout} from "../api/homeApi.ts";
import router from "../router";
import {onMounted, ref} from "vue";

let userInfo = ref({
  userName: '',
  avatar: ''
})

let aboutDialogVisible = ref(false)

const getUserInfo = () => {
  let userDetail = localStorage.getItem("userInfo")
  userInfo.value.avatar = JSON.parse(userDetail).avatar
  userInfo.value.userName = JSON.parse(userDetail).userName
}

const userLogout = () => {
  logout()
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success',
          })
          localStorage.removeItem("userInfo")
          localStorage.removeItem("token")
          router.push('/login')
        } else {
          ElNotification({
            title: '警告',
            message: res.data.message,
            type: 'warning',
          })
        }
      })
}

onMounted(() => {
  getUserInfo()
})

</script>

<style scoped>
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