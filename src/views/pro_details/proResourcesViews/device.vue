<template>
  <div class="container">
    <div class="header">
      <div class="title">
        项目设备
      </div>
      <div class="addTest">
        <el-button type="primary" size="large" @click="openAddProDeviceDialog"><span
            style="font-size: 20px; margin-right: 5px;">+</span>添加项目设备
        </el-button>
      </div>
    </div>
    <div class="content">
      <div class="top">
        <div class="search">
          <el-input placeholder="请输入设备名称"
                    v-model="searchContent"
                    size="large"
                    @keydown.enter="loadTableData()"
                    clearable>
            <template #prefix>
              <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>
            </template>
          </el-input>
        </div>
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
          <el-table-column prop="resourceName" label="设备名称">
          </el-table-column>
          <el-table-column prop="role" label="设备类型" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="estimateStartTime" label="预计开始使用时间" align="center">
          </el-table-column>
          <el-table-column prop="estimateEndTime" label="预计结束使用时间" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{row}">
              <el-button type="danger" text size="large" @click="handleDelete(row)">释放设备</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>

  <!--  添加项目设备-->
  <el-dialog
      title="添加项目设备"
      v-model="addProDeviceDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
    <p>已经被释放过的设备不可再添加到该项目中</p>
    <el-form :model="addDeviceForm" label-width="100px" label-position="top">
      <el-form-item label="设备名称" prop="resourceName">
        <el-select v-model="addDeviceForm.resourceId" placeholder="请选择设备" size="large"
                   @change="checkHasThisDevice">
          <el-option
              v-for="item in deviceData"
              :key="item.devId"
              :label="item.devName"
              :value="item.devId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预计开始使用时间" prop="estimateStartTime">
        <el-date-picker
            v-model="addDeviceForm.estimateStartTime"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期"
            size="large">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预计结束使用时间" prop="estimateEndTime">
        <el-date-picker
            v-model="addDeviceForm.estimateEndTime"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择日期"
            size="large">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleCloseAddProMemberDialog" size="large">取 消</el-button>
      <el-button :loading="loadingAddDevice" type="primary" @click="submitForm" size="large">确 定</el-button>
    </div>
  </el-dialog>

  <!--  移除设备-->
  <el-dialog
      title="提示"
      v-model="removeDeviceDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
    <p>此操作将该成员从项目中移除，并且无法再次添加该成员， 是否继续?</p>
    <el-form :model="willDeleteDevice" label-width="100px" label-position="top">
      <el-form-item label="姓名" prop="resourceName">
        <el-input v-model="willDeleteDevice.resourceName" size="large" disabled/>
      </el-form-item>
      <el-form-item label="实际开始使用时间">
        <el-date-picker
            v-model="willDeleteDevice.actualStartTime"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="large">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实际结束使用时间">
        <el-date-picker
            v-model="willDeleteDevice.actualEndTime"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            size="large">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleCloseRemoveMemberDialog" size="large">取 消</el-button>
      <el-button :loading="loadingRemoveDevice" type="primary" @click="submitRemoveMember" size="large">确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {getProjectDevices} from "../../../api/ProjectResourceApi.ts";
import {getProAddDevice} from "../../../api/DeviceApi.ts";
import {addDeviceToPro, deleteDevice} from "../../../api/allProApi.ts";

const proId = ref('')

const searchContent = ref('')
const tableData = ref([])
const loading = ref(false)
const deviceData = ref([])

//添加项目设备
const addProDeviceDialogVisible = ref(false)
const addDeviceForm = ref({
  resourceId: '',
  estimateStartTime: '',
  estimateEndTime: '',
  proId: ''
})
const loadingAddDevice = ref(false)

//移除项目设备
const willDeleteDevice = ref({})
const removeDeviceDialogVisible = ref(false)
const loadingRemoveDevice = ref(false)

const loadTableData = () => {
  loading.value = true

  let formData = {
    proId: proId.value,
    deviceName: searchContent.value
  }
  getProjectDevices(formData)
      .then(res => {
        if (res.data.code === 200) {
          tableData.value = res.data.data

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

const openAddProDeviceDialog = () => {
  addProDeviceDialogVisible.value = true
}

const handleCloseAddProMemberDialog = () => {
  addProDeviceDialogVisible.value = false
  addDeviceForm.value = {
    resourceId: '',
    estimateStartTime: '',
    estimateEndTime: '',
    proId: ''
  }
}

const checkHasThisDevice = () => {
  for (let i = 0; i < tableData.value.length; i++) {
    if (tableData.value[i].resourceId === addDeviceForm.value.resourceId) {
      ElNotification({
        title: '提示',
        message: '该设备已在项目中',
        type: 'warning'
      })
      addDeviceForm.value.resourceId = ''
      return
    }
  }
}

const submitForm = () => {
  loadingAddDevice.value = true
  if (!addDeviceForm.value.resourceId) {
    ElNotification({
      title: '提示',
      message: '请选择设备',
      type: 'warning'
    })
    loadingAddDevice.value = false
    return
  }

  if (!addDeviceForm.value.estimateStartTime) {
    ElNotification({
      title: '提示',
      message: '请选择预计开始使用时间',
      type: 'warning'
    })
    loadingAddDevice.value = false
    return
  }

  if (!addDeviceForm.value.estimateEndTime) {
    ElNotification({
      title: '提示',
      message: '请选择预计结束使用时间',
      type: 'warning'
    })
    loadingAddDevice.value = false
    return
  }
  let formData = {
    proId: proId.value,
    memberId: addDeviceForm.value.resourceId,
    estimateStartTime: addDeviceForm.value.estimateStartTime,
    estimateEndTime: addDeviceForm.value.estimateEndTime
  }

  addDeviceToPro(formData)
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
        loadingAddDevice.value = false
      })
}

const handleDelete = (row) => {
  willDeleteDevice.value = row
  removeDeviceDialogVisible.value = true
}

const handleCloseRemoveMemberDialog = () => {
  removeDeviceDialogVisible.value = false
  willDeleteDevice.value = {}
}

const submitRemoveMember = () => {
  loadingRemoveDevice.value = true

  if (!willDeleteDevice.value.actualStartTime) {
    ElNotification({
      title: '提示',
      message: '请选择实际开始使用时间',
      type: 'warning'
    })
    loadingRemoveDevice.value = false
    return
  }

  if (!willDeleteDevice.value.actualEndTime) {
    ElNotification({
      title: '提示',
      message: '请选择实际结束使用时间',
      type: 'warning'
    })
    loadingRemoveDevice.value = false
    return
  }

  let formData = {
    id: willDeleteDevice.value.id,
    actualStartTime: willDeleteDevice.value.actualStartTime,
    actualEndTime: willDeleteDevice.value.actualEndTime
  }

  deleteDevice(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '提示',
            message: '释放成功',
            type: 'success'
          })
          handleCloseRemoveMemberDialog()
          loadTableData()
          getDevices()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      .finally(() => {
        loadingRemoveDevice.value = false
      })
}

const getDevices = () => {
  getProAddDevice(proId.value)
      .then((res) => {
        if (res.data.code === 200) {
          deviceData.value = res.data.data
        } else {
          deviceData.value = []
        }
      })
}

onMounted(() => {
  let currentProId = localStorage.getItem('proDetailId')
  if (currentProId) {
    proId.value = currentProId
  }
  loadTableData()
  getDevices()
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