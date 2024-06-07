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
          <el-form-item :label="'用户名：'+userDetails.userName">
            <el-input class="form-control-input" v-model="userDetails.userName" disabled/>
          </el-form-item>
          <el-form-item :label="'邮箱：'+userDetails.email">
            <div class="email-container">
              <el-input class="form-control-input" style="width: 86%;" v-model="email" placeholder="请输入新的邮箱" clearable/>
              <el-button type="primary" size="large" @click="resetEmail" :disabled="emailDisabled">
                {{ eamilText }}
              </el-button>
            </div>
          </el-form-item>
          <el-form-item :label="'手机号码：'+userDetails.phoneNumber">
            <el-input class="form-control-input" v-model="phone" placeholder="请输入新的手机号码" clearable/>
            <div class="code-container">
              <el-input class="form-control-input" style="width: 78%;" v-model="code" placeholder="请输入验证码" clearable/>
              <el-button type="primary" size="large" style="">获取验证码</el-button>
            </div>
            <el-button type="primary" size="large" style="margin-top: 10px" @click="resetPhoneNumber" :disabled="phoneNumberDisabled">
              {{ phoneNumberText }}
            </el-button>
          </el-form-item>
        </el-form>
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
  avatar: '',
  email: '',
  phoneNumber: ''
})
const updatePasswordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const submitText = ref('确定')
const isDisabled = ref(false)
const email = ref('')
const eamilText = ref('修改')
const emailDisabled = ref(false)

const phone = ref('')
const code = ref('')
const phoneNumberText = ref('修改')
const phoneNumberDisabled = ref(false)

const loadUserDetail = () => {
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
  if (updatePasswordForm.value.oldPassword === '') {
    ElNotification({
      title: '警告',
      message: '请输入原密码',
      type: 'warning',
    })
    return
  }

  if (updatePasswordForm.value.newPassword === '') {
    ElNotification({
      title: '警告',
      message: '请输入新密码',
      type: 'warning',
    })
    return
  }

  if (updatePasswordForm.value.confirmPassword === '') {
    ElNotification({
      title: '警告',
      message: '请再次输入新密码',
      type: 'warning',
    })
    return
  }

  const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{12,}$/;
  if (!pattern.test(updatePasswordForm.value.newPassword)) {
    ElNotification({
      title: "提示",
      message: "密码必须包含大小写字母、数字、特殊字符，且长度不少于12位",
      type: "warning"
    })
    return
  }

  if (updatePasswordForm.value.newPassword !== updatePasswordForm.value.confirmPassword) {
    ElNotification({
      title: '警告',
      message: '两次输入的密码不一致',
      type: 'warning',
    })
    return
  }

  submitText.value = '提交中...'
  isDisabled.value = true
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

const resetPhoneNumber = () => {
  phoneNumberText.value = '提交中...'
  phoneNumberDisabled.value = true

  if (phone.value === '') {
    ElNotification({
      title: '警告',
      message: '请输入新的手机号码',
      type: 'warning',
    })
    phoneNumberText.value = '修改'
    phoneNumberDisabled.value = false
    return
  }

  if (code.value === '') {
    ElNotification({
      title: '警告',
      message: '请输入验证码',
      type: 'warning',
    })
    phoneNumberText.value = '修改'
    phoneNumberDisabled.value = false
    return
  }

  let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (!reg.test(phone.value)) {
    ElNotification({
      title: '警告',
      message: '请输入正确的手机号码',
      type: 'warning',
    })
    phoneNumberText.value = '修改'
    phoneNumberDisabled.value = false
    return
  }

  console.log(phone.value)

  phoneNumberText.value = '修改'
  phoneNumberDisabled.value = false
}

const resetEmail = () => {
  eamilText.value = '提交中...'
  emailDisabled.value = true

  if (email.value === '') {
    ElNotification({
      title: '警告',
      message: '请输入新的邮箱',
      type: 'warning',
    })
    eamilText.value = '修改'
    emailDisabled.value = false
    return
  }

  let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (!reg.test(email.value)) {
    ElNotification({
      title: '警告',
      message: '请输入正确的邮箱',
      type: 'warning',
    })
    eamilText.value = '修改'
    emailDisabled.value = false
    return
  }

  console.log(email.value)

  eamilText.value = '修改'
  emailDisabled.value = false
}

onMounted(() => {
  loadUserDetail()
})
</script>

<style scoped>
.my-divider {
  width: 95%;
  margin: 0 auto;
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
  width: 100%;
  padding-left: 105px;
  margin-top: 20px;
}

.baseInfo-form {
  width: 550px;
}

.form-control-input {
  height: 40px;
  font-size: 14px;
  color: #999999;
}

.code-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px
}

.email-container{
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px
}
</style>