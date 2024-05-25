<template>
  <div class="user-query-container">
    <div class="user-query-form-container">
      <el-form class="form-inline" size="default" :inline="true" :model="form">
        <el-form-item label="目标名称">
          <el-input v-model="form.targetName" placeholder="请输入目标名称" clearable/>
        </el-form-item>
        <el-form-item label="质量特性">
          <el-select v-model="form.qualityAttribute" placeholder="请选择质量特性" clearable>
            <el-option v-for="item in qualityAttributeList"
                       :key="item.dictionaryDataId"
                       :label="item.label"
                       :value="item.dictionaryDataId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="form.priority" placeholder="请选择优先级" clearable>
            <el-option label="低" value="0"/>
            <el-option label="中" value="1"/>
            <el-option label="高" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadTargetList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addTargetDialog = true" size="large">新增目标</el-button>
    </div>
    <div class="user-list-table">
      <el-table
          :data="targetList"
          :row-key="row => row.no"
          style="width: 100%"
          stripe
          v-loading="loadingTable"
          empty-text="暂无数据"
      >
        <el-table-column
            prop="no"
            label="序号"
            width="120"
        >
        </el-table-column>
        <el-table-column
            prop="targetName"
            label="目标名称"
            :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
            prop="qualityAttribute"
            label="质量特性"
            width="150"
        >
        </el-table-column>
        <el-table-column
            prop="targetValue"
            label="目标预期"
            :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
            prop="priority"
            label="优先级"
            width="150"
        >
        </el-table-column>
        <el-table-column
            prop="metric"
            label="度量指标"
        >
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
                size="large"
                @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
                type="danger"
                text
                size="large"
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
      title="目标详情"
      v-model="targetDetailDialog"
      width="50%"
      :show-close="false"
  >
    <el-form label-position="top" label-width="100px" :model="targetDetail">
      <el-form-item label="目标名称">
        <el-input v-model="targetDetail.targetName"
                  :disabled="targetDetail.qualityTargetId === '1' || targetDetail.qualityTargetId === '2'"
                  size="large"/>
      </el-form-item>
      <el-form-item label="质量特性">
        <el-select v-model="targetDetail.qualityAttribute" size="large"
                   :disabled="targetDetail.qualityTargetId === '1' || targetDetail.qualityTargetId === '2'">
          <el-option v-for="item in qualityAttributeList"
                     :key="item.dictionaryDataId"
                     :label="item.label"
                     :value="item.dictionaryDataId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="目标预期">
        <el-input v-model="targetDetail.targetValue" size="large"
                  :disabled="targetDetail.qualityTargetId === '1' || targetDetail.qualityTargetId === '2'"/>
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="targetDetail.priority" size="large"
                   :disabled="targetDetail.qualityTargetId === '1' || targetDetail.qualityTargetId === '2'">
          <el-option label="低" :value="0"/>
          <el-option label="中" :value="1"/>
          <el-option label="高" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="度量指标">
        <el-input v-model="targetDetail.metric" size="large"
                  :disabled="targetDetail.qualityTargetId === '1' || targetDetail.qualityTargetId === '2'"/>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="targetDetail.createName" disabled size="large"/>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="targetDetail.createTime" disabled size="large"/>
      </el-form-item>
      <div class="footer">
        <el-button @click="handleCloseEditTargetDetailDialog" size="large">取消</el-button>
        <el-button type="primary" @click="handleSubmitEditTargetDetailDialog" size="large">确定</el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
      title="新增目标"
      v-model="addTargetDialog"
      width="50%"
      :show-close="false"
  >
    <el-form label-position="top" label-width="100px" :model="addTargetForm">
      <el-form-item label="目标名称">
        <el-input v-model="addTargetForm.targetName" size="large" placeholder="请输入目标名称"/>
      </el-form-item>
      <el-form-item label="质量特性">
        <el-select v-model="addTargetForm.qualityAttribute" size="large" placeholder="请选择质量特性">
          <el-option v-for="item in qualityAttributeList"
                     :key="item.dictionaryDataId"
                     :label="item.label"
                     :value="item.dictionaryDataId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="目标预期">
        <el-input v-model="addTargetForm.targetValue" size="large" placeholder="请输入目标预期"/>
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="addTargetForm.priority" size="large" placeholder="请选择优先级">
          <el-option label="低" :value="0"/>
          <el-option label="中" :value="1"/>
          <el-option label="高" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="度量指标">
        <el-input v-model="addTargetForm.metric" size="large" placeholder="请输入度量指标"/>
      </el-form-item>
      <div class="footer">
        <el-button @click="handleCloseAddTargetDialog" size="large">取消</el-button>
        <el-button type="primary" @click="handleSubmitAddTargetDialog" size="large">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {addTarget, deleteTarget, queryTarget, queryTargetList, updateTarget} from "../../api/qualityTargetApi.ts";
import {queryDictionaryDataByTypeId} from "../../api/dictionaryApi.ts";
import {message} from 'ant-design-vue';

const targetList = ref([])
const loadingTable = ref(false)
const qualityAttributeList = ref([])

const targetDetailDialog = ref(false)
const targetDetail = ref({})

const addTargetDialog = ref(false)
const addTargetForm = ref({
  targetName: '',
  qualityAttribute: null,
  targetValue: '',
  priority: null,
  metric: ''
})

const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const pageSizes = [10, 15, 30, 50, 100]

const form = ref({
  targetName: '',
  qualityAttribute: null,
  priority: null,
})

const loadTargetList = () => {
  loadingTable.value = true
  let params = {
    page: tablePage.pageNum,
    size: tablePage.pageSize
  }

  let condition = {
    targetName: form.value.targetName,
    qualityAttribute: form.value.qualityAttribute,
    priority: form.value.priority
  }

  queryTargetList(params, condition)
      .then(res => {
        if (res.data.code === 200) {
          let pageInfo = res.data.data
          tablePage.total = parseInt(pageInfo.total)

          for (let i = 0; i < pageInfo.records.length; i++) {
            pageInfo.records[i].no = (tablePage.pageNum - 1) * tablePage.pageSize + i + 1
            pageInfo.records[i].createTime = pageInfo.records[i].createTime.replace('T', ' ')

            if (pageInfo.records[i].priority === 0) {
              pageInfo.records[i].priority = '低'
            } else if (pageInfo.records[i].priority === 1) {
              pageInfo.records[i].priority = '中'
            } else if (pageInfo.records[i].priority === 2) {
              pageInfo.records[i].priority = '高'
            }

            for (let j = 0; j < qualityAttributeList.value.length; j++) {
              if (pageInfo.records[i].qualityAttribute === qualityAttributeList.value[j].dictionaryDataId) {
                pageInfo.records[i].qualityAttribute = qualityAttributeList.value[j].label
                break
              }
            }
          }

          targetList.value = pageInfo.records
        } else {
          targetList.value = []
        }
      })
      .finally(() => {
        loadingTable.value = false
      })
}

const handleEdit = (row) => {
  message.loading('加载中...', 0);
  queryTarget(row.qualityTargetId)
      .then(res => {
        if (res.data.code === 200) {
          targetDetail.value = res.data.data
          targetDetail.value.createTime = targetDetail.value.createTime.replace('T', ' ')
          targetDetailDialog.value = true
        }
      })
      .finally(() => {
        message.destroy()
      })
}

const handleCloseEditTargetDetailDialog = () => {
  targetDetailDialog.value = false
  targetDetail.value = {}
}

const handleSubmitEditTargetDetailDialog = () => {
  let formData = {
    qualityTargetId: targetDetail.value.qualityTargetId,
    targetName: targetDetail.value.targetName,
    qualityAttribute: targetDetail.value.qualityAttribute,
    targetValue: targetDetail.value.targetValue,
    priority: targetDetail.value.priority,
    metric: targetDetail.value.metric
  }
  updateTarget(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          targetDetailDialog.value = false
          loadTargetList()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

const handleCloseAddTargetDialog = () => {
  addTargetDialog.value = false
  addTargetForm.value = {
    targetName: '',
    qualityAttribute: null,
    targetValue: '',
    priority: null,
    metric: ''
  }
}

const handleSubmitAddTargetDialog = () => {
  let formData = {
    targetName: addTargetForm.value.targetName,
    qualityAttribute: addTargetForm.value.qualityAttribute,
    targetValue: addTargetForm.value.targetValue,
    priority: addTargetForm.value.priority,
    metric: addTargetForm.value.metric
  }
  addTarget(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          addTargetDialog.value = false
          loadTargetList()
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
  ElMessageBox.confirm('此操作将永久删除该质量目标，是否继续？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(() => {
        message.loading('删除中...', 0)
        let ids = [row.qualityTargetId]
        deleteTarget(ids)
            .then(res => {
              if (res.data.code === 200) {
                ElNotification({
                  title: '成功',
                  message: res.data.message,
                  type: 'success'
                })
                loadTargetList()
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
          message: '已取消删除操作',
          type: 'info'
        })
      })

}

const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  loadTargetList()
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  loadTargetList()
}

const queryTargetAttribute = () => {
  let typeId = '1787300872371118082'
  queryDictionaryDataByTypeId(typeId)
      .then(res => {
        if (res.data.code === 200) {
          qualityAttributeList.value = res.data.data
          loadTargetList()
        }
      })
}

onMounted(() => {
  queryTargetAttribute()
})
</script>

<style scoped>
.user-query-container {
  padding: 10px 20px 0 20px;
}

.user-query-form-container {
  display: flex;
  justify-content: space-between;
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

.footer {
  display: flex;
  justify-content: flex-end;
}
</style>