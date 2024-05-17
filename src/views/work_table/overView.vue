<template>
  <div class="overView-title">
    最近打开
  </div>

  <div>
    <el-skeleton v-if="loadingVisitPro" style="width: 100%;display: flex;padding: 0 40px 32px 40px" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px"/>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px"/>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px"/>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px"/>
        <el-skeleton-item variant="image" style="width: 200px; height: 130px; margin-right: 16px"/>
      </template>
    </el-skeleton>
    <a-empty v-else-if="emptyVisitPro" description="暂无数据"/>
    <div v-else>
      <el-row style="padding: 0 40px 32px 40px">
        <div class="lately-pro" v-for="pro in pros" :key="pro.name" @click="toProDetail(pro.proId)">
          <div class="lately-pro-in"></div>
          <div class="lately-pro-cont">
            <font-awesome-icon style="font-size: 24px; color: #56abfb" icon="fa-solid fa-folder-plus"/>
            <div class="pro-title" style="color: #333;margin: 14px 0 10px 0">
              <el-text truncated>{{ pro.name }}</el-text>
            </div>
            <div class="pro-path" style="font-size: .75rem; color: #999">
              <el-text truncated size="small">{{ pro.path }}</el-text>
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
      <el-row style="height: 56px; border-bottom: solid 0.8px #eee;" v-for="item in visited" :key="item.flag"
              @click="rowClick(item)">
        <el-col :span="19" style="padding: 12px 16px;line-height: 32px">
          <font-awesome-icon v-if="item.type === 2" style="color: #ff6c6c; margin-right: 18px" icon="fa-solid fa-clipboard-list"/>
          <a-tag v-if="item.type === 2" color="orange">需求</a-tag>
          <font-awesome-icon v-if="item.type === 3" style="color: #5fb2ff; margin-right: 14px"
                             icon="fa-solid fa-screwdriver-wrench"/>
          <a-tag v-if="item.type === 3" color="cyan">测试</a-tag>
          <span style="margin-right: 8px; color: #999;">{{ item.flag }}</span>
          <span style="color: #333; font-weight: 500">{{ item.name }}</span>
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
import {queryRecentVisits, queryRecentVisitsPro} from "../../api/RecentVisitApi.ts";

const loadingVisit = ref(true)
const emptyVisit = ref(false)

const loadingVisitPro = ref(true)
const emptyVisitPro = ref(false)

const pros = ref([])
const visited = ref([])

const toProDetail = (proId) => {
  localStorage.setItem('proDetailId', proId)
  router.push('/proDetail')
}

const getUserRecentVisit = () => {
  queryRecentVisits()
      .then(res => {
        if (res.data.code == 200) {
          visited.value = res.data.data
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
  font-size: 20px;
  padding: 0 40px;
}

.lately-pro {
  width: 200px;
  height: 130px;
  border: solid 0.8px #eee;
  margin-right: 16px;
  border-radius: 4px;
  overflow: hidden;

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
</style>