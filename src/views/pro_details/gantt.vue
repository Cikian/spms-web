<template>
  <div class="overView-title"
       style="display: flex; align-items: center; justify-content: space-between;">
    甘特图
  </div>
  <el-scrollbar style="width: 90%; margin: 0 auto; padding: 10px">
    <g-gantt-chart
        :chart-start="startTime"
        :chart-end="endTime"
        precision="day"
        bar-start="myBeginDate"
        bar-end="myEndDate"
        @click-bar="onClickBar"

    >
      <g-gantt-row v-for="(ganttRow, index) in ganttRowList" :label="ganttRow[0].ganttBarConfig.label"
                   :bars="ganttRow"/>
    </g-gantt-chart>
  </el-scrollbar>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {GGanttChart, GGanttRow} from "@infectoone/vue-ganttastic";
import {getGanttRowList, getProTime} from "../../api/demandApi.ts";
import router from "../../router";

const proId = ref('')

const proInfo = ref({})
const startTime = ref('')
const endTime = ref('')


onMounted(() => {
  proId.value = localStorage.getItem('proDetailId')
  getGanttRow(proId.value)
  getProInfo(proId.value)
})

const getProInfo = (id) => {
  getProTime(id).then(res => {

    startTime.value = res.data.data.start
    endTime.value = res.data.data.end

  })
}

const ganttRowList = ref([])

const getGanttRow = (id) => {
  getGanttRowList(id).then(res => {
    console.log('res', res)
    ganttRowList.value = res.data.data
  })
}
const onClickBar = (bar) => {
  localStorage.setItem("recentVisit", bar.bar.ganttBarConfig.id)
  router.push('/proDetail/proDemand/allDemands')
}


</script>

<style scoped>
.overView-title {
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 22px;
  font-weight: 700;
  padding: 0 40px;
}

</style>