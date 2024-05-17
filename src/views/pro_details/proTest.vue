<template>
  <div class="container">
    <div class="header">
      <div class="title">
        项目测试计划
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
      <el-button type="primary" @click="submitForm" size="large" style="width: 90px;" :disabled="addTestPlanBtnDisable"
                 :loading="loadingAddTestPlan">
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
              <div v-if="firstLevelComment.length <= 0">
                <a-empty description="暂无评论"/>
              </div>
              <div style="width: 90%" v-else>
                <a-comment v-for="(item,index) in firstLevelComment" :key="index" v-if="firstLevelComment.length > 0">
                  <template #actions>
                    <span @click="beforeReply(item)">回复</span>
                  </template>
                  <template #author>
                    <a>{{ item.nickName }}</a>
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
              <div style="width: 55vw; position: fixed; bottom: 10vh">
                <div class="post-comment-form"
                     style="width: 100%; display: flex; justify-content: space-between; align-items: flex-end">
                  <a-textarea
                      :auto-size="{ minRows: 3, maxRows: 6 }"
                      placeholder="友善发言，文明评论~"
                      v-model:value="postComment.content"
                      id="postCommentInput"
                      @keydown.enter.native="submitComment"
                  />

                  <a-button style="margin-left: 30px" type="primary" @click="submitComment"
                            :disabled="postComment.content === ''">评论
                  </a-button>
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
      :show-close="false">
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
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const proId = ref('')

onMounted(() => {
  let currentProId = localStorage.getItem('proDetailId')
  if (currentProId) {
    proId.value = currentProId
  }
})
</script>

<style scoped>

</style>