<template>
  <div class="container">
    <div class="header">
      <div class="title">
        我提交的
      </div>
      <div class="addTest">
        <el-button type="primary" size="large" @click="openAddTestPlanDialog"><span
            style="font-size: 20px; margin-right: 5px;">+</span>新建测试
        </el-button>
      </div>
    </div>
    <div class="content">
      <div class="top">
        <div class="search">
          <el-input placeholder="请输入测试计划名称"
                    v-model="searchContent"
                    size="large"
                    @keydown.enter="search"
                    clearable>
            <template #prefix>
              <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>
            </template>
          </el-input>
          <div class="test-plan-status">
            <el-button type="primary" size="large" round @click="changeStatus(3)">全部</el-button>
            <el-button type="danger" size="large" round @click="changeStatus(2)">未通过</el-button>
            <el-button type="warning" size="large" round @click="changeStatus(0)">审核中</el-button>
            <el-button type="success" size="large" round @click="changeStatus(1)">已通过</el-button>
          </div>
        </div>
        <div class="total">
          共有<span>{{ tablePage.total }}</span>条提交
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
          <el-table-column prop="planName" label="测试计划名称">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <font-awesome-icon style="color:#56abfb;" :icon="['fas', 'file-lines']"/>
                <span style="margin-left: 10px">{{ scope.row.planName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="headName" label="负责人">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <a-avatar :src="scope.row.headAvatar" :alt="scope.row.headName"/>
                <span style="margin-left: 10px">{{ scope.row.headName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="projectName"
              label="关联项目"
          >
          </el-table-column>
          <el-table-column
              prop="demandName"
              label="关联需求"
          >
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" align="center">
          </el-table-column>
          <el-table-column prop="reviewStatus" label="审核结果" align="center">
            <template #default="scope">
              <el-tag size="large" round effect="dark" v-if="scope.row.reviewStatus === 0" type="warning">审核中</el-tag>
              <el-tag size="large" round effect="dark" v-if="scope.row.reviewStatus === 1" type="success">已通过</el-tag>
              <el-tag size="large" round effect="dark" v-if="scope.row.reviewStatus === 2" type="danger">未通过</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
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

  <!--  新增测试计划dialog-->
  <el-dialog
      title="新建测试计划"
      v-model="addTestPlanDialogVisible"
      width="42%"
      center
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="100px" label-position="top">
      <el-form-item label="测试计划名称">
        <el-input v-model="form.planName"
                  placeholder="请输入测试计划名称"
                  maxlength="255"
                  show-word-limit
                  type="text"
                  clearable
                  size="large"/>
      </el-form-item>
      <el-form-item label="关联项目">
        <el-select size="large" v-model="form.projectId" placeholder="请选择关联项目" @change="getDemandListByProId"
                   no-data-text="暂无项目">
          <el-option
              v-for="item in allProject"
              :key="item.proId"
              :label="item.proName"
              :value="item.proId"
          />
        </el-select>
      </el-form-item>
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
      <el-form-item label="负责人">
        <el-select size="large" v-model="form.head" placeholder="请选择负责人" no-data-text="暂无成员">
          <el-option
              v-for="item in projectTestMember"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划周期">
        <el-date-picker
            v-model="form.startTime"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择开始日期">
        </el-date-picker>
        <span style="margin: 0 15px">-</span>
        <el-date-picker
            v-model="form.endTime"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCloseAddTestPlanDialog" size="large" style="width: 90px;">取 消</el-button>
      <el-button type="primary" @click="submitForm" size="large" style="width: 90px;" :disabled="addTestPlanBtnDisable"
                 :loading="loadingAddTestPlan">
        {{ addTestPlanBtnText }}
      </el-button>
    </div>
  </el-dialog>

  <a-float-button
      type="default"
      :style="{
      right: '40px',
    }"
  >
    <template #icon>
      <font-awesome-icon icon="fa-regular fa-circle-question"/>
    </template>
    <template #tooltip>
      <div>测试报告只能由该测试计划的创建人审核</div>
    </template>
  </a-float-button>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {addTestPlan, listMySubmit} from "../../api/TestPlanApi.ts";
import {getProListByStatus} from "../../api/allProApi.ts";
import {queryDemandByProId} from "../../api/demandApi.ts";
import {queryProjectTestMember} from "../../api/userApi.ts";

const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const pageSizes = [10, 15, 30, 50, 100]
const currentTestPlanStatus = ref(3)

//新增测试计划
const loading = ref(true)
const searchContent = ref('')
const tableData = ref([])
const addTestPlanBtnText = ref('提交')
const addTestPlanBtnDisable = ref(false)
const addTestPlanDialogVisible = ref(false)
const form = ref({
  planName: '',
  projectId: '',
  demandId: '',
  head: '',
  startTime: '',
  endTime: '',
})
const loadingAddTestPlan = ref(false)

//其他
const allProject = ref([])
const projectDemand = ref([])
const projectTestMember = ref([])

const changeStatus = (status) => {
  currentTestPlanStatus.value = status
  loadMySubmitTestPlanList()
}

const loadMySubmitTestPlanList = () => {
  loading.value = true
  let queryCondition = {
    planName: searchContent.value
  }
  let formData = {
    page: tablePage.pageNum,
    size: tablePage.pageSize,
    reviewStatus: currentTestPlanStatus.value
  }
  listMySubmit(formData, queryCondition)
      .then(res => {
        if (res.data.code === 200) {
          let pageInfo = res.data.data;
          tablePage.total = parseInt(pageInfo.total)

          for (let i = 0; i < pageInfo.records.length; i++) {
            pageInfo.records[i].createTime = pageInfo.records[i].createTime.replace('T',' ')
          }
          tableData.value = pageInfo.records
        } else {
          tableData.value = []
        }
      })
      .finally(() => {
        loading.value = false
      })
}

const search = () => {
  tablePage.pageNum = 1
  loadMySubmitTestPlanList()
}

const openAddTestPlanDialog = () => {
  form.value.projectId = ''
  projectDemand.value = []
  projectTestMember.value = []
  addTestPlanDialogVisible.value = true
}

const handleCloseAddTestPlanDialog = () => {
  form.value = {
    planName: '',
    projectId: '',
    demandId: '',
    head: '',
    startTime: '',
    endTime: '',
  }
  addTestPlanDialogVisible.value = false
}

const submitForm = () => {
  addTestPlanBtnText.value = '提交中'
  addTestPlanBtnDisable.value = true
  loadingAddTestPlan.value = true

  if (form.value.planName === '') {
    ElNotification({
      title: '提示',
      message: '请输入测试计划名称',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.projectId === '') {
    ElNotification({
      title: '提示',
      message: '请选择关联项目',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.demandId === '') {
    ElNotification({
      title: '提示',
      message: '请选择关联需求',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.head === '') {
    ElNotification({
      title: '提示',
      message: '请选择负责人',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.startTime === '') {
    ElNotification({
      title: '提示',
      message: '请选择计划开始时间',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.endTime === '') {
    ElNotification({
      title: '提示',
      message: '请选择计划结束时间',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  let formData = {
    planName: form.value.planName,
    projectId: form.value.projectId,
    demandId: form.value.demandId,
    head: form.value.head,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
  }

  addTestPlan(formData)
      .then(res => {
        if (res.data.code === 200) {
          handleCloseAddTestPlanDialog()
          loadMySubmitTestPlanList()
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
        addTestPlanBtnText.value = '提交'
        addTestPlanBtnDisable.value = false
        loadingAddTestPlan.value = false
      })
}

const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  loadMySubmitTestPlanList()
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  loadMySubmitTestPlanList()
}

const getProjectListByStatus = () => {
  getProListByStatus(0)
      .then(res => {
        if (res.data.code === 200) {
          allProject.value = res.data.data
        }
      })
}

const getDemandListByProId = () => {
  queryDemandByProId(form.value.projectId)
      .then(res => {
        if (res.data.code === 2001) {
          projectDemand.value = res.data.data.allDemands
        }
      })
  getProjectTestMember(form.value.projectId)
}

const getProjectTestMember = (projectId) => {
  projectTestMember.value = []
  queryProjectTestMember(projectId)
      .then(res => {
        if (res.data.code === 200) {
          projectTestMember.value = res.data.data
        }
      })
}

onMounted(() => {
  loadMySubmitTestPlanList()
  getProjectListByStatus()
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

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 43px;
}

.add-test-case-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}

.test-report-card {
  margin-top: 20px;
}

.test-report-top {
  display: flex;
  justify-content: space-between;
}

.test-report-title {
  font-size: 18px;
  font-weight: bold;
}

.approval {
  width: 110px;
}

.test-report-footer {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
}

.post-comment-form {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end
}
</style>