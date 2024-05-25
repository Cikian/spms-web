<template>
  <div
      style="
      display: flex;
      justify-content: right;
      align-items: center;
      height: 60px;
      padding: 0 30px;
"
  >
    <el-button type="danger" size="large" @click="handleDeleteAll()" v-if="!selections.length <= 0">
      <font-awesome-icon style="margin-right: 10px" :icon="['fas', 'xmark']"/>
      拒绝选中
    </el-button>
    <el-button type="success" size="large" @click="handleEditAll()" v-if="!selections.length <= 0">
      <font-awesome-icon style="margin-right: 10px" :icon="['fas', 'check']"/>
      同意选中
    </el-button>

  </div>

  <div style="width: 100%; height: 70vh; display: flex; justify-content: center; align-items: center"
       v-if="tableData.length <= 0">
    <a-spin v-if="loadingTestPlan" size="large" style="margin: 0 auto"/>
    <el-empty v-else description="暂无测试计划"/>
  </div>

  <el-table
      v-else
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      flexible
      :indent="40"
      border
      size="large"
      :header-cell-style="{'text-align': 'center',}"
  >
    <el-table-column
        type="selection"
        width="55"
        align="center"
    >
    </el-table-column>
    <el-table-column
        prop="id"
        label="序号"
        width="80"
        align="center"
    >
    </el-table-column>
    <el-table-column
        prop="name"
        label="测试计划名称"
    >
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <font-awesome-icon style="color:#56abfb;" :icon="['fas', 'file-lines']"/>
          <span style="margin-left: 10px">{{ scope.row.planName }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column
        prop="demandName"
        label="关联需求"
    >
    </el-table-column>
    <el-table-column
        prop="creatorName"
        label="创建人"
    >
      <template #default="scope">
        <div style="display: flex; align-items: center; margin: 0 auto">
          <el-avatar :size="'normal'" :src="scope.row.creatorAvatar" style="margin-right: 10px"/>
          {{ scope.row.creatorName }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
        prop="headName"
        label="负责人"
    >
      <template #default="scope">
        <div style="display: flex; align-items: center; margin: 0 auto">
          <el-avatar :size="'normal'" :src="scope.row.headAvatar" style="margin-right: 10px"/>
          {{ scope.row.headName }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="startTime" label="计划开始时间" align="center">
    </el-table-column>
    <el-table-column prop="endTime" label="计划结束时间" align="center">
    </el-table-column>
    <el-table-column
        label="操作"
        align="center"
    >
      <template #default="scope">
        <el-button
            size="small"
            type="danger"
            round
            @click="clickButton=true;handleReview(scope.row,2)"
        >
          拒绝
        </el-button>
        <el-button size="small"
                   type="success"
                   round
                   @click="clickButton=true;handleReview(scope.row,1)"
        >
          通过
        </el-button>
      </template>
    </el-table-column>
  </el-table>

</template>


<script setup lang="ts">
import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {queryAllPendingByProId, updateReviewStatus} from "../../../api/TestPlanApi.ts";
import {message} from "ant-design-vue";

const proId = ref('')
const tableData = ref([])
const loading = ref(false)
const selections = ref([])
const clickButton = ref(false)
const loadingTestPlan = ref(true)

const handleEditAll = () => {
  console.log(selections.value)
}

const handleDeleteAll = () => {
  console.log(selections.value)
}

const handleSelectionChange = (val) => {
  selections.value = val
}

const loadData = () => {
  loadingTestPlan.value = true
  loading.value = true
  queryAllPendingByProId(proId.value)
      .then(res => {
        if (res.data.code === 200){
          tableData.value = res.data.data

          for (let i = 0; i < tableData.value.length; i++) {
            tableData.value[i].id = i + 1

            if (tableData.value[i].startTime) {
              tableData.value[i].startTime = tableData.value[i].startTime.split('T')[0]
            }
            if (tableData.value[i].endTime) {
              tableData.value[i].endTime = tableData.value[i].endTime.split('T')[0]
            }
          }
        }else {
          tableData.value = []
        }
      })
      .finally(() => {
        loadingTestPlan.value = false
        loading.value = false
      })
}

const handleReview = (row, reviewResult) => {
  let willReview = ''
  if (reviewResult === 1) {
    willReview = '通过'
  } else {
    willReview = '拒绝'
  }

  ElMessageBox.confirm('是否 ' + willReview + ' 该测试计划?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    message.loading('操作中...', 0)
    let formData = {
      testPlanId: row.testPlanId,
      reviewResult: reviewResult
    }
    updateReviewStatus(formData)
        .then(res => {
          if (res.data.code === 200) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
          } else {
            ElNotification({
              title: '失败',
              message: res.data.message,
              type: 'warning'
            })
          }
        })
        .finally(() => {
          loadData()
          message.destroy()
        })
  }).catch(() => {
    ElNotification({
      title: '提示',
      message: '已取消审核',
      type: 'info'
    })
  })

}

onMounted(() => {
  proId.value = localStorage.getItem('proDetailId')
  loadData()
})


</script>

<style scoped>
.select-priority-options {
  width: 50px;
  height: 24px;
  line-height: 24px;
  border-radius: 20px;
  text-align: center;
  color: white;
  font-size: 14px
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

.demand-table-select-options-menu {
  display: flex;
  align-items: center;
  height: 40px;
}

.add-demand-priority-select-options-menu {
  display: flex;
  align-items: center;
}

.member-select-options-menu {
  display: flex;
  align-items: center;
  height: 50px;
}

.table-title-cell {
  display: inline-block;
  padding: 0 10px;
  text-align: right;
  position: absolute;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s;
}

.el-table__row .is-left:hover .table-title-cell {
  opacity: 1;
}

.line-throw {
  text-decoration: line-through;
  text-decoration-style: double;
  color: rgba(51, 51, 51, 0.38);
}


</style>