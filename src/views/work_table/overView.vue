<template>
  <div class="overView-title">
    最近打开
  </div>

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


  <div class="overView-title">
    最近访问
  </div>

  <div style="width: 100%; padding: 0 40px">
    <el-row style="height: 56px; border-bottom: solid 0.8px #eee;" v-for="item in visited" :key="item.flag">
      <el-col :span="19" style="padding: 12px 16px;line-height: 32px">
        <font-awesome-icon style="color: #56abfb; margin-right: 8px" icon="fa-solid fa-folder-plus"/>
        <span style="margin-right: 8px; color: #999;">{{ item.flag }}</span>
        <span style="color: #333; font-weight: 500">{{ item.name }}</span>
      </el-col>
      <el-col :span="5" style="padding: 12px 16px">{{ item.proName }}</el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {ref} from "vue";
import router from "../../router";

const toProDetail = (proId) => {
  localStorage.setItem('proDetailId', proId)
  router.push('/proDetail')
}

const pros = ref([
  {
    proId: '1056066526164565266',
    name: '项目啊实打实大苏打的啊实打实的1',
    path: '/work_table/project1'
  },
  {
    proId: '1056066526164565266',
    name: '项目2',
    path: '/work_table/project2'
  },
  {
    proId: '1056066526164565266',
    name: '项目3',
    path: '/work_table/project2'
  },
  {
    proId: '1056066526164565266',
    name: '项目4',
    path: '/work_table/project2'
  },
  {
    proId: '1056066526164565266',
    name: '项目5',
    path: '/work_table/project2'
  }
])

const visited = ref([
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  },
  {
    flag: 'SPMS',
    name: '项目啊实打实大苏打的啊实打实的1',
    proName: '项目1',
  }
])

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