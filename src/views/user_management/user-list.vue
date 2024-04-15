<template>
  <!--  用户展示列表-->
  <div class="user-list-container">
    <el-table
        :data="userList"
        style="width: 100%"
        border
        stripe
        v-loading="loading"
    >
      <el-table-column
          prop="id"
          label="ID"
          width="100"
      >
      </el-table-column>
      <el-table-column
          prop="username"
          label="用户名"
          width="180"
      >
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          width="180"
      >
      </el-table-column>
      <el-table-column
          prop="phone"
          label="电话"
          width="180"
      >
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
      >
      </el-table-column>
      <el-table-column
          label="操作"
          width="180"
      >
        <template #default="{row}">
          <el-button
              type="text"
              size="small"
              @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
              type="text"
              size="small"
              @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="total"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {queryUserList} from "../../api/userApi.ts";

const total = ref(0)
const page = ref(1)
const size = ref(10)
const userList = ref([])

const loadUserList = () => {
  let userDTO = {}
  let formData = {
    page: page.value,
    size: size.value
  }
  queryUserList(formData, userDTO).then(res => {
    if (res.data.code === 200) {
      let pageInfo = res.data.data;
      total.value = pageInfo.total
      userList.value = pageInfo.records
    }
  })
}

onMounted(() => {
  loadUserList()
})


</script>

<style scoped>

.user-list-container {
  padding: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

</style>