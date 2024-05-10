<template>
  <div class="container">
    <div class="header">
      <div class="title">
        全部测试计划
      </div>
      <div class="addTest">
        <el-button type="primary" size="large"><span style="font-size: 20px; margin-right: 5px;">+</span>新建测试
        </el-button>
      </div>
    </div>
    <div class="content">
      <div class="top">
        <div class="search">
          <el-input placeholder="请输入测试计划名称" v-model="searchContent" size="large" @keydown.enter="search"
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
        >
          <el-table-column prop="planName" label="测试计划名称">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <font-awesome-icon style="color:#56abfb;" :icon="['fas', 'file-lines']" />
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
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {queryTestPlanList} from "../../api/TestPlanApi.ts";

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

const loading = ref(false)
const searchContent = ref('')
const tableData = ref([])

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

const changePageNum = (currentPage) => {
  tablePage.pageNum = currentPage
  loadTestPlanList()
}

const handleSizeChange = (pageSize) => {
  tablePage.pageSize = pageSize
  loadTestPlanList()
}

onMounted(() => {
  loadTestPlanList()
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

</style>