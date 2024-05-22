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
          <div class="test-plan-status">
            <el-button type="primary" size="large" round @click="changeStatus(0)">全部</el-button>
            <el-button type="danger" size="large" round @click="changeStatus(1)">未开始</el-button>
            <el-button type="warning" size="large" round @click="changeStatus(2)">进行中</el-button>
            <el-button type="success" size="large" round @click="changeStatus(3)">已完成</el-button>
          </div>
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

  <!--  编辑测试计划dialog-->
  <el-dialog
      v-model="openDialog"
      top="7vh"
      title="编辑测试计划"
      width="80vw"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="closeTestPlanDialog"
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
                <el-table-column prop="priorityLabel" label="优先级" sortable>
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
                <el-button type="primary" @click="submitAddTestCase" :disabled="addTestCaseBtnDisable"
                           :loading="loadingAddTestCase">
                  {{ addTestCaseBtnText }}
                </el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="测试报告" name="testReport">
              <el-upload
                  class="upload-report"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="handleUpload"
                  drag>
                <font-awesome-icon style="font-size: 50px;margin: 20px auto;" icon="fa-solid fa-cloud-arrow-up"/>
                <div class="el-upload__text">
                  将文件拖动到此或<em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip" style="font-size: 15px">
                    仅支持上传 <em>doc</em>、<em>docx</em>、<em>pdf</em> 格式文件
                  </div>
                </template>
              </el-upload>
              <div class="upload-progress">
                <el-progress v-if="uploadProgress > 0"
                             :percentage="uploadProgress"
                             :color="colors"
                             :stroke-width="15"
                             type="line"/>
              </div>
              <div class="test-report-card">
                <el-card v-if="testReport !== null" class="test-report">
                  <div class="test-report-top">
                    <div class="test-report-title">{{ testReport.testReportName }}</div>
                    <div class="approval">
                      <el-select v-model="testReport.approvalStatus" @change="updateTestReportApprovalStatus">
                        <el-option label="待审批" :value="0"/>
                        <el-option label="已通过" :value="1"/>
                        <el-option label="未通过" :value="2"/>
                      </el-select>
                    </div>
                  </div>
                  <div class="test-report-footer">
                    <el-button type="primary" text size="default" @click="downloadTestReport">下载</el-button>
                    <el-button type="danger" text size="default" @click="deleteTestReport">删除</el-button>
                  </div>
                </el-card>
                <el-empty description="暂未上传测试报告" v-else/>
              </div>
            </el-tab-pane>
            <el-tab-pane label="留言" name="message">
              <div style="height: 200px;display: flex; justify-content: center; align-items: center"
                   v-if="loadingMessage">
                <a-spin size="large"/>
              </div>
              <div v-else>
                <div class="post-comment-form"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: flex-end; flex-direction: column">
                  <a-textarea
                      :auto-size="{ minRows: 4, maxRows: 4 }"
                      placeholder="友善发言，文明评论~"
                      v-model:value="postComment.content"
                      id="postCommentInput"
                      @keydown.enter.native="submitComment"
                  />
                  <a-button style="margin: 10px 0" type="primary" @click="submitComment"
                            :disabled="postComment.content === ''">评论
                  </a-button>
                </div>
                <div v-if="firstLevelComment.length <= 0">
                  <a-empty description="暂无评论"/>
                </div>
                <div style="width: 100%" v-else>
                  <el-scrollbar max-height="38vh">
                    <a-comment v-for="(item,index) in firstLevelComment" :key="index"
                               v-if="firstLevelComment.length > 0">
                      <template #actions>
                        <span>{{ item.createTime }}</span>
                        <span @click="beforeReply(item)">回复</span>
                      </template>
                      <template #author>
                        <a style="font-size: 14px">{{ item.nickName }}</a>
                      </template>
                      <template #avatar>
                        <a-avatar :src="item.avatar" :alt="item.nickName"/>
                      </template>
                      <template #content>
                        <p>
                          {{ item.content }}
                        </p>
                      </template>
                      <div v-for="(r,i) in notFirstLevelComment" :key="i">
                        <a-comment v-if="r.toCommentId === item.commentId">
                          <template #actions>
                            <span>{{ r.createTime }}</span>
                            <span @click="beforeReply(r)">回复</span>
                          </template>
                          <template #author>
                            <a style="font-size: 14px">{{ r.nickName }}</a>
                            <span style="margin: 0 5px; font-size: 12px">回复了</span>
                            <a><span style="color: #16acff; font-size: 14px"> @{{ r.toUserNickName }}</span></a>
                          </template>
                          <template #avatar>
                            <a-avatar :src="r.avatar" :alt="r.nickName"/>
                          </template>
                          <template #content>
                            <p>
                              {{ r.content }}
                            </p>
                          </template>
                        </a-comment>
                      </div>
                    </a-comment>
                  </el-scrollbar>
                  <a-modal v-model:open="openRep" width="60%" :footer="null" :closable="false" z-index="9999">
                    <div class="rep-box">
                      <a-textarea
                          class="rep-con"
                          v-model:value="replyContent"
                          placeholder="友善发言，文明评论~"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                          id="repCommentInput"
                          @keydown.enter.native="replyComment"
                      />
                    </div>
                    <a-form-item>
                      <a-button style="float: right" type="primary" @click="replyComment()"
                                :disabled="replyContent === ''">回复
                      </a-button>
                    </a-form-item>
                  </a-modal>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-scrollbar style="width: 25%; padding-left: 20px; border-left: rgba(0,0,0,0.1) solid 1px">
          <el-form-item label="负责人" required v-loading="loadingTestMembers">
            <el-select v-model="echoTestPlan.head" placeholder="请选择负责人">
              <el-option
                  v-for="item in projectTestMember"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目">
            <el-input v-model="echoTestPlan.projectName" disabled></el-input>
          </el-form-item>
          <el-form-item label="关联需求">
            <el-input v-model="echoTestPlan.demandName" disabled></el-input>
          </el-form-item>
          <el-form-item label="计划周期" required>
            <el-date-picker
                style="width: 155px;"
                v-model="echoTestPlan.startTime"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择开始日期">
            </el-date-picker>
            <span style="margin: 0 18px">-</span>
            <el-date-picker
                style="width: 155px;"
                v-model="echoTestPlan.endTime"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="echoTestPlan.creatorName" disabled/>
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
            <el-button type="primary" @click="handleSubmitEditTestPlan" :disabled="editTestPlanBtnDisable"
                       :loading="loadingEditTestPlan">
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
      :close-on-press-escape="false"
      :close-on-click-modal="false">
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
        <el-select v-model="echoTestCase.priority" placeholder="请选择优先级" size="large">
          <el-option key="0" label="低" :value="0"/>
          <el-option key="1" label="中" :value="1"/>
          <el-option key="2" label="高" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="echoTestCase.status" placeholder="请选择状态" size="large">
          <el-option key="false" label="未完成" :value="false"/>
          <el-option key="true" label="已完成" :value="true"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editTestCaseDialogVisible = false" size="large" style="width: 90px;">取 消</el-button>
      <el-button type="primary" @click="submitEditTestCase" size="large" style="width: 90px;"
                 :disabled="editTestCaseBtnDisable" :loading="loadingEditTestCase">
        {{ editTestCaseBtnText }}
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
      <font-awesome-icon icon="fa-regular fa-circle-question" />
    </template>
    <template #tooltip>
      <div>Documents</div>
    </template>
  </a-float-button>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  addTestCase,
  addTestPlan,
  deleteTestCaseById, deleteTestReportById,
  queryTestCaseById,
  queryTestCaseByPlanId,
  queryTestPlanById,
  queryTestPlanList, queryTestReportByPlanId,
  updateTestCase,
  updateTestPlan, updateTestReportApprovalStatusById, uploadTestReport,
} from "../../api/TestPlanApi.ts";
import {getProListByStatus} from "../../api/allProApi.ts";
import {addComment, getCommentList, queryDemandByProId} from "../../api/demandApi.ts";
import {queryProjectTestMember} from "../../api/userApi.ts";
import {recordVisit} from "../../api/RecentVisitApi.ts";

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
const currentTestPlanStatus = ref(0)

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

