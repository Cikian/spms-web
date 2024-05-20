<template>
  <div class="overView-title">
    全部项目
    <el-button type="primary" style="width: 120px; height:36px" @click="dialogVisible = true" v-if="isROLE_project_admin">
      <font-awesome-icon :icon="['fas', 'plus']"/>&nbsp;&nbsp;新建项目
    </el-button>

  </div>

  <div class="search-box">
    <el-input
        v-model="searchInput"
        style="width: 300px; height: 100%;"
        placeholder="搜索..."
        clearable
        @change="searchPro"
        @clear="searchInput = ''; searchPro()"
    >
      <template #prefix>
        <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>
      </template>
    </el-input>
  </div>
  <div v-if="tableData.data.length <= 0" style="width: 100%; padding: 0 40px" v-loading="loadingPro">
    <el-empty description="暂无数据"/>
  </div>

  <div v-else style="width: 100%; padding: 0 40px" v-loading="loadingPro">
    <el-table
        :data="tableData.data"
        style="width: 100%"
        :row-style="{height: '56px'}"
        stripe
        highlight-current-row
        @row-click="rowClick"
    >
      <el-table-column label="项目" prop="proName" sortable>
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <font-awesome-icon style="color: #56abfb" :icon="['fas', 'folder-open']"/>
            <span style="margin-left: 10px">{{ scope.row.proName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标识" prop="proFlag">
        <template #default="scope">
          <div style="width: 100%; text-align: center">
            <span>{{ scope.row.proFlag }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属" prop="from"/>
      <el-table-column align="center" label="创建时间" prop="updateTime">
        <template #default="scope">
          <span>{{ formatDate(new Date(scope.row.createTime), 'YYYY年MM月DD日') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 新增项目弹出框 -->
  <el-dialog
      v-model="dialogVisible"
      title="新增项目"
      width="980"
      class="addPro-dialog"
  >
    <div style="display: flex; height: 50vh">
      <el-scrollbar style="width: 50%; height: 100%;">
        <img style="width: 100%" src="../../assets/addPro01.png"/>
      </el-scrollbar>
      <el-scrollbar style="width: 50%;height: 100%; margin: 8px 32px 16px 32px; padding-right: 32px">
        <el-form
            ref="ruleFormRef"
            :rules="rules"
            label-position="top"
            label-width="auto"
            :model="proData"
            style="max-width: 600px;"
            require-asterisk-position="right"
            show-message
            v-if="theFirst"
        >
          <el-form-item required label="项目名称" prop="proName">
            <el-input v-model="proData.proName" placeholder="请输入项目名称" size="large">
              <template #prefix>
                <font-awesome-icon style="color: #56abfb" :icon="['fas', 'folder-open']"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item required label="组织">
            <el-input disabled v-model="beLong" size="large">
              <template #prefix>
                <font-awesome-icon style="color: #56abfb" :icon="['fas', 'sitemap']"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item required label="项目标识" prop="proFlag">
            <el-input v-model="proData.proFlag" placeholder="大写字母和数字，15个字符以内" size="large">
              <template #prefix>
                <font-awesome-icon style="color: #56abfb" :icon="['fas', 'feather']"/>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item required label="项目预计时间">
            <el-date-picker
                v-model="proDate"
                type="daterange"
                range-separator="——"
                start-placeholder="开始日期"
                end-placeholder="预计完成日期"
                size="large"
                @change="dateChange"
                value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>

          <el-form-item required label="项目类型">
            <el-radio-group v-model="proData.proType">
              <el-radio value="0" size="large">Scrum项目</el-radio>
              <el-radio value="1" size="large" disabled>Kanban项目</el-radio>
              <el-radio value="2" size="large" disabled>瀑布项目</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="proData.proCustomer" size="large"/>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
                v-model="proData.proDesc"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="项目描述"
            />
          </el-form-item>
        </el-form>


        <div v-else style="width: 100%;">
          <div style="height: 52px">

            <el-table
                ref="addMemberTableRef"
                :data="memberData"
                style="width: 100%"
                :row-style="{height: '52px'}"
                stripe
                :header-cell-style="{fontWeight: 'normal', fontSize: '14px'}"
                @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"/>
              <el-table-column label="姓名" prop="peoName" sortable>
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <div>
                      <el-avatar :size="'small'" :src="scope.row.avatar"/>
                    </div>

                    <span style="margin-left: 10px">{{ scope.row.userName }}</span>
                  </div>
                </template>
              </el-table-column>
              <!--              <el-table-column label="部门" prop="dept"/>-->
              <el-table-column label="职位" prop="position"/>
            </el-table>

          </div>
        </div>


      </el-scrollbar>
    </div>


    <template #footer>
      <div class="dialog-footer">
        <el-button style="width: 98px; height: 36px" v-show="!theFirst" @click="theFirst = true">上一步</el-button>

        <el-button style="width: 98px; height: 36px" v-if="theFirst" type="primary" @click="submitForm(ruleFormRef)">
          下一步
        </el-button>

        <el-button style="width: 98px; height: 36px" v-else type="primary" @click="submitAddPro">
          提&nbsp;&nbsp;交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ElTable, FormInstance, FormRules} from "element-plus";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted, reactive, ref} from "vue";
import {addPro, getAddMembers, getProList, searchProList} from "../../api/allProApi.ts";
import {useRouter} from "vue-router";
import {recordVisit} from "../../api/RecentVisitApi.ts";
import {formatDate} from "@vueuse/shared";

let tableData = reactive({
  data: []
})

let tableDataTemp = reactive({
  data: []
})

const searchPro = () => {
  if (searchInput.value === '') {
    tableData.data = tableDataTemp.data
  } else {
    searchProList(searchInput.value).then((res) => {
      tableData.data = res.data.data
    })
  }
}


const dialogVisible = ref(false)
const theFirst = ref(true)
let currentUser = reactive<any>({})

const isROLE_project_admin = ref(false)
onMounted(() => {
  let roles = JSON.parse(localStorage.getItem('hasRole'))
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].authority === 'ROLE_project_admin') {
      isROLE_project_admin.value = true
      break
    }
  }

  currentUser = localStorage.getItem('userInfo')
  memberData[0] = currentUser
  getPros()
})

const loadingPro = ref(true)

const beLong = ref('默认组织')

const proData = reactive({
  proName: '',
  proDesc: '',
  proStatus: -1,
  proFlag: '',
  proType: '0',
  proCustomer: '',
  proMembersIds: [] as string,
  expectedStartTime: '',
  expectedEndTime: '',
})

const proDate = ref('')

const dateChange = () => {
  console.log(proDate.value)
}

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<typeof proData>>({
  proName: [
    {required: true, message: '请输入项目名称', trigger: 'blur'}
  ],
  proFlag: [
    {required: true, message: '请输入项目标识', trigger: 'blur'},
    {
      required: true,
      pattern: /^[A-Z][A-Z0-9_]{3,14}$/,
      message: '为4-15个字符，只允许大写字母、数字、下划线，必须字母开头',
      trigger: 'blur'
    }
  ],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      getMembers()
      theFirst.value = false
    } else {
      console.log('error submit!')
      return false
    }
  })
}


const searchInput = ref('')


const getPros = () => {
  console.log('获取项目列表')
  getProList().then((res) => {
    tableData.data = res.data.data
    tableDataTemp.data = res.data.data
    loadingPro.value = false
  })
}

const getMembers = () => {
  getAddMembers().then((res) => {
    if (res.data.code === 2001) {
      memberData.value = res.data.data
      console.log(memberData.value)
    }

  })
}


interface member {
  peoId: number,
  peoName: string,
  dept: string,
  position: string,
  avatar: string
}


const memberData = ref<member[]>([])
const addMemberTableRef = ref<InstanceType<typeof ElTable>>()
const selectionMembers = ref<User[]>([])

const handleSelectionChange = (val: User[]) => {
  selectionMembers.value = val
  console.log(selectionMembers.value)
}

const submitAddPro = () => {
  console.log('提交表单')

  proData.proMembersIds = []
  for (let i = 0; i < selectionMembers.value.length; i++) {
    proData.proMembersIds.push(selectionMembers.value[i].userId)
  }
  proData.expectedStartTime = proDate.value[0]
  proData.expectedEndTime = proDate.value[1]

  console.log(proData)

  addPro(proData).then((res) => {
    if (res.data.code === 3001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
      dialogVisible.value = false
      getPros()
    } else {
      ElNotification({
        title: '失败',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}


const router = useRouter()
const rowClick = (row) => {
  recordVisit(row.proId, 1)
  localStorage.setItem('proDetailId', row.proId)
  router.push('/proDetail')
}
</script>

<style scoped>
.overView-title {
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 20px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  width: 100%;
  height: 36px;
  padding: 0 40px;
  margin-bottom: 24px;
}


</style>