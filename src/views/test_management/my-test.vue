<template>
  <div class="container">
    <div class="header">
      <div class="title">
        我负责的
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
        </div>
        <div class="total">
          共有<span>{{ tablePage.total }}</span>个测试
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData"
                  style="width: 100%"
                  size="large"
                  stripe
                  v-loading="loading"
                  @row-click="rowClick"
        >
          <el-table-column prop="planName" label="测试计划名称">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <font-awesome-icon style="color:#56abfb;" :icon="['fas', 'file-lines']"/>
                <span style="margin-left: 10px">{{ scope.row.planName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="scope">
              <el-tag v-if="scope.row.progress>0 && scope.row.progress < 100" type="warning" size="large" round
                      effect="dark">进行中
              </el-tag>
              <el-tag v-else-if="scope.row.progress === 100" type="success" size="large" round effect="dark">已完成
              </el-tag>
              <el-tag v-else-if="scope.row.progress === 0" type="danger" size="large" round effect="dark">未开始
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="headName" label="负责人">
          </el-table-column>
          <el-table-column prop="progress" label="计划进度">
            <template #default="scope">
              <el-progress
                  :percentage="scope.row.progress"
                  status="success"
                  :text-inside="true"
                  :stroke-width="24"
                  :color="colors"/>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="计划开始时间" align="center">
          </el-table-column>
          <el-table-column prop="endTime" label="计划结束时间" align="center">
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
      <el-button type="primary" @click="submitForm" size="large" style="width: 90px;" :disabled="addTestPlanBtnDisable">
        {{ addTestPlanBtnText }}
      </el-button>
    </div>
  </el-dialog>

  <!--  编辑测试计划dialog-->
  <el-dialog
      v-model="openDialog"
      title="编辑测试计划"
      width="80vw"
      :show-close="false"
  >
    <el-form
        :model="echoTestPlan"
        label-width="auto"
        label-position="top"
        require-asterisk-position="right"
        size="large">
      <div style="width: 100%; height: 70vh; margin: 0 auto; display: flex; justify-content: space-between">
        <div style="width: 73%;">
          <el-form-item label="标题" required>
            <el-input v-model="echoTestPlan.planName" placeholder="请输入需求标题" clearable></el-input>
          </el-form-item>
          <el-tabs type="border-card" @tab-click="handleTabClick" v-model="activeName">
            <el-tab-pane label="测试用例" name="caseList">
              <el-table :data="testCaseTableData"
                        style="width: 100%;"
                        size="large"
                        v-loading="loadTestCase"
                        max-height="535px"
                        stripe>
                <el-table-column prop="caseName" label="用例名称"/>
                <el-table-column prop="priority" label="优先级" sortable>
                  <template #default="scope">
                    <el-tag v-if="scope.row.priority === 0" type="info">低</el-tag>
                    <el-tag v-else-if="scope.row.priority === 1" type="warning">中</el-tag>
                    <el-tag v-else-if="scope.row.priority === 2" type="danger">高</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" sortable>
                  <template #default="scope">
                    <el-tag v-if="scope.row.status === false" type="info">未完成</el-tag>
                    <el-tag v-else-if="scope.row.status === true" type="success">已完成</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button type="primary" text size="large" @click="editTestCase(scope.row)">编辑</el-button>
                    <el-button type="danger" text size="large" @click="deleteTestCase(scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="添加测试用例" name="addCase">
              <el-form v-model="addTestCaseForm" label-width="100px" label-position="top" style="max-height: 704px">
                <el-form-item label="用例名称" required>
                  <el-input v-model="addTestCaseForm.caseName" placeholder="请输入用例名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="用例描述" required>
                  <el-input v-model="addTestCaseForm.caseContent" placeholder="请输入用例描述" type="textarea"
                            :rows="12" resize="none" clearable></el-input>
                </el-form-item>
                <el-form-item label="优先级" required>
                  <el-select v-model="addTestCaseForm.priority" placeholder="请选择优先级" clearable>
                    <el-option label="低" value="0"></el-option>
                    <el-option label="中" value="1"></el-option>
                    <el-option label="高" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="add-test-case-footer">
                <el-button type="primary" @click="submitAddTestCase" :disabled="addTestCaseBtnDisable">
                  {{ addTestCaseBtnText }}
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-scrollbar style="width: 25%; padding-left: 20px; border-left: rgba(0,0,0,0.1) solid 1px">
          <el-form-item label="负责人" required>
            <el-select v-model="echoTestPlan.head" placeholder="请选择负责人" clearable>
              <el-option
                  v-for="item in projectTestMember"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="关联项目">
            <el-input v-model="echoTestPlan.projectName" disabled></el-input>
          </el-form-item>
          <el-form-item label="关联需求">
            <el-input v-model="echoTestPlan.demandName" disabled></el-input>
          </el-form-item>
          <el-form-item label="开始日期" required>
            <el-date-picker
                v-model="echoTestPlan.startTime"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" required>
            <el-date-picker
                v-model="echoTestPlan.endTime"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择结束日期">
            </el-date-picker>
          </el-form-item>
          <el-progress
              style="margin-top: 10px"
              :percentage="echoTestPlan.progress"
              :color="colors"
              stroke-width="15"
              type="circle">
            <template #default="{ percentage }">
              <span class="percentage-value">{{ percentage }}%</span>
              <span class="percentage-label">测试进度</span>
            </template>
          </el-progress>
          <div class="dialog-footer">
            <el-button @click="handleCloseEditTestPlan">取消</el-button>
            <el-button type="primary" @click="handleSubmitEditTestPlan" :disabled="editTestPlanBtnDisable">
              {{ editTestPlanBtnText }}
            </el-button>
          </div>
        </el-scrollbar>
      </div>
    </el-form>
  </el-dialog>

<!--  编辑测试用例dialog-->
  <el-dialog
      v-model="editTestCaseDialogVisible"
      title="编辑测试用例"
      width="40%"
      center
      :show-close="false"
  >
    <el-form :model="echoTestCase" label-width="100px" label-position="top">
      <el-form-item label="用例名称">
        <el-input v-model="echoTestCase.caseName"
                  placeholder="请输入用例名称"
                  type="text"
                  clearable
                  size="large"/>
      </el-form-item>
      <el-form-item label="用例描述">
        <el-input v-model="echoTestCase.caseContent"
                  placeholder="请输入用例描述"
                  type="textarea"
                  :rows="12"
                  resize="none"
                  clearable/>
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="echoTestCase.priority" placeholder="请选择优先级" clearable size="large">
          <el-option label="低" value="0"></el-option>
          <el-option label="中" value="1"></el-option>
          <el-option label="高" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="echoTestCase.status" placeholder="请选择状态" clearable size="large">
          <el-option label="未完成" value="0"></el-option>
          <el-option label="已完成" value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editTestCaseDialogVisible = false" size="large" style="width: 90px;">取 消</el-button>
      <el-button type="primary" @click="submitEditTestCase" size="large" style="width: 90px;"
                 :disabled="editTestCaseBtnDisable">
        {{ editTestCaseBtnText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  addTestCase,
  addTestPlan,
  queryTestCaseByPlanId,
  queryTestPlanById,
  queryTestPlanList, updateTestPlan
} from "../../api/TestPlanApi.ts";
import {getProListByStatus} from "../../api/allProApi.ts";
import {queryDemandByProId} from "../../api/demandApi.ts";
import {queryProjectTestMember} from "../../api/userApi.ts";

const colors = [
  {color: '#f56c6c', percentage: 25},
  {color: '#ff9400', percentage: 50},
  {color: '#ffb310', percentage: 75},
  {color: '#67c23a', percentage: 100},
]
const tablePage = {
  pageNum: 1,
  pageSize: 10,
  total: 0
}
const pageSizes = [10, 15, 30, 50, 100]

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

//编辑需求
const openDialog = ref(false)
const editTestPlanBtnText = ref('提交')
const editTestPlanBtnDisable = ref(false)
const echoTestPlan = ref({})

//测试用例
const loadTestCase = ref(true)
const activeName = ref('caseList')
const testCaseTableData = ref([])
const addTestCaseForm = ref({
  caseName: '',
  caseContent: '',
  priority: ''
})
const addTestCaseBtnText = ref('提交')
const addTestCaseBtnDisable = ref(false)

//编辑测试用例
const editTestCaseDialogVisible = ref(false)
const editTestCaseBtnText = ref('提交')
const editTestCaseBtnDisable = ref(false)
const echoTestCase = ref({})

//其他
const allProject = ref([])
const projectDemand = ref([])
const projectTestMember = ref([])

const loadTestPlanList = () => {
  loading.value = true

  let queryCondition = {
    planName: searchContent.value
  }
  let formData = {
    page: tablePage.pageNum,
    size: tablePage.pageSize
  }
  queryTestPlanList(formData, queryCondition, 1)
      .then(res => {
        if (res.data.code === 200) {
          let pageInfo = res.data.data;
          tablePage.total = parseInt(pageInfo.total)

          for (let i = 0; i < pageInfo.records.length; i++) {
            if (pageInfo.records[i].startTime) {
              pageInfo.records[i].startTime = pageInfo.records[i].startTime.split('T')[0]
            }
            if (pageInfo.records[i].endTime) {
              pageInfo.records[i].endTime = pageInfo.records[i].endTime.split('T')[0]
            }
          }

          tableData.value = pageInfo.records
        }
      })
      .finally(() => {
        loading.value = false
      })
}

const search = () => {
  tablePage.pageNum = 1
  loadTestPlanList()
}

const openAddTestPlanDialog = () => {
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
  addTestPlanBtnText.value = '提交中...'
  addTestPlanBtnDisable.value = true

  if (form.value.planName === '') {
    ElNotification({
      title: '提示',
      message: '请输入测试计划名称',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
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
          loadTestPlanList()
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
      })
}

const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  loadTestPlanList()
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  loadTestPlanList()
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
        if (res.data.code === 200) {
          projectDemand.value = res.data.data
        }
      })
  getProjectTestMember(form.value.projectId)
}

const getProjectTestMember = (projectId) => {
  queryProjectTestMember(projectId)
      .then(res => {
        if (res.data.code === 200) {
          projectTestMember.value = res.data.data
        }
      })
}

const getTestPlanDetailById = (planId) => {
  queryTestPlanById(planId)
      .then(res => {
        if (res.data.code === 200) {
          echoTestPlan.value = res.data.data
          getTestPlanData()
        }
      })
}

const rowClick = (row) => {
  openDialog.value = true
  getProjectTestMember(row.projectId)
  getTestPlanDetailById(row.testPlanId)
}

const submitAddTestCase = () => {
  addTestCaseBtnText.value = '提交中...'
  addTestCaseBtnDisable.value = true
  let formData = {
    caseName: addTestCaseForm.value.caseName,
    caseContent: addTestCaseForm.value.caseContent,
    priority: addTestCaseForm.value.priority,
    testPlanId: echoTestPlan.value.testPlanId
  }
  addTestCase(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          addTestCaseBtnText.value = '提交'
          addTestCaseBtnDisable.value = false
          addTestCaseForm.value = {
            caseName: '',
            caseContent: '',
            priority: ''
          }
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
          addTestCaseBtnText.value = '提交'
          addTestCaseBtnDisable.value = false
        }
      })
}

