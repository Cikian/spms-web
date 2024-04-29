<template>
  <div class="personal-document-container">
    <div class="title">
      个人资料
    </div>
    <div class="avatar-profileBg">
      <div class="avatar-title">
        <span>头像和封面</span>
      </div>
      <div class="avatar-container">
        <div class="avatar-container-image">
          <div class="profile-bg">
            <img style="border-radius: 10px 10px 0 0;"
                 src="https://cdn-aliyun.pingcode.com/static/portal/assets/images/user-menu-bg.svg?v=5.85.0" alt="">
          </div>

          <el-upload
              class="avatar-upload"
              :show-file-list="false"
              :http-request="handleAvatarUpload"
              :before-upload="beforeAvatarUpload">
            <el-popover
                placement="top"
                popper-class="customPopper"
                trigger="hover"
                hide-after="100"
                auto-close="100"
                content="上传头像"
            >
              <template #reference>
                <el-avatar
                    class="avatar-border"
                    :src="userDetails.avatar"
                    :size="80"
                />
              </template>
            </el-popover>
          </el-upload>
        </div>
        <div class="avatar-container-tip">
          <span>仅支持JPG、PNG格式图片，头像不超过1M，封面不超过5M</span>
        </div>
      </div>
    </div>

    <el-divider class="my-divider"/>

    <div class="baseInfo">
      <div class="avatar-title">
        <span>基本信息</span>
      </div>
      <div class="baseInfo-container">
        <el-form class="baseInfo-form" :model="userDetails" label-position="top">
          <el-form-item label="用户名">
            <el-input class="form-control-input" v-model="userDetails.userName" disabled/>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input class="form-control-input" v-model="userDetails.nickName"/>
          </el-form-item>
          <el-form-item label="性别">
            <el-select size="large" v-model="userDetails.gender">
              <el-option label="男" value="M"/>
              <el-option label="女" value="F"/>
              <el-option label="未知" value="N"/>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="large" @click="submitUserBaseInfo" :disabled="isDisabled">{{ submitText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {queryCurrentUser, updateUserAvatar, updateUserBaseInfo} from "../../api/userApi.ts";

const userDetails = ref({
  userName: '',
  nickName: '',
  gender: '',
  avatar: ''
})
const submitText = ref('确定')
const isDisabled = ref(false)

const loadUserDerail = () => {
  queryCurrentUser()
      .then(res => {
        if (res.data.code === 200) {
          userDetails.value = res.data.data
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

const submitUserBaseInfo = () => {
  submitText.value = '提交中...'
  isDisabled.value = true

  if (!userDetails.value.nickName) {
    ElNotification({
      title: '提示',
      message: '昵称不能为空',
      type: 'warning'
    })
    submitText.value = '确定'
    isDisabled.value = false
    return
  }

  let reg = /^[\u4E00-\u9FA5\w]{3,18}$/;
  if (!reg.test(userDetails.value.nickName)) {
    ElNotification({
      title: '警告',
      message: '请输入正确格式的昵称',
      type: 'warning',
    })
    submitText.value = '确定'
    isDisabled.value = false
    return
  }

  updateUserBaseInfo(userDetails.value)
      .then(res => {
        if (res.data.code === 200) {
          let userInfo = localStorage.getItem("userInfo");
          if (userInfo) {
            let user = JSON.parse(userInfo);
            user.nickName = userDetails.value.nickName;
            localStorage.setItem("userInfo", JSON.stringify(user));
          }
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
        submitText.value = '确定'
        isDisabled.value = false
      })
}

const beforeAvatarUpload = (file: any) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isJPG) {
    ElNotification({
      title: '警告',
      message: '上传头像图片只能是JPG或PNG格式！',
      type: 'error'
    })
  }
  if (!isLt1M) {
    ElNotification({
      title: '警告',
      message: '上传头像图片大小不能超过 1MB！',
      type: 'error'
    })
  }
  return isJPG && isLt1M
}

const handleAvatarUpload = (file) => {
  let formData = new FormData();
  formData.append("file", file.file);
  updateUserAvatar(formData)
      .then(res => {
        if (res.data.code === 200) {
          userDetails.value.avatar = res.data.data
          let userInfo = localStorage.getItem("userInfo");
          if (userInfo) {
            let user = JSON.parse(userInfo);
            user.avatar = res.data.data;
            localStorage.setItem("userInfo", JSON.stringify(user));
          }
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

onMounted(() => {
  loadUserDerail()
})

</script>

<style scoped>
.my-divider {
  width: 95%;
  margin: 30px auto;
}

.title {
  height: 49px;
  font-size: 15px;
  line-height: 49px;
  padding-left: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-profileBg {
  width: 100%;
  padding: 20px;
}

.avatar-title {
  height: 40px;
  font-size: 15px;
  line-height: 40px;
}

.avatar-title span {
  padding: 12px 20px;
}

.avatar-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  padding-left: 105px;
  margin-top: 30px;
}

.avatar-container-image {
  width: 320px;
  height: 197px;
  position: relative;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.avatar-container-tip {
  margin-left: 20px;
}

.avatar-container-tip span {
  line-height: 36px;
  color: #999;
  font-size: .75rem;
}

.avatar-border {
  position: absolute;
  border: 5px solid;
  top: 85px;
  left: calc(50% - 40px);
  transition: all 0.3s ease;
}

.avatar-border:hover:before {
  content: '';
  position: absolute;
  width: 27px;
  height: 27px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(255,255,255,1)'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M9.82843 5L7.82843 7H4V19H20V7H16.1716L14.1716 5H9.82843ZM9 3H15L17 5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7L9 3ZM12 18C8.96243 18 6.5 15.5376 6.5 12.5C6.5 9.46243 8.96243 7 12 7C15.0376 7 17.5 9.46243 17.5 12.5C17.5 15.5376 15.0376 18 12 18ZM12 16C13.933 16 15.5 14.433 15.5 12.5C15.5 10.567 13.933 9 12 9C10.067 9 8.5 10.567 8.5 12.5C8.5 14.433 10.067 16 12 16Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: cover;
  z-index: 2;
  opacity: 1;
}

.avatar-border:hover:after {
  content: '';
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(0, 0, 0, 0.2);
  z-index: 1;
  opacity: 1;
}

.avatar-border:before,
.avatar-border:after {
  content: '';
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.baseInfo {
  width: 100%;
  padding: 20px;
}

.baseInfo-container {
  width: 550px;
  padding-left: 105px;
  margin-top: 30px;
}

.baseInfo-form {
  width: 100%;
}

.form-control-input {
  width: 100%;
  height: 40px;
  font-size: 16px;
}
</style>