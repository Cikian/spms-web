<template>
  <div style="padding: 30px 20px">
    <el-row :gutter="20">
      <el-col :span="6">
        <div style=" height: 376px; padding: 24px 28px; box-shadow: var(--el-box-shadow)">
          <el-row>
            <el-col :span="24" style="padding-bottom: 18px">
              基本信息
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="padding-bottom: 10px" class="basic-info-title">状态</div>
                  <div class="table-statue" style="background-color: #73d897;" v-show="currentProInfo.proStatus===0">
                    正常
                  </div>
                  <div class="table-statue" style="background-color: #f6c659;" v-show="currentProInfo.proStatus===1">
                    预警
                  </div>
                  <div class="table-statue" style="background-color: #ff7575;" v-show="currentProInfo.proStatus===2">
                    延期
                  </div>

            </el-col>
            <el-col :span="12">
              <div style="padding-bottom: 10px" class="basic-info-title">负责人</div>
              <div style="padding-bottom: 10px" class="basic-info-title">
                <div v-for="member in members"
                     v-show="member.userId === currentProInfo.createBy"
                     style="display: flex; align-items: center"
                >
                  <el-avatar :size="'small'" :src="member.avatar"/>
                  <span style="margin-left: 10px">{{ member.nickName }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">开始时间</div>
              <div v-if="currentProInfo.expectedStartTime === null" style="padding-bottom: 10px">——</div>
              <div v-else style="padding-bottom: 10px">{{ formatDate(new Date(currentProInfo.expectedStartTime), 'YYYY年MM月DD日') }}</div>
            </el-col>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">结束时间</div>
              <div v-if="currentProInfo.expectedEndTime === null" style="padding-bottom: 10px">——</div>
              <div v-else style="padding-bottom: 10px">{{ formatDate(new Date(currentProInfo.expectedEndTime), 'YYYY年MM月DD日') }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">进度</div>
              <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="allProgress"
                  status="success"
              />
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="18">
        <div style="height: 376px;padding: 24px 28px; box-shadow: var(--el-box-shadow)">
          <el-row>
            <el-col :span="24" style="padding-bottom: 44px">
              工作项统计
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="padding-bottom: 18px; display: flex; justify-content: space-around">
              <el-progress type="circle" :percentage="workItemProgress" :width="200" :color="customColors">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">任务</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="defectProgress" :width="200" :color="customColors">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">缺陷</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="proTestProgress" :width="200" :color="customColors">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">测试</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="dayProgress" :width="200" :color="customColors">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">工期剩余</span>
                </template>
              </el-progress>

            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
  <div style="padding: 30px 20px; height: 500px">
    <el-row :gutter="20">
      <el-col :span="12">
        <div style=" height: 400px; padding: 24px 28px; box-shadow: var(--el-box-shadow)">
          <el-row>
            <el-col :span="24" style="padding-bottom: 18px">
              项目属性
            </el-col>
          </el-row>
          <el-row style="padding: 46px 0">
            <el-descriptions column="2" size="large">
              <el-descriptions-item label="项目名称" width="400px">{{ currentProInfo.proName }}</el-descriptions-item>
              <el-descriptions-item label="项目标识">{{ currentProInfo.proFlag }}</el-descriptions-item>
              <el-descriptions-item label="客户名称">{{ currentProInfo.proCustomer }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ formatDate(new Date(currentProInfo.createTime), 'YYYY年MM月DD日 HH:mm:ss') }}</el-descriptions-item>
              <el-descriptions-item label="项目描述">{{ currentProInfo.proDesc }}</el-descriptions-item>
            </el-descriptions>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="height: 400px;padding: 24px 28px; box-shadow: var(--el-box-shadow)">
          <el-row>
            <el-col :span="20" style="padding-bottom: 10px">
              项目公告
            </el-col>
            <el-col :span="4" style="padding-bottom: 10px">
              <el-button @click="openIssueAnnouncementDialog" style="font-size: 18px" size="large" type="primary" text :disabled="!isProHeader">
                <font-awesome-icon :icon="['fas', 'pen-to-square']"/>
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="padding-bottom: 18px; display: flex; justify-content: space-around">
              <div style="width: 100%">
                <!--                <Toolbar-->
                <!--                    style="border-bottom: 1px solid #ccc"-->
                <!--                    :editor="editorRef"-->
                <!--                    :defaultConfig="toolbarConfig"-->
                <!--                    :mode="mode"-->
                <!--                />-->
                <Editor
                    style="height: 300px; overflow-y: hidden;"
                    v-model="valueHtml"
                    :defaultConfig="{
                      readOnly: true
                    }"
                    :mode="mode"
                    @onCreated="handleCreatedEditor"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>

  <el-dialog
      v-model="issueAnnouncementDialog"
      title="编辑公告"
      width="80vw"
      :before-close="handleClose"
  >
    <div style="width: 100%">
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="issueEditorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
      />
      <Editor
          style="height: 60vh; overflow-y: hidden;"
          v-model="valueHtmlIssue"
          :defaultConfig="editorIssueConfig"
          :mode="mode"
          @onCreated="handleCreatedIssueEditor"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="issueAnnouncementDialog = false">取消</el-button>
        <el-button type="primary" @click="submitIssue">
          发布
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {IToolbarConfig} from '@wangeditor/editor'
import {onBeforeUnmount, ref, shallowRef, onMounted} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  addAnno,
  getCalcProTestProgress,
  getDefectProgressCount,
  getWorkItemProgressCount,
  selectByProId, updateProStatus
} from "../../api/proOverViewApi.ts";
import {queryProByProId, updateDefectStatus} from "../../api/defectApi.ts";
import {judgeProjectHeader, queryDemandMembers} from "../../api/demandApi.ts";
import {formatDate} from "@vueuse/shared";


const mode = 'default' // 或 'simple'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const issueEditorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>无公告</p>')
const valueHtmlIssue = ref('<p>无公告</p>')

const toolbarConfig: Partial<IToolbarConfig> = {  // TS 语法
  excludeKeys: [
    "uploadImage",
    "group-video"// 排除菜单组，写菜单组 key 的值即可
  ]
}

const editorIssueConfig = {
  placeholder: '请输入内容...',
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  const editorIssue = issueEditorRef.value
  if (editor == null) return
  if (editorIssue == null) return
  editor.destroy()
  editorIssue.destroy()
})


const handleCreatedEditor = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleCreatedIssueEditor = (editorIssue) => {
  issueEditorRef.value = editorIssue // 记录 editor 实例，重要！
}

const proId = ref('')

const currentProInfo = ref({})

const members = ref([])

const getDemandMembers = (proId) => {
  queryDemandMembers(proId).then((res) => {
    members.value = res.data.data
    console.log(res)
  })
}
const dayProgress = ref(0)
const getCurrentProInfo = (proId) => {
  queryProByProId(proId).then((res) => {
    if (res.data.code === 2001) {
      currentProInfo.value = res.data.data

      // 计算项目天数
      let startTime = new Date(currentProInfo.value.expectedStartTime)
      let endTime = new Date(currentProInfo.value.expectedEndTime)
      let days = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24)
      // 计算剩余天数
      let now = new Date()
      let leftDays = (endTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      dayProgress.value =  leftDays / days * 100
      if (dayProgress.value < 0) {
        dayProgress.value = 0
        if (currentProInfo.value.proStatus !== 2) {
          currentProInfo.value.proStatus = 2
          proStatusChange(currentProInfo.value)
        }
      }
      dayProgress.value = dayProgress.value.toFixed(2)

      console.log("总天数：" + days)
      console.log("剩余天数：" + leftDays)

      if (dayProgress.value < 10) {
        if (currentProInfo.value.proStatus === 0) {
          currentProInfo.value.proStatus = 1
          proStatusChange(currentProInfo.value)
        }
      }

    } else {

    }
  })
}

onMounted(() => {
  let currentProId = localStorage.getItem('proDetailId')
  if (currentProId) {
    proId.value = currentProId
    getWorkItemProgress(currentProId)
    getCurrentProInfo(currentProId)
    getDemandMembers(currentProId)
  }
  judgeProHeader(currentProId)
  getAnno()
})

const isProHeader = ref(false)
const judgeProHeader = (proId) => {
  judgeProjectHeader(proId).then((res) => {
    if (res.data.code === 200) {
      isProHeader.value = res.data.data
    } else {

    }
  })
}

const proTestProgress = ref(0)
const workItemProgress = ref(0)
const defectProgress = ref(0)
const allProgress = ref(0)
const all = ref(0)
const allComplete = ref(0)

const getTestProgress = (currentProId) =>{
  getCalcProTestProgress(currentProId).then(res => {
    if (res.data.code === 200) {
      if (res.data.data.all !== 0){
        proTestProgress.value = res.data.data.completed / res.data.data.all * 100
        proTestProgress.value = toFixTwo(proTestProgress.value)
      } else {
        proTestProgress.value = 0
      }
      allComplete.value += res.data.data.completed
      all.value += res.data.data.all
    }
    allProgress.value = allComplete.value / all.value * 100
    allProgress.value = toFixTwo(allProgress.value)
  })
}

const getWorkItemProgress = (currentProId) =>{
  getWorkItemProgressCount(currentProId).then(res => {
    if (res.data.code === 200) {
      if (res.data.data.all !== 0){
        workItemProgress.value = res.data.data.completed / res.data.data.all * 100
        workItemProgress.value = toFixTwo(workItemProgress.value)
      } else {
        workItemProgress.value = 0
      }
      allComplete.value += res.data.data.completed
      all.value += res.data.data.all
    }
    getDefectProgress(currentProId)
  })
}

const getDefectProgress = (currentProId) =>{
  getDefectProgressCount(currentProId).then(res => {
    if (res.data.code === 200) {
      if (res.data.data.all !== 0){
        defectProgress.value = res.data.data.completed / res.data.data.all * 100
        defectProgress.value = toFixTwo(defectProgress.value)
      } else {
        defectProgress.value = 0
      }
      allComplete.value += res.data.data.completed
      all.value += res.data.data.all
    }
    getTestProgress(currentProId)
  })
}

const toFixTwo = (value) => {
  return value.toFixed(2)
}

const issueAnnouncementDialog = ref(false)

const openIssueAnnouncementDialog = () => {
  valueHtmlIssue.value = valueHtml.value
  issueAnnouncementDialog.value = true
}

const handleClose = (done: () => void) => {
  valueHtmlIssue.value = ''
  done()
}

const submitIssue = () => {
  valueHtml.value = valueHtmlIssue.value
  let anno = {
    proId: proId.value,
    content: valueHtmlIssue.value
  }
  addAnno(anno).then(res => {
    if (res.data.code === 3001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '警告',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
  issueAnnouncementDialog.value = false
}

const getAnno = () => {
  selectByProId(proId.value).then(res => {
    if (res.data.code === 2001) {
      valueHtml.value = res.data.data.content
    }
  })
}

const proStatusChange = (row) => {
  updateProStatus(row.proId, row.proStatus).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}

const customColors = [
  { color: '#ff2424', percentage: 10 },
  { color: '#ff322e', percentage: 20 },
  { color: '#cf3a33', percentage: 30 },
  { color: '#ff7116', percentage: 40 },
  { color: '#f6c659', percentage: 50 },
  { color: '#dcb907', percentage: 60 },
  { color: '#bdd20a', percentage: 70 },
  { color: '#b7c722', percentage: 80 },
  { color: '#a0cc5e', percentage: 90 },
  { color: '#67c23a', percentage: 100 },
]

// const customColors = [
//   { color: '#FF0000', percentage: 20 },
//   { color: '#FF8000', percentage: 40 },
//   { color: '#FFFF00', percentage: 60 },
//   { color: '#80FF00', percentage: 80 },
//   { color: '#00FF00', percentage: 100 }
// ]

// const customColors = [
//   { color: '#FF0000', percentage: 10 },
//   { color: '#FF3D00', percentage: 20 },
//   { color: '#FF7A00', percentage: 30 },
//   { color: '#FFB700', percentage: 40 },
//   { color: '#FFF200', percentage: 50 },
//   { color: '#D4FF00', percentage: 60 },
//   { color: '#A7FF00', percentage: 70 },
//   { color: '#7AFF00', percentage: 80 },
//   { color: '#4DFF00', percentage: 90 },
//   { color: '#00FF00', percentage: 100 },
// ]
</script>

<style scoped>
.basic-info-title {
  font-size: 14px;
  color: #666666;
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

.demand-table-select-options-menu {
  display: flex;
  align-items: center;
  height: 40px;
}

.table-statue {
  width: 60px;
  height: 24px;
  line-height: 24px;
  border-radius: 20px;
  text-align: center;
  color: white;
  font-size: 12px
}
</style>