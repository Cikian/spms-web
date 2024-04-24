<template>
  <div class="role-info-container">
    <div class="role-query-form-container">
      <el-form class="form-inline" size="default" :inline="true" :model="queryForm">
        <el-form-item label="角色标识">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色标识" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="queryForm.remark" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryRoleInfoByCondition">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
<!--    展示详角色细信息-->
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const queryForm = ref({
  roleName: '',
  remark: ''
})

const queryRoleInfoByCondition = () => {
  console.log(queryForm.value)
}
</script>

<style scoped>
.role-info-container {
  padding: 10px 20px 0 20px;
}

.role-query-form-container {
  margin-left: 20px;
}
</style>