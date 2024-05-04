<template>
  <div class="user-list-container">
    <div class="user-query-form-container">
      <el-form class="form-inline" size="default" :inline="true" :model="queryResourceCostConditionForm">
        <el-form-item label="设备名称">
          <el-input v-model="queryResourceCostConditionForm.resourceName" placeholder="请输入设备名称" clearable/>
        </el-form-item>
        <el-popover
            placement="bottom"
            width="280"
            trigger="hover"
            title="提示"
            content="实际查询价格范围会在目标价格±10元"
        >
          <template #reference>
            <el-form-item label="日费用（元）">
              <el-input @keydown.enter="queryResourceCostListByCondition" type="number" v-model="queryResourceCostConditionForm.dailyCost" placeholder="请输入目标费用" clearable/>
            </el-form-item>
          </template>
        </el-popover>
<!--        <el-popover-->
<!--            placement="bottom"-->
<!--            width="280"-->
<!--            trigger="hover"-->
<!--            title="提示"-->
<!--            content="实际查询价格范围会在目标价格±100元"-->
<!--        >-->
<!--          <template #reference>-->
<!--            <el-form-item label="月费用（元）">-->
<!--              <el-input type="number" v-model="queryResourceCostConditionForm.monthlyCost" placeholder="请输入目标费用" clearable/>-->
<!--            </el-form-item>-->
<!--          </template>-->
<!--        </el-popover>-->
        <el-form-item>
          <el-button type="primary" @click="queryResourceCostListByCondition">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-list-table">
      <el-table
          :data="deviceCostList"
          :row-key="row => row.no"
          style="width: 100%"
          stripe
          v-loading="loading"
      >
<!--        <el-table-column type="selection" width="55" :reserve-selection="true"/>-->
        <el-table-column
            prop="no"
            label="序号"
            width="120"
        >
        </el-table-column>
        <el-table-column
            prop="resourceName"
            label="设备名称"
            :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
            prop="dailyCost"
            label="日费用（元）"
        >
        </el-table-column>
<!--        <el-table-column-->
<!--            prop="monthlyCost"-->
<!--            label="月费用（元）"-->
<!--        >-->
<!--        </el-table-column>-->
        <el-table-column
            prop="updateTime"
            label="上次更新时间"
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
              配置成本
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

  <!--  资源成本信息dialog-->
  <el-dialog
      title="资源成本详细信息"
      v-model="resourceCostDetailDialogVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <el-form label-position="top" label-width="100px">
      <el-form-item label="设备名称">
        <el-input class="form-control-input" v-model="resourceCostDetails.resourceName" disabled/>
      </el-form-item>
      <el-form-item label="日费用（元）">
        <el-input class="form-control-input" v-model="resourceCostDetails.dailyCost" type="number"/>
      </el-form-item>
      <el-form-item label="月费用（元）">
        <el-input class="form-control-input" v-model="resourceCostDetails.monthlyCost" type="number"/>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" type="primary" @click="handleSubmitResourceCostInfo"
                 :disabled="editResourceCostIsDisabled">
        {{ editResourceCostSubmitText }}
      </el-button>
      <el-button size="large" @click="handleCloseEditResourceCostDialog">取消</el-button>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {queryResourceCostById, queryResourceList, updateCost} from "../../api/resourceCostApi.ts";

const loading = ref(true)
const deviceCostList = ref([])

const editResourceCostSubmitText = ref('提交')
const editResourceCostIsDisabled = ref(false)
const resourceCostDetailDialogVisible = ref(false)
const resourceCostDetails = ref()

const queryResourceCostConditionForm = ref({
  resourceName: '',
  dailyCost: '',
  monthlyCost: '',
  resourceType: 2
})

const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const pageSizes = [10, 15, 30, 50, 100]

const loadResourceList = () => {
  loading.value = true

  let deviceQueryCondition = {
    resourceName: queryResourceCostConditionForm.value.resourceName,
    dailyCost: queryResourceCostConditionForm.value.dailyCost,
    monthlyCost: queryResourceCostConditionForm.value.monthlyCost,
    resourceType: queryResourceCostConditionForm.value.resourceType
  }

  let formData = {
    page: tablePage.pageNum,
    size: tablePage.pageSize
  }

  queryResourceList(formData, deviceQueryCondition)
      .then(res => {
        if (res.data.code === 200) {
          let pageInfo = res.data.data;
          tablePage.total = parseInt(pageInfo.total)

          for (let i = 0; i < pageInfo.records.length; i++) {
            pageInfo.records[i].no = (tablePage.pageNum - 1) * tablePage.pageSize + i + 1
            pageInfo.records[i].updateTime = new Date(pageInfo.records[i].updateTime).toLocaleString()
            pageInfo.records[i].dailyCost = pageInfo.records[i].dailyCost.toFixed(2)
            pageInfo.records[i].monthlyCost = pageInfo.records[i].monthlyCost.toFixed(2)
          }

          deviceCostList.value = pageInfo.records
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      .finally(() => {
        loading.value = false
      })
}

const handleEdit = (row) => {
  queryResourceCostById(row.ratedTimeCostId)
      .then(res => {
        if (res.data.code === 200) {
          resourceCostDetails.value = res.data.data
          resourceCostDetails.value.dailyCost = resourceCostDetails.value.dailyCost.toFixed(2)
          resourceCostDetails.value.monthlyCost = resourceCostDetails.value.monthlyCost.toFixed(2)
          resourceCostDetailDialogVisible.value = true
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

const handleSubmitResourceCostInfo = () => {
  editResourceCostSubmitText.value = '提交中...'
  editResourceCostIsDisabled.value = true

  let formData = {
    ratedTimeCostId: resourceCostDetails.value.ratedTimeCostId,
    dailyCost: resourceCostDetails.value.dailyCost,
    monthlyCost: resourceCostDetails.value.monthlyCost
  }

  updateCost(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '提示',
            message: '修改成功',
            type: 'success'
          })
          handleCloseEditResourceCostDialog()
          loadResourceList()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      .finally(() => {
        editResourceCostSubmitText.value = '提交'
        editResourceCostIsDisabled.value = false
      })
}

const handleCloseEditResourceCostDialog = () => {
  resourceCostDetailDialogVisible.value = false
  resourceCostDetails.value = {}
}

const queryResourceCostListByCondition = () => {
  tablePage.pageNum = 1
  loadResourceList()
}

const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  loadResourceList()
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  loadResourceList()
}

onMounted(() => {
  loadResourceList()
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

.user-query-form-container {
  margin-left: 20px;
}

.form-inline .el-input {
  --el-input-width: 200px;
}

.form-inline .el-select {
  --el-select-width: 150px;
}

.form-control-input {
  width: 100%;
  height: 48px;
  font-size: 16px;
}
</style>