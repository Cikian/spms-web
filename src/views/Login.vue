<template>
  <div class="login-root">
    <div class="login-body">
      <div class="login-body-info">
        <div class="info-logo">
          <a href="home.vue">
            <img src="https://cdn-aliyun.pingcode.com/static/pc-charm/assets/images/pingcode-logo.svg?v=5.85.0" alt=""/>
          </a>
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
                <span>登录</span>
              </div>
              <div class="from-container-header-description">
                <span>欢迎登录</span>
              </div>
            </div>
            <div class="form-container-body">
              <div class="form-username form-group">
                <label class="form-label">
                  <span>用户名</span>
                </label>
                <div class="form-control">
                  <el-input
                      class="form-control-input"
                      v-model="usernameInput"
                      placeholder="请输入用户名"
                      clearable
                  />
                </div>
              </div>
              <div class="form-password form-group">
                <label class="form-label">密码</label>
                <div class="form-control">
                  <el-input
                      class="form-control-input"
                      v-model="passwordInput"
                      placeholder="请输入密码"
                      type="password"
                      show-password
                  />
                </div>
              </div>
              <div class="form-submit">
                <el-button color="#6698ff" class="form-submit-button" @click="userLogin()">登录</el-button>
              </div>
              <div class="form-footer">
                <a href="forget-password.vue" class="forget-password">忘记密码？</a>
              </div>
            </div>
          </div>
        </div>
        <div class="login-body-footer">
          <span class="login-body-footer-tip">如您没有账号，请联系管理员申请账号</span>
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
import {login} from "../api/homeApi.ts";
import {ElNotification} from "element-plus";


const usernameInput = ref('')
const passwordInput = ref('')

const userLogin = () => {
  let formData = {
    userName: usernameInput.value,
    password: passwordInput.value
  }
  login(formData)
      .then(res => {
        if (res.data.code === 400) {
          ElNotification({
            title: '警告',
            message: res.data.message,
            type: 'warning',
          })
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
  padding: 40px 0;
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
  margin-top: 80px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.login-body-footer-tip {
  color: #999;
  font-size: 14px;
}
</style>