<template>
  <div class="personal-document-container">
    <div class="title">
      数据备份
    </div>
    <div class="baseInfo">
      <div class="avatar-title">
        <span>初始备份</span>
      </div>
      <div class="baseInfo-container">
        <el-button type="primary" size="large" @click="restoreInitialData">
          恢复至初始数据
        </el-button>
      </div>
    </div>
    <el-divider class="my-divider"/>
    <div class="baseInfo">
      <div class="avatar-title">
        <span>恢复数据</span>
      </div>
      <div class="baseInfo-container">
        <div class="backup-list">
          <el-table :data="backupList" style="width: 100%" empty-text="暂无数据">
            <el-table-column prop="fileName" label="文件名称" width="250"/>
            <el-table-column prop="fileSize" label="文件大小" width="150"/>
            <el-table-column prop="checkCode" label="校验码" width="550"/>
            <el-table-column prop="desc" label="备份来源" width="200"/>
            <el-table-column prop="createTime" label="备份日期" width="250"/>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" size="large" @click="restoreBackup(scope.row)">恢复</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {queryBackupList, restore, restoreInit} from "../../api/backupApi.ts";
import {message} from "ant-design-vue";

const backupList = ref([])

const getBackupList = () => {
  // 获取备份列表
  queryBackupList()
      .then(res => {
        backupList.value = res.data.data

        for (let i = 0; i < backupList.value.length; i++) {
          if (backupList.value[i].fileSize < 1024) {
            backupList.value[i].fileSize = backupList.value[i].fileSize + 'B'
          } else if (backupList.value[i].fileSize < 1024 * 1024) {
            backupList.value[i].fileSize = (backupList.value[i].fileSize / 1024).toFixed(2) + 'KB'
          } else {
            backupList.value[i].fileSize = (backupList.value[i].fileSize / 1024 / 1024).toFixed(2) + 'MB'
          }
        }
      })
}

const restoreInitialData = () => {
  ElMessageBox.confirm('此操作将数据恢复至初始状态,您确定吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessageBox.confirm('此操作不可逆，您确定要恢复至初始状态吗？', '最终确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      message.loading('加载中...', 0);
      restoreInit()
          .then(res => {
            if (res.data.code === 200) {
              ElNotification({
                title: '成功',
                message: '数据恢复成功',
                type: 'success'
              })
            } else {
              ElNotification({
                title: '失败',
                message: '数据恢复失败',
                type: 'error'
              })
            }
          })
          .finally(() => {
            message.destroy()
          })
    }).catch(() => {
      ElNotification({
        title: '提示',
        message: '取消恢复',
        type: 'info'
      })
    })
  }).catch(() => {
    ElNotification({
      title: '提示',
      message: '取消恢复',
      type: 'info'
    })
  })
}

const restoreBackup = (row) => {
  ElMessageBox.confirm('此操作将数据恢复至' + row.createTime + ',您确定吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessageBox.confirm('此操作不可逆，您确定要恢复此备份吗？', '最终确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      message.loading('加载中...', 0);
      let fromData = {
        fileName: row.fileName,
        checkCode: row.checkCode
      }
      restore(fromData)
          .then(res => {
            if (res.data.code === 200) {
              ElNotification({
                title: '成功',
                message: '数据恢复成功',
                type: 'success'
              })
            } else {
              ElNotification({
                title: '失败',
                message: '数据恢复失败',
                type: 'error'
              })
            }
          })
          .finally(() => {
            message.destroy()
          })
    }).catch(() => {
      ElNotification({
        title: '提示',
        message: '取消恢复',
        type: 'info'
      })
    })
  }).catch(() => {
    ElNotification({
      title: '提示',
      message: '取消恢复',
      type: 'info'
    })
  })

}

onMounted(() => {
  getBackupList()
})
</script>

<style scoped>
.my-divider {
  width: 95%;
  margin: 0 auto;
}

.title {
  height: 49px;
  font-size: 15px;
  line-height: 49px;
  padding-left: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.baseInfo {
  width: 100%;
  padding: 20px;
}

.avatar-title {
  height: 40px;
  font-size: 15px;
  line-height: 40px;
}

.avatar-title span {
  padding: 12px 20px;
}

.baseInfo-container {
  width: 100%;
  padding-left: 20px;
  margin-top: 20px;
}
</style>