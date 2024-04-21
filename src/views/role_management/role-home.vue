<template>
  <router-view/>
</template>

<script setup lang="ts">
import router from "../../router";
import {onMounted} from "vue";

onMounted(() => {
  router.push("/role/management")
})

</script>

<style scoped>

</style>