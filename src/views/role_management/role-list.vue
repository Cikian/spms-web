<template>
  <div class="user-list-container">
    <div class="top">
      <div class="open-add-user-btn">
        <el-button type="primary" @click="openAddRoleDialog">新增角色</el-button>
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
          layout="total, sizes, prev, pager, next, jumper"
          background
          :pager-count="11"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
      />
    </div>
  </div>

  <!--  新增角色dialog-->
  <el-dialog
      title="新增角色"
      v-model="dialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <div class="add-user-tip">
      <div class="add-user-tip-text">请按
        <el-popover
            placement="bottom-start"
            width="450"
            trigger="hover"
            content="角色标识和名称均是唯一的，不可重复。角色标识只可以用英文单词，多个单词使用下划线（ _ ）分割，例如（system_admin），角色名称只能使用中文。"
        >
          <template #reference>
            <el-text style="color:#409eff; cursor: pointer">规则</el-text>
          </template>
        </el-popover>
        输入角色标识和名称，新增成功之后可以通过编辑赋予角色权限
      </div>
    </div>
    <el-form :model="role" label-position="top">
      <el-form-item label="角色标识">
        <el-input class="form-control-input" v-model="role.roleName" placeholder="请输入角色标识"/>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input class="form-control-input" v-model="role.remark" placeholder="请输入角色名称"/>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmit" :disabled="isDisabled">{{ submitText }}</el-button>
      <el-button size="large" @click="handleCloseAddRoleDialog">取消</el-button>
    </div>
  </el-dialog>

  <!--  角色信息dialog-->
  <el-dialog
      title="角色详细信息"
      v-model="roleDetailDialogVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <el-form :model="roleDetails" label-position="top">
      <el-form-item label="角色标识">
        <el-input v-model="roleDetails.roleName"/>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="roleDetails.remark"/>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="roleDetails.createTime" disabled/>
      </el-form-item>
      <el-button type="primary" round size="large" @click="openSelectMenuDialog(roleDetails.roleId)">
        <font-awesome-icon :icon="['far', 'pen-to-square']" style="margin-right: 5px"/>
        点击分配角色权限
      </el-button>
    </el-form>
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmitRoleInfo" :disabled="isDisabled">{{ submitText }}
      </el-button>
      <el-button size="large" @click="handleCloseEditRoleDialog">取消</el-button>
    </div>
  </el-dialog>

  <!--  角色权限选择dialog-->
  <el-dialog
      title="角色权限选择"
      v-model="roleMenuDialogVisible"
      width="80%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <el-checkbox-group v-model="roleHasMenus">
      <el-checkbox v-for="menu in allMenus" :key="menu.menuId" :label="menu.menuId" :disabled="!menu.status">{{ menu.menuName }}
      </el-checkbox>
    </el-checkbox-group>
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSelectedMenuDialog" :disabled="canSubmitSelectMenu">
        {{ selectMenuSubmitText }}
      </el-button>
      <el-button size="large" @click="handleCloseSelectMenuDialog">取消</el-button>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {
  addRole,
  deleteRoles,
  queryById,
  queryRoleList, updateRoleInfo,
  updateStatus
} from "../../api/roleApi.ts";
import {assignPermissions, queryAllMenus, queryRoleHasMenu} from "../../api/menuApi.ts";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const loading = ref(true)
const dialogVisible = ref(false)
const roleList = ref([])
const submitText = ref('提交')
const selectMenuSubmitText = ref('提交')
const isDisabled = ref(false)
const role = ref({
  roleName: '',
  remark: ''
})
const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const pageSizes = [10, 15, 30, 50, 100]
const multipleTableRef = ref()
const selectedRows = ref([]);

const roleDetailDialogVisible = ref(false)
const roleMenuDialogVisible = ref(false)
const canSubmitSelectMenu = ref(false)
const roleDetails = ref()
const roleOldMenus = ref([])
const roleHasMenus = ref([])
const allMenus = ref([])

//打开编辑角色dialog
const handleEdit = (row) => {
  let roleId = row.roleId
  queryById(roleId)
      .then(res => {
        if (res.data.code === 200) {
          roleDetails.value = res.data.data
          roleDetails.value.createTime = new Date(roleDetails.value.createTime).toLocaleString()
          roleDetailDialogVisible.value = true
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }

      })
}

