<template>
  proTest{{ proId }}
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

const proId = ref('')

onMounted(() => {
  let currentProId = localStorage.getItem('proDetailId')
  if (currentProId) {
    proId.value = currentProId
  }
})
</script>

<style scoped>

</style>