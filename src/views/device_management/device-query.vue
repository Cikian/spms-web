<template>
  <div class="user-query-container">
    <div class="user-query-form-container">
      <el-form class="form-inline" size="default" :inline="true" :model="queryConditionForm">
        <el-form-item label="设备名称">
          <el-input v-model="queryConditionForm.devName" placeholder="请输入设备名称" clearable/>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select
              v-model="queryConditionForm.type"
              clearable
              placeholder="请选择设备类型"
          >
            <el-option
                v-for="item in deviceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买日期">
          <el-date-picker
              v-model="queryConditionForm.purchaseDate"
              type="date"
              placeholder="请选择购买日期"
              clearable
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-popover
            placement="bottom"
            width="280"
            trigger="hover"
            title="提示"
            content="实际查询价格范围会在目标价格±100元"
        >
          <template #reference>
            <el-form-item label="购买价格（元）">
              <el-input style="width: 150px;" v-model="queryConditionForm.purchaseCost" placeholder="请输入购买价格" clearable/>
            </el-form-item>
          </template>
        </el-popover>
        <el-form-item label="设备状态">
          <el-select
              v-model="queryConditionForm.status"
              clearable
              placeholder="请选择设备状态"
          >
            <el-option
                v-for="item in deviceStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select
              v-model="queryConditionForm.usage"
              clearable
              placeholder="请选择使用情况"
          >
            <el-option
                v-for="item in deviceUsage"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryDeviceListByCondition">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-list-table">
      <el-table
          :data="deviceList"
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
        <el-table-column
            prop="devName"
            label="设备名称"
            width="230"
            :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
            prop="type"
            label="设备类型"
            width="200"
        >
        </el-table-column>
        <el-table-column
            prop="purchaseDate"
            label="购买日期"
            width="250"
        >
        </el-table-column>
        <el-table-column
            prop="warrantyExpiryDate"
            label="保修到期日期"
            width="250"
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
            label="设备当前状态"
            width="200"
        >
          <template #default="{row}">
            <el-select class="device-status-select" v-model="row.status" placeholder="请选择" @change="handleStatus(row)">
              <el-option
                  v-for="item in deviceStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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

  <el-dialog
      title="设备详细信息"
      v-model="deviceDetailDialogVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <el-form label-position="top" label-width="100px">
      <el-form-item label="设备名称">
        <el-input v-model="deviceDetails.devName"/>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select
            v-model="deviceDetails.type"
            clearable
            placeholder="请选择设备类型"
        >
          <el-option
              v-for="item in deviceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="购买日期">
        <el-input v-model="deviceDetails.purchaseDate" disabled/>
      </el-form-item>
      <el-form-item label="保修到期日期">
        <el-input v-model="deviceDetails.warrantyExpiryDate" disabled/>
      </el-form-item>
      <el-form-item label="购买价格（元）">
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
import {ref} from 'vue'
import {queryDeviceById, queryDeviceList, updateDeviceInfo, updateStatus} from "../../api/DeviceApi.ts";

const loading = ref(false)
const deviceList = ref([])

const queryConditionForm = ref({
  devName: '',
  type: '',
  purchaseDate: '',
  purchaseCost: '',
  status: '',
  usage: ''
})

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

const deviceStatus = [
  {label: '正常', value: 0},
  {label: '维修中', value: 1},
  {label: '已报废', value: 2}
]
const deviceTypes = [
  {label: '服务器', value: 0},
  {label: '网络设备', value: 1},
  {label: '存储设备', value: 2},
  {label: '计算设备', value: 3},
  {label: '外围设备', value: 4},
  {label: '移动设备', value: 5}
]
const deviceUsage = [
  {label: '空闲', value: 0},
  {label: '使用中', value: 1}
]

