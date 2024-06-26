<template>
  <div class="user-list-container">
    <div class="top">
      <div class="open-add-user-btn">
        <el-button type="primary" @click="handleOpenAddDeviceDialog">新增设备</el-button>
      </div>
      <div class="batch-delete">
        <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0">批量删除</el-button>
      </div>
    </div>
    <div class="user-list-table">
      <el-table
          ref="multipleTableRef"
          :data="deviceList"
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
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="devName"
            label="设备名称"
            width="200"
            :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
            prop="typeName"
            label="设备类型"
            width="200"
        >
        </el-table-column>
        <el-table-column
            prop="purchaseDate"
            label="购买日期"
            width="230"
        >
        </el-table-column>
        <el-table-column
            prop="warrantyExpiryDate"
            label="保修到期日期"
            width="230"
        >
        </el-table-column>
        <el-table-column
            prop="purchaseCost"
            label="购买价格（元）"
            width="200"
        >
        </el-table-column>
        <el-table-column
            prop="status"
            label="设备工作状态"
            width="200"
        >
          <template #default="{row}">
            <el-select class="device-status-select" v-model="row.status"
                       @change="handleStatus(row)">
              <el-option
                  v-for="item in deviceStatus"
                  :key="item.dictionaryDataId"
                  :label="item.label"
                  :value="item.dictionaryDataId"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
            prop="deviceUsage"
            label="设备使用情况"
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
          layout="total, sizes, prev, pager, next, jumper"
          background
          :pager-count="11"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
      />
    </div>
  </div>

  <!--  新增设备dialog-->
  <el-dialog
      title="新增设备"
      class="add-user-dialog"
      v-model="addDeviceDialogVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <div class="add-user-tip">
      <span class="add-user-tip-text">在输入设备名称时，须将型号一并输入</span>
    </div>
    <label class="form-label">设备名称（名称-型号）</label>
    <el-input
        class="form-control-input"
        v-model="addDeviceInfo.devName"
        clearable
        placeholder="请输入设备名称"
    />
    <label class="form-label">设备类型</label>
    <el-select
        class="form-control-input"
        v-model="addDeviceInfo.typeId"
        clearable
        placeholder="请选择设备类型"
    >
      <el-option
          v-for="item in deviceTypes"
          :key="item.dictionaryDataId"
          :label="item.label"
          :value="item.dictionaryDataId"
      >
      </el-option>
    </el-select>
    <label class="form-label">购买日期</label>
    <el-date-picker
        class="form-control-input"
        v-model="addDeviceInfo.purchaseDate"
        type="datetime"
        clearable
        placeholder="选择购买日期"
        value-format="YYYY-MM-DD HH:mm:ss"
        size="large"
    />
    <label class="form-label">保修到期日期</label>
    <el-date-picker
        class="form-control-input"
        v-model="addDeviceInfo.warrantyExpiryDate"
        clearable
        type="datetime"
        placeholder="选择保修到期日期"
        value-format="YYYY-MM-DD HH:mm:ss"
        size="large"
    />
    <label class="form-label">购买价格（元）</label>
    <el-input
        class="form-control-input"
        v-model="addDeviceInfo.purchaseCost"
        clearable
        type="number"
        placeholder="请输入购买价格"
    />
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmitAddDevice" :disabled="addDeviceIsDisabled">
        {{ addDeviceSubmitText }}
      </el-button>
      <el-button size="large" @click="handleCloseAddDeviceDialog">取消</el-button>
    </div>
  </el-dialog>

  <!--  设备信息dialog-->
  <el-dialog
      title="设备详细信息"
      v-model="deviceDetailDialogVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <el-form label-position="top" label-width="100px">
      <el-form-item label="设备名称" size="large">
        <el-input v-model="deviceDetails.devName"/>
      </el-form-item>
      <el-form-item label="设备类型" size="large">
        <el-select
            v-model="deviceDetails.typeId"
            clearable
            placeholder="请选择设备类型"
        >
          <el-option
              v-for="item in deviceTypes"
              :key="item.dictionaryDataId"
              :label="item.label"
              :value="item.dictionaryDataId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="购买日期" size="large">
        <el-input v-model="deviceDetails.purchaseDate" disabled/>
      </el-form-item>
      <el-form-item label="保修到期日期" size="large">
        <el-input v-model="deviceDetails.warrantyExpiryDate" disabled/>
      </el-form-item>
      <el-form-item label="购买价格（元）" size="large">
        <el-input v-model="deviceDetails.purchaseCost" disabled/>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmitDeviceInfo" :disabled="editDeviceIsDisabled">
        {{ editDeviceSubmitText }}
      </el-button>
      <el-button size="large" @click="handleCloseEditUserDialog">取消</el-button>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {
  addDevice,
  deleteDevice,
  queryDeviceById,
  queryDeviceList,
  updateDeviceInfo,
  updateStatus
} from "../../api/DeviceApi.ts";
import {queryDictionaryDataByTypeId} from "../../api/dictionaryApi.ts";