//编辑测试计划
const openDialog = ref(false)
const editTestPlanBtnText = ref('确定')
const editTestPlanBtnDisable = ref(false)
const echoTestPlan = ref({})
const loadingEditTestPlan = ref(false)
const loadingTestMembers = ref(true)

//新增测试用例
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
const loadingAddTestCase = ref(false)

//编辑测试用例
const editTestCaseDialogVisible = ref(false)
const editTestCaseBtnText = ref('确定')
const editTestCaseBtnDisable = ref(false)
const echoTestCase = ref({})
const loadingEditTestCase = ref(false)

//测试报告
const testReport = ref(null)
const uploadProgress = ref(0)

//其他
const allProject = ref([])
const projectDemand = ref([])
const projectTestMember = ref([])
const userAvatar = ref('')

//留言
const loadingMessage = ref(true)
const firstLevelComment = ref([]);
const notFirstLevelComment = ref([]);
const postComment = ref({
  toCommentId: '',
  content: '',
  workItemId: '',
  userId: '',
  avatar: '',
  nickName: '',
  toUserId: '',
  toUserNickName: '',
})
const openRep = ref(false)
const replyContent = ref('')


const changeStatus = (status) => {
  currentTestPlanStatus.value = status
  loadTestPlanList()
}

const loadTestPlanList = () => {
  loading.value = true
  let queryCondition = {
    planName: searchContent.value
  }
  let formData = {
    page: tablePage.pageNum,
    size: tablePage.pageSize,
    status: currentTestPlanStatus.value
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
  loadTestPlanList()
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
        loadingAddTestPlan.value = false
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
        if (res.data.code === 2001) {

          projectDemand.value = res.data.data.allDemands
        }
      })
  getProjectTestMember(form.value.projectId)
}

