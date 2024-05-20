<template>
  <el-container>
    <el-header  style="margin: 0; padding: 0; height: 52px; box-shadow: 0 4px 8px #00000008; z-index: 99">
      <el-menu
          class="el-menu-demo"
          mode="horizontal"
          style="height: 52px; padding: 0 20px"
          :router="true"
      >
        <span style="line-height: 52px;"><font-awesome-icon style="color: #ffb77d; margin-right: 5px" icon="fa-solid fa-house" />项目管理<el-divider style="margin: 0 16px" direction="vertical" /></span>
        <Notification/>
        <AvatarMenu />
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width=" ">
        <el-menu
            default-active="/workTable/overView"
            class="el-menu-vertical-demo"
            background-color="#fbfbfb"
            active-text-color="#6698ff"
            :router="true"
            style="padding: 0 12px 20px 12px"
        >

          <div class="group-title">项目</div>
          <el-menu-item style="margin:0 0 12px 0;" index="/proman/allpro">
            <font-awesome-icon class="list-icons" :icon="['fas', 'list-check']"/>
            <template #title>全部项目</template>
          </el-menu-item>
          <el-menu-item style="margin:0 0 12px 0;" index="/proman/tbcom">
            <font-awesome-icon class="list-icons" :icon="['fas', 'terminal']"/>
            <template #title>待完成项目</template>
          </el-menu-item>
          <el-menu-item style="margin:0 0 12px 0;" index="/proman/mySubmit">
            <font-awesome-icon class="list-icons" :icon="['far', 'file-code']" />
            <template #title>我提交的项目</template>
          </el-menu-item>
          <el-menu-item style="margin:0 0 12px 0;" index="/proman/audit" v-show="isROLE_project_director">
            <font-awesome-icon class="list-icons" :icon="['far', 'hourglass-half']" />
            <template #title>待审批</template>
          </el-menu-item>

        </el-menu>
      </el-aside>
      <el-main style="padding: 0">
        <el-scrollbar max-height="calc(100vh - 52px)">
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted, ref} from "vue";
import router from "../../router";
import Notification from "../../compoment/Notification.vue";
import AvatarMenu from "../../compoment/AvatarMenu.vue";

const isROLE_project_director = ref(false)

onMounted(() => {
  let roles = JSON.parse(localStorage.getItem('hasRole'))
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].authority === 'ROLE_project_director') {
      isROLE_project_director.value = true
      break
    }
  }

  router.push('/proman/allpro')
})
</script>

<style scoped>
.el-menu-vertical-demo {
  width: 260px;
  min-height: calc(100vh - 52px);
}

.home-user {
  width: 100%;
  height: 144px;
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