<template>
  <div class="personal-document-container">
    <div class="title">
      账号设置
    </div>
    <div class="baseInfo">
      <div class="avatar-title">
        <span>账号设置</span>
      </div>
      <div class="baseInfo-container">
        <el-form class="baseInfo-form" :model="userDetails" label-position="top">
          <el-form-item label="邮箱">
            <el-input class="form-control-input" v-model="userDetails.userName"/>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input class="form-control-input" v-model="userDetails.nickName"/>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="large" @click="" :disabled="isDisabled">{{ submitText }}
        </el-button>
      </div>
    </div>
    <el-divider class="my-divider"/>
    <div class="baseInfo">
      <div class="avatar-title">
        <span>修改密码</span>
      </div>
      <div class="baseInfo-container">
        <el-form class="baseInfo-form" :model="userDetails" label-position="top">
          <el-form-item label="原密码">
            <el-input
                class="form-control-input"
                v-model="updatePasswordForm.oldPassword"
                placeholder="请输入旧密码"
                show-password
            />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input
                class="form-control-input"
                v-model="updatePasswordForm.newPassword"
                placeholder="请输入新密码"
                show-password
            />
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input
                class="form-control-input"
                v-model="updatePasswordForm.confirmPassword"
                placeholder="再次输入新密码"
                show-password
            />
          </el-form-item>
        </el-form>
        <el-button type="primary" size="large" @click="resetPassword" :disabled="isDisabled">{{ submitText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {queryCurrentUser, updatePassword} from "../../api/userApi.ts";
import router from "../../router";

const userDetails = ref({
  userName: '',
  nickName: '',
  gender: '',
  avatar: ''
})
const updatePasswordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
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

const resetPassword = () => {
  submitText.value = '提交中...'
  isDisabled.value = true

  if (updatePasswordForm.value.oldPassword === '') {
    ElNotification({
      title: '警告',
      message: '请输入原密码',
      type: 'warning',
    })
    submitText.value = '确定'
    isDisabled.value = false
    return
  }

  if (updatePasswordForm.value.newPassword === '') {
    ElNotification({
      title: '警告',
      message: '请输入新密码',
      type: 'warning',
    })
    submitText.value = '确定'
    isDisabled.value = false
    return
  }

  if (updatePasswordForm.value.confirmPassword === '') {
    ElNotification({
      title: '警告',
      message: '请再次输入新密码',
      type: 'warning',
    })
    submitText.value = '确定'
    isDisabled.value = false
    return
  }

  if (updatePasswordForm.value.newPassword !== updatePasswordForm.value.confirmPassword) {
    ElNotification({
      title: '警告',
      message: '两次输入的密码不一致',
      type: 'warning',
    })
    submitText.value = '确定'
    isDisabled.value = false
    return
  }


  let formData = {
    oldPassword: updatePasswordForm.value.oldPassword,
    newPassword: updatePasswordForm.value.newPassword,
    confirmPassword: updatePasswordForm.value.confirmPassword
  }
  updatePassword(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          localStorage.removeItem('token')
          router.push('/login')
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
onMounted(() => {
  loadUserDerail()
})
</script>

<style scoped>
.my-divider {
  width: 95%;
  margin: 10px auto;
}

.title {
  height: 49px;
  font-size: 15px;
  line-height: 49px;
  padding-left: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.baseInfo {
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

.baseInfo-container {
  width: 550px;
  padding-left: 105px;
  margin-top: 20px;
}

.baseInfo-form {
  width: 100%;
}

.form-control-input {
  width: 100%;
  height: 40px;
  font-size: 14px;
  color: #999999;
}
</style>