const getProjectTestMember = (projectId) => {
  loadingTestMembers.value = true
  projectTestMember.value = []
  queryProjectTestMember(projectId)
      .then(res => {
        if (res.data.code === 200) {
          projectTestMember.value = res.data.data
          loadingTestMembers.value = false
        }
      })
}

const getTestPlanDetailById = (planId) => {
  queryTestPlanById(planId)
      .then(res => {
        if (res.data.code === 200) {
          echoTestPlan.value = res.data.data
          getTestCaseData()
          getProjectTestMember(echoTestPlan.value.projectId)
        }
      })
}

const rowClick = (row) => {
  openDialog.value = true
  getTestPlanDetailById(row.testPlanId)
  recordVisit(row.testPlanId, 3)
}

const submitAddTestCase = () => {
  addTestCaseBtnText.value = '提交中'
  addTestCaseBtnDisable.value = true
  loadingAddTestCase.value = true

  if (addTestCaseForm.value.caseName === '') {
    ElNotification({
      title: '提示',
      message: '请输入用例名称',
      type: 'warning'
    })
    addTestCaseBtnText.value = '提交'
    addTestCaseBtnDisable.value = false
    loadingAddTestCase.value = false
    return;
  }

  if (addTestCaseForm.value.caseContent === '') {
    ElNotification({
      title: '提示',
      message: '请输入用例描述',
      type: 'warning'
    })
    addTestCaseBtnText.value = '提交'
    addTestCaseBtnDisable.value = false
    loadingAddTestCase.value = false
    return;
  }

  if (addTestCaseForm.value.priority === '') {
    ElNotification({
      title: '提示',
      message: '请选择优先级',
      type: 'warning'
    })
    addTestCaseBtnText.value = '提交'
    addTestCaseBtnDisable.value = false
    loadingAddTestCase.value = false
    return;
  }

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
        }
        addTestCaseBtnText.value = '提交'
        addTestCaseBtnDisable.value = false
        loadingAddTestCase.value = false
      })
}

const getTestCaseData = () => {
  loadTestCase.value = true
  queryTestCaseByPlanId(echoTestPlan.value.testPlanId)
      .then(res => {
        if (res.data.code === 200) {
          testCaseTableData.value = res.data.data
          loadTestCase.value = false
        }
      })
}

const handleCloseEditTestPlan = () => {
  openDialog.value = false
  echoTestPlan.value = {}
  testCaseTableData.value = []
  activeName.value = 'caseList'
  testReport.value = null
  uploadProgress.value = 0
  postComment.value = {
    toCommentId: '',
    content: '',
    workItemId: '',
    userId: '',
    avatar: '',
    nickName: '',
    toUserId: '',
    toUserNickName: '',
  }
  replyContent.value = ''
}

const handleSubmitEditTestPlan = () => {
  editTestPlanBtnText.value = '提交中'
  editTestPlanBtnDisable.value = true
  loadingEditTestPlan.value = true

  if (echoTestPlan.value.planName === '') {
    ElNotification({
      title: '提示',
      message: '请输入测试计划名称',
      type: 'warning'
    })
    editTestPlanBtnText.value = '提交'
    editTestPlanBtnDisable.value = false
    loadingEditTestPlan.value = false
    return;
  }

  if (echoTestPlan.value.head === '') {
    ElNotification({
      title: '提示',
      message: '请选择负责人',
      type: 'warning'
    })
    editTestPlanBtnText.value = '提交'
    editTestPlanBtnDisable.value = false
    loadingEditTestPlan.value = false
    return;
  }

  if (echoTestPlan.value.startTime === '') {
    ElNotification({
      title: '提示',
      message: '请选择计划开始时间',
      type: 'warning'
    })
    editTestPlanBtnText.value = '提交'
    editTestPlanBtnDisable.value = false
    loadingEditTestPlan.value = false
    return;
  }

  if (echoTestPlan.value.endTime === '') {
    ElNotification({
      title: '提示',
      message: '请选择计划结束时间',
      type: 'warning'
    })
    editTestPlanBtnText.value = '提交'
    editTestPlanBtnDisable.value = false
    loadingEditTestPlan.value = false
    return;
  }

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
        loadingEditTestPlan.value = false
      })
}

