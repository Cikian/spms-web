<template>
  <div class="overView-title">
    待审批
  </div>

  <div v-if="tableData.length <= 0" style="width: 100%; padding: 0 40px" v-loading="loadingPro">
    <el-empty description="暂无数据"/>
  </div>

  <div v-else style="padding: 0 40px" v-loading="loadingPro">
    <el-table
        :data="tableData"
        :row-style="{height: '56px'}"
        :indent="40"
        row-key="proId"
        size="large"
        flexible
        highlight-current-row
        @row-click="clickRow"
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
      <el-table-column align="center" label="创建时间" prop="updateTime">
        <template #default="scope">
          <span>{{ formatDate(new Date(scope.row.createTime), 'YYYY年MM月DD日') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="状态" prop="proStatus">
        <template #default="scope">
          <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.proStatus===-1">等待审批</div>
          <div class="table-statue" style="background-color: #9de4b6;"
               v-show="scope.row.proStatus!==-1 && scope.row.proStatus!==-2">审核通过
          </div>
          <div class="table-statue" style="background-color: #c3c3c3;" v-show="scope.row.proStatus===-2">已拒绝</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="proStatus">
        <template #default="scope">
          <el-button
              size="small"
              type="info"
              round
              @click="handleDelete(scope.row)"
              :disabled="scope.row.proStatus !== -1 && scope.row.status !== -2"
          >
            拒绝
          </el-button>
          <el-button size="small"
                     type="success"
                     round
                     @click="handleEdit(scope.row)"
                     :disabled="scope.row.proStatus !== -1 && scope.row.status !== -2"
          >
            通过
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
      v-model="dialogVisible"
      title="项目预览"
      width="70vw"
      :before-close="handleClose"
      top="7vh"
  >
    <div style="width: 100%; height: 75vh; margin: 0 auto; display: flex; justify-content: space-between; overflow: hidden">
      <el-scrollbar style="width: 65%;">
        <el-input class="click-dialog-input"
                  v-model="proInfo.proName"
                  readonly
                  placeholder="请输入需求标题" size="large"
                  style="height: 50px; font-size: 22px"></el-input>

        <div style="width: 100%; padding: 50px 20px;">
          <el-descriptions
              direction="vertical"
              :column="3"
          >
            <el-descriptions-item width="25%" label="创建人">
              <div v-for="member in members"
                   v-show="member.userId === proInfo.createBy"
                   style="display: flex; align-items: center"
              >
                <el-avatar :size="'small'" :src="member.avatar"/>
                <span style="margin-left: 10px">{{ member.nickName }}</span>
              </div>
            </el-descriptions-item>
            <el-descriptions-item width="25%" label="预计开始时间">
              {{ formatDate(new Date(proInfo.expectedStartTime), 'YYYY年MM月DD日') }}
            </el-descriptions-item>
            <el-descriptions-item width="25%" label="预计结束时间">
              {{ formatDate(new Date(proInfo.expectedEndTime), 'YYYY年MM月DD日') }}
            </el-descriptions-item>

          </el-descriptions>
        </div>
        <div style="font-size: 20px; padding: 50px 20px;">
          <div style="margin-bottom: 38px">项目描述</div>
          <span style="font-size: 18px">{{ proInfo.proDesc }}</span>
        </div>
        <div style="font-size: 20px; padding: 50px 20px;">
          <div style="margin-bottom: 38px">预估成本</div>
          <span style="font-size: 18px">{{ proInfo.proDesc }}</span>
        </div>


      </el-scrollbar>
      <el-scrollbar style="width: 35%; padding-left: 20px; border-left: rgba(0,0,0,0.1) solid 1px">
        <div style="padding: 20px 10px;">
          <div style="margin-bottom: 38px; font-size: 20px;">成员列表</div>
          <div v-for="member in members" :key="member.userId" style="display: flex; align-items: center; margin: 30px 0;">
            <el-avatar :src="member.avatar" style="margin-right: 10px"></el-avatar>
            <span style="font-size: 18px; width: 90px;">{{ member.nickName }}</span>
            <span style="font-size: 12px">{{ member.email }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <template #header>
      <font-awesome-icon style="font-size: 18px; color: #56abfb; margin-right: 10px" icon="fa-solid fa-folder-plus"/>
      {{ proInfo.proFlag }} - {{ proInfo.proName }}
    </template>
    <template #footer>

    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import {ElTable} from "element-plus";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted, ref} from "vue";
import {deletePro, getAuditProList} from "../../api/allProApi.ts";
import {formatDate} from "@vueuse/shared";
import {queryDemandMembers} from "../../api/demandApi.ts";
import {updateProStatus} from "../../api/proOverViewApi.ts";

onMounted(() => {
  getPros()
})

const tableData = ref([])
const loadingPro = ref(true)
const proInfo = ref({})
const dialogVisible = ref(false)

const getPros = () => {
  getAuditProList().then((res) => {
    tableData.value = res.data.data
    loadingPro.value = false
  })
}
const members = ref([])

const getDemandMembers = (proId) => {
  queryDemandMembers(proId).then((res) => {
    members.value = res.data.data
  })
}

const clickRow = (row) => {
  proInfo.value = row
  getDemandMembers(row.proId)
  dialogVisible.value = true
}
const handleEdit = (row) => {
    updateProStatus(row.proId, 0).then((res) => {
      if (res.data.code === 4001) {
        ElNotification({
          title: 'Success',
          message: res.data.message,
          type: 'success',
        })
        getPros()
      } else {
        ElNotification({
          title: 'Error',
          message: res.data.message,
          type: 'error',
        })
      }
    })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定拒绝？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    updateProStatus(row.proId, -2).then((res) => {
      if (res.data.code === 4001) {
        ElNotification({
          title: 'Success',
          message: res.data.message,
          type: 'success',
        })
        getPros()
      } else {
        ElNotification({
          title: 'Error',
          message: res.data.message,
          type: 'error',
        })
      }
    })
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