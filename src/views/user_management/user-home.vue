<template>
  <el-scrollbar max-height="calc(100vh - 52px)">
    <router-view></router-view>
  </el-scrollbar>
</template>

<script setup lang="ts">
import router from "../../router";
import {onMounted} from "vue";

onMounted(() => {
  router.push("/user/management")
})

</script>

<style scoped>

</style>