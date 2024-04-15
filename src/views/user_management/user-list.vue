<template>
  <!--  用户展示列表-->
  <div class="user-list-container">
    <div class="user-list-table">
      <el-table
          :data="userList"
          :row-key="row => row.no"
          style="width: 100%"
          stripe
          v-loading="loading"
      >
        <el-table-column
            prop="no"
            label="序号"
            width="100"
        >
        </el-table-column>
        <el-table-column label="头像" width="180">
          <template #default="{row}">
            <el-avatar :src="row.avatar" size="large"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="userName"
            label="用户名"
            width="200"
        >
        </el-table-column>
        <el-table-column
            prop="nickName"
            label="昵称"
            width="220"
        >
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="250"
        >
        </el-table-column>
        <el-table-column
            prop="phoneNumber"
            label="电话"
            width="180"
        >
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="130"
        >
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="200"
        >
        </el-table-column>
        <el-table-column
            label="操作"
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
    </div>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="total"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {queryUserList} from "../../api/userApi.ts";

const loading = ref(true)

const total = ref(0)
const page = ref(1)
const size = ref(10)
const userList = ref([])

const loadUserList = () => {
  loading.value = true
  let userDTO = {}
  let formData = {
    page: page.value,
    size: size.value
  }
  queryUserList(formData, userDTO).then(res => {
    if (res.data.code === 200) {
      let pageInfo = res.data.data;
      total.value = pageInfo.total

      for (let i = 0; i < pageInfo.records.length; i++) {
        pageInfo.records[i].no = (page.value - 1) * size.value + i + 1

        if (pageInfo.records[i].gender === 'N') {
          pageInfo.records[i].gender = '未知'
        } else if (pageInfo.records[i].gender === 'M') {
          pageInfo.records[i].gender = '男'
        } else {
          pageInfo.records[i].gender = '女'
        }

        if (pageInfo.records[i].status) {
          pageInfo.records[i].status = '启用'
        } else {
          pageInfo.records[i].status = '禁用'
        }

        if (pageInfo.records[i].createTime) {
          pageInfo.records[i].createTime = new Date(pageInfo.records[i].createTime).toLocaleString()
        }
      }

      userList.value = pageInfo.records
      loading.value = false
    }
  })
}

const handleEdit = (row) => {
  console.log(row)
}

const handleDelete = (row) => {
  console.log(row)
}

onMounted(() => {
  loadUserList()
})


</script>

<style scoped>

.user-list-container {
  padding: 20px;
}

.user-list-table {
  width: 100%;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

</style>