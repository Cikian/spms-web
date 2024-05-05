<template>
  <div style="padding: 30px 20px">
    <el-row :gutter="20">
      <el-col :span="6">
        <div style=" height: 376px; padding: 24px 28px; box-shadow: var(--el-box-shadow)">
          <el-row>
            <el-col :span="24" style="padding-bottom: 18px">
              基本信息
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="padding-bottom: 10px;" class="basic-info-title">状态</div>
              <el-button type="success" round size="small">正常</el-button>
            </el-col>
            <el-col :span="12">
              <div style="padding-bottom: 10px" class="basic-info-title">负责人</div>
              <div>张三</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">开始时间</div>
              <div style="padding-bottom: 10px">2022-04-23</div>
            </el-col>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">结束时间</div>
              <div style="padding-bottom: 10px">2022-04-23</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">进度</div>
              <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="50"
                  status="success"
              />
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="18">
        <div style="height: 376px;padding: 24px 28px; box-shadow: var(--el-box-shadow)">
          <el-row>
            <el-col :span="24" style="padding-bottom: 44px">
              工作项统计
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="padding-bottom: 18px; display: flex; justify-content: space-around">
              <el-progress type="circle" :percentage="25" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">任务</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="100" status="success" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">缺陷</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="70" status="warning" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">缺陷</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="50" status="exception" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">测试</span>
                </template>
              </el-progress>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
  <div style="padding: 30px 20px; height: 500px">
    <el-row :gutter="20">
      <el-col :span="12">
        <div style=" height: 400px; padding: 24px 28px; box-shadow: var(--el-box-shadow)">
          <el-row>
            <el-col :span="24" style="padding-bottom: 18px">
              项目属性
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div style="padding-bottom: 10px;" class="basic-info-title">状态</div>
              <el-button type="success" round size="small">正常</el-button>
            </el-col>
            <el-col :span="12">
              <div style="padding-bottom: 10px" class="basic-info-title">负责人</div>
              <div>张三</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">开始时间</div>
              <div style="padding-bottom: 10px">2022-04-23</div>
            </el-col>
            <el-col :span="12" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">结束时间</div>
              <div style="padding-bottom: 10px">2022-04-23</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="margin-top: 50px">
              <div style="padding-bottom: 10px" class="basic-info-title">进度</div>
              <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="50"
                  status="success"
              />
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="height: 400px;padding: 24px 28px; box-shadow: var(--el-box-shadow)">
          <el-row>
            <el-col :span="24" style="padding-bottom: 44px">
              工作项统计
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="padding-bottom: 18px; display: flex; justify-content: space-around">
              <el-progress type="circle" :percentage="25" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">任务</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="100" status="success" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">缺陷</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="70" status="warning" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">缺陷</span>
                </template>
              </el-progress>
              <el-progress type="circle" :percentage="50" status="exception" width="200">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">测试</span>
                </template>
              </el-progress>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
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
.basic-info-title {
  font-size: 14px;
  color: #666666;
}

.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>