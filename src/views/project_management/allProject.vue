<template>
  <div class="overView-title">
    全部项目
    <el-button type="primary" style="width: 120px; height:36px">
      <font-awesome-icon :icon="['fas', 'plus']" />&nbsp;&nbsp;新建项目
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

  <div style="width: 100%; padding: 0 40px">
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
            <font-awesome-icon style="color: #56abfb" :icon="['fas', 'folder-open']" />
            <span style="margin-left: 10px">{{ scope.row.proName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标识" prop="flag" />
      <el-table-column label="所属" prop="from" />
      <el-table-column label="更新时间" prop="updateTime" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {computed, ref} from "vue";


const searchInput = ref('')
const filterTableData = computed(() =>
    tableData.filter((data) =>
            !searchInput.value ||
            data.proName.toLowerCase().includes(searchInput.value.toLowerCase())
    )
)

const tableData = [
  {
    proId: 1001,
    proName: '软件研发项目管理系统',
    flag: 'SPMS',
    from: 'Cikian',
    updateTime: '2024-05-03 18:55',
  },
  {
    proId: 1002,
    proName: '超级课程表',
    flag: 'SCT',
    from: '张林浩',
    updateTime: '2024-05-06 18:55',
  },
  {
    proId: 1003,
    proName: '澡堂管理系统',
    flag: 'WMS',
    from: '赵泽',
    updateTime: '2024-04-03 18:55',
  },
  {
    proId: 1004,
    proName: '麦基外卖',
    flag: 'MVS',
    from: '张三',
    updateTime: '2024-05-07 18:55',
  }
]

const clickl = (row,column) => {
  console.log(row)
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