//关闭编辑角色dialog
const handleCloseEditRoleDialog = () => {
  roleDetails.value = {}
  roleHasMenus.value = []
  roleDetailDialogVisible.value = false
}

//提交编辑角色信息
const handleSubmitRoleInfo = () => {
  isDisabled.value = true
  submitText.value = '提交中...'

  if (!validateRoleInfo(roleDetails.value.roleName, roleDetails.value.remark)) {
    isDisabled.value = false
    submitText.value = '提交'
    return
  }

  let updateRole = {
    roleId: roleDetails.value.roleId,
    roleName: roleDetails.value.roleName,
    remark: roleDetails.value.remark
  }

  updateRoleInfo(updateRole)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          isDisabled.value = false
          submitText.value = '提交'
          handleCloseEditRoleDialog()
          loadRoleList()
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

//加载所有菜单
const loadAllMenus = () => {
  queryAllMenus()
      .then(res => {
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            allMenus.value.push(res.data.data[i])
          }
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

//打开权限分配dialog
const openSelectMenuDialog = (roleId) => {
  queryRoleHasMenu(roleId)
      .then(res => {
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            roleOldMenus.value.push(res.data.data[i].menuId)
            roleHasMenus.value.push(res.data.data[i].menuId)
          }
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
  roleMenuDialogVisible.value = true
}

//关闭权限分配dialog
const handleCloseSelectMenuDialog = () => {
  roleHasMenus.value = []
  roleOldMenus.value = []
  roleMenuDialogVisible.value = false
}

//确定提交权限分配
const handleSelectedMenuDialog = () => {
  canSubmitSelectMenu.value = true
  selectMenuSubmitText.value = '提交中...'

  let roleHasMenuIds = []
  for (let i = 0; i < roleHasMenus.value.length; i++) {
    roleHasMenuIds.push(roleHasMenus.value[i])
  }

  console.log(roleHasMenuIds.toString() + "....." + roleOldMenus.value.toString())
  if (roleHasMenuIds.toString() === roleOldMenus.value.toString()) {
    canSubmitSelectMenu.value = false
    selectMenuSubmitText.value = '提交'
    handleCloseSelectMenuDialog()
    return
  }

  let formData = {
    roleId: roleDetails.value.roleId,
    menuIds: roleHasMenuIds
  }

  assignPermissions(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          canSubmitSelectMenu.value = false
          selectMenuSubmitText.value = '提交'
          handleCloseSelectMenuDialog()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
          canSubmitSelectMenu.value = false
          selectMenuSubmitText.value = '提交'
        }

      })
}

//打开新增角色dialog
const openAddRoleDialog = () => {
  dialogVisible.value = true
}

//关闭新增角色dialog
const handleCloseAddRoleDialog = () => {
  role.value = {
    roleName: '',
    remark: ''
  }
  dialogVisible.value = false
}

//提交新增角色
const handleSubmit = () => {
  isDisabled.value = true
  submitText.value = '提交中...'

  if (!validateRoleInfo(role.value.roleName, role.value.remark)) {
    isDisabled.value = false
    submitText.value = '提交'
    return
  }

  let roleFormData = {
    roleName: role.value.roleName,
    remark: role.value.remark
  }
  addRole(roleFormData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          isDisabled.value = false
          submitText.value = '提交'
          handleCloseAddRoleDialog()
          loadRoleList()
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

//加载所有角色
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

//更新角色状态
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

//删除和批量删除
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

//切换页面
const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  loadRoleList()
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  loadRoleList()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
}

//校验角色信息方法
const validateRoleInfo = (roleName, remark) => {
  if (!roleName || !remark) {
    ElNotification({
      title: '提示',
      message: '角色标识和名称不能为空',
      type: 'warning'
    })
    return false
  }

  let roleNameReg = /^[a-zA-Z_]+$/;
  let remarkReg = /^[\u4e00-\u9fa5]+$/;
  if (!roleNameReg.test(roleName)) {
    ElNotification({
      title: '提示',
      message: '角色标识只能使用英文单词，多个单词使用下划线（ _ ）分割',
      type: 'warning'
    })
    return false
  }

  if (!remarkReg.test(remark)) {
    ElNotification({
      title: '提示',
      message: '角色名称只能使用中文',
      type: 'warning'
    })
    return false
  }
  return true
}

onMounted(() => {
  loadRoleList()
  loadAllMenus()
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