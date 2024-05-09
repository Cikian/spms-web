<template>
  <el-dialog
      v-model="openDialog"
      title="新建需求"
      width="80vw"
      :before-close="handleClose"
  >
    <div style="width: 100%">
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
      />
      <Editor
          style="height: 60vh; overflow-y: hidden;"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreatedEditor"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="openDialog = false">取消</el-button>
        <el-button type="primary" @click="submitIssue">
          发布
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import { ref, shallowRef} from "vue";
import {IToolbarConfig} from "@wangeditor/editor";

const mode = 'default' // 或 'simple'
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>无公告</p>')

const editorConfig = {
  placeholder: '请输入内容...',
}

const toolbarConfig: Partial<IToolbarConfig> = {  // TS 语法
  excludeKeys: [
    "uploadImage",
    "group-video"// 排除菜单组，写菜单组 key 的值即可
  ]
}

const submitIssue = () => {
  console.log("提交需求")
}
const handleCreatedEditor = (editorIssue) => {
  editorRef.value = editorIssue // 记录 editor 实例，重要！
}

const handleClose = (done: () => void) => {
  valueHtml.value = ''
  done()
}
</script>

<style scoped>

</style>