const getTestPlanData = () => {
  loadTestCase.value = true
  queryTestCaseByPlanId(echoTestPlan.value.testPlanId)
      .then(res => {
        if (res.data.code === 200) {
          testCaseTableData.value = res.data.data
          loadTestCase.value = false
        }
      })
}

const handleTabClick = (tab) => {
  if (tab.props.name === 'caseList') {
    getTestPlanData()
  }
}

const handleCloseEditTestPlan = () => {
  openDialog.value = false
  echoTestPlan.value = {}
  testCaseTableData.value = []
}

const handleSubmitEditTestPlan = () => {
  editTestPlanBtnText.value = '提交中...'
  editTestPlanBtnDisable.value = true
  let fromData = {
    testPlanId: echoTestPlan.value.testPlanId,
    planName: echoTestPlan.value.planName,
    head: echoTestPlan.value.head,
    startTime: echoTestPlan.value.startTime.replace('T', ' '),
    endTime: echoTestPlan.value.endTime.replace('T', ' ')
  }
  updateTestPlan(fromData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          handleCloseEditTestPlan()
          loadTestPlanList()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
        editTestPlanBtnText.value = '提交'
        editTestPlanBtnDisable.value = false
      })
}

const editTestCase = (row) => {
  editTestCaseDialogVisible.value = true
  echoTestCase.value = row
}

const deleteTestCase = (row) => {
  ElMessageBox.confirm('此操作将永久删除该测试用例, 是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('删除')
  }).catch(() => {
    console.log('取消')
  })
}

onMounted(() => {
  loadTestPlanList()
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
  width: 300px;
  height: 40px;
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
</style>