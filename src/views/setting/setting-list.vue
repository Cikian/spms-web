<template>
  <el-container>
    <el-aside width="260px">
      <el-menu
          default-active="/setting/list/personal"
          class="el-menu-vertical-demo"
          background-color="#fbfbfb"
          active-text-color="#6698ff"
          :router="true"
      >
        <div class="group-title">账号设置</div>
        <el-menu-item style="margin:0 0 12px 0;" index="/setting/list/personal">
          <font-awesome-icon class="list-icons" :icon="['fas', 'list-check']"/>
          <template #title>个人资料</template>
        </el-menu-item>
        <el-menu-item style="margin:0 0 12px 0;" index="/setting/list/account">
          <font-awesome-icon class="list-icons" :icon="['far', 'pen-to-square']" />
          <template #title>账号设置</template>
        </el-menu-item>
        <el-divider/>
        <div class="group-title">系统安全</div>
        <el-menu-item style="margin:0 0 12px 0;" index="/setting/list/backup">
          <font-awesome-icon class="list-icons" :icon="['fas', 'database']"/>
          <template #title>数据备份</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="padding: 0">
      <el-scrollbar max-height="calc(100vh - 55px)">
        <router-view></router-view>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import router from "../../router";

router.push('/setting/list/personal')
</script>

<style scoped>
.el-menu-vertical-demo {
  width: 260px;
  min-height: calc(100vh - 55px);
  padding: 0 12px;
}

.el-divider {
  margin: auto;
}

.el-menu-item {
  height: 36px;
}

.el-menu-item:hover {
  background-color: #f5f5f5;
  border-radius: 5px;
}

.is-active {
  background-color: #ebf0fb;
  border-radius: 5px;
}

.group-title {
  height: 48px;
  font-size: 11px;
  line-height: 48px;
  color: #999;
}

.list-icons {
  margin-right: 12px;
}
</style>