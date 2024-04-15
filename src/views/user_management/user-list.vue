<template>
  <div class="user-list-container">
    <div class="open-add-user-btn">
      <el-button type="primary" @click="openDialog">新增用户</el-button>
    </div>

    <div class="user-list-table">
      <el-table
          :data="userList"
          :row-key="row => row.no"
          style="width: 100%"
          stripe
          v-loading="loading"
      >
        <el-table-column
            prop="no"
            label="序号"
            width="100"
        >
        </el-table-column>
        <el-table-column label="头像" width="180">
          <template #default="{row}">
            <el-avatar :src="row.avatar" size="large"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="userName"
            label="用户名"
            width="200"
        >
        </el-table-column>
        <el-table-column
            prop="nickName"
            label="昵称"
            width="220"
        >
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="250"
        >
        </el-table-column>
        <el-table-column
            prop="phoneNumber"
            label="电话"
            width="180"
        >
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="130"
        >
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="200"
        >
        </el-table-column>
        <el-table-column
            label="操作"
        >
          <template #default="{row}">
            <el-button
                type="primary"
                text
                size="default"
                @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
                type="danger"
                text
                size="default"
                @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="total"/>
    </div>
  </div>

  <el-dialog
      title="新增用户"
      class="add-user-dialog"
      v-model="dialogVisible"
      width="30%"
      :show-close="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <div class="add-user-tip">
      <span class="add-user-tip-text">系统会将用户账号和密码发送到填写的邮箱，您可以编辑用户为其分配角色</span>
    </div>
    <label class="form-label">邮箱</label>
    <el-input
        class="form-control-input"
        v-model="email"
        clearable
        placeholder="请输入邮箱"
    />
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmit" :disabled="isDisabled">{{ submitText }}</el-button>
      <el-button size="large" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {addUser, queryUserList} from "../../api/userApi.ts";
import {ElNotification} from "element-plus";

const loading = ref(true)
const total = ref(0)
const page = ref(1)
const size = ref(10)
const userList = ref([])
const dialogVisible = ref(false)
const submitText = ref('提交')
const isDisabled = ref(false)

const email = ref('')

const openDialog = () => {
  dialogVisible.value = true
}

const handleSubmit = () => {
  isDisabled.value = true
  submitText.value = '提交中...'

  if (email.value === '') {
    ElNotification({
      title: '警告',
      message: '邮箱不能为空',
      type: 'warning'
    })
    isDisabled.value = false
    submitText.value = '提交'
    return
  }

  let userFormData = {
    email: email.value
  }
  addUser(userFormData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          isDisabled.value = false
          submitText.value = '提交'
          email.value = ''
          dialogVisible.value = false
          loadUserList()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
          isDisabled.value = false
          submitText.value = '提交'
        }
      })
}

const handleClose = () => {
  dialogVisible.value = false
  email.value = ''
}

const loadUserList = () => {
  loading.value = true
  let userDTO = {}
  let formData = {
    page: page.value,
    size: size.value
  }
  queryUserList(formData, userDTO).then(res => {
    if (res.data.code === 200) {
      let pageInfo = res.data.data;
      total.value = pageInfo.total

      for (let i = 0; i < pageInfo.records.length; i++) {
        pageInfo.records[i].no = (page.value - 1) * size.value + i + 1

        if (pageInfo.records[i].gender === 'N') {
          pageInfo.records[i].gender = '未知'
        } else if (pageInfo.records[i].gender === 'M') {
          pageInfo.records[i].gender = '男'
        } else {
          pageInfo.records[i].gender = '女'
        }

        if (pageInfo.records[i].status) {
          pageInfo.records[i].status = '启用'
        } else {
          pageInfo.records[i].status = '禁用'
        }

        if (pageInfo.records[i].createTime) {
          pageInfo.records[i].createTime = new Date(pageInfo.records[i].createTime).toLocaleString()
        }
      }

      userList.value = pageInfo.records
      loading.value = false
    }
  })
}

const handleEdit = (row) => {
  console.log(row)
}

const handleDelete = (row) => {
  console.log(row)
}

onMounted(() => {
  loadUserList()
})


</script>

<style scoped>
.user-list-container {
  padding: 10px 20px 0 20px;
}

.user-list-table {
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.open-add-user-btn {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.add-user-tip {
  margin-bottom: 20px;
}

.add-user-tip-text {
  font-size: 14px;
  color: #909399;
}

.form-label {
  font-size: 16px;
  color: #666;
  margin: 20px 0 10px 0;
  display: block;
}

.form-control-input {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.add-user-dialog {
  border-radius: 20px;
  padding: 30px 30px;
}

</style>