const handleTabClick = (tab) => {
  if (tab.props.name === 'caseList') {
    getTestCaseData()
  } else if (tab.props.name === 'testReport') {
    queryTestReport()
  } else if (tab.props.name === 'message') {
    getComments(echoTestPlan.value.testPlanId)
  }
}

const editTestCase = (row) => {
  editTestCaseDialogVisible.value = true
  queryTestCaseById(row.testCaseId)
      .then(res => {
        if (res.data.code === 200) {
          echoTestCase.value = res.data.data
        }
      })
}

const deleteTestCase = (row) => {
  ElMessageBox.confirm('此操作将永久删除该测试用例, 是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteTestCaseById(row.testCaseId)
        .then(res => {
          if (res.data.code === 200) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            getTestCaseData()
          } else {
            ElNotification({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
        })
  }).catch(() => {
    ElNotification({
      title: '提示',
      message: '已取消删除',
      type: 'info'
    })
  })
}

const submitEditTestCase = () => {
  editTestCaseBtnText.value = '提交中'
  editTestCaseBtnDisable.value = true
  loadingEditTestCase.value = true

  if (echoTestCase.value.caseName === '') {
    ElNotification({
      title: '提示',
      message: '请输入用例名称',
      type: 'warning'
    })
    editTestCaseBtnText.value = '提交'
    editTestCaseBtnDisable.value = false
    loadingEditTestCase.value = false
    return;
  }

  if (echoTestCase.value.caseContent === '') {
    ElNotification({
      title: '提示',
      message: '请输入用例描述',
      type: 'warning'
    })
    editTestCaseBtnText.value = '提交'
    editTestCaseBtnDisable.value = false
    loadingEditTestCase.value = false
    return;
  }

  if (echoTestCase.value.priority === '') {
    ElNotification({
      title: '提示',
      message: '请选择优先级',
      type: 'warning'
    })
    editTestCaseBtnText.value = '提交'
    editTestCaseBtnDisable.value = false
    loadingEditTestCase.value = false
    return;
  }

  if (echoTestCase.value.status === '') {
    ElNotification({
      title: '提示',
      message: '请选择状态',
      type: 'warning'
    })
    editTestCaseBtnText.value = '提交'
    editTestCaseBtnDisable.value = false
    loadingEditTestCase.value = false
    return;
  }

  let formData = {
    testCaseId: echoTestCase.value.testCaseId,
    caseName: echoTestCase.value.caseName,
    caseContent: echoTestCase.value.caseContent,
    priority: echoTestCase.value.priority,
    status: echoTestCase.value.status,
    testPlanId: echoTestPlan.value.testPlanId
  }
  updateTestCase(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          editTestCaseDialogVisible.value = false
          getTestCaseData()
          getTestPlanDetailById(formData.testPlanId)
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
        editTestCaseBtnText.value = '提交'
        editTestCaseBtnDisable.value = false
        loadingEditTestCase.value = false
      })
}

const beforeUpload = (file) => {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElNotification({
      title: '警告',
      message: '上传文件大小不能超过 5MB!',
      type: 'warning'
    })
  }

  const isDoc = file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/pdf';
  if (!isDoc) {
    ElNotification({
      title: '警告',
      message: '上传文件只能是doc、docx、pdf格式!',
      type: 'warning'
    })
  }
  return isLt5M && isDoc;
}

const handleUpload = (file) => {
  uploadProgress.value = 0

  let formData = new FormData();
  formData.append('file', file.file);
  formData.append('testPlanId', echoTestPlan.value.testPlanId);

  const config = {
    onUploadProgress: (progressEvent) => {
      console.log(progressEvent.loaded * 100)
      console.log(progressEvent.total)
      uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    },
  };

  uploadTestReport(formData, config)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          queryTestReport()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })

}

const queryTestReport = () => {
  queryTestReportByPlanId(echoTestPlan.value.testPlanId)
      .then(res => {
        if (res.data.code === 200) {
          testReport.value = res.data.data
          testReport.value.oldStatus = res.data.data.approvalStatus
        } else {
          testReport.value = null
        }
      })
}

