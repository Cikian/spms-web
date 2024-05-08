<template>
  <router-view/>
</template>

<script setup lang="ts">

</script>

<style>

body, html {
  margin: 0;
  padding: 0;
  background-color: #fff;
}
.el-dialog {
  border-radius: 20px!important;
  padding: 30px 20px!important;
}

.el-divider{
  border-top-color: #eeeeee!important;
}

.customPopper {
  width: 90px!important;
  min-width: 90px!important;
  text-align: center;
}

.form-control-input .el-select__wrapper {
  width: 100%;
  height: 48px!important;
  font-size: 16px;
}

.notification-drawer .el-drawer__body{
  padding: 0;
}
</style>
