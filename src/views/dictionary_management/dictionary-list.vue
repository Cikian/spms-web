<template>
  <div class="user-list-container">
    <div class="user-query-form-container">
      <el-input v-model="queryConditionForm.dictionaryTypeName" @keydown.enter="loadDictionaryTypeList"
                placeholder="请输入字典分类名称" clearable style="width: 200px;">
        <template #prefix>
          <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>
        </template>
      </el-input>
      <el-button type="primary" @click="loadDictionaryTypeList" style="margin-left: 10px">查询</el-button>
    </div>
    <div class="user-list-table">
      <el-table
          :data="dictionaryTypeList"
          :row-key="row => row.no"
          style="width: 100%"
          stripe
          v-loading="loading"
      >
        <el-table-column
            prop="no"
            label="序号"
            width="200"
        >
        </el-table-column>
        <el-table-column
            prop="dictionaryTypeName"
            label="字典分类名称"
            width="300"
        >
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
        >
          <template #default="{row}">
            <el-button
                type="primary"
                text
                size="default"
                @click="handleEdit(row)"
            >
              配置字典数据
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

  <!--  字典分类信息dialog-->
  <el-dialog
      title="字典详细信息"
      v-model="dictionaryDetailDialogVisible"
      width="40%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <el-form label-position="top" label-width="100px">
      <el-form-item label="字典分类名称">
        <el-input v-model="dictionaryDetails.dictionaryTypeName" disabled/>
      </el-form-item>
      <el-form-item class="addDictionaryData" label="添加字典数据">
        <el-input v-model="addDictionaryDataForm.label" placeholder="请输入字典数据标签" clearable/>
        <el-button type="primary" @click="handleAddDictionaryData">添加</el-button>
      </el-form-item>
      <el-form-item label="字典数据">
        <el-table
            :data="dictionaryDataList"
            style="width: 100%"
            stripe
            max-height="400px"
        >
          <el-table-column
              prop="label"
              label="字典数据标签"
          >
          </el-table-column>
          <el-table-column
              label="操作"
          >
            <template #default="{row}">
              <el-button
                  type="danger"
                  text
                  size="default"
                  @click="handleDeleteDictionaryData(row)"
                  :disabled="row.isSystem"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div style="text-align: center; margin-top: 20px;">
      <el-button size="large" @click="handleCloseEditDictionaryDialog">关闭</el-button>
    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {
  addDictionaryData, deleteDictionaryData,
  queryDictionaryDataByTypeId,
  queryDictionaryTypeList
} from "../../api/dictionaryApi.ts";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const loading = ref(true)
const dictionaryTypeList = ref([])

const queryConditionForm = ref({
  dictionaryTypeName: ''
})

const dictionaryDetailDialogVisible = ref(false)
const dictionaryDetails = ref()
const dictionaryOldDetails = ref()

const dictionaryDataList = ref([])
const addDictionaryDataForm = ref({
  label: '',
})

const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const pageSizes = [10, 15, 30, 50, 100]

const loadDictionaryTypeList = () => {
  loading.value = true

  let queryCondition = {
    dictionaryTypeName: queryConditionForm.value.dictionaryTypeName
  }
  let formData = {
    page: tablePage.pageNum,
    size: tablePage.pageSize
  }

  queryDictionaryTypeList(formData, queryCondition)
      .then(res => {
        if (res.data.code === 200) {
          let pageInfo = res.data.data;
          tablePage.total = parseInt(pageInfo.total)

          for (let i = 0; i < pageInfo.records.length; i++) {
            pageInfo.records[i].no = (tablePage.pageNum - 1) * tablePage.pageSize + i + 1
            pageInfo.records[i].createTime = new Date(pageInfo.records[i].createTime).toLocaleString()
            pageInfo.records[i].updateTime = new Date(pageInfo.records[i].updateTime).toLocaleString()
          }

          dictionaryTypeList.value = pageInfo.records
        }
        loading.value = false
      })
}

const handleEdit = (row) => {
  dictionaryDetails.value = row
  dictionaryOldDetails.value = JSON.parse(JSON.stringify(row))
  let dictionaryTypeId = row.dictionaryTypeId

  queryDictionaryDataByTypeId(dictionaryTypeId)
      .then(res => {
        if (res.data.code === 200) {
          dictionaryDataList.value = res.data.data
          dictionaryDetailDialogVisible.value = true
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

const handleCloseEditDictionaryDialog = () => {
  dictionaryDetailDialogVisible.value = false
  dictionaryDetails.value = {}
}

const handleAddDictionaryData = () => {
  if (addDictionaryDataForm.value.label === '') {
    ElNotification({
      title: '提示',
      message: '字典数据标签不能为空',
      type: 'warning'
    })
    return
  }

  let formData = {
    label: addDictionaryDataForm.value.label,
    dictionaryTypeId: dictionaryDetails.value.dictionaryTypeId
  }
  addDictionaryData(formData)
      .then(res => {
        if (res.data.code === 200) {
          dictionaryDataList.value.push(res.data.data)
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
      })
  addDictionaryDataForm.value.label = ''
}

const handleDeleteDictionaryData = (row) => {
  deleteDictionaryData(row.dictionaryDataId)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          let index = dictionaryDataList.value.indexOf(row)
          dictionaryDataList.value.splice(index, 1)
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })

}

const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  loadDictionaryTypeList()
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  loadDictionaryTypeList()
}

onMounted(() => {
  loadDictionaryTypeList()
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
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 20px;
  margin-bottom: 20px;
}

.addDictionaryData .el-input {
  --el-input-width: 200px;
  margin-right: 10px;
}

</style>