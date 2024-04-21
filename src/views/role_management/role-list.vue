<template>
  <div class="user-list-container">
    <div class="top">
      <div class="open-add-user-btn">
        <el-button type="primary" @click="openDialog">新增角色</el-button>
      </div>
      <div class="batch-delete">
        <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      </div>
    </div>
    <div class="user-list-table">
      <el-table
          ref="multipleTableRef"
          :data="roleList"
          :row-key="row => row.no"
          style="width: 100%"
          stripe
          v-loading="loading"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"/>
        <el-table-column
            prop="no"
            label="序号"
            width="120"
        />
        <el-table-column
            prop="remark"
            label="角色名称"
        />
        <el-table-column
            prop="roleName"
            label="角色标识"
        />
        <el-table-column
            prop="status"
            label="状态"
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

  <!--  新增用户dialog-->
  <el-dialog
      title="新增用户"
      class="add-user-dialog"
      v-model="dialogVisible"
      width="30%"
      :show-close="false"
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
      <el-button size="large" @click="handleCloseAddRoleDialog">取消</el-button>
    </div>
  </el-dialog>

  <!--  用户信息dialog-->
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
          <el-checkbox v-for="role in allRoles" :key="role.roleId" :label="role.roleId" :disabled="!role.status">
            {{ role.remark }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmitUserInfo" :disabled="isDisabled">{{
          submitText
        }}
      </el-button>
      <el-button size="large" @click="handleCloseEditRoleDialog">取消</el-button>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {assignRole, deleteRoles, queryRoleList, queryUserHasRole, updateStatus} from "../../api/roleApi.ts";

const loading = ref(true)
const roleList = ref([])
const dialogVisible = ref(false)
const submitText = ref('提交')
const isDisabled = ref(false)
const email = ref('')
const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const multipleTableRef = ref()
const selectedRows = ref([]);
const userDetails = ref()
const userDetailDialogVisible = ref(false)
const userOldRoles = ref([])
const userHasRoles = ref([])

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

const handleCloseAddRoleDialog = () => {
  email.value = ''
  dialogVisible.value = false
}

const handleCloseEditRoleDialog = () => {
  userDetails.value = {}
  userHasRoles.value = []
  userDetailDialogVisible.value = false
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








const loadRoleList = () => {
  loading.value = true

  let formData = {
    page: tablePage.pageNum,
    size: tablePage.pageSize
  }
  queryRoleList(formData).then(res => {
    if (res.data.code === 200) {
      let pageInfo = res.data.data;
      tablePage.total = parseInt(pageInfo.total)

      for (let i = 0; i < pageInfo.records.length; i++) {
        pageInfo.records[i].no = (tablePage.pageNum - 1) * tablePage.pageSize + i + 1

        if (pageInfo.records[i].status) {
          pageInfo.records[i].status = '启用'
        } else {
          pageInfo.records[i].status = '禁用'
        }

        if (pageInfo.records[i].createTime) {
          pageInfo.records[i].createTime = new Date(pageInfo.records[i].createTime).toLocaleString()
        }
      }

      roleList.value = pageInfo.records
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
                } else {
                  ElNotification({
                    title: '提示',
                    message: res.data.message,
                    type: 'warning'
                  })
                }
                userDetailDialogVisible.value = true
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
        let roleIds = []
        roleIds.push(row.roleId)
        deleteRoles(roleIds)
            .then(res => {
              if (res.data.code === 200) {
                ElNotification({
                  title: '成功',
                  message: res.data.message,
                  type: 'success'
                })
                loadRoleList()
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
          roleId: row.roleId,
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
                loadRoleList()
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
  loadRoleList()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
}

const handleBatchDelete = () => {
  let roleIds = []
  for (let i = 0; i < selectedRows.value.length; i++) {
    roleIds.push(selectedRows.value[i].roleId)
  }

  ElMessageBox.confirm(
      '此操作将批量删除选中的用户，确定执行吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        deleteRoles(roleIds)
            .then(res => {
              if (res.data.code === 200) {
                ElNotification({
                  title: '成功',
                  message: res.data.message,
                  type: 'success'
                })
                console.log(multipleTableRef)
                multipleTableRef.value.clearSelection()
                selectedRows.value = []
                loadRoleList()
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

onMounted(() => {
  loadRoleList()
})

</script>

<style scoped>
.user-list-container {
  padding: 10px 20px 0 20px;
}

.top {
  display: flex;
  justify-content: flex-start;
}

.batch-delete {
  margin-left: 30px;
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

</style>