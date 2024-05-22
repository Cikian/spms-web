<template>
  <div class="login-root">
    <div class="login-body">
      <div class="login-body-info">
        <div class="info-logo">
          <img src="https://img-upyun.cikian.cn/develop/simida/static/spms-logo-round.png" alt=""/>
        </div>
        <div class="info-image">
          <img src="https://cdn-aliyun.pingcode.com/static/pc-charm/assets/images/pingcode-intro-01.png?v=5.85.0"
               alt=""/>
        </div>
      </div>
      <div class="login-body-content">
        <div class="login-body-content-main">
          <div class="login-body-content-form-container">
            <div class="form-container-header">
              <div class="form-container-header-title">
                <span>重置密码</span>
              </div>
              <div class="from-container-header-description">
                <span>为了您的账号安全，第一次登录需要重置密码</span>
              </div>
            </div>
            <div class="form-container-body">
              <div class="form-password form-group">
                <label class="form-label">原密码</label>
                <div class="form-control">
                  <el-input
                      class="form-control-input"
                      v-model="oldPasswordInput"
                      placeholder="请输入原密码"
                      type="password"
                      show-password
                  />
                </div>
              </div>
              <div class="form-password form-group">
                <label class="form-label">新密码</label>
                <div class="form-control">
                  <el-input
                      class="form-control-input"
                      v-model="newPasswordInput"
                      placeholder="请输入新密码"
                      type="password"
                      show-password
                  />
                </div>
              </div>
              <div class="form-password form-group">
                <label class="form-label">确认新密码</label>
                <div class="form-control">
                  <el-input
                      class="form-control-input"
                      v-model="confirmPasswordInput"
                      placeholder="请再次输入新密码"
                      type="password"
                      show-password
                  />
                </div>
              </div>
              <div class="form-submit">
                <el-button color="#6698ff" :disabled="isDisabled" class="form-submit-button" @click="resetPassword()">提交
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="login-body-footer">
          <span class="login-body-footer-tip">为了您的账号安全，请勿将账号告知他人</span>
        </div>
      </div>
    </div>
    <div class="login-footer">
      @ SPMS
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {sendEmailCode, updatePassword, verifyEmail} from "../api/userApi.ts";
import router from "../router";

const emailInput = ref('')
const emailCode = ref('')
const oldPasswordInput = ref('')
const newPasswordInput = ref('')
const confirmPasswordInput = ref('')
const isDisabled = ref(false)
const getCodeBtn = ref(true)
const getCodeBtnText = ref('获取验证码')


watch(emailInput, (val) => {
  getCodeBtn.value = !val;
})


const resetPassword = () => {
  isDisabled.value = true

  if (oldPasswordInput.value === '') {
    ElNotification({
      title: '警告',
      message: '请输入原密码',
      type: 'warning',
    })
    isDisabled.value = false
    return
  }

  if (newPasswordInput.value === '') {
    ElNotification({
      title: '警告',
      message: '请输入新密码',
      type: 'warning',
    })
    isDisabled.value = false
    return
  }

  if (confirmPasswordInput.value === '') {
    ElNotification({
      title: '警告',
      message: '请再次输入新密码',
      type: 'warning',
    })
    isDisabled.value = false
    return
  }

  if (newPasswordInput.value !== confirmPasswordInput.value) {
    ElNotification({
      title: '警告',
      message: '两次输入的密码不一致',
      type: 'warning',
    })
    isDisabled.value = false
    return
  }

  let passwordFormData = {
    oldPassword: oldPasswordInput.value,
    newPassword: newPasswordInput.value,
    confirmPassword: confirmPasswordInput.value
  }

  updatePassword(passwordFormData).then(res => {
    if (res.data.code === 200) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
      localStorage.removeItem('token')
      localStorage.removeItem('isFirstLogin')
      router.push('/login')
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
    isDisabled.value = false
  })

}
</script>

<style scoped>

.login-root {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  min-height: 100vh;
  background-color: #fafafa !important;
}

.login-body {
  min-height: 600px;
  padding: 40px 0;
  width: 1000px;
  display: flex;
  margin: 0 auto;
  flex-direction: row;
  background: #fff;
  box-shadow: 0 2px 30px #5f6f7c17;
}

.login-footer {
  margin-top: 16px;
  width: 1000px;
  color: #aaa;
  text-align: center;
  line-height: 25px;
  font-size: 14px;
  padding: 0 40px;
}

.login-body-info {
  display: flex;
  width: 500px;
  padding: 0 42px;
  flex: 1;
  flex-direction: column;
  border-right: 1px solid #eee;
}

.info-logo {
  height: 40px;
}

.info-image {
  display: flex;
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
}

.login-body-content {
  width: 500px;
  padding: 0 42px;
}

.login-body-content-main {
  display: flex;
  flex-direction: column;
}

.login-body-content-form-container {
  display: flex;
  flex-direction: column;
}

.form-container-header {
  position: relative;
  box-sizing: border-box;
}

.form-container-header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-container-header-title > span {
  font-size: 28px;
  color: #333;
  line-height: 38px;
  margin-bottom: 8px;
}

.from-container-header-description {
  font-size: 14px;
  color: #999;
}

.form-container-body {
  padding-top: 28px;
}

.form-group {
  margin-top: 20px;
  margin-bottom: 24px;
}

.form-label {
  font-size: 16px;
  line-height: 22px;
  color: #666;
}

label {
  display: inline-block;
  margin-bottom: .5rem;
}

.form-control-input {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.from-control-input-code {
  width: 70%;
}

.form-submit {
  width: 100%;
}

.form-submit-button {
  width: 100%;
  height: 48px;
  background-color: #6698ff;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s;
}

.form-submit-button:hover {
  box-shadow: 0 0 10px 0 rgba(102, 152, 255, 0.5);
}

.login-body-footer {
  margin-top: 50px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.login-body-footer-tip {
  color: #999;
  font-size: 14px;
}

.getCodeBtn {
  width: 29%;
  height: 48px;
  background-color: #6698ff;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s;
  float: right;
}
</style>