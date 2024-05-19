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

      </div>
    </div>
    <el-divider class="my-divider"/>
    <div class="baseInfo">
      <div class="avatar-title">
        <span>恢复数据</span>
      </div>
      <div class="baseInfo-container">

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

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
  padding-left: 105px;
  margin-top: 20px;
}
</style>