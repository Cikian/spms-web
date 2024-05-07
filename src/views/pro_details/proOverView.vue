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
              <div style="padding-bottom: 10px;" class="basic-info-title">状态</div>
              <el-button type="success" round size="small">正常</el-button>
            </el-col>
            <el-col :span="12">
              <div style="padding-bottom: 10px" class="basic-info-title">负责人</div>
              <div>张三</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">开始时间</div>
              <div style="padding-bottom: 10px">2022-04-23</div>
            </el-col>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">结束时间</div>
              <div style="padding-bottom: 10px">2022-04-23</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">进度</div>
              <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="50"
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
              <el-progress type="circle" :percentage="25" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">任务</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="100" status="success" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">缺陷</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="70" status="warning" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">缺陷</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="50" status="exception" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">测试</span>
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
          <el-row>
            <el-col :span="12">
              <div style="padding-bottom: 10px;" class="basic-info-title">状态</div>
              <el-button type="success" round size="small">正常</el-button>
            </el-col>
            <el-col :span="12">
              <div style="padding-bottom: 10px" class="basic-info-title">负责人</div>
              <div>张三</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">开始时间</div>
              <div style="padding-bottom: 10px">2022-04-23</div>
            </el-col>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">结束时间</div>
              <div style="padding-bottom: 10px">2022-04-23</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">进度</div>
              <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="50"
                  status="success"
              />
            </el-col>
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
              <el-button @click="openIssueAnnouncementDialog" style="font-size: 18px" size="large" type="primary" text>
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
import {addAnno, selectByProId} from "../../api/proOverViewApi.ts";


const mode = 'default' // 或 'simple'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const issueEditorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>无公告</p>')
const valueHtmlIssue = ref('<p>无公告</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {

})

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

onMounted(() => {
  let currentProId = localStorage.getItem('proDetailId')
  if (currentProId) {
    proId.value = currentProId
  }
  getAnno()
})

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
</style>