const queryDeviceListByCondition = () => {
  loading.value = true

  let deviceQueryCondition = {
    devName: queryConditionForm.value.devName,
    type: queryConditionForm.value.type,
    purchaseDate: queryConditionForm.value.purchaseDate,
    purchaseCost: queryConditionForm.value.purchaseCost,
    status: queryConditionForm.value.status
  }

  let formData = {
    page: tablePage.pageNum,
    size: tablePage.pageSize
  }

  console.log(deviceQueryCondition)

  queryDeviceList(formData, deviceQueryCondition).then(res => {
    if (res.data.code === 200) {
      let pageInfo = res.data.data;
      tablePage.total = parseInt(pageInfo.total)

      for (let i = 0; i < pageInfo.records.length; i++) {
        pageInfo.records[i].no = (tablePage.pageNum - 1) * tablePage.pageSize + i + 1

        if (pageInfo.records[i].type === 0) {
          pageInfo.records[i].type = '服务器'
        } else if (pageInfo.records[i].type === 1) {
          pageInfo.records[i].type = '网络设备'
        } else if (pageInfo.records[i].type === 2) {
          pageInfo.records[i].type = '存储设备'
        } else if (pageInfo.records[i].type === 3) {
          pageInfo.records[i].type = '计算设备'
        } else if (pageInfo.records[i].type === 4) {
          pageInfo.records[i].type = '外围设备'
        } else if (pageInfo.records[i].type === 5) {
          pageInfo.records[i].type = '移动设备'
        }

        if (pageInfo.records[i].deviceUsage === 0) {
          pageInfo.records[i].deviceUsage = '空闲'
        } else {
          pageInfo.records[i].deviceUsage = '使用中'
        }

        if (pageInfo.records[i].purchaseDate) {
          pageInfo.records[i].purchaseDate = new Date(pageInfo.records[i].purchaseDate).toLocaleString()
        }

        if (pageInfo.records[i].warrantyExpiryDate) {
          pageInfo.records[i].warrantyExpiryDate = new Date(pageInfo.records[i].warrantyExpiryDate).toLocaleString()
        }

        if (pageInfo.records[i].purchaseCost) {
          pageInfo.records[i].purchaseCost = pageInfo.records[i].purchaseCost.toFixed(2)
        }

        pageInfo.records[i].oldStatus = pageInfo.records[i].status
      }

      deviceList.value = pageInfo.records
      loading.value = false
    }else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning'
      })
      loading.value = false
    }
  })
}

const handleStatus = (row) => {
  let willStatus = row.status
  if (row.status === 0) {
    willStatus = '正常'
  } else if (row.status === 1) {
    willStatus = '维修中'
  } else if (row.status === 2) {
    willStatus = '已报废'
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
              queryDeviceListByCondition()
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
    type: deviceDetails.value.type,
    purchaseDate: deviceOldDetails.value.purchaseDate,
    warrantyExpiryDate: deviceOldDetails.value.warrantyExpiryDate,
    purchaseCost: deviceDetails.value.purchaseCost
  }

  if (JSON.stringify(deviceOldDetails.value) === JSON.stringify(deviceFormData)) {
    ElNotification({
      title: '提示',
      message: '设备信息未发生变化',
      type: 'warning'
    })
    editDeviceIsDisabled.value = false
    editDeviceSubmitText.value = '提交'
    return
  } else {
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

    let isType = false
    for (let i = 0; i < deviceTypes.length; i++) {
      if (deviceFormData.type === deviceTypes[i].value) {
        isType = true
        break
      }
    }

    if (!isType) {
      ElNotification({
        title: '提示',
        message: '设备类型不合法',
        type: 'warning'
      })
      editDeviceIsDisabled.value = false
      editDeviceSubmitText.value = '提交'
      return
    }

    if (!deviceFormData.purchaseDate) {
      ElNotification({
        title: '提示',
        message: '购买日期不能为空',
        type: 'warning'
      })
      editDeviceIsDisabled.value = false
      editDeviceSubmitText.value = '提交'
      return
    }

    if (!deviceFormData.warrantyExpiryDate) {
      ElNotification({
        title: '提示',
        message: '保修到期日期不能为空',
        type: 'warning'
      })
      editDeviceIsDisabled.value = false
      editDeviceSubmitText.value = '提交'
      return
    }
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
          queryDeviceListByCondition()
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
  console.log(row)
}

const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  queryDeviceListByCondition()
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  queryDeviceListByCondition()
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

.device-status-select{
  width: 130px;
}
</style>