const deleteTestReport = () => {
  ElMessageBox.confirm('此操作将永久删除该测试报告, 是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteTestReportById(testReport.value.testReportId)
        .then(res => {
          if (res.data.code === 200) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            queryTestReport()
          } else {
            ElNotification({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
        })
  }).catch(() => {
    ElNotification({
      title: '提示',
      message: '已取消删除',
      type: 'info'
    })
  })
}

const downloadTestReport = () => {
  window.open(testReport.value.reportFile)
}

const updateTestReportApprovalStatus = () => {
  ElMessageBox.confirm('是否确认修改测试报告审批状态?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(() => {
        updateTestReportApprovalStatusById(testReport.value.testReportId, testReport.value.approvalStatus)
            .then(res => {
              if (res.data.code === 200) {
                ElNotification({
                  title: '成功',
                  message: res.data.message,
                  type: 'success'
                })
              } else {
                testReport.value.approvalStatus = testReport.value.oldStatus
                ElNotification({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
      })
      .catch(() => {
        testReport.value.approvalStatus = testReport.value.oldStatus
        ElNotification({
          title: '提示',
          message: '已取消修改',
          type: 'info'
        })
      })
}

const getUserAvatar = () => {
  let userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    userInfo = JSON.parse(userInfo)
    userAvatar.value = userInfo.avatar
  }
}

const getComments = (workItemId) => {
  loadingMessage.value = true
  getCommentList(workItemId)
      .then((res) => {
        if (res.data.code === 2001) {
          let comments = res.data.data

          for (let i = 0; i < comments.length; i++) {
            comments[i].createTime = comments[i].createTime.replace('T', ' ')
          }

          for (let i = 0; i < comments.length; i++) {
            let now = new Date().getTime()
            let createTime = new Date(comments[i].createTime).getTime()
            let diff = now - createTime
            if (diff < 86400000) {
              if (diff < 60000) {
                comments[i].createTime = '刚刚'
              } else if (diff < 3600000) {
                console.log(diff / 60000)
                comments[i].createTime = Math.floor(diff / 60000) + '分钟前'
              } else {
                comments[i].createTime = Math.floor(diff / 3600000) + '小时前'
              }
            }
          }

          firstLevelComment.value = comments.filter((item) => item.toCommentId === '0')
          notFirstLevelComment.value = comments.filter((item) => item.toCommentId !== '0')
          loadingMessage.value = false
        } else if (res.data.code === 2002) {
          firstLevelComment.value = []
          notFirstLevelComment.value = []
          loadingMessage.value = false
        }
      })
}

const submitComment = () => {
  if (postComment.value.content === '') {
    ElNotification({
      title: '提示',
      message: '评论内容不能为空',
      type: 'warning',
    })
    return;
  }

  let userInfo = JSON.parse(localStorage.getItem("userInfo"))

  postComment.value.workItemId = echoTestPlan.value.testPlanId;
  postComment.value.toCommentId = '0';
  postComment.value.toUserId = '0';
  postComment.value.toUserNickName = '';
  postComment.value.avatar = userInfo.avatar;
  postComment.value.nickName = userInfo.nickName;

  addComment(postComment.value).then((res) => {
    if (res.data.code === 3001) {
      postComment.value.content = '';
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
      getComments(echoTestPlan.value.testPlanId)
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })

}

const beforeReply = (comment) => {
  let userInfo = JSON.parse(localStorage.getItem("userInfo"))

  openRep.value = true;
  postComment.value.workItemId = echoTestPlan.value.testPlanId;
  if (comment.toCommentId === '0') {
    postComment.value.toCommentId = comment.commentId;
  } else {
    postComment.value.toCommentId = comment.toCommentId;
  }
  postComment.value.toUserId = comment.userId;
  postComment.value.toUserNickName = comment.userNickName;
  postComment.value.avatar = userInfo.avatar
  postComment.value.nickName = userInfo.nickName
}

const replyComment = () => {
  if (replyContent.value === '') {
    ElNotification({
      title: '提示',
      message: '评论内容不能为空',
      type: 'warning'
    })
    return;
  }
  postComment.value.content = replyContent.value;

  addComment(postComment.value).then((res) => {
    if (res.data.code === 3001) {
      postComment.value.content = '';
      replyContent.value = '';
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
      openRep.value = false;
      getComments(echoTestPlan.value.testPlanId)
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}

const isFromRecentVisit = () => {
  let recent = localStorage.getItem("recentVisit");
  if (recent) {
    let row = {
      testPlanId: recent
    }
    rowClick(row)
    localStorage.removeItem("recentVisit")
  }
}

const closeTestPlanDialog = () => {
  loadTestPlanList()
}

onMounted(() => {
  loadTestPlanList()
  getProjectListByStatus()
  getUserAvatar()
  isFromRecentVisit()
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