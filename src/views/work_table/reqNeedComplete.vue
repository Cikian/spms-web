<template>
  <div style="width: 100%; height: 70vh; display: flex; justify-content: center; align-items: center"
       v-if="demandsByLevel.length <= 0">
    <a-spin v-if="loadingWorkItems" size="large" style="margin: 0 auto"/>
    <el-empty v-else description="暂无数据"/>
  </div>

  <div v-for="project in demandsByLevel"
       :key="project.proId"
       v-else
       style="margin: 50px 0;"
  >
    <font-awesome-icon style="color: #56abfb" :icon="['fas', 'folder-open']"/>
    <span style="margin-left: 10px">{{ project.proName }}</span>
    <el-table
        :data="project.demands"
        row-key="demandId"
        :indent="40"
        style="width: 100%; margin-top: 30px;"
        size="large"
        :header-cell-style="{'text-align': 'center', 'display': 'none'}"
        @row-click="clickRow"
        flexible
    >
      <el-table-column min-width="100px" align="left" prop="proNo" label="编号" fixed>
        <template #default="scope">
          {{ project.proFlag }} — {{ scope.row.demandNo }}
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="left" prop="title" label="标题" resizable fixed>
        <template #default="scope">
        <span v-show="scope.row.workItemType===0"
              class="demand-title"
              style="max-width: 100px"
              :class="{'line-throw': scope.row.demandStatus === 2 || scope.row.demandStatus === -1}">
          <font-awesome-icon
              :class="[(scope.row.demandStatus === 2 || scope.row.demandStatus === -1) ? 'epic-throw-icon':'epic-default-icon']"
              :icon="['fas', 'bolt-lightning']"/>
          {{ scope.row.title }}
        </span>
          <span v-show="scope.row.workItemType===1"
                :class="{'line-throw': scope.row.demandStatus === 2 || scope.row.demandStatus === -1}">
          <font-awesome-icon
              :class="[(scope.row.demandStatus === 2 || scope.row.demandStatus === -1) ? 'special-throw-icon':'special-default-icon']"
              :icon="['fas', 'flag']"/>
          {{ scope.row.title }}
        </span>
          <span v-show="scope.row.workItemType===2"
                :class="{'line-throw': scope.row.demandStatus === 2 || scope.row.demandStatus === -1}">
          <font-awesome-icon
              :class="[(scope.row.demandStatus === 2 || scope.row.demandStatus === -1) ? 'story-throw-icon':'story-default-icon']"
              :icon="['fas', 'book-open']"/>
          {{ scope.row.title }}
        </span>
          <span v-show="scope.row.workItemType===3"
                :class="{'line-throw': scope.row.demandStatus === 2 || scope.row.demandStatus === -1}">
          <font-awesome-icon
              :class="[(scope.row.demandStatus === 2 || scope.row.demandStatus === -1) ? 'task-throw-icon':'task-default-icon']"
              :icon="['fas', 'square-check']"/>
          {{ scope.row.title }}
        </span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="left" prop="demandStatus" label="状态" class-name="table-statue-column">
        <template #default="scope">
          <div class="table-statue" style="background-color: #56abfb;" v-show="scope.row.demandStatus===0">打开</div>
          <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.demandStatus===1">进行中
          </div>
          <div class="table-statue" style="background-color: #9de4b6;" v-show="scope.row.demandStatus===2">已完成
          </div>
          <div class="table-statue" style="background-color: #c3c3c3;" v-show="scope.row.demandStatus===-1">关闭</div>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="left" prop="priority" label="优先级">
        <template #default="scope">
          <div class="table-statue" style="background-color: #73d897;" v-show="scope.row.priority===0">最低</div>
          <div class="table-statue" style="background-color: #5dcfff;" v-show="scope.row.priority===1">较低</div>
          <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.priority===2">普通</div>
          <div class="table-statue" style="background-color: #ff9f73;" v-show="scope.row.priority===3">较高</div>
          <div class="table-statue" style="background-color: #ff7575;" v-show="scope.row.priority===4">最高</div>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>


<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {queryDemandSource, queryDemandTypes} from "../../api/demandApi.ts";
import {recordVisit} from "../../api/RecentVisitApi.ts";
import {getMyDemandByHeadId} from "../../api/proOverViewApi.ts";
import router from "../../router";


const demandsByLevel = ref([])

onMounted(() => {
  getDemandTypes()
  getDemandSource()
  getDemandsList()
})

const loadingWorkItems = ref(true)
const demandTypes = ref([])
const demandSource = ref([])

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

const getDemandsList = () => {
  getMyDemandByHeadId().then((res) => {
    if (res.data.code === 2001) {
      demandsByLevel.value = res.data.data
      loadingWorkItems.value = false
    } else {
      ElNotification({
        title: '通知',
        message: res.data.message,
        duration: 2000,
      })
      loadingWorkItems.value = false
    }
  })
}

const clickRow = (row) => {
  localStorage.setItem("recentVisit", row.demandId)
  router.push('/proDetail/proDemand/allDemands')
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {

})
</script>

<style scoped>


.table-statue {
  width: 60px;
  height: 24px;
  line-height: 24px;
  border-radius: 20px;
  text-align: center;
  color: white;
  font-size: 12px
}

.epic-default-icon {
  color: #ff877b;
  width: 18px;
  margin-right: 5px
}

.epic-throw-icon {
  color: rgba(255, 135, 123, 0.5);
  width: 18px;
  margin-right: 5px
}

.special-default-icon {
  color: #9191f9;
  width: 18px;
  margin-right: 5px
}

.special-throw-icon {
  color: rgba(145, 145, 249, 0.5);
  width: 18px;
  margin-right: 5px
}

.story-default-icon {
  color: #30d1fc;
  width: 18px;
  margin-right: 5px
}

.story-throw-icon {
  color: rgba(48, 209, 252, 0.5);
  width: 18px;
  margin-right: 5px
}

.task-default-icon {
  color: #73d897;
  width: 18px;
  margin-right: 5px
}

.task-throw-icon {
  color: rgba(115, 216, 151, 0.5);
  width: 18px;
  margin-right: 5px
}

</style>