const loading = ref(true)
const deviceList = ref([])

const addDeviceDialogVisible = ref(false)
const addDeviceInfo = ref({
  devName: '',
  typeId: '',
  purchaseDate: '',
  warrantyExpiryDate: '',
  purchaseCost: ''
})
const addDeviceSubmitText = ref('提交')
const addDeviceIsDisabled = ref(false)

const editDeviceSubmitText = ref('提交')
const editDeviceIsDisabled = ref(false)
const deviceDetailDialogVisible = ref(false)
const deviceDetails = ref()
const deviceOldDetails = ref()

const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const pageSizes = [10, 15, 30, 50, 100]
const multipleTableRef = ref()
const selectedRows = ref([]);

const deviceStatus = ref([])
const deviceTypes = ref([])
const deviceUsage = ref([])

const loadDeviceList = () => {
  loading.value = true
  let deviceQueryCondition = {}
  let formData = {
    page: tablePage.pageNum,
    size: tablePage.pageSize
  }
  queryDeviceList(formData, deviceQueryCondition)
      .then(res => {
        if (res.data.code === 200) {
          let pageInfo = res.data.data;
          tablePage.total = parseInt(pageInfo.total)

          for (let i = 0; i < pageInfo.records.length; i++) {
            pageInfo.records[i].no = (tablePage.pageNum - 1) * tablePage.pageSize + i + 1

            for (let j = 0; j < deviceUsage.value.length; j++) {
              if (pageInfo.records[i].deviceUsage === deviceUsage.value[j].dictionaryDataId) {
                pageInfo.records[i].deviceUsage = deviceUsage.value[j].label
                break
              }
            }

            if (pageInfo.records[i].purchaseDate) {
              pageInfo.records[i].purchaseDate = pageInfo.records[i].purchaseDate.replace('T', ' ')
            }

            if (pageInfo.records[i].warrantyExpiryDate) {
              pageInfo.records[i].warrantyExpiryDate = pageInfo.records[i].warrantyExpiryDate.replace('T', ' ')
            }

            if (pageInfo.records[i].purchaseCost) {
              pageInfo.records[i].purchaseCost = pageInfo.records[i].purchaseCost.toFixed(2)
            }

            pageInfo.records[i].oldStatus = pageInfo.records[i].status
          }

          deviceList.value = pageInfo.records
          loading.value = false
        }
      })
}

const handleStatus = (row) => {
  let willStatus = ''
  for (let i = 0; i < deviceStatus.value.length; i++) {
    if (row.status === deviceStatus.value[i].dictionaryDataId) {
      willStatus = deviceStatus.value[i].label
      break
    }
  }

  ElMessageBox.confirm(
      '将该设备状态更新为 ' + willStatus + ' ，确定执行吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        let formData = {
          devId: row.devId,
          status: row.status
        }

        updateStatus(formData)
            .then(res => {
              if (res.data.code === 200) {
                ElNotification({
                  title: '成功',
                  message: res.data.message,
                  type: 'success'
                })
              } else {
                ElNotification({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
              loadDeviceList()
            })
      })
      .catch(() => {
        row.status = row.oldStatus
        ElNotification({
          title: '提示',
          message: '已取消操作',
          type: 'info'
        })
      })

}

const handleOpenAddDeviceDialog = () => {
  addDeviceDialogVisible.value = true
}

const handleCloseAddDeviceDialog = () => {
  addDeviceInfo.value = {
    devName: '',
    type: '',
    purchaseDate: '',
    warrantyExpiryDate: '',
    purchaseCost: ''
  }
  addDeviceDialogVisible.value = false
}

const handleSubmitAddDevice = () => {
  addDeviceIsDisabled.value = true
  addDeviceSubmitText.value = '提交中...'

  let deviceFormData = {
    devName: addDeviceInfo.value.devName,
    typeId: addDeviceInfo.value.typeId,
    purchaseDate: addDeviceInfo.value.purchaseDate,
    warrantyExpiryDate: addDeviceInfo.value.warrantyExpiryDate,
    purchaseCost: addDeviceInfo.value.purchaseCost
  }

  if (!deviceFormData.devName) {
    ElNotification({
      title: '提示',
      message: '设备名称不能为空',
      type: 'warning'
    })
    addDeviceIsDisabled.value = false
    addDeviceSubmitText.value = '提交'
    return
  }

  if (parseFloat(deviceFormData.purchaseCost) < 0) {
    ElNotification({
      title: '提示',
      message: '购买价格不能为负数',
      type: 'warning'
    })
    addDeviceIsDisabled.value = false
    addDeviceSubmitText.value = '提交'
    return
  }

  deviceFormData.purchaseCost = parseFloat(deviceFormData.purchaseCost).toFixed(2)

  addDevice(deviceFormData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          loadDeviceList()
          handleCloseAddDeviceDialog()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
        addDeviceIsDisabled.value = false
        addDeviceSubmitText.value = '提交'
      })
}

const handleEdit = (row) => {
  queryDeviceById(row.devId)
      .then(res => {
        if (res.data.code === 200) {
          deviceDetails.value = res.data.data
          deviceDetails.value.purchaseCost = deviceDetails.value.purchaseCost.toFixed(2)
          deviceOldDetails.value = JSON.parse(JSON.stringify(deviceDetails.value))

          deviceDetails.value.purchaseDate = new Date(deviceDetails.value.purchaseDate).toLocaleString()
          deviceDetails.value.warrantyExpiryDate = new Date(deviceDetails.value.warrantyExpiryDate).toLocaleString()

          deviceDetailDialogVisible.value = true
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })

}

const handleSubmitDeviceInfo = () => {
  editDeviceIsDisabled.value = true
  editDeviceSubmitText.value = '提交中...'

  let deviceFormData = {
    devId: deviceDetails.value.devId,
    devName: deviceDetails.value.devName,
    typeId: deviceDetails.value.typeId,
    purchaseDate: deviceOldDetails.value.purchaseDate,
    warrantyExpiryDate: deviceOldDetails.value.warrantyExpiryDate,
    purchaseCost: deviceDetails.value.purchaseCost
  }

  if (!deviceFormData.devName) {
    ElNotification({
      title: '提示',
      message: '设备名称不能为空',
      type: 'warning'
    })
    editDeviceIsDisabled.value = false
    editDeviceSubmitText.value = '提交'
    return
  }

  deviceFormData.purchaseDate = deviceFormData.purchaseDate.replace('T', ' ')
  deviceFormData.warrantyExpiryDate = deviceFormData.warrantyExpiryDate.replace('T', ' ')
  deviceFormData.purchaseCost = parseFloat(deviceFormData.purchaseCost).toFixed(2)

  updateDeviceInfo(deviceFormData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          loadDeviceList()
          handleCloseEditUserDialog()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      .finally(() => {
        editDeviceIsDisabled.value = false
        editDeviceSubmitText.value = '提交'
      })
}

const handleCloseEditUserDialog = () => {
  deviceDetailDialogVisible.value = false
  deviceDetails.value = {}
}

const handleDelete = (row) => {
  let ids = []
  ids.push(row.devId)

  ElMessageBox.confirm('此操作将永久删除该设备，是否继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(() => {
        deleteDevice(ids)
            .then(res => {
              if (res.data.code === 200) {
                ElNotification({
                  title: '成功',
                  message: res.data.message,
                  type: 'success'
                })
                loadDeviceList()
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
          message: '已取消删除操作',
          type: 'info'
        })
      })
}

const handleBatchDelete = () => {
  //TODO: 批量删除
}

const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  loadDeviceList()
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  loadDeviceList()
}

const getDeviceTypes = () => {
  let deviceTypesId = '1786021634477154306'
  queryDictionaryDataByTypeId(deviceTypesId)
      .then(res => {
        if (res.data.code === 200) {
          deviceTypes.value = res.data.data
        }
      })
}

const getDeviceStatus = () => {
  let deviceStatusId = '1786582217903677442'
  queryDictionaryDataByTypeId(deviceStatusId)
      .then(res => {
        if (res.data.code === 200) {
          deviceStatus.value = res.data.data
        }
      })
}

const getDeviceUsage = () => {
  let deviceTypesId = '1786608523483566082'
  queryDictionaryDataByTypeId(deviceTypesId)
      .then(res => {
        if (res.data.code === 200) {
          deviceUsage.value = res.data.data
        }
      })
}

onMounted(() => {
  loadDeviceList()
  getDeviceStatus()
  getDeviceTypes()
  getDeviceUsage()
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

.device-status-select {
  width: 130px;
}
</style>