<template>
  <div
      style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      padding: 0 30px;
"
  >
    <el-input placeholder="请输入需求编号或标题" size="large" style="height: 38px; width: 260px" clearable>

    </el-input>
    <el-button type="primary" @click="openAddDemandDialog">发布需求</el-button>
  </div>
  <el-table
      :data="demandsByLevel"
      row-key="demandId"
      :indent="40"
      border
      style="width: 100%"
      size="large"
      @selection-change="handleSelectionChange"
      :header-cell-style="{'text-align': 'center',}"
      @row-click="clickRow"
  >
    <el-table-column align="center" type="selection"/>
    <el-table-column align="center" label="序号" type="index" min-width="30px"/>
    <el-table-column align="center" prop="demandNo" label="编号" sortable type=""/>
    <el-table-column align="left" prop="title" label="标题" min-width="200px">
      <template #default="scope">
          <span v-show="scope.row.workItemType===0"><font-awesome-icon
              style="color: #ff877b;width: 18px; margin-right: 5px"
              :icon="['fas', 'bolt-lightning']"/>{{ scope.row.title }}</span>
        <span v-show="scope.row.workItemType===1"><font-awesome-icon
            style="color: #9191f9;width: 18px; margin-right: 5px"
            :icon="['fas', 'flag']"/>{{ scope.row.title }}</span>
        <span v-show="scope.row.workItemType===2"><font-awesome-icon
            style="color: #30d1fc;width: 18px; margin-right: 5px"
            :icon="['fas', 'book-open']"/>{{ scope.row.title }}</span>
        <span v-show="scope.row.workItemType===3"><font-awesome-icon
            style="color: #73d897;width: 18px; margin-right: 5px"
            :icon="['fas', 'square-check']"/>{{ scope.row.title }}</span>
        <div class="table-title-cell">
          <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.workItemType===0?'新建特性':scope.row.workItemType===1?'新建用户故事':scope.row.workItemType===2?'新建任务':'任务'"
              placement="top" ,
              v-if="scope.row.workItemType!==3"
          >
            <el-button @click="addWorkItem(scope.row)" style="font-size: 20px; margin-right: 20px" type="text">
              <font-awesome-icon :icon="['fas', 'plus']"/>
            </el-button>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="Top Center prompts info"
              placement="top"
          >
            <el-button style="font-size: 18px; margin-right: 30px" type="text">
              <font-awesome-icon :icon="['far', 'pen-to-square']"/>
            </el-button>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="demandStatus" label="状态" class-name="table-statue-column">
      <template #default="scope">
        <el-select
            v-model="scope.row.demandStatus"
            placeholder="请选择优先级"
            class="demand-status-select"
            @change="demandStatusChange(scope.row)"
        >
          <el-option
              class="demand-table-select-options-menu"
              :key="0"
              label="打开"
              :value="0"
              :disabled="scope.row.demandStatus === 0"
          >
            <div v-if="scope.row.demandStatus === 0" class="table-statue" style="background-color: #b5d8fa;">打开</div>
            <div v-else class="table-statue" style="background-color: #56abfb;">打开</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="1"
              label="进行中"
              :value="1"
              :disabled="scope.row.demandStatus === 1 || scope.row.demandStatus === -1"
          >
            <div v-if="scope.row.demandStatus === 1 || scope.row.demandStatus === -1" class="table-statue"
                 style="background-color: #fae3b2;">进行中
            </div>
            <div v-else class="table-statue" style="background-color: #f6c659;">进行中</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="2"
              label="已完成"
              :value="2"
              :disabled="scope.row.demandStatus === 2 || scope.row.demandStatus === -1"
          >
            <div v-if="scope.row.demandStatus === 2 || scope.row.demandStatus === -1" class="table-statue"
                 style="background-color: #c0fad5;">已完成
            </div>
            <div v-else class="table-statue" style="background-color: #9de4b6;">已完成</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="-1"
              label="关闭"
              :value="-1"
              :disabled="scope.row.demandStatus === -1"
          >
            <div v-if="scope.row.demandStatus === -1" class="table-statue" style="background-color: #e0dede;">关闭</div>
            <div v-else class="table-statue" style="background-color: #c3c3c3;">关闭</div>
          </el-option>

          <template #prefix>
            <div class="table-statue" style="background-color: #56abfb;" v-show="scope.row.demandStatus===0">打开</div>
            <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.demandStatus===1">进行中
            </div>
            <div class="table-statue" style="background-color: #9de4b6;" v-show="scope.row.demandStatus===2">已完成
            </div>
            <div class="table-statue" style="background-color: #c3c3c3;" v-show="scope.row.demandStatus===-1">关闭</div>
          </template>
        </el-select>


        <!--        <div class="table-statue" style="background-color: #56abfb;" v-show="scope.row.demandStatus===0">打开</div>-->
        <!--        <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.demandStatus===1">进行中</div>-->
        <!--        <div class="table-statue" style="background-color: #9de4b6;" v-show="scope.row.demandStatus===2">已完成</div>-->
        <!--        <div class="table-statue" style="background-color: #c3c3c3;" v-show="scope.row.demandStatus===-1">关闭</div>-->
      </template>
    </el-table-column>
    <el-table-column align="center" prop="headId" label="负责人">
      <template #default="scope">
        <el-select
            v-model="scope.row.headId"
            placeholder="—"
            class="demand-headId-select"
            @change="demandHeadIdChange(scope.row)"
        >
          <el-option
              class="member-select-options-menu"
              v-for="item in members"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
          >
            <div style="display: flex; align-items: center; text-align: center">
              <div style="display: flex; align-items: center;">
                <el-avatar :size="'small'" :src="item.avatar" style="position: relative; top: 0.2vh;"/>
              </div>

              <span style="margin-left: 10px">{{ item.nickName }}</span>
            </div>
          </el-option>

          <template #prefix>
            <div v-for="member in members"
                 v-show="member.userId === scope.row.headId"
                 style="display: flex; align-items: center"
            >
              <el-avatar :size="'small'" :src="member.avatar" style="position: relative; top: 0.2vh;"/>
            </div>
          </template>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="priority" label="优先级">
      <template #default="scope">
        <el-select
            v-model="scope.row.priority"
            placeholder="请选择优先级"
            class="demand-status-select"
            @change="demandPriorityChange(scope.row)"
        >
          <el-option
              class="demand-table-select-options-menu"
              :key="4"
              label="最高"
              :value="4"
          >
            <div class="table-statue" style="background-color: #ff7575;">最高</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="3"
              label="较高"
              :value="3"
          >
            <div class="table-statue" style="background-color: #ff9f73;">较高</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="2"
              label="普通"
              :value="2"
          >
            <div class="table-statue" style="background-color: #f6c659;">普通</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="1"
              label="较低"
              :value="1"
          >
            <div class="table-statue" style="background-color: #5dcfff;">较低</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="0"
              label="最低"
              :value="0"
          >
            <div class="table-statue" style="background-color: #73d897;">最低</div>
          </el-option>


          <template #prefix>
            <div class="table-statue" style="background-color: #73d897;" v-show="scope.row.priority===0">最低</div>
            <div class="table-statue" style="background-color: #5dcfff;" v-show="scope.row.priority===1">较低</div>
            <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.priority===2">普通</div>
            <div class="table-statue" style="background-color: #ff9f73;" v-show="scope.row.priority===3">较高</div>
            <div class="table-statue" style="background-color: #ff7575;" v-show="scope.row.priority===4">最高</div>
          </template>
        </el-select>


      </template>
    </el-table-column>
    <el-table-column align="center" prop="fatherDemandId" label="父工作项">
      <template #default="scope">
        <span v-for="demand in demandsByLevel" v-show="demand.demandId === scope.row.fatherDemandId">{{
            demand.title
          }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="type" label="需求类型">
      <template #default="scope">
        <span v-for="type in demandTypes" v-show="type.dictionaryDataId === scope.row.type">{{ type.label }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="storyPoint" label="故事点"/>
    <el-table-column align="center" prop="updateTime" label="更新时间"/>

  </el-table>

  <!--  新建需求弹窗-->
  <el-dialog
      v-model="addDemandDialogVisible"
      title="新建需求"
      width="80vw"
      :before-close="handleClose"
      top="7vh"
      @close="closeAddDemandDialog"
  >
    <el-form
        :model="newDemandFormData"
        label-width="auto"
        label-position="top"
        require-asterisk-position="right"
        size="large"
    >
      <div style="width: 100%; height: 70vh; margin: 0 auto; display: flex; justify-content: space-between">
        <div style="width: 73%; ">
          <el-form-item label="标题" required>
            <el-input v-model="newDemandFormData.title" placeholder="请输入需求标题"></el-input>
          </el-form-item>

          <el-form-item label="描述">
            <div style="width: 100%">
              <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editorRef"
                  :defaultConfig="toolbarConfig"
                  :mode="mode"
              />
              <Editor
                  style="height: 300px; overflow-y: hidden;"
                  v-model="valueHtml"
                  :defaultConfig="editorConfig"
                  :mode="mode"
                  @onCreated="handleCreatedEditor"
              />
            </div>
          </el-form-item>

        </div>
        <el-scrollbar style="width: 25%; padding-left: 20px; border-left: rgba(0,0,0,0.1) solid 1px">
          <el-form-item label="项目" required>
            <el-input readonly disabled v-model="currentProInfo.proName">
              <template #prefix>
                <font-awesome-icon style="color: #56abfb; margin-right: 8px" icon="fa-solid fa-folder-plus"/>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="工作项类型" required>
            <el-select
                v-model="newDemandFormData.workItemType"
                placeholder="请选择工作项类型"
                size="large"
                clearable
            >
              <el-option
                  :key="0"
                  label="史诗"
                  :value="0"
              >
                <font-awesome-icon style="color: #ff877b;width: 18px" :icon="['fas', 'bolt-lightning']"/>
                史诗
              </el-option>
              <el-option
                  :key="1"
                  label="特性"
                  :value="1"
              >
                <font-awesome-icon style="color: #9191f9;width: 18px" :icon="['fas', 'flag']"/>
                特性
              </el-option>
              <el-option
                  :key="2"
                  label="用户故事"
                  :value="2"
              >
                <font-awesome-icon style="color: #30d1fc;width: 18px" :icon="['fas', 'book-open']"/>
                用户故事
              </el-option>
              <el-option
                  :key="3"
                  label="任务"
                  :value="3"
              >
                <font-awesome-icon style="color: #73d897;width: 18px" :icon="['fas', 'square-check']"/>
                任务
              </el-option>
              <template #prefix>
                <font-awesome-icon style="color: #ff877b;width: 18px" :icon="['fas', 'bolt-lightning']"
                                   v-show="newDemandFormData.workItemType===0"/>
                <font-awesome-icon style="color: #9191f9;width: 18px" :icon="['fas', 'flag']"
                                   v-show="newDemandFormData.workItemType===1"/>
                <font-awesome-icon style="color: #30d1fc;width: 18px" :icon="['fas', 'book-open']"
                                   v-show="newDemandFormData.workItemType===2"/>
                <font-awesome-icon style="color: #73d897;width: 18px" :icon="['fas', 'square-check']"
                                   v-show="newDemandFormData.workItemType===3"/>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="父工作项">
            <el-select
                v-model="newDemandFormData.fatherDemandId"
                placeholder="请选父工作项"
                size="large"
                clearable
            >
              <el-option
                  v-for="item in allDemands"
                  :key="item.demandId"
                  :label="item.title"
                  :value="item.demandId"
              />


              <!--              <template #prefix>-->
              <!--                <font-awesome-icon style="color: #ff877b;width: 18px" :icon="['fas', 'bolt-lightning']" v-show=".dType===0"/>-->
              <!--                <font-awesome-icon style="color: #9191f9;width: 18px" :icon="['fas', 'flag']" v-show="newDemandFormData.dType===1"/>-->
              <!--                <font-awesome-icon style="color: #30d1fc;width: 18px" :icon="['fas', 'book-open']" v-show="newDemandFormData.dType===2"/>-->
              <!--                <font-awesome-icon style="color: #73d897;width: 18px" :icon="['fas', 'square-check']" v-show="newDemandFormData.dType===3"/>-->
              <!--              </template>-->
            </el-select>
          </el-form-item>

          <el-form-item label="负责人">
            <el-select
                v-model="newDemandFormData.headId"
                placeholder="请选择负责人"
                size="large"
                clearable
            >
              <el-option
                  class="member-select-options-menu"
                  v-for="item in members"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
              >
                <div style="display: flex; align-items: center; text-align: center">
                  <div style="display: flex; align-items: center;">
                    <el-avatar :size="'small'" :src="item.avatar" style="position: relative; top: 0.2vh;"/>
                  </div>

                  <span style="margin-left: 10px">{{ item.nickName }}</span>
                </div>
              </el-option>
              <template #prefix>
                <div v-for="member in members"
                     v-show="member.userId === newDemandFormData.headId"
                     style="display: flex; align-items: center;"
                >
                  <el-avatar :size="'small'" :src="member.avatar" style="position: relative; top: 0.2vh;"/>
                </div>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item labei="开始时间">
            <el-date-picker
                v-model="newDemandFormData.startTime"
                type="date"
                placeholder="选择日期"
                size="large"
                clearable
            />
          </el-form-item>
          <el-form-item labei="结束时间">
            <el-date-picker
                v-model="newDemandFormData.endTime"
                type="date"
                placeholder="选择日期"
                size="large"
                clearable
            />
          </el-form-item>
          <el-form-item label="优先级">
            <el-select
                v-model="newDemandFormData.priority"
                placeholder="请选择优先级"
                size="large"
                clearable
                class="demand-add-status-select"
            >
              <el-option
                  class="add-demand-priority-select-options-menu"
                  :key="4"
                  label="最高"
                  :value="4"
              >
                <div class="select-priority-options" style="background-color: #ff7575;">
                  最高
                </div>
              </el-option>
              <el-option
                  class="add-demand-priority-select-options-menu"
                  :key="3"
                  label="较高"
                  :value="3"
              >
                <div class="select-priority-options" style="background-color: #ff9f73;">
                  较高
                </div>
              </el-option>
              <el-option
                  class="add-demand-priority-select-options-menu"
                  :key="2"
                  label="普通"
                  :value="2"
              >
                <div class="select-priority-options" style="background-color: #f6c659;">
                  普通
                </div>
              </el-option>
              <el-option
                  class="add-demand-priority-select-options-menu"
                  :key="1"
                  label="较低"
                  :value="1"
              >
                <div class="select-priority-options" style="background-color: #5dcfff;">
                  较低
                </div>
              </el-option>
              <el-option
                  class="add-demand-priority-select-options-menu"
                  :key="0"
                  label="最低"
                  :value="0"
              >
                <div class="select-priority-options" style="background-color: #73d897;">
                  最低
                </div>
              </el-option>
              <template #prefix>
                <div class="select-priority-options" style="background-color: #ff7575;"
                     v-show="newDemandFormData.priority===4">最高
                </div>
                <div class="select-priority-options" style="background-color: #ff9f73;"
                     v-show="newDemandFormData.priority===3">较高
                </div>
                <div class="select-priority-options" style="background-color: #f6c659;"
                     v-show="newDemandFormData.priority===2">普通
                </div>
                <div class="select-priority-options" style="background-color: #5dcfff;"
                     v-show="newDemandFormData.priority===1">较低
                </div>
                <div class="select-priority-options" style="background-color: #73d897;"
                     v-show="newDemandFormData.priority===0">最低
                </div>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="需求类型">
            <el-select
                v-model="newDemandFormData.type"
                placeholder="请选择需求类型"
                size="large"
                clearable
            >
              <el-option
                  v-for="item in demandTypes"
                  :key="item.dictionaryDataId"
                  :label="item.label"
                  :value="item.dictionaryDataId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="需求来源">
            <el-select
                v-model="newDemandFormData.source"
                placeholder="请选择需求来源"
                size="large"
                clearable
            >
              <el-option
                  v-for="item in demandSource"
                  :key="item.dictionaryDataId"
                  :label="item.label"
                  :value="item.dictionaryDataId"
              />
            </el-select>
          </el-form-item>
        </el-scrollbar>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDemandDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddDemand">
          发布
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!--  点击需求弹窗-->
  <el-dialog
      v-model="clickRowDialogVisible"
      width="80vw"
      style="height: 90vh"
      top="3vh"
      @close="handleCloseClickRow"
  >
    <div style="width: 100%; height: 80vh; margin: 0 auto; display: flex; justify-content: space-between; overflow: hidden">
      <el-scrollbar style="width: 75%;">
        <el-input class="click-dialog-input" v-model="clickedDemand.title" placeholder="请输入需求标题" size="large"
                  style="height: 50px; font-size: 22px"></el-input>

        <div style="width: 100%; padding: 20px 20px;">
          <el-descriptions
              direction="vertical"
              :column="4"
              :size="size"
          >
            <el-descriptions-item width="25%" label="负责人">
              <el-select
                  v-model="clickedDemand.headId"
                  placeholder="—"
                  class="demand-headId-select"
                  @change="demandHeadIdChange(clickedDemand)"
                  style="width: 80%"
              >
                <el-option
                    class="member-select-options-menu"
                    v-for="item in members"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId"
                >
                  <div style="display: flex; align-items: center; text-align: center">
                    <div style="display: flex; align-items: center;">
                      <el-avatar :size="'small'" :src="item.avatar" style="position: relative; top: 0.2vh;"/>
                    </div>

                    <span style="margin-left: 10px">{{ item.nickName }}</span>
                  </div>
                </el-option>

                <template #prefix>
                  <div v-for="member in members"
                       v-show="member.userId === clickedDemand.headId"
                       style="display: flex; align-items: center"
                  >
                    <el-avatar :size="'small'" :src="member.avatar" style="position: relative; top: 0.2vh;"/>
                  </div>
                </template>
              </el-select>
            </el-descriptions-item>
            <el-descriptions-item width="25%" label="状态">
              <el-select
                  v-model="clickedDemand.demandStatus"
                  placeholder="请选择优先级"
                  class="demand-status-select"
                  @change="demandStatusChange(clickedDemand)"
                  style="width: 80%"
              >
                <el-option
                    class="demand-table-select-options-menu"
                    :key="0"
                    label="打开"
                    :value="0"
                    :disabled="clickedDemand.demandStatus === 0"
                >
                  <div v-if="clickedDemand.demandStatus === 0" class="table-statue" style="background-color: #b5d8fa;">
                    打开
                  </div>
                  <div v-else class="table-statue" style="background-color: #56abfb;">打开</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="1"
                    label="进行中"
                    :value="1"
                    :disabled="clickedDemand.demandStatus === 1 || clickedDemand.demandStatus === -1"
                >
                  <div v-if="clickedDemand.demandStatus === 1 || clickedDemand.demandStatus === -1" class="table-statue"
                       style="background-color: #fae3b2;">进行中
                  </div>
                  <div v-else class="table-statue" style="background-color: #f6c659;">进行中</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="2"
                    label="已完成"
                    :value="2"
                    :disabled="clickedDemand.demandStatus === 2 || clickedDemand.demandStatus === -1"
                >
                  <div v-if="clickedDemand.demandStatus === 2 || clickedDemand.demandStatus === -1" class="table-statue"
                       style="background-color: #c0fad5;">已完成
                  </div>
                  <div v-else class="table-statue" style="background-color: #9de4b6;">已完成</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="-1"
                    label="关闭"
                    :value="-1"
                    :disabled="clickedDemand.demandStatus === -1"
                >
                  <div v-if="clickedDemand.demandStatus === -1" class="table-statue" style="background-color: #e0dede;">
                    关闭
                  </div>
                  <div v-else class="table-statue" style="background-color: #c3c3c3;">关闭</div>
                </el-option>

                <template #prefix>
                  <div class="table-statue" style="background-color: #56abfb;" v-show="clickedDemand.demandStatus===0">
                    打开
                  </div>
                  <div class="table-statue" style="background-color: #f6c659;" v-show="clickedDemand.demandStatus===1">
                    进行中
                  </div>
                  <div class="table-statue" style="background-color: #9de4b6;" v-show="clickedDemand.demandStatus===2">
                    已完成
                  </div>
                  <div class="table-statue" style="background-color: #c3c3c3;" v-show="clickedDemand.demandStatus===-1">
                    关闭
                  </div>
                </template>
              </el-select>
            </el-descriptions-item>
            <el-descriptions-item width="25%" label="开始时间">
              <el-date-picker
                  v-model="clickedDemand.startTime"
                  type="date"
                  placeholder="——"
                  class="click-dialog-input"
                  :clearable="false"
              />
            </el-descriptions-item>
            <el-descriptions-item width="25%" label="结束时间">
              <el-date-picker
                  v-model="clickedDemand.endTime"
                  type="date"
                  placeholder="——"
                  class="click-dialog-input"
                  :clearable="false"
              />
            </el-descriptions-item>

          </el-descriptions>
        </div>

        <el-tabs v-model="firstTagName">
          <el-tab-pane label="基本信息" name="baseInfo">
            <div style="display: flex; justify-content: space-between; padding-right: 50px; align-items: center">
              <span>描述</span>
              <el-button @click="openClickEditor" text round style="font-size: 18px;">
                <font-awesome-icon :icon="['fas', 'pencil']"/>
              </el-button>
            </div>
            <Toolbar
                v-show="false"
                style="border-bottom: 1px solid #ccc"
                :editor="clickReadOnlyEditorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
            />
            <Editor
                v-show="showDesc"
                style="height: 200px; overflow-y: hidden;"
                v-model="clickValueHtmlReadOnly"
                :defaultConfig="{
                      readOnly: true
                    }"
                :mode="mode"
                @onCreated="handleCreatedClickReadOnlyEditor"
            />

            <div v-show="!showDesc">
              <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="clickEditorRef"
                  :defaultConfig="toolbarConfig"
                  :mode="mode"
              />
              <Editor
                  style="height: 300px; overflow-y: hidden;"
                  v-model="clickValueHtml"
                  :defaultConfig="editorConfig"
                  :mode="mode"
                  @onCreated="handleCreatedClickEditor"
              />
              <div style="text-align: right; padding-right: 50px">
                <el-button @click="closeClickEditor" type="text" text>取消</el-button>
                <el-button @click="submitClickEditor(clickedDemand.demandId)" type="primary">保存</el-button>
              </div>
            </div>
            <el-tabs v-model="secondTagName" class="click-row-bottom-tags">
              <el-tab-pane label="评论" name="comment">评论</el-tab-pane>
              <el-tab-pane label="活动" name="active">活动</el-tab-pane>
              <el-tab-pane label="流转" name="circulation">流转</el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="子工作项" name="childrenWorkItem">Config</el-tab-pane>
          <el-tab-pane label="测试" name="tests">Role</el-tab-pane>
        </el-tabs>


      </el-scrollbar>
      <el-scrollbar style="width: 25%; padding-left: 20px; border-left: rgba(0,0,0,0.1) solid 1px">
        <div style="width: 100%;">
          <span style="font-size: 12px; color: #999999;">属性</span>
          <div style="display: flex; margin-top: 18px; color: #666666">
            <div style="width: 25%;font-size: 14px; line-height: 38px;">优先级</div>
            <div style="line-height: 30px; width: 50%">
              <el-select
                  v-model="clickedDemand.priority"
                  placeholder="请选择优先级"
                  class="demand-status-select"
                  @change="demandPriorityChange(clickedDemand)"
              >
                <el-option
                    class="demand-table-select-options-menu"
                    :key="4"
                    label="最高"
                    :value="4"
                >
                  <div class="table-statue" style="background-color: #ff7575;">最高</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="3"
                    label="较高"
                    :value="3"
                >
                  <div class="table-statue" style="background-color: #ff9f73;">较高</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="2"
                    label="普通"
                    :value="2"
                >
                  <div class="table-statue" style="background-color: #f6c659;">普通</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="1"
                    label="较低"
                    :value="1"
                >
                  <div class="table-statue" style="background-color: #5dcfff;">较低</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="0"
                    label="最低"
                    :value="0"
                >
                  <div class="table-statue" style="background-color: #73d897;">最低</div>
                </el-option>


                <template #prefix>
                  <div class="table-statue" style="background-color: #73d897;" v-show="clickedDemand.priority===0">最低</div>
                  <div class="table-statue" style="background-color: #5dcfff;" v-show="clickedDemand.priority===1">较低</div>
                  <div class="table-statue" style="background-color: #f6c659;" v-show="clickedDemand.priority===2">普通</div>
                  <div class="table-statue" style="background-color: #ff9f73;" v-show="clickedDemand.priority===3">较高</div>
                  <div class="table-statue" style="background-color: #ff7575;" v-show="clickedDemand.priority===4">最高</div>
                </template>
              </el-select>
            </div>
          </div>
          <div style="display: flex;">
            <div style="width: 25%;font-size: 14px; line-height: 38px;">需求类型</div>
            <div style="width: 50%;line-height: 30px">
              <el-select
                  v-model="clickedDemand.type"
                  placeholder="请选择需求类型"
                  size="large"
                  class="demand-status-select"
                  @change="demandTypeChange(clickedDemand)"
              >
                <el-option
                    v-for="item in demandTypes"
                    :key="item.dictionaryDataId"
                    :label="item.label"
                    :value="item.dictionaryDataId"
                />
                <template #prefix>
                  <div v-if="clickedDemand.type === null || clickedDemand.type === ''">——</div>
                  <div v-for="item in demandTypes" :key="item.dictionaryDataId" v-show="item.dictionaryDataId === clickedDemand.type">{{ item.label }}</div>
                </template>
              </el-select>
            </div>
          </div>
          <div style="display: flex;">
            <div style="width: 25%;font-size: 14px; line-height: 38px;">需求来源</div>
            <div style="width: 50%;line-height: 30px">
              <el-select
                  v-model="clickedDemand.source"
                  placeholder="请选择需求类型"
                  size="large"
                  class="demand-status-select"
                  @change="demandSourceChange(clickedDemand)"
              >
                <el-option
                    v-for="item in demandSource"
                    :key="item.dictionaryDataId"
                    :label="item.label"
                    :value="item.dictionaryDataId"
                />
                <template #prefix>
                  <div v-if="clickedDemand.source === null || clickedDemand.source === ''">——</div>
                  <div v-for="item in demandSource" :key="item.dictionaryDataId" v-show="item.dictionaryDataId === clickedDemand.source">{{ item.label }}</div>
                </template>
              </el-select>
            </div>
          </div>
        </div>
        <div style="width: 100%; margin-top: 50px">
          <span style="font-size: 12px; color: #999999;">基础属性</span>
          <div style="display: flex; margin-top: 18px; color: #666666">
            <div style="width: 25%;font-size: 14px; line-height: 38px;">项目</div>
            <div style="line-height: 30px; width: 50%">
              <font-awesome-icon style="color: #56abfb; margin-right: 8px" icon="fa-solid fa-folder-plus"/>
              {{ currentProInfo.proName }}
            </div>
          </div>
          <div style="display: flex; margin-top: 14px">
            <div style="width: 25%;font-size: 14px; line-height: 38px;">创建人</div>
            <div style="width: 50%;line-height: 30px">
              <div v-for="member in members"
                   v-show="member.userId === clickedDemand.createBy"
                   style="display: flex;"
              >
                <el-avatar :size="'small'" :src="member.avatar" style="position: relative; top: 0.2vh;"/>
                <span style="margin-left: 10px;">{{ member.nickName }}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; margin-top: 14px">
            <div style="width: 25%;font-size: 14px; line-height: 38px;">创建时间</div>
            <div style="width: 50%;line-height: 38px">
              {{ clickedDemand.createTime }}
            </div>
          </div>
          <div style="display: flex; margin-top: 14px">
            <div style="width: 25%;font-size: 14px; line-height: 38px;">更新人</div>
            <div style="width: 50%;line-height: 30px">
              <div v-for="member in members"
                   v-show="member.userId === clickedDemand.updateBy"
                   style="display: flex;"
              >
                <el-avatar :size="'small'" :src="member.avatar" style="position: relative; top: 0.2vh;"/>
                <span style="margin-left: 10px;">{{ member.nickName }}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; margin-top: 14px">
            <div style="width: 25%;font-size: 14px; line-height: 38px;">更新时间</div>
            <div style="width: 50%;line-height: 38px">
              {{ clickedDemand.updateTime }}
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <template #header>
      <span v-show="clickedDemand.workItemType===0"><font-awesome-icon
          style="color: #ff877b;width: 18px; margin-right: 5px"
          :icon="['fas', 'bolt-lightning']"/></span>
      <span v-show="clickedDemand.workItemType===1"><font-awesome-icon
          style="color: #9191f9;width: 18px; margin-right: 5px"
          :icon="['fas', 'flag']"/></span>
      <span v-show="clickedDemand.workItemType===2"><font-awesome-icon
          style="color: #30d1fc;width: 18px; margin-right: 5px"
          :icon="['fas', 'book-open']"/></span>
      <span v-show="clickedDemand.workItemType===3"><font-awesome-icon
          style="color: #73d897;width: 18px; margin-right: 5px"
          :icon="['fas', 'square-check']"/></span>
      {{ currentProInfo.proFlag }} - {{ clickedDemand.demandNo }}
    </template>
  </el-dialog>

</template>


<script setup lang="ts">
import {nextTick, onMounted, ref, shallowRef, onBeforeUnmount} from "vue";
import {IToolbarConfig} from "@wangeditor/editor";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {DomEditor} from '@wangeditor/editor'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  getAllDemandByProId,
  insertNewDemand,
  queryDemandMembers,
  queryDemandSource,
  queryDemandTypes,
  queryProByProId,
  updateDemandDesc,
  updateDemandHeadId,
  updateDemandPriority,
  updateDemandSource,
  updateDemandStatus,
  updateDemandType
} from "../../../api/demandApi.ts";

const proId = ref('')
const currentProInfo = ref({})

const demandsByLevel = ref([])
const allDemands = ref([])

onMounted(() => {
  proId.value = localStorage.getItem('proDetailId')

  getCurrentProInfo()
  getDemandTypes()
  getDemandSource()
  getDemandMembers()
  getDemandsList()
})

const newDemandFormData = ref({
  proId: '',
  title: '',
  demandDesc: '',
  demandStatus: 0,
  headId: '',
  priority: 2, // 默认普通优先级
  fatherDemandId: '',
  type: '',
  workItemType: 0,
  source: '',
  storyPoint: 0,
})

const addDemandDialogVisible = ref(false)
const clickRowDialogVisible = ref(false)
const members = ref([])
const demandTypes = ref([])
const demandSource = ref([])

const getCurrentProInfo = () => {
  queryProByProId(proId.value).then((res) => {
    if (res.data.code === 2001) {
      currentProInfo.value = res.data.data
      console.log(currentProInfo.value)
    } else {

    }
  })
}

const getDemandMembers = () => {
  queryDemandMembers(proId.value).then((res) => {
    members.value = res.data.data
    console.log(res)
  })
}

const getDemandTypes = () => {
  queryDemandTypes().then((res) => {
    demandTypes.value = res.data.data
    console.log(demandTypes.value)
  })
}

const getDemandSource = () => {
  queryDemandSource().then((res) => {
    demandSource.value = res.data.data
    console.log(demandSource.value)
  })
}

const getDemandsList = () => {
  getAllDemandByProId(proId.value).then((res) => {
    if (res.data.code === 2001) {
      demandsByLevel.value = res.data.data.demandsByLevel
      allDemands.value = res.data.data.allDemands
    } else {
      ElNotification({
        title: '通知',
        message: res.data.message,
        duration: 2000,
      })
    }
  })
}

const selections = ref([])

const handleSelectionChange = (val) => {
  selections.value = val
}

const mode = 'default' // 或 'simple'
const editorRef = shallowRef()
const clickEditorRef = shallowRef()
const clickReadOnlyEditorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')
const clickValueHtml = ref('')
const clickValueHtmlReadOnly = ref('')
const showDesc = ref(true)

const editorConfig = {
  placeholder: '请输入内容...',
}

const toolbarConfig: Partial<IToolbarConfig> = {  // TS 语法
  excludeKeys: [
    "uploadImage",
    "group-video",// 排除菜单组，写菜单组 key 的值即可
    "fullScreen",
  ]
}

const submitAddDemand = () => {
  if (newDemandFormData.value.fatherDemandId === "") {
    newDemandFormData.value.fatherDemandId = "0"
  }
  newDemandFormData.value.demandDesc = valueHtml.value
  insertNewDemand(newDemandFormData.value).then((res) => {
    if (res.data.code === 3001) {
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
      addDemandDialogVisible.value = false
      getDemandsList()
    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}
const handleCreatedEditor = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  // nextTick(() => {
  //   const toolbar = DomEditor.getToolbar(editorRef.value)
  //   const curToolbarConfig = toolbar.getConfig()
  //   console.log('curToolbarConfig', curToolbarConfig)
  // })
}
const handleCreatedClickEditor = (editor) => {
  clickEditorRef.value = editor // 记录 editor 实例，重要！
}
const handleCreatedClickReadOnlyEditor = (editor) => {
  clickReadOnlyEditorRef.value = editor // 记录 editor 实例，重要！
}

const handleClose = (done: () => void) => {
  valueHtml.value = ''
  done()
}

const openAddDemandDialog = () => {
  newDemandFormData.value.proId = currentProInfo.value.proId
  addDemandDialogVisible.value = true
}

const closeAddDemandDialog = () => {
  newDemandFormData.value.proId = currentProInfo.value.proId
  newDemandFormData.value.title = ''
  newDemandFormData.value.demandDesc = ''
  newDemandFormData.value.demandStatus = 0
  newDemandFormData.value.headId = ''
  newDemandFormData.value.priority = 2
  newDemandFormData.value.fatherDemandId = ''
  newDemandFormData.value.type = ''
  newDemandFormData.value.workItemType = 0
  newDemandFormData.value.source = ''
  newDemandFormData.value.storyPoint = 0
  newDemandFormData.value.startTime = ''
  newDemandFormData.value.endTime = ''


  valueHtml.value = ''
}

const handleCloseClickRow = () => {
  showDesc.value = true
}

const addWorkItem = (row) => {
  newDemandFormData.value.proId = currentProInfo.value.proId
  newDemandFormData.value.fatherDemandId = row.demandId
  newDemandFormData.value.workItemType = row.workItemType + 1
  addDemandDialogVisible.value = true
}

const demandStatusChange = (row) => {
  updateDemandStatus(row.demandId, row.demandStatus).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}
const demandHeadIdChange = (row) => {
  updateDemandHeadId(row.demandId, row.headId).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}
const demandPriorityChange = (row) => {
  updateDemandPriority(row.demandId, row.priority).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}
const demandTypeChange = (row) => {
  updateDemandType(row.demandId, row.type).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}
const demandSourceChange = (row) => {
  updateDemandSource(row.demandId, row.source).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}

const clickedDemand = ref({})
const clickRow = (row) => {
  console.log(row)
  clickValueHtmlReadOnly.value = row.demandDesc
  clickRowDialogVisible.value = true
  clickedDemand.value = row
}

const openClickEditor = () => {
  showDesc.value = false
  clickValueHtml.value = clickValueHtmlReadOnly.value
}

const closeClickEditor = () => {
  showDesc.value = true
  // clickValueHtml.value = ''
}

const submitClickEditor = (demandId) => {
  console.log("发送描述：" + clickValueHtml.value)
  let demand = {
    demandId: demandId,
    demandDesc: clickValueHtml.value
  }
  updateDemandDesc(demand).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
      getDemandsList()
      showDesc.value = true
      clickValueHtmlReadOnly.value = clickValueHtml.value
    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}

const firstTagName = ref('baseInfo')
const secondTagName = ref('comment')

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  const clickEditor = clickEditorRef.value
  const clickReadOnlyEditor = clickReadOnlyEditorRef.value
  if (editor == null) return
  if (clickEditor == null) return
  if (clickReadOnlyEditor == null) return
  editor.destroy()
  clickEditor.destroy()
  clickReadOnlyEditor.destroy()
})
</script>

<style scoped>
.select-priority-options {
  width: 50px;
  height: 24px;
  line-height: 24px;
  border-radius: 20px;
  text-align: center;
  color: white;
  font-size: 14px
}

.table-statue {
  width: 60px;
  height: 24px;
  line-height: 24px;
  border-radius: 20px;
  text-align: center;
  color: white;
  font-size: 12px
}

.demand-table-select-options-menu {
  display: flex;
  align-items: center;
  height: 40px;
}

.add-demand-priority-select-options-menu {
  display: flex;
  align-items: center;
}

.member-select-options-menu {
  display: flex;
  align-items: center;
  height: 50px;
}

.table-title-cell {
  display: inline-block;
  text-align: right;
  position: absolute;
  right: 0;
  opacity: 0;
}

.el-table__row .is-left:hover .table-title-cell {
  opacity: 1;
}


</style>