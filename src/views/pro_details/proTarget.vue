<template>
  <div class="container">
    <div class="header">
      <div class="title">
        需求质量目标
      </div>
      <div class="addTest">
        <el-button type="primary" size="large" @click="openAddTargetDialog"><span
            style="font-size: 20px; margin-right: 5px;">+</span>新增需求目标
        </el-button>
      </div>
    </div>
    <div class="content">
      <div class="table">
        <el-table :data="tableData"
                  style="width: 100%"
                  size="large"
                  stripe
                  v-loading="loading"
                  empty-text="暂无数据"
        >
          <el-table-column prop="targetName" label="质量目标名称">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <font-awesome-icon style="color:#56abfb;" :icon="['fas', 'file-lines']"/>
                <span style="margin-left: 10px">{{ scope.row.targetName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="demandName" label="关联需求">
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button type="danger" text size="default" @click="handleDeleteDemandTarget(scope.row)">解除关联
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>

  <!--  新增需求目标dialog-->
  <el-dialog
      title="新增需求目标"
      v-model="addTargetDialogVisible"
      width="42%"
      center
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="100px" label-position="top">
      <el-form-item label="关联需求">
        <el-select size="large" v-model="form.demandId" placeholder="请选择关联需求" no-data-text="暂无需求">
          <el-option
              v-for="item in projectDemand"
              :key="item.demandId"
              :label="item.title"
              :value="item.demandId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="质量目标">
        <el-select size="large" v-model="form.qualityTargetId" placeholder="请选择质量目标" no-data-text="暂无质量目标">
          <el-option
              v-for="item in allTarget"
              :key="item.qualityTargetId"
              :label="item.targetName"
              :value="item.qualityTargetId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCloseAddTargetDialog" size="large" style="width: 90px;">取 消</el-button>
      <el-button type="primary" @click="submitForm" size="large" style="width: 90px;" :disabled="addTargetBtnDisable"
                 :loading="loadingAddTarget">
        提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {addDemandTarget, deleteDemandTarget, queryProTarget, queryTargetList} from "../../api/qualityTargetApi.ts";
import {queryDemandByProId} from "../../api/demandApi.ts";
import {message} from "ant-design-vue";

const proId = ref('')

const allTarget = ref([])
const projectDemand = ref([])

const tableData = ref([])
const loading = ref(false)

const addTargetDialogVisible = ref(false)
const form = ref({})
const addTargetBtnDisable = ref(false)
const loadingAddTarget = ref(false)

const loadProTarget = () => {
  loading.value = true
  queryProTarget(proId.value)
      .then(res => {
        if (res.data.code === 200) {
          tableData.value = res.data.data
        } else {
          tableData.value = []
        }
      })
      .finally(() => {
        loading.value = false
      })
}

const openAddTargetDialog = () => {
  addTargetDialogVisible.value = true
  getDemandListByProId()
}

const getDemandListByProId = () => {
  queryDemandByProId(proId.value)
      .then(res => {
        if (res.data.code === 2001) {
          projectDemand.value = res.data.data.allDemands
        } else {
          projectDemand.value = []
        }
      })
}

const loadAllTarget = () => {
  let params = {
    page: 1,
    size: 1000
  }

  queryTargetList(params, {})
      .then(res => {
        if (res.data.code === 200) {
          allTarget.value = res.data.data.records
        } else {
          allTarget.value = []
        }
      })
}

const submitForm = () => {
  addTargetBtnDisable.value = true
  loadingAddTarget.value = true
  addDemandTarget(form.value)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: '新增需求目标成功',
            type: 'success'
          })
          handleCloseAddTargetDialog()
          loadProTarget()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      .finally(() => {
        addTargetBtnDisable.value = false
        loadingAddTarget.value = false
      })
}

const handleCloseAddTargetDialog = () => {
  projectDemand.value = []
  form.value = {}
  addTargetDialogVisible.value = false
}

const handleDeleteDemandTarget = (row) => {

  console.log(row)
  ElMessageBox.confirm('确定要解除关联吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    message.loading("操作中...", 0)

    let data = {
      demandId: row.demandId,
      targetId: row.qualityTargetId
    }

    deleteDemandTarget(data)
        .then(res => {
          if (res.data.code === 200) {
            ElNotification({
              title: '成功',
              message: '解除关联成功',
              type: 'success'
            })
            loadProTarget()
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
  }).catch(() => {
    ElNotification({
      title: '提示',
      message: '取消解操作',
      type: 'info'
    })
  })
}

onMounted(() => {
  let currentProId = localStorage.getItem('proDetailId')
  if (currentProId) {
    proId.value = currentProId
    loadProTarget()
  }

  loadAllTarget()
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
  width: 650px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.test-plan-status {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 20px;
}

.table {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}

</style>