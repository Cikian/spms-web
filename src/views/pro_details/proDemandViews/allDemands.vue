<template>
  <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
    全部需求
    <el-button type="primary" @click="openAddDemandDialog">发布需求</el-button>
  </div>
  <el-table
      :data="tableData"
      border
      style="width: 100%"
      size="large"
      @selection-change="handleSelectionChange"
  >
    <el-table-column align="center" type="selection"/>
    <el-table-column align="center" label="序号" type="index"/>
    <el-table-column align="center" prop="demandNo" label="编号" sortable/>
    <el-table-column align="center" prop="title" label="标题" min-width="200px">
      <template #default="scope">
        <div style="text-align: left">
          <span v-show="scope.row.dType===0"><font-awesome-icon style="color: #ff877b;width: 18px; margin-right: 5px"
                                                                :icon="['fas', 'bolt-lightning']"/>{{ scope.row.title }}</span>
          <span v-show="scope.row.dType===1"><font-awesome-icon style="color: #9191f9;width: 18px; margin-right: 5px"
                                                                :icon="['fas', 'flag']"/>{{ scope.row.title }}</span>
          <span v-show="scope.row.dType===2"><font-awesome-icon style="color: #30d1fc;width: 18px; margin-right: 5px"
                                                                :icon="['fas', 'book-open']"/>{{
              scope.row.title
            }}</span>
          <span v-show="scope.row.dType===3"><font-awesome-icon style="color: #73d897;width: 18px; margin-right: 5px"
                                                                :icon="['fas', 'square-check']"/>{{
              scope.row.title
            }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="status" label="状态">
      <template #default="scope">
        <div class="table-statue" style="background-color: #56abfb;" v-show="scope.row.status===0">打开</div>
        <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.status===1">进行中</div>
        <div class="table-statue" style="background-color: #9de4b6;" v-show="scope.row.status===2">已完成</div>
        <div class="table-statue" style="background-color: #c3c3c3;" v-show="scope.row.status===-1">关闭</div>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="headId" label="负责人">
      <template #default="scope">
        <div style="display: flex; align-items: center; text-align: center"
             v-for="member in members"
             v-show="member.userId === scope.row.headId">
          <div>
            <el-avatar :size="'small'" :src="member.avatar"/>
          </div>

          <span style="margin-left: 10px">{{ member.nickName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="priority" label="优先级">
      <template #default="scope">
        <div class="table-statue" style="background-color: #73d897;" v-show="scope.row.priority===0">最低</div>
        <div class="table-statue" style="background-color: #5dcfff;" v-show="scope.row.priority===1">较低</div>
        <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.priority===2">普通</div>
        <div class="table-statue" style="background-color: #ff9f73;" v-show="scope.row.priority===-3">较高</div>
        <div class="table-statue" style="background-color: #ff7575;" v-show="scope.row.priority===-4">最该</div>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="fatherDemandId" label="父工作项">
      <template #default="scope">
        <span v-for="demand in tableData" v-show="demand.demandId === scope.row.fatherDemandId">{{
            demand.title
          }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="type" label="需求类型">
      <template #default="scope">
        <span v-for="type in demandTypes" v-show="type.dictionaryDataId === scope.row.type">{{ type.label }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="storyPoint" label="故事点"/>
    <el-table-column align="center" prop="createTime" label="创建时间"/>

  </el-table>

  <el-dialog
      v-model="openDialog"
      title="新建需求"
      width="80vw"
      :before-close="handleClose"
      top="7vh"
  >
    <el-form
        :model="newDemandFormData"
        label-width="auto"
        label-position="top"
        require-asterisk-position="right"
        size="large"
    >
      <div style="width: 100%; height: 70vh; margin: 0 auto; display: flex; justify-content: space-between">
        <div style="width: 73%; ">
          <el-form-item label="标题" required>
            <el-input v-model="newDemandFormData.title" placeholder="请输入需求标题"></el-input>
          </el-form-item>

          <el-form-item label="描述">
            <div style="width: 100%">
              <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  :mode="mode"
              />
              <Editor
                  style="height: 300px; overflow-y: hidden;"
                  v-model="valueHtml"
                  :defaultConfig="editorConfig"
                  :mode="mode"
                  @onCreated="handleCreatedEditor"
              />
            </div>
          </el-form-item>

        </div>
        <el-scrollbar style="width: 25%; padding-left: 20px; border-left: rgba(0,0,0,0.1) solid 1px">
          <el-form-item label="项目" required>
            <el-input readonly disabled v-model="currentProInfo.proName">
              <template #prefix>
                <font-awesome-icon style="color: #56abfb; margin-right: 8px" icon="fa-solid fa-folder-plus"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="工作项类型" required>
            <el-select
                v-model="newDemandFormData.dType"
                placeholder="请选择工作项类型"
                size="large"
                clearable
            >
              <el-option
                  :key="0"
                  label="史诗"
                  :value="0"
              >
                <font-awesome-icon style="color: #ff877b;width: 18px" :icon="['fas', 'bolt-lightning']"/>
                史诗
              </el-option>
              <el-option
                  :key="1"
                  label="特性"
                  :value="1"
              >
                <font-awesome-icon style="color: #9191f9;width: 18px" :icon="['fas', 'flag']"/>
                特性
              </el-option>
              <el-option
                  :key="2"
                  label="用户故事"
                  :value="2"
              >
                <font-awesome-icon style="color: #30d1fc;width: 18px" :icon="['fas', 'book-open']"/>
                用户故事
              </el-option>
              <el-option
                  :key="3"
                  label="任务"
                  :value="3"
              >
                <font-awesome-icon style="color: #73d897;width: 18px" :icon="['fas', 'square-check']"/>
                任务
              </el-option>
              <template #prefix>
                <font-awesome-icon style="color: #ff877b;width: 18px" :icon="['fas', 'bolt-lightning']"
                                   v-show="newDemandFormData.dType===0"/>
                <font-awesome-icon style="color: #9191f9;width: 18px" :icon="['fas', 'flag']"
                                   v-show="newDemandFormData.dType===1"/>
                <font-awesome-icon style="color: #30d1fc;width: 18px" :icon="['fas', 'book-open']"
                                   v-show="newDemandFormData.dType===2"/>
                <font-awesome-icon style="color: #73d897;width: 18px" :icon="['fas', 'square-check']"
                                   v-show="newDemandFormData.dType===3"/>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="父工作项">
            <el-select
                v-model="newDemandFormData.fatherDemandId"
                placeholder="请选父工作项"
                size="large"
                clearable
            >
              <el-option
                  v-for="item in tableData"
                  :key="item.demandId"
                  :label="item.title"
                  :value="item.demandId"
              />


              <!--              <template #prefix>-->
              <!--                <font-awesome-icon style="color: #ff877b;width: 18px" :icon="['fas', 'bolt-lightning']" v-show=".dType===0"/>-->
              <!--                <font-awesome-icon style="color: #9191f9;width: 18px" :icon="['fas', 'flag']" v-show="newDemandFormData.dType===1"/>-->
              <!--                <font-awesome-icon style="color: #30d1fc;width: 18px" :icon="['fas', 'book-open']" v-show="newDemandFormData.dType===2"/>-->
              <!--                <font-awesome-icon style="color: #73d897;width: 18px" :icon="['fas', 'square-check']" v-show="newDemandFormData.dType===3"/>-->
              <!--              </template>-->
            </el-select>
          </el-form-item>

          <el-form-item label="负责人">
            <el-select
                v-model="newDemandFormData.headId"
                placeholder="请选择负责人"
                size="large"
                clearable
            >
              <el-option
                  v-for="item in members"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="优先级">
            <el-select
                v-model="newDemandFormData.priority"
                placeholder="请选择优先级"
                size="large"
                clearable
            >
              <el-option
                  :key="4"
                  label="最高"
                  :value="4"
              >
                <div class="select-priority-options" style="background-color: #ff7575;">
                  最高
                </div>
              </el-option>
              <el-option
                  :key="3"
                  label="较高"
                  :value="3"
              >
                <div class="select-priority-options" style="background-color: #ff9f73;">
                  较高
                </div>
              </el-option>
              <el-option
                  :key="2"
                  label="普通"
                  :value="2"
              >
                <div class="select-priority-options" style="background-color: #f6c659;">
                  普通
                </div>
              </el-option>
              <el-option
                  :key="1"
                  label="较低"
                  :value="1"
              >
                <div class="select-priority-options" style="background-color: #5dcfff;">
                  较低
                </div>
              </el-option>
              <el-option
                  :key="0"
                  label="最低"
                  :value="0"
              >
                <div class="select-priority-options" style="background-color: #73d897;">
                  最低
                </div>
              </el-option>
              <template #prefix>
                <div class="select-priority-options" style="background-color: #ff7575;"
                     v-show="newDemandFormData.priority===4">最高
                </div>
                <div class="select-priority-options" style="background-color: #ff9f73;"
                     v-show="newDemandFormData.priority===3">较高
                </div>
                <div class="select-priority-options" style="background-color: #f6c659;"
                     v-show="newDemandFormData.priority===2">普通
                </div>
                <div class="select-priority-options" style="background-color: #5dcfff;"
                     v-show="newDemandFormData.priority===1">较低
                </div>
                <div class="select-priority-options" style="background-color: #73d897;"
                     v-show="newDemandFormData.priority===0">最低
                </div>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="需求类型">
            <el-select
                v-model="newDemandFormData.type"
                placeholder="请选择需求类型"
                size="large"
                clearable
            >
              <el-option
                  v-for="item in demandTypes"
                  :key="item.dictionaryDataId"
                  :label="item.label"
                  :value="item.dictionaryDataId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="需求来源">
            <el-select
                v-model="newDemandFormData.source"
                placeholder="请选择需求来源"
                size="large"
                clearable
            >
              <el-option
                  v-for="item in demandSource"
                  :key="item.dictionaryDataId"
                  :label="item.label"
                  :value="item.dictionaryDataId"
              />
            </el-select>
          </el-form-item>
        </el-scrollbar>
      </div>
    </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="openDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAddDemand">
            发布
          </el-button>
        </div>
      </template>
  </el-dialog>


</template>


<script setup lang="ts">
import {nextTick, onMounted, ref, shallowRef} from "vue";
import {IToolbarConfig} from "@wangeditor/editor";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {DomEditor} from '@wangeditor/editor'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  insertNewDemand,
  queryDemandMembers,
  queryDemandSource,
  queryDemandTypes,
  queryProByProId
} from "../../../api/demandApi.ts";

const proId = ref('')
const currentProInfo = ref({})

onMounted(() => {
  proId.value = localStorage.getItem('proDetailId')

  getCurrentProInfo()
  getDemandTypes()
  getDemandSource()
  getDemandMembers()
})

const newDemandFormData = ref({
  proId: '',
  title: '',
  desc: '',
  status: 0,
  headId: '',
  priority: 2, // 默认普通优先级
  fatherDemandId: '',
  type: '',
  dType: 0,
  source: '',
  storyPoint: 0,
})

const openDialog = ref(false)
const members = ref([])
const demandTypes = ref([])
const demandSource = ref([])

const getCurrentProInfo = () => {
  queryProByProId(proId.value).then((res) => {
    if (res.data.code === 2001){
      currentProInfo.value = res.data.data
      console.log(currentProInfo.value)
    } else {

    }
  })
}

const getDemandMembers = () => {
  queryDemandMembers(proId.value).then((res) => {
    members.value = res.data.data
    console.log(res)
  })
}

const getDemandTypes = () => {
  queryDemandTypes().then((res) => {
    demandTypes.value = res.data.data
    console.log(demandTypes.value)
  })
}

const getDemandSource = () => {
  queryDemandSource().then((res) => {
    demandSource.value = res.data.data
    console.log(demandSource.value)
  })
}


const tableData = ref([
  {
    demandId: '1001',
    proId: '123',
    demandNo: 'demo-1',
    title: '用户',
    desc: '需求描述1',
    status: -1,
    headId: '123',
    priority: 2,
    fatherDemandId: '1000',
    type: '1788120977904091137',
    dType: 0,
    source: '1788141110428971010',
    storyPoint: 0,
  },
  {
    demandId: '1002',
    proId: '124',
    demandNo: 'demo-2',
    title: '购物车',
    desc: '需求描述1',
    status: 1,
    headId: '124',
    priority: 2,
    fatherDemandId: '1001',
    type: '1788121016265195521',
    dType: 1,
    source: '1788141153521250306',
    storyPoint: 0,
  },
  {
    demandId: '1003',
    proId: '125',
    demandNo: 'demo-3',
    title: '不知道起啥名，起个长点的名字',
    desc: '需求描述1',
    status: 0,
    headId: '125',
    priority: 2,
    fatherDemandId: '1001',
    type: '1788121016265195521',
    dType: 2,
    source: '1788141153521250306',
    storyPoint: 0,
  },
])

const selections = ref([])

const handleSelectionChange = (val) => {
  selections.value = val
}


const mode = 'default' // 或 'simple'
const editorRef = shallowRef()


// 内容 HTML
const valueHtml = ref('')

const editorConfig = {
  placeholder: '请输入内容...',
}

const toolbarConfig: Partial<IToolbarConfig> = {  // TS 语法
  excludeKeys: [
    "uploadImage",
    "group-video",// 排除菜单组，写菜单组 key 的值即可
    "fullScreen",
  ]
}

const submitAddDemand = () => {
  console.log("提交需求")
  newDemandFormData.value.desc = valueHtml.value
  console.log(newDemandFormData.value)
  openDialog.value = false
  insertNewDemand(newDemandFormData.value).then((res) => {
    if (res.data.code === 3001) {
      console.log("发布成功")
    } else {
      console.log("发布失败")
    }
  })
}
const handleCreatedEditor = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  nextTick(() => {
    const toolbar = DomEditor.getToolbar(editorRef.value)
    const curToolbarConfig = toolbar.getConfig()
    console.log('curToolbarConfig', curToolbarConfig)
  })
}


const handleClose = (done: () => void) => {
  valueHtml.value = ''
  done()
}

const openAddDemandDialog = () => {
  newDemandFormData.value.proId = currentProInfo.value.proId
  openDialog.value = true
}

</script>

<style scoped>
.select-priority-options {
  width: 50px;
  height: 24px;
  line-height: 24px;
  border-radius: 20px;
  text-align: center;
  color: white;
  font-size: 14px
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