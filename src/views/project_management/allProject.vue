<template>
  <div class="overView-title">
    全部项目
    <el-button type="primary" style="width: 120px; height:36px" @click="dialogVisible = true">
      <font-awesome-icon :icon="['fas', 'plus']"/>&nbsp;&nbsp;新建项目
    </el-button>

  </div>

  <div class="search-box">
    <el-input
        v-model="searchInput"
        style="width: 300px; height: 100%;"
        placeholder="搜索..."
        clearable
    >
      <template #prefix>
        <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>
      </template>
    </el-input>

  </div>

  <div style="width: 100%; padding: 0 40px" v-loading="loadingPro">
    <el-table
        :data="filterTableData"
        :default-sort="{ prop: 'date', order: 'descending' }"
        style="width: 100%"
        :row-style="{height: '56px'}"
        @row-click="clickl"
        stripe
        highlight-current-row
        :header-cell-style="{fontWeight: 'normal', fontSize: '14px'}"
    >
      <el-table-column label="项目" prop="proName" sortable>
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <font-awesome-icon style="color: #56abfb" :icon="['fas', 'folder-open']"/>
            <span style="margin-left: 10px">{{ scope.row.proName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标识" prop="proFlag"/>
      <el-table-column label="所属" prop="from"/>
      <el-table-column label="更新时间" prop="proUpdateTime"/>
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
                :data="memberData"
                style="width: 100%"
                :row-style="{height: '52px'}"
                @row-click="clickl"
                stripe
                :header-cell-style="{fontWeight: 'normal', fontSize: '14px'}"
            >
              <el-table-column label="姓名" prop="peoName" sortable>
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <el-avatar :size="'small'" :src="scope.row.avatar"/>
                    <span style="margin-left: 10px">{{ scope.row.peoName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="部门" prop="dept"/>
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
import {FormInstance, FormRules} from "element-plus";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted, reactive, ref, computed} from "vue";
import {addPro, getProList} from "../../api/allProApi.ts";

let tableData = reactive({
  data: []
})
const dialogVisible = ref(false)
const theFirst = ref(true)
let currentUser = reactive<any>({})
onMounted(() => {
  currentUser = localStorage.getItem('userInfo')
  memberData[0] = currentUser
  getPros()
})

const loadingPro = ref(true)

interface proDevice {
  devId: number,
  days: number,
}

const beLong = ref('默认组织')

const proData = reactive({
  proName: '',
  proDesc: '',
  proFlag: '',
  proType: '0',
  proLeaderId: '',
  proCustomer: '',
  proMembers: [] as any,

  proDevices: [] as proDevice[],
})

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
      message: '为3-15个字符，只允许大写字母、数字、下划线，必须字母开头',
      trigger: 'blur'
    }
  ],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      theFirst.value = false
    } else {
      console.log('error submit!')
      return false
    }
  })
}


const searchInput = ref('')
const filterTableData = computed(() =>
    tableData.data.filter((data) =>
        !searchInput.value ||
        data.proName.toLowerCase().includes(searchInput.value.toLowerCase())
    )
)

const getPros = () => {
  console.log('获取项目列表')
  getProList().then((res) => {
    tableData.data = res.data.data
    console.log(tableData.data)
    loadingPro.value = false
  })
}


interface member {
  peoId: number,
  peoName: string,
  dept: string,
  position: string,
  avatar: string
}


const memberData = reactive<member[]>([
  {
    peoId: 1,
    peoName: '张三',
    dept: '产品部',
    position: '产品经理',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d07103f482067139658244046jpeg.jpeg'
  },
  {
    peoId: 2,
    peoName: '李四',
    dept: '产品部',
    position: '产品经理',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d07103f482067139658244046jpeg.jpeg'
  }
])


const clickl = (row) => {
  console.log(row)
}

const submitAddPro = () => {
  console.log('提交表单')
  proData.proMembers = [
    {peoId: "1774695386807324674", days: 10},
    {peoId: "1779874103749816321", days: 5}
  ]
  proData.proDevices = [
    {devId: 1, days: 10},
    {devId: 2, days: 5}
  ]
  proData.proLeaderId = '1774695386807324674'

  console.log(proData)

  addPro(proData).then((res) => {
    if (res.data.code) {
      ElNotification({
        title: '成功',
        message: '添加项目',
        type: 'success',
      })
      dialogVisible.value = false
      getPros()
    }
  })
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