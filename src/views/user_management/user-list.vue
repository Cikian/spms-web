<template>
  <div class="user-list-container">
    <div class="top">
      <div class="open-add-user-btn">
        <el-button type="primary" @click="openDialog">新增用户</el-button>
      </div>
      <div class="batch-delete">
        <el-button type="primary" @click="openImportUserDialog()">批量导入</el-button>
      </div>
      <div class="batch-delete">
        <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      </div>

    </div>
    <div class="user-list-table">
      <el-table
          ref="multipleTableRef"
          :data="userList"
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
        >
        </el-table-column>
        <el-table-column label="头像" width="150">
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
            label="姓名"
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
            label="入职时间"
            width="170"
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
              分配角色
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
          layout="total, sizes, prev, pager, next, jumper"
          background
          :pager-count="11"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
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
      <span class="add-user-tip-text">系统会将用户账号和密码发送至邮箱，系统管理员可以为用户分配角色</span>
    </div>
    <label class="form-label">姓名</label>
    <el-input
        class="form-control-input"
        v-model="nickName"
        clearable
        placeholder="请输入用户姓名"
    />
    <label class="form-label">邮箱</label>
    <el-input
        class="form-control-input"
        v-model="email"
        clearable
        placeholder="请输入邮箱"
    />
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmit" :loading="loadingAddUser" :disabled="isDisabled">
        提交
      </el-button>
      <el-button size="large" @click="handleCloseAddUserDialog">取消</el-button>
    </div>
  </el-dialog>

  <!--  导入用户dialog-->
  <el-dialog
      title="新增用户"
      class="add-user-dialog"
      v-model="importUserDialog"
      width="35%"
  >
    <el-popover
        placement="right"
        title="注意"
        :width="374"
        trigger="hover"
    >
      导入的文件仅支持<span style="font-weight: bold">.xlsx</span>文件或<span style="font-weight: bold">.xls</span>文件<br>
      其中必须包含“姓名”、“邮箱”两列<br>
      示例：<br>
      <img style="width: 350px; margin: 0 auto" src="../../assets/example.png"  />

      <template #reference>
        <el-upload
            class="upload-demo"
            ref="importUserRef"
            drag
            :http-request="importUserReq"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
        >
          <font-awesome-icon style="font-size: 50px; margin-bottom: 20px" :icon="['fas', 'cloud-arrow-up']"/>
          <div class="el-upload__text">
            将文件拖动到此或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip" style="font-size: 15px">
              仅支持上传 <em>xlsx</em>、<em>xls</em> 格式文件
            </div>
          </template>
        </el-upload>
      </template>
    </el-popover>


    <el-progress :percentage="uploadProgress" :format="format"/>

    <div v-if="uploadProgress === 100">
      导入成功：<span style="color: #6bed7a">{{uploadResult.success}}</span>
      导入失败：<span style="color: #ff3232">{{uploadResult.fail}}</span>
    </div>
    <template #footer>
      <el-button type="success" size="large" @click="submitImportUser()">导入</el-button>
    </template>
  </el-dialog>

  <!--  用户信息dialog-->
  <el-dialog
      title="分配角色"
      v-model="userDetailDialogVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <!--    表单-->
    <el-form :model="userDetails" label-position="top">
      <el-form-item label="角色">
        <el-checkbox-group v-model="userHasRoles">
          <el-checkbox v-for="role in allRoles" :key="role.roleId" :label="role.roleId" :disabled="!role.status">
            {{ role.remark }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmitUserInfo" :loading="loadingSubmitUserInfo" :disabled="isDisabled">提交
      </el-button>
      <el-button size="large" @click="handleCloseEditUserDialog">取消</el-button>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {addUser, deleteUsers, queryById, queryUserList, updateStatus} from "../../api/userApi.ts";
import {assignRole, queryRoleList, queryUserHasRole, uploadImportUser} from "../../api/roleApi.ts";
import {message} from "ant-design-vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {genFileId, UploadInstance, UploadProps, UploadRawFile} from 'element-plus'

const loading = ref(true)
const userList = ref([])
const dialogVisible = ref(false)
const isDisabled = ref(false)
const loadingAddUser = ref(false)
const loadingSubmitUserInfo = ref(false)
const email = ref('')
const nickName = ref('')
const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const pageSizes = [10, 15, 30, 50, 100]
const multipleTableRef = ref()
const selectedRows = ref([]);
const userDetails = ref()
const userDetailDialogVisible = ref(false)
const allRoles = ref([])
const userOldRoles = ref([])
const userHasRoles = ref([])

const openDialog = () => {
  dialogVisible.value = true
}

const handleSubmit = () => {
  isDisabled.value = true
  loadingAddUser.value = true

  if (email.value === '') {
    ElNotification({
      title: '提示',
      message: '邮箱不能为空',
      type: 'warning'
    })
    isDisabled.value = false
    loadingAddUser.value = false
    return
  }

  if (nickName.value === '') {
    ElNotification({
      title: '提示',
      message: '用户姓名不能为空',
      type: 'warning'
    })
    isDisabled.value = false
    loadingAddUser.value = false
    return
  }

  let userFormData = {
    email: email.value,
    nickName: nickName.value
  }
  addUser(userFormData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          email.value = ''
          nickName.value = ''
          dialogVisible.value = false
          loadUserList()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      .finally(() => {
        isDisabled.value = false
        loadingAddUser.value = false
      })
}

const handleCloseAddUserDialog = () => {
  email.value = ''
  nickName.value = ''
  dialogVisible.value = false
}

const handleCloseEditUserDialog = () => {
  userDetails.value = {}
  userHasRoles.value = []
  userOldRoles.value = []
  userDetailDialogVisible.value = false
}

const loadUserList = () => {
  loading.value = true
  let userDTO = {}
  let formData = {
    page: tablePage.pageNum,
    size: tablePage.pageSize
  }
  queryUserList(formData, userDTO).then(res => {
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
          pageInfo.records[i].createTime = pageInfo.records[i].createTime.replace('T', ' ')
        }
      }

      userList.value = pageInfo.records
      loading.value = false
    }else {
      userList.value = []
    }
  })
}

const handleEdit = (row) => {
  message.loading('加载中...', 0)
  let userId = row.userId
  queryById(userId)
      .then(res => {
        if (res.data.code === 200) {
          userDetails.value = res.data.data
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
              .finally(() => {
                message.destroy()
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
        message.loading('删除中...', 0)
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
                loadUserList()
              } else {
                ElNotification({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
            .finally(() => {
              message.destroy()
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
        message.loading('操作中...', 0)
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
                loadUserList()
              } else {
                ElNotification({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
            .finally(() => {
              message.destroy()
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
  loadUserList()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  loadUserList()
}

const handleBatchDelete = () => {
  let userIds = []
  for (let i = 0; i < selectedRows.value.length; i++) {
    userIds.push(selectedRows.value[i].userId)
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
        deleteUsers(userIds)
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
                loadUserList()
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
  loadingSubmitUserInfo.value = true

  let userHasRoleIds = []
  for (let i = 0; i < userHasRoles.value.length; i++) {
    userHasRoleIds.push(userHasRoles.value[i])
  }

  if (userHasRoleIds.toString() === userOldRoles.value.toString()) {
    isDisabled.value = false
    loadingSubmitUserInfo.value = false
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
          handleCloseEditUserDialog()
          loadUserList()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      .finally(() => {
        isDisabled.value = false
        loadingSubmitUserInfo.value = false
      })
}

const importUserRef = ref<UploadInstance>()

const importUserDialog = ref(false)

const uploadProgress = ref(0)

const uploadResult = ref({
  success: 0,
  fail: 0
})

const addUploadProgress = () => {
  if (uploadProgress.value < 99) {
    uploadProgress.value += 1
  }
}
const addUploadProgressSuccess = () => {
  if (uploadProgress.value < 100) {
    uploadProgress.value += 1
  } else {
    clearInterval(timerSuccess)
  }
}

let timerSuccess;
const importUserReq = (file) => {
  uploadProgress.value = 0

  let formData1 = new FormData();
  formData1.append('file', file.file);

  let timer = setInterval(addUploadProgress, 190);

  uploadImportUser(formData1)
      .then(res => {
        if (res.data.code === 1001) {
          console.log("导入返回：" + res)
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          uploadResult.value.success = res.data.data.success
          uploadResult.value.fail = res.data.data.fail
          importUserRef.value!.clearFiles()
          clearInterval(timer)
          timerSuccess = setInterval(addUploadProgressSuccess, 20);
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

const openImportUserDialog = () => {
  importUserDialog.value = true
}

const submitImportUser = () => {
  importUserRef.value!.submit()
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  importUserRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  importUserRef.value!.handleStart(file)
}

const format = (percentage) => (percentage === 100 ? '完成' : `${percentage}%`)

onMounted(() => {
  loadUserList()
  queryAllRole()
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