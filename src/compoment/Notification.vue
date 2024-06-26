<template>
  <!--  通知图标-->
  <div class="notification" @click="openNotificationList">
    <a-badge :dot="notificationList.length !== 0">
      <font-awesome-icon icon="fa-regular fa-bell" class="notification-icon" style=""/>
    </a-badge>
  </div>

  <el-drawer
      class="notification-drawer"
      v-model="notificationDrawer"
      title="通知"
      :direction="'rtl'"
      :before-close="handleClose"
  >
    <div class="notification-list">

      <el-empty v-if="notificationList.length === 0 && notificationOldList.length === 0" description="暂无通知"/>

      <div v-else>
        <el-empty v-if="showNewEmptyNotification" description="暂无最新通知"/>
        <div class="unread" v-if="notificationList.length !== 0">
          <el-card v-for="(item,index) in notificationList" :key="index"
                   style="margin-bottom: 10px; cursor: pointer" shadow="hover"
                   @click="readNotify(item.notificationId,index)">
            <div class="notification-title">
              <div class="notification-title-top">
                <div class="notification-title-icon">
                  <font-awesome-icon style="color: #4682fa" :icon="['fas', 'circle-exclamation']"/>
                </div>
                <div class="notification-title-content">
                  {{ item.content }}
                </div>
              </div>
              <div class="notification-title-time">
                {{ item.createTime }}
              </div>
            </div>
            <div class="notification-goat">{{ item.title }}</div>
          </el-card>
        </div>

        <transition name="fade">
          <el-divider v-if="!unreadNotification" content-position="center">已读通知</el-divider>
        </transition>

        <transition name="fade">
          <div class="read" v-if="!unreadNotification">
            <el-empty v-if="notificationOldList.length === 0" description="暂无历史通知"/>
            <el-card v-else v-for="(item,index) in notificationOldList" :key="index"
                     style="margin-bottom: 10px;cursor: pointer" shadow="hover"
                     @click="readNotify(item.notificationId,index)">
              <div class="notification-title">
                <div class="notification-title-top">
                  <div class="notification-title-icon">
                    <font-awesome-icon style="color: #4682fa" :icon="['fas', 'circle-exclamation']"/>
                  </div>
                  <div class="notification-title-content">
                    {{ item.content }}
                  </div>
                </div>
                <div class="notification-title-time">
                  {{ item.createTime }}
                </div>
              </div>
              <div class="notification-goat">{{ item.title }}</div>
            </el-card>
          </div>
        </transition>

      </div>

    </div>
    <div class="notification-footer">
      <el-switch v-model="unreadNotification" active-color="#13ce66" inactive-color="#ff4949" @change="handleSwitch"/>
      <span style="margin-left: 10px">只显示未读</span>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {getNotification, getOldNotification, readNotification} from "../api/NotificationApi.ts";

const notificationDrawer = ref(false);
const unreadNotification = ref(false);
const showNewEmptyNotification = ref(false)

let unreadNotificationCount = ref(0);
let notificationList = ref([]);
let notificationOldList = ref([]);

const getNotificationList = () => {
  getNotification()
      .then((res) => {
        if (res.data.code === 200) {
          if (res.data.data !== null) {
            notificationList.value = res.data.data;

            for (let i = 0; i < notificationList.value.length; i++) {
              let time = new Date().getTime() - new Date(notificationList.value[i].createTime).getTime();
              if (time < 60000) {
                notificationList.value[i].createTime = '刚刚';
              } else if (time < 3600000) {
                notificationList.value[i].createTime = Math.floor(time / 60000) + '分钟前';
              } else if (time < 86400000) {
                notificationList.value[i].createTime = Math.floor(time / 3600000) + '小时前';
              } else if (time < 604800000) {
                notificationList.value[i].createTime = Math.floor(time / 86400000) + '天前';
              } else {
                notificationList.value[i].createTime = new Date(notificationList.value[i].createTime).toLocaleDateString();
              }
            }
          } else {
            notificationList.value = [];
          }
        }
      })

};

const getOldNotificationList = () => {
  getOldNotification()
      .then(res => {
        if (res.data.code === 200) {
          if (res.data.data !== null) {
            notificationOldList.value = res.data.data;

            for (let i = 0; i < notificationOldList.value.length; i++) {
              let time = new Date().getTime() - new Date(notificationOldList.value[i].createTime).getTime();
              if (time < 60000) {
                notificationOldList.value[i].createTime = '刚刚';
              } else if (time < 3600000) {
                notificationOldList.value[i].createTime = Math.floor(time / 60000) + '分钟前';
              } else if (time < 86400000) {
                notificationOldList.value[i].createTime = Math.floor(time / 3600000) + '小时前';
              } else if (time < 604800000) {
                notificationOldList.value[i].createTime = Math.floor(time / 86400000) + '天前';
              } else {
                notificationOldList.value[i].createTime = new Date(notificationOldList.value[i].createTime).toLocaleDateString();
              }
            }
          } else {
            notificationOldList.value = [];
          }
        }
      })
}

const getUnreadNotificationCount = () => {
  unreadNotificationCount.value = 5;
};

const openNotificationList = () => {
  notificationDrawer.value = true;
};

const handleClose = () => {
  notificationDrawer.value = false;
};

const handleSwitch = () => {
  showNewEmptyNotification.value = unreadNotification.value && notificationList.value.length === 0;
}

const readNotify = (id, item) => {
  readNotification(id)
      .then(res => {
        if (res.data.code === 200) {
          if (item !== undefined) {
            notificationList.value.splice(item, 1);
          }
          getOldNotificationList();
        }
      })
}

onMounted(() => {
  getNotificationList()
  getOldNotificationList()
  getUnreadNotificationCount()
});
</script>

<style scoped>
.notification {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  cursor: pointer;
  position: absolute;
  right: 80px;
  border-radius: 50%;
  transition: all 0.2s;
}

.notification-icon {
  font-size: 20px;
  color: #474747;
  transition: all 0.2s;
}

.notification:hover {
  background-color: #e4eaff;
}

.notification:hover .notification-icon {
  color: #5fb2ff;
}

.tip {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  transition: all 0.2s;
}

.notification:hover .tip {
  background-color: #ff6c6c;
}

.notification-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.notification-list {
  padding: 20px 20px 0 20px;
  height: calc(100% - 50px);
  overflow-y: auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.notification-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-title-top {
  display: flex;
  align-items: center;
}

.notification-title-icon {
  margin-right: 10px;
}

.notification-title-content {
  font-size: 15px;
  font-weight: 700;
  color: #303133;
}

.notification-title-time {
  font-size: 12px;
  color: #909399;
}

.notification-goat {
  font-size: 15px;
  color: #606266;
  margin-top: 20px;
}
</style>