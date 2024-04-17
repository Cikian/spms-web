<template>
  <div class="user-query-container">
    <div class="user-query-form-container">
      <el-form class="form-inline" size="default" :inline="true" :model="form">
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" placeholder="请输入昵称" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.userName" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" placeholder="请选择性别" clearable>
            <el-option label="男" value="M"/>
            <el-option label="女" value="F"/>
            <el-option label="未知" value="N"/>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="true"/>
            <el-option label="禁用" value="false"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryUserListByCondition">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-list-table">
      <el-table
          :data="userList"
          :row-key="row => row.no"
          style="width: 100%"
          stripe
          v-loading="loading"
          empty-text="暂无数据"
      >
        <el-table-column
            prop="no"
            label="序号"
            width="120"
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
            :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="250"
            :show-overflow-tooltip="true"
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
          <template #default="{row}">
            <el-button size="small" plain @click="handleStatus(row)" v-if="row.status === '启用'" type="success">
              {{ row.status }}
            </el-button>
            <el-button size="small" plain @click="handleStatus(row)" v-else type="danger">{{ row.status }}</el-button>
          </template>
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
      <el-pagination
          :current-page="tablePage.pageNum"
          @current-change="changePageNum"
          :total="tablePage.total"
          layout="total, prev, pager, next, jumper"
          background
          :pager-count="11"
      />
    </div>
  </div>

  <el-dialog
      title="用户详细信息"
      v-model="userDetailDialogVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <!--    表单-->
    <el-form :model="userDetails" label-position="top">
      <el-form-item label="用户名">
        <el-input v-model="userDetails.userName" disabled/>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="userDetails.nickName" disabled/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userDetails.email" disabled/>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="userDetails.phoneNumber" disabled/>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="userDetails.gender" disabled/>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="userDetails.createTime" disabled/>
      </el-form-item>
      <el-form-item label="角色（分配角色）">
        <el-checkbox-group v-model="userHasRoles">
          <el-checkbox v-for="role in allRoles" :key="role.roleId" :label="role.roleId">
            {{ role.remark }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmitUserInfo" :disabled="isDisabled">{{ submitText }}</el-button>
      <el-button size="large" @click="handleCloseEditUserDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {deleteUsers, queryById, queryUserList, updateStatus} from '../../api/userApi.ts'
import {assignRole, queryRoleList, queryUserHasRole} from "../../api/roleApi.ts";

const loading = ref(false)
const form = ref({
  nickName: null,
  userName: null,
  gender: null,
  email: null,
  status: null,
  phoneNumber: null
})
const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const userList = ref([])
const submitText = ref('提交')
const isDisabled = ref(false)
const userDetails = ref()
const userDetailDialogVisible = ref(false)
const allRoles = ref([])
const userOldRoles = ref([])
const userHasRoles = ref([])

const queryUserListByCondition = () => {
  loading.value = true
  const data = {
    page: tablePage.pageNum,
    size: tablePage.pageSize
  }

  const userDTO = {
    nickName: form.value.nickName == '' ? null : form.value.nickName,
    userName: form.value.userName == '' ? null : form.value.userName,
    gender: form.value.gender == '' ? null : form.value.gender,
    email: form.value.email == '' ? null : form.value.email,
    status: form.value.status == '' ? null : form.value.status,
    phoneNumber: form.value.phoneNumber == '' ? null : form.value.phoneNumber
  }

  queryUserList(data, userDTO)
      .then(res => {
        if (res.data.code === 200) {
          if (res.data.code === 200) {
            let pageInfo = res.data.data;
            tablePage.total = parseInt(pageInfo.total)

            for (let i = 0; i < pageInfo.records.length; i++) {
              pageInfo.records[i].no = (tablePage.pageNum - 1) * tablePage.pageSize + i + 1

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
            queryAllRole()
            loading.value = false
          }
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
          userList.value = []
          loading.value = false
        }
      })
}

const handleEdit = (row) => {
  let userId = row.userId

  queryById(userId)
      .then(res => {
        if (res.data.code === 200) {
          userDetails.value = res.data.data
          if (userDetails.value.gender === 'N') {
            userDetails.value.gender = '未知'
          } else if (userDetails.value.gender === 'M') {
            userDetails.value.gender = '男'
          } else {
            userDetails.value.gender = '女'
          }
          if (userDetails.value.createTime) {
            userDetails.value.createTime = new Date(userDetails.value.createTime).toLocaleString()
          }

          queryUserHasRole(userId)
              .then(res => {
                if (res.data.code === 200) {
                  for (let i = 0; i < res.data.data.length; i++) {
                    userOldRoles.value.push(res.data.data[i].roleId)
                    userHasRoles.value.push(res.data.data[i].roleId)
                  }
                  userDetailDialogVisible.value = true
                } else {
                  ElNotification({
                    title: '提示',
                    message: res.data.message,
                    type: 'warning'
                  })
                }
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

const queryAllRole = () => {
  let formData = {
    page: 1,
    size: 100
  }
  queryRoleList(formData)
      .then(res => {
        if (res.data.code === 200) {
          allRoles.value = res.data.data.records
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

const handleSubmitUserInfo = () => {
  isDisabled.value = true
  submitText.value = '提交中...'

  let userHasRoleIds = []
  for (let i = 0; i < userHasRoles.value.length; i++) {
    userHasRoleIds.push(userHasRoles.value[i])
  }

  if (userHasRoleIds.toString() === userOldRoles.value.toString()) {
    isDisabled.value = false
    submitText.value = '提交'
    userDetailDialogVisible.value = false
    return
  }

  let formData = {
    userId: userDetails.value.userId,
    roleIds: userHasRoleIds
  }

  assignRole(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          isDisabled.value = false
          submitText.value = '提交'
          userDetailDialogVisible.value = false
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

const handleDelete = (row) => {
  ElMessageBox.confirm(
      '此操作将删除此用户，确定执行吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        let userIds = []
        userIds.push(row.userId)
        deleteUsers(userIds)
            .then(res => {
              if (res.data.code === 200) {
                ElNotification({
                  title: '成功',
                  message: res.data.message,
                  type: 'success'
                })
                queryUserListByCondition()
              } else {
                ElNotification({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
      })
      .catch(() => {
        ElNotification({
          title: '提示',
          message: '已取消操作',
          type: 'info'
        })
      })
}

const handleStatus = (row) => {
  let willStatus = row.status === '启用' ? '禁用' : '启用'

  ElMessageBox.confirm(
      '此操作将' + willStatus + '此用户，确定执行吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        let formData = {
          userId: row.userId,
          status: row.status === '启用' ? 0 : 1
        }

        updateStatus(formData)
            .then(res => {
              if (res.data.code === 200) {
                ElNotification({
                  title: '成功',
                  message: res.data.message,
                  type: 'success'
                })
                queryUserListByCondition()
              } else {
                ElNotification({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
      })
      .catch(() => {
        ElNotification({
          title: '提示',
          message: '已取消操作',
          type: 'info'
        })
      })

}

const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  queryUserListByCondition()
}

const handleCloseEditUserDialog = () => {
  userDetails.value = {}
  userHasRoles.value = []
  userDetailDialogVisible.value = false
}

</script>

<style scoped>
.user-query-container {
  padding: 10px 20px 0 20px;
}

.user-query-form-container {
  margin-left: 20px;
}

.form-inline .el-input {
  --el-input-width: 200px;
}

.form-inline .el-select {
  --el-select-width: 150px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>