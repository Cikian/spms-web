<template>
  <div class="overView-title"
       style="display: flex; align-items: center; justify-content: space-between;">
    会议记录
    <el-button type="primary" @click="openAddDialog" size="large">
      <font-awesome-icon style="margin-right: 10px" :icon="['fas', 'plus']"/>
      新增会议
    </el-button>
  </div>

  <div style="width: 100%; padding: 0 40px">
    <el-empty v-if="false" description="暂无数据"/>
    <div v-else>
      <el-table
          :data="tableData"
          stripe
          size="large"
          @row-click="clickRow"
      >
        <el-table-column type="index" label="序号" width="70" align="center"/>
        <el-table-column prop="title" label="会议名称" width="300" show-overflow-tooltip/>
        <el-table-column prop="createTime" label="日期" align="center"/>
      </el-table>

    </div>
  </div>

  <el-dialog
      v-model="addDialogVisible"
      title="新增会议"
      width="60vw"
      :before-close="handleClose"
      top="7vh"
  >
    <el-form
        :model="formData"
        label-width="auto"
        label-position="top"
        require-asterisk-position="right"
        size="large"
    >

      <el-form-item label="会议名称" required>
        <el-input v-model="formData.title" placeholder="请输入会议名称"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
            v-model="formData.meetingAbstract"
            type="textarea"
            :resize="'none'"
            placeholder="请输入会议描述"
            :autosize="{ minRows: 8, maxRows: 8 }"
            show-word-limit
            maxlength="1000"
        ></el-input>
      </el-form-item>
      <el-form-item label="会议记录">
        <el-upload
            class="upload-report"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :http-request="handleUpload"
            drag>
          <font-awesome-icon style="font-size: 50px;margin: 20px auto;" icon="fa-solid fa-cloud-arrow-up"/>
          <div class="el-upload__text">
            将文件拖动到此或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip" style="font-size: 15px">
              仅支持上传 <em>doc</em>、<em>docx</em>、<em>pdf</em> 格式文件
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button size="large" @click="addDialogVisible = false">取消</el-button>
        <el-button size="large" type="primary" @click="submitAdd">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
      v-model="editDialogVisible"
      title="会议详情"
      width="60vw"
      :before-close="handleClose"
  >
    <el-input class="click-dialog-input"
              v-model="clickedMeeting.title"
              size="large"
              style="height: 50px; font-size: 22px">
    </el-input>

    <div>
      <div style="margin: 20px 20px; font-size: 20px; font-weight: bold; ">摘要</div>
      <div style="margin: 20px 20px; font-size: 18px; ">{{ clickedMeeting.meetingAbstract }}</div>
    </div>

    <div style="margin-top: 100px">
      <div style="margin: 20px 20px; font-size: 20px; font-weight: bold; ">会议记录文件</div>
      <div style="margin: 20px 20px; font-size: 18px; ">
        <el-link :href="clickedMeeting.reportFile"
                 target="_blank">
          <font-awesome-icon v-if="getFileName(clickedMeeting.reportFile) === '.pdf'"
                             style="width: 18px; color: #ff0000" :icon="['fas', 'file-pdf']"/>
          <font-awesome-icon v-else style="width: 18px; color: #0084ff" :icon="['fas', 'file-word']"/>
          “{{ clickedMeeting.title }}”-会议记录{{ getFileName(clickedMeeting.reportFile) }}
        </el-link>
      </div>
    </div>

  </el-dialog>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted, ref} from "vue";
import {addMeeting, getMeetingByProId, uploadMeetingReport} from "../../api/meetingApi.ts";
import {UploadProps} from "element-plus";

const proId = ref('')

const getFileName = (url: string) => {
  // 获取文件拓展名
  let index1 = url.lastIndexOf(".");
  let index2 = url.length;
  return url.substring(index1, index2);//后缀名
}

const lastIndexOf = (str, target) => {
  return str.lastIndexOf(target)
}

onMounted(() => {
  let currentProId = localStorage.getItem('proDetailId')
  if (currentProId) {
    proId.value = currentProId
    getMeetingList(proId.value)
  }

})

const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const clickedMeeting = ref({})
const clickRow = (row) => {
  clickedMeeting.value = row
  editDialogVisible.value = true
}

const openAddDialog = () => {
  addDialogVisible.value = true
}

const tableData = ref([])

const formData = ref({
  title: '',
  proId: '',
  meetingAbstract: '',
  reportFile: '',
})

const beforeUpload = (file) => {
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElNotification({
      title: '警告',
      message: '上传文件大小不能超过 5MB!',
      type: 'warning'
    })
  }

  const isDoc = file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/pdf';
  if (!isDoc) {
    ElNotification({
      title: '警告',
      message: '上传文件只能是doc、docx、pdf格式!',
      type: 'warning'
    })
  }
  return isLt5M && isDoc;
}

const handleUpload = (file) => {
  let formData1 = new FormData();
  formData1.append('file', file.file);
  formData1.append('proId', proId.value);

  uploadMeetingReport(formData1)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          formData.value.reportFile = res.data.data
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

const submitAdd = () => {
  formData.value.proId = proId.value
  addMeeting(formData.value)
      .then(res => {
        if (res.data.code === 3001) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          addDialogVisible.value = false
          formData.value = {
            title: '',
            proId: '',
            meetingAbstract: '',
            reportFile: '',
          }
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}
const getMeetingList = (selectedProId) => {
  getMeetingByProId(selectedProId)
      .then(res => {
        console.log(res)
        if (res.data.code === 2001) {
          tableData.value = res.data.data
          for (let i = 0; i < tableData.value.length; i++) {
            tableData.value[i].createTime = tableData.value[i].createTime.replace('T', ' ')
          }
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
}

const handleClose = (done) => {
  formData.value = {
    title: '',
    proId: '',
    meetingAbstract: '',
    reportFile: '',
  }
  done()
}

</script>

<style scoped>
.overView-title {
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 22px;
  font-weight: 700;
  padding: 0 40px;
}

</style>