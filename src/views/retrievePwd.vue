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
                <span>找回密码</span>
              </div>
              <div class="from-container-header-description">
                <span>通过邮箱找回密码</span>
              </div>
            </div>
            <div class="form-container-body">
              <div class="form-username form-group">
                <label class="form-label">
                  <span>邮箱</span>
                </label>
                <div class="form-control">
                  <el-input
                      class="form-control-input"
                      v-model="emailInput"
                      placeholder="请输入邮箱"
                      clearable
                  />
                </div>
              </div>
              <div class="form-password form-group">
                <label class="form-label">验证码</label>
                <div class="code-container">
                  <el-input class="form-control-input"
                            v-model="codeInput"
                            placeholder="请输入验证码"
                            clearable/>
                  <el-button type="primary"
                             size="large"
                             style="margin-left: 10px;height: 48px;color: #fff"
                             @click="sendCode"
                             :disabled="sendCodeDisable"
                             :loading="sendCodeLoading"
                             color="#6698ff">获取验证码
                  </el-button>
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
                <el-button :loading="loadingLogin"
                           :disabled="isDisabled"
                           class="form-submit-button"
                           color="#6698ff"
                           @click="submit()">提交
                </el-button>
              </div>
              <div class="form-footer">
                <el-button text @click="router.push('/login')" class="forget-password">返回登录</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="login-body-footer">
          <span class="login-body-footer-tip">请输入账号绑定的邮箱，系统将验证码发送至邮箱</span>
        </div>
      </div>
    </div>
    <div class="login-footer">
      @ SPMS
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import router from "../router";
import {retrievePassword, sendEmailCode, updatePassword, verifyEmail} from "../api/userApi.ts";

const emailInput = ref('')
const codeInput = ref('')
const newPasswordInput = ref('')
const confirmPasswordInput = ref('')

const isDisabled = ref(false)
const loadingLogin = ref(false)

const sendCodeDisable = ref(false)
const sendCodeLoading = ref(false)

const sendCode = () => {
  if (!emailInput.value) {
    ElNotification({
      title: "提示",
      message: "请输入邮箱",
      type: "warning"
    })
    return
  }

  sendCodeDisable.value = true
  sendCodeLoading.value = true
  let userFormData = {
    email: emailInput.value
  }

  sendEmailCode(userFormData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: "成功",
            message: res.data.message,
            type: "success"
          })
        } else {
          ElNotification({
            title: "提示",
            message: res.data.message,
            type: "warning"
          })
        }
      })
      .finally(() => {
        sendCodeDisable.value = false
        sendCodeLoading.value = false
      })
}

const submit = () => {
  if (!emailInput.value) {
    ElNotification({
      title: "提示",
      message: "请输入邮箱",
      type: "warning"
    })
    return
  }

  if (!codeInput.value) {
    ElNotification({
      title: "提示",
      message: "请输入验证码",
      type: "warning"
    })
    return
  }

  if (!newPasswordInput.value) {
    ElNotification({
      title: "提示",
      message: "请输入新密码",
      type: "warning"
    })
    return
  }

  if (!confirmPasswordInput.value) {
    ElNotification({
      title: "提示",
      message: "请输入确认密码",
      type: "warning"
    })
    return
  }

  const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?])[A-Za-z\d!@#$%^&*()_\-+=<>?]{12,}$/;
  if (!pattern.test(newPasswordInput.value)) {
    ElNotification({
      title: "提示",
      message: "密码必须包含大小写字母、数字、特殊字符，且长度不少于12位",
      type: "warning"
    })
    return
  }

  if (newPasswordInput.value !== confirmPasswordInput.value) {
    ElNotification({
      title: "提示",
      message: "两次密码输入不一致",
      type: "warning"
    })
    return
  }

  isDisabled.value = true
  loadingLogin.value = true
  let userFormData = {
    email: emailInput.value,
    code: codeInput.value,
  }

  verifyEmail(userFormData)
      .then(res => {
        if (res.data.code === 200) {
          let userFormData = {
            email: emailInput.value,
            newPassword: newPasswordInput.value,
            confirmPassword: confirmPasswordInput.value
          }
          retrievePassword(userFormData)
              .then(res => {
                if (res.data.code === 200) {
                  ElNotification({
                    title: "成功",
                    message: res.data.message,
                    type: "success"
                  })
                  router.push('/login')
                } else {
                  ElNotification({
                    title: "提示",
                    message: res.data.message,
                    type: "warning"
                  })
                }
              })
              .finally(() => {
                isDisabled.value = false
                loadingLogin.value = false
              })
        } else {
          ElNotification({
            title: "提示",
            message: res.data.message,
            type: "warning"
          })
          isDisabled.value = false
          loadingLogin.value = false
        }
      })

}
</script>

<style scoped>

.login-root {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fafafa !important;
  min-height: 100vh;
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

.form-footer {
  margin-top: 16px;
  text-align: right;
}

.forget-password {
  color: #6698ff;
  font-size: 14px;
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

.code-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>