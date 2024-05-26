<template>
  <div class="container">
    <div class="header">
      <div class="title">
        项目成员
      </div>
      <div class="addTest">
        <el-button type="primary" size="large" @click="openAddProMemberDialog"><span
            style="font-size: 20px; margin-right: 5px;">+</span>添加项目成员
        </el-button>
      </div>
    </div>
    <div class="content">
      <div class="top">
        <div class="search">
          <el-input placeholder="请输入成员姓名"
                    v-model="searchContent"
                    size="large"
                    @keydown.enter="loadTableData()"
                    clearable>
            <template #prefix>
              <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>
            </template>
          </el-input>
        </div>
<!--        预计成本展示-->
        <span>预计成本: {{ estimateTotalCost }}￥</span>

      </div>
      <div class="table">
        <el-table :data="tableData"
                  style="width: 100%"
                  size="large"
                  stripe
                  v-loading="loading"
                  empty-text="暂无数据"
        >
          <el-table-column prop="no" label="序号" width="120">
          </el-table-column>
          <el-table-column prop="resourceName" label="姓名">
          </el-table-column>
          <el-table-column prop="role" label="职位" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="estimateStartTime" label="预计开始使用时间" align="center">
          </el-table-column>
          <el-table-column prop="estimateEndTime" label="预计结束使用时间" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{row}">
              <el-button type="danger" text size="large" @click="handleDelete(row)">移除成员</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>

  <!--  添加项目成员-->
  <el-dialog
      title="添加项目成员"
      v-model="addProMemberDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
    <p>已经被移除过的用户不可再添加到该项目中</p>
    <el-form :model="addMemberForm" label-width="100px" label-position="top">
      <el-form-item label="姓名" prop="resourceName">
        <el-select v-model="addMemberForm.resourceId" placeholder="请选择成员" size="large"
                   @change="checkHasThisMember">
          <el-option
              v-for="item in memberData"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预计开始使用时间" prop="estimateStartTime">
        <el-date-picker
            v-model="addMemberForm.estimateStartTime"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期"
            size="large">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预计结束使用时间" prop="estimateEndTime">
        <el-date-picker
            v-model="addMemberForm.estimateEndTime"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期"
            size="large">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleCloseAddProMemberDialog" size="large">取 消</el-button>
      <el-button :loading="loadingAddMember" type="primary" @click="submitForm" size="large">确 定</el-button>
    </div>
  </el-dialog>

  <!--  移除成员-->
  <el-dialog
      title="提示"
      v-model="removeMemberDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
    <p>此操作将该成员从项目中移除，并且无法再次添加该成员， 是否继续?</p>
    <el-form :model="willDeleteMember" label-width="100px" label-position="top">
      <el-form-item label="姓名" prop="resourceName">
        <el-input v-model="willDeleteMember.resourceName" size="large" disabled/>
      </el-form-item>
      <el-form-item label="实际开始使用时间">
        <el-date-picker
            v-model="willDeleteMember.actualStartTime"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="large">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实际结束使用时间">
        <el-date-picker
            v-model="willDeleteMember.actualEndTime"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="large">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleCloseRemoveMemberDialog" size="large">取 消</el-button>
      <el-button :loading="loadingRemoveMember" type="primary" @click="submitRemoveMember" size="large">确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {getProjectMembers} from "../../../api/ProjectResourceApi.ts";
import {addMember, deleteMember, getAddMembers, getProAddMembers} from "../../../api/allProApi.ts";

const proId = ref('')

const searchContent = ref('')
const tableData = ref([])
const loading = ref(false)
const memberData = ref([])
const estimateTotalCost = ref(0)

//添加项目成员
const addProMemberDialogVisible = ref(false)
const addMemberForm = ref({
  resourceId: '',
  estimateStartTime: '',
  estimateEndTime: '',
  proId: ''
})
const loadingAddMember = ref(false)

//移除项目成员
const willDeleteMember = ref({})
const removeMemberDialogVisible = ref(false)
const loadingRemoveMember = ref(false)

const loadTableData = () => {
  loading.value = true

  let formData = {
    proId: proId.value,
    userName: searchContent.value
  }
  getProjectMembers(formData)
      .then(res => {
        if (res.data.code === 200) {
          tableData.value = res.data.data.members
          estimateTotalCost.value = res.data.data.totalCost.toFixed(2)

          for (let i = 0; i < tableData.value.length; i++) {
            tableData.value[i].no = i + 1

            tableData.value[i].estimateStartTime = tableData.value[i].estimateStartTime.split('T')[0]
            tableData.value[i].estimateEndTime = tableData.value[i].estimateEndTime.split('T')[0]
          }
        } else {
          tableData.value = []
        }
      })
      .finally(() => {
        loading.value = false
      })
}

const openAddProMemberDialog = () => {
  addProMemberDialogVisible.value = true
}

const handleCloseAddProMemberDialog = () => {
  addProMemberDialogVisible.value = false
  addMemberForm.value = {
    resourceId: '',
    estimateStartTime: '',
    estimateEndTime: ''
  }
}

const checkHasThisMember = () => {
  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].resourceId === addMemberForm.value.resourceId) {
      ElNotification({
        title: '提示',
        message: '该成员已在项目中',
        type: 'warning'
      })
      addMemberForm.value.resourceId = ''
      return
    }
  }
}

const submitForm = () => {
  loadingAddMember.value = true
  if (!addMemberForm.value.resourceId) {
    ElNotification({
      title: '提示',
      message: '请选择成员',
      type: 'warning'
    })
    loadingAddMember.value = false
    return
  }

  if (!addMemberForm.value.estimateStartTime) {
    ElNotification({
      title: '提示',
      message: '请选择预计开始使用时间',
      type: 'warning'
    })
    loadingAddMember.value = false
    return
  }

  if (!addMemberForm.value.estimateEndTime) {
    ElNotification({
      title: '提示',
      message: '请选择预计结束使用时间',
      type: 'warning'
    })
    loadingAddMember.value = false
    return
  }
  let formData = {
    proId: proId.value,
    memberId: addMemberForm.value.resourceId,
    estimateStartTime: addMemberForm.value.estimateStartTime,
    estimateEndTime: addMemberForm.value.estimateEndTime
  }

  addMember(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '提示',
            message: '添加成功',
            type: 'success'
          })
          handleCloseAddProMemberDialog()
          loadTableData()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      .finally(() => {
        loadingAddMember.value = false
      })
}

const handleDelete = (row) => {
  willDeleteMember.value = row
  removeMemberDialogVisible.value = true
}

const handleCloseRemoveMemberDialog = () => {
  removeMemberDialogVisible.value = false
  willDeleteMember.value = {}
}

const submitRemoveMember = () => {
  loadingRemoveMember.value = true

  if (!willDeleteMember.value.actualStartTime) {
    ElNotification({
      title: '提示',
      message: '请选择实际开始使用时间',
      type: 'warning'
    })
    loadingRemoveMember.value = false
    return
  }

  if (!willDeleteMember.value.actualEndTime) {
    ElNotification({
      title: '提示',
      message: '请选择实际结束使用时间',
      type: 'warning'
    })
    loadingRemoveMember.value = false
    return
  }

  let formData = {
    id: willDeleteMember.value.id,
    actualStartTime: willDeleteMember.value.actualStartTime,
    actualEndTime: willDeleteMember.value.actualEndTime
  }

  deleteMember(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '提示',
            message: '移除成功',
            type: 'success'
          })
          handleCloseRemoveMemberDialog()
          loadTableData()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      .finally(() => {
        loadingRemoveMember.value = false
      })
}

const getMembers = () => {
  getProAddMembers(proId.value)
      .then((res) => {
        if (res.data.code === 200) {
          memberData.value = res.data.data
        } else {
          memberData.value = []
        }
      })
}

onMounted(() => {
  let currentProId = localStorage.getItem('proDetailId')
  if (currentProId) {
    proId.value = currentProId
  }
  loadTableData()
  getMembers()
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}

.search {
  width: 350px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.table {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>