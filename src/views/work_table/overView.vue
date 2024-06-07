<template>
  <div class="overView-title">
    最近打开
  </div>

  <div>
    <el-skeleton v-if="loadingVisitPro" style="width: 100%;display: flex;padding: 0 40px 32px 40px" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px;border-radius: 5px"/>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px;border-radius: 5px"/>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px;border-radius: 5px"/>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px;border-radius: 5px"/>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px;border-radius: 5px"/>
      </template>
    </el-skeleton>
    <a-empty v-else-if="emptyVisitPro" description="暂无数据"/>
    <div v-else>
      <el-row style="padding: 0 40px 32px 40px">
        <div class="lately-pro" v-for="pro in pros" :key="pro.id" @click="toProDetail(pro.id)">
          <div class="lately-pro-in"></div>
          <div class="lately-pro-cont">
            <font-awesome-icon style="font-size: 24px; color: #56abfb" icon="fa-solid fa-folder-plus"/>
            <div class="pro-title" style="margin: 14px 0 10px 0">
              {{ pro.name }}
            </div>
            <div class="pro-path" style="font-size: .75rem; color: #999">
              <el-text truncated size="small">{{ pro.desc }}</el-text>
            </div>
          </div>
        </div>
      </el-row>
    </div>
  </div>

  <div class="overView-title">
    最近访问
  </div>
  <div style="width: 100%; padding: 0 40px">
    <el-skeleton v-if="loadingVisit" :rows="10" :throttle="500" animated/>
    <el-empty v-else-if="emptyVisit" description="暂无数据"/>
    <div v-else>
      <el-row class="recent-visit" v-for="item in visited"
              :key="item.flag"
              @click="rowClick(item)">
        <el-col style="padding: 12px 16px;line-height: 32px;display: flex; justify-content: space-between">
          <div>
            <font-awesome-icon v-if="item.type === 2" style="color: #ff6c6c; margin-right: 18px"
                               icon="fa-solid fa-clipboard-list"/>
            <a-tag v-if="item.type === 2" color="orange">需求</a-tag>
            <font-awesome-icon v-if="item.type === 3" style="color: #5fb2ff; margin-right: 14px"
                               icon="fa-solid fa-screwdriver-wrench"/>
            <a-tag v-if="item.type === 3" color="cyan">测试</a-tag>
            <span style="margin-right: 8px; color: #999;">{{ item.flag }}</span>
            <span style="color: #333; font-weight: 500">{{ item.name }}</span>
          </div>
          <span style="font-size: 14px;color: #999999">{{ item.time }}</span>
        </el-col>
        <el-col :span="5" style="padding: 12px 16px">{{ item.proName }}</el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted, ref} from "vue";
import router from "../../router";
import {queryRecentVisits, queryRecentVisitsPro, recordVisit} from "../../api/RecentVisitApi.ts";

const loadingVisit = ref(true)
const emptyVisit = ref(false)

const loadingVisitPro = ref(true)
const emptyVisitPro = ref(false)

const pros = ref([])
const visited = ref([])

const toProDetail = (proId) => {
  recordVisit(proId, 1)
  localStorage.setItem('proDetailId', proId)
  router.push('/proDetail')
}

const getUserRecentVisit = () => {
  queryRecentVisits()
      .then(res => {
        if (res.data.code == 200) {
          visited.value = res.data.data
          for (let i = 0; i < visited.value.length; i++) {
            let time = visited.value[i].time;
            let now = new Date().getTime();
            let diffValue = now - time;
            let result = '';
            if (diffValue < 0) {
              return result;
            }
            let minute = 1000 * 60;
            let hour = minute * 60;
            let day = hour * 24;
            let month = day * 30;
            let year = month * 12;
            let _year = diffValue / year;
            let _month = diffValue / month;
            let _week = diffValue / (7 * day);
            let _day = diffValue / day;
            let _hour = diffValue / hour;
            let _min = diffValue / minute;
            if (_year >= 1) {
              result = parseInt(_year) + "年前";
            } else if (_month >= 1) {
              result = parseInt(_month) + "个月前";
            } else if (_week >= 1) {
              result = parseInt(_week) + "周前";
            } else if (_day >= 1) {
              result = parseInt(_day) + "天前";
            } else if (_hour >= 1) {
              result = parseInt(_hour) + "小时前";
            } else if (_min >= 1) {
              result = parseInt(_min) + "分钟前";
            } else {
              result = "刚刚";
            }
            visited.value[i].time = result;
          }
          emptyVisit.value = visited.value.length === 0;
        } else {
          visited.value = []
          emptyVisit.value = true
        }
      })
      .finally(() => {
        loadingVisit.value = false
      })
}

const getUserRecentVisitPro = () => {
  queryRecentVisitsPro()
      .then(res => {
        if (res.data.code == 200) {
          pros.value = res.data.data
          emptyVisitPro.value = pros.value.length === 0;
        } else {
          pros.value = []
          emptyVisitPro.value = true
        }
      })
      .finally(() => {
        loadingVisitPro.value = false
      })
}

const rowClick = (item) => {
  localStorage.setItem("recentVisit", item.id)
  if (item.type === 2) {
    router.push('/proDetail/proDemand/allDemands')
  } else if (item.type === 3) {
    router.push('/test/list/myTest')
  }
}

onMounted(() => {
  getUserRecentVisit()
  getUserRecentVisitPro()
})

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

.lately-pro {
  width: 200px;
  height: 130px;
  border: solid 0.8px #eee;
  margin-right: 16px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.lately-pro:hover {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.lately-pro-in {
  width: 100%;
  height: 40px;
  background-color: #f5f5f5;
}

.lately-pro-cont {
  width: 100%;
  height: 90px;
  position: relative;
  bottom: 13px;
  padding: 0 20px;
}

.recent-visit {
  height: 56px;
  border-bottom: solid 1px #eee;
  cursor: pointer;
  transition: background-color 0.3s;
}

.recent-visit:hover {
  background-color: #f5f7fa;
}

.pro-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>