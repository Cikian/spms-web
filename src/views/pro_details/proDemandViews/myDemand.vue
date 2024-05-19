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

  <div style="width: 100%; height: 70vh; display: flex; justify-content: center; align-items: center"
       v-if="demandsByLevel.length <= 0">
    <a-spin v-if="loadingWorkItems" size="large" style="margin: 0 auto"/>
    <el-empty v-else description="暂无需求"/>
  </div>

  <el-table
      v-else
      :data="demandsByLevel"
      row-key="demandId"
      :indent="40"
      border
      style="width: 100%"
      size="large"
      @selection-change="handleSelectionChange"
      :header-cell-style="{'text-align': 'center',}"
      @row-click="clickRow"
      flexible
  >
    <el-table-column align="center" type="selection"/>
    <el-table-column min-width="61px" align="center" label="序号" type="index" fixed/>
    <el-table-column min-width="128px" align="center" prop="demandNo" label="编号" sortable fixed type="">
      <template #default="scope">
        <span>{{ currentProInfo.proFlag }}—{{ scope.row.demandNo }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="380px" align="left" prop="title" label="标题" resizable fixed>
      <template #default="scope">
        <span v-show="scope.row.workItemType===0"
              class="demand-title"
              style="max-width: 100px"
              :class="{'line-throw': scope.row.demandStatus === 2 || scope.row.demandStatus === -1}">
          <font-awesome-icon
              :class="[(scope.row.demandStatus === 2 || scope.row.demandStatus === -1) ? 'epic-throw-icon':'epic-default-icon']"
              :icon="['fas', 'bolt-lightning']"/>
          {{ scope.row.title }}
        </span>
        <span v-show="scope.row.workItemType===1"
              :class="{'line-throw': scope.row.demandStatus === 2 || scope.row.demandStatus === -1}">
          <font-awesome-icon
              :class="[(scope.row.demandStatus === 2 || scope.row.demandStatus === -1) ? 'special-throw-icon':'special-default-icon']"
              :icon="['fas', 'flag']"/>
          {{ scope.row.title }}
        </span>
        <span v-show="scope.row.workItemType===2"
              :class="{'line-throw': scope.row.demandStatus === 2 || scope.row.demandStatus === -1}">
          <font-awesome-icon
              :class="[(scope.row.demandStatus === 2 || scope.row.demandStatus === -1) ? 'story-throw-icon':'story-default-icon']"
              :icon="['fas', 'book-open']"/>
          {{ scope.row.title }}
        </span>
        <span v-show="scope.row.workItemType===3"
              :class="{'line-throw': scope.row.demandStatus === 2 || scope.row.demandStatus === -1}">
          <font-awesome-icon
              :class="[(scope.row.demandStatus === 2 || scope.row.demandStatus === -1) ? 'task-throw-icon':'task-default-icon']"
              :icon="['fas', 'square-check']"/>
          {{ scope.row.title }}
        </span>
        <div class="table-title-cell" style="background-color: #f5f7fa">
          <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.workItemType===0?'新建特性':scope.row.workItemType===1?'新建用户故事':scope.row.workItemType===2?'新建任务':'任务'"
              placement="top" ,
              v-if="scope.row.workItemType!==3"
          >
            <el-button @click="addWorkItem(scope.row)" style="font-size: 20px; margin-right: 20px; color: #79bbff" link>
              <font-awesome-icon :icon="['fas', 'plus']"/>
            </el-button>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="dark"
              content="编辑"
              placement="top"
          >
            <el-button style="font-size: 18px; margin-right: 30px; color: #79bbff" link>
              <font-awesome-icon :icon="['far', 'pen-to-square']"/>
            </el-button>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column min-width="150px" align="center" prop="demandStatus" label="状态" class-name="table-statue-column">
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
    <el-table-column min-width="150px" align="center" prop="headId" label="负责人">
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
    <el-table-column min-width="150px" align="center" prop="priority" label="优先级">
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
    <el-table-column min-width="150px" align="center" prop="fatherDemandId" label="父工作项">
      <template #default="scope">
        <el-text truncated v-for="demand in allDemands" v-show="demand.demandId === scope.row.fatherDemandId">{{
            demand.title
          }}
        </el-text>
      </template>
    </el-table-column>
    <el-table-column min-width="130px" align="center" prop="type" label="需求类型">
      <template #default="scope">
        <span v-for="type in demandTypes" v-show="type.dictionaryDataId === scope.row.type">{{ type.label }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="80px" align="center" prop="storyPoint" label="故事点"/>
    <el-table-column min-width="180px" align="center" prop="updateTime" label="更新时间">
      <template #default="scope">
        {{ formatDate(new Date(scope.row.updateTime), 'YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>

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
        <el-scrollbar style="width: 25%; padding: 0 20px; border-left: rgba(0,0,0,0.1) solid 1px">
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
                @change="addDemandFatherDemandIdChange"
            >
              <el-option
                  v-for="item in allFatherDemands"
                  :key="item.demandId"
                  :label="item.title"
                  :value="item.demandId"
              >
                <div style="display: flex; align-items: center; text-align: center">
                  <div style="display: flex; align-items: center;">
                    <font-awesome-icon style="color: #ff877b;width: 18px" :icon="['fas', 'bolt-lightning']"
                                       v-show="item.workItemType===0"/>
                    <font-awesome-icon style="color: #9191f9;width: 18px" :icon="['fas', 'flag']"
                                       v-show="item.workItemType===1"/>
                    <font-awesome-icon style="color: #30d1fc;width: 18px" :icon="['fas', 'book-open']"
                                       v-show="item.workItemType===2"/>
                    <font-awesome-icon style="color: #73d897;width: 18px" :icon="['fas', 'square-check']"
                                       v-show="item.workItemType===3"/>
                  </div>
                  <span style="margin-left: 10px">{{ item.title }}</span>
                </div>
              </el-option>


              <template #prefix>
                <font-awesome-icon style="color: #ff877b;width: 18px" :icon="['fas', 'bolt-lightning']"
                                   v-show="addDemandFatherDemandSelected.workItemType===0"/>
                <font-awesome-icon style="color: #9191f9;width: 18px" :icon="['fas', 'flag']"
                                   v-show="addDemandFatherDemandSelected.workItemType===1"/>
                <font-awesome-icon style="color: #30d1fc;width: 18px" :icon="['fas', 'book-open']"
                                   v-show="addDemandFatherDemandSelected.workItemType===2"/>
                <font-awesome-icon style="color: #73d897;width: 18px" :icon="['fas', 'square-check']"
                                   v-show="addDemandFatherDemandSelected.workItemType===3"/>
              </template>
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
          <el-form-item label="开始时间">
            <el-date-picker
                v-model="newDemandFormData.startTime"
                type="date"
                placeholder="选择日期"
                size="large"
                clearable
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD"
                style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
                v-model="newDemandFormData.endTime"
                type="date"
                placeholder="选择日期"
                size="large"
                clearable
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD"
                style="width: 100%"
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
    <div
        style="width: 100%; height: 75vh; margin: 0 auto; display: flex; justify-content: space-between; overflow: hidden">
      <el-scrollbar style="width: 75%;">
        <el-input class="click-dialog-input"
                  :class="{'line-throw': clickedDemand.demandStatus === 2 || clickedDemand.demandStatus === -1}"
                  v-model="clickedDemand.title"
                  placeholder="请输入需求标题" size="large"
                  style="height: 50px; font-size: 22px"></el-input>

        <div style="width: 100%; padding: 20px 20px;">
          <el-descriptions
              direction="vertical"
              :column="4"
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
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD"
                  @change="demandStartTimeChange(clickedDemand)"
              />
            </el-descriptions-item>
            <el-descriptions-item width="25%" label="结束时间">
              <el-date-picker
                  v-model="clickedDemand.endTime"
                  type="date"
                  placeholder="——"
                  class="click-dialog-input"
                  :clearable="false"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  format="YYYY-MM-DD"
                  @change="demandEndTimeChange(clickedDemand)"
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
            <div style="width: 100%; height: 100px"
                 v-if="clickedDemand.demandDesc === '<p><br></p>' || clickedDemand.demandDesc === null || clickedDemand.demandDesc === '' ">
              <a-empty description="暂无描述"/>
            </div>
            <div v-else>
              <Toolbar
                  v-show="false"
                  style="border-bottom: 1px solid #ccc"
                  :editor="clickReadOnlyEditorRef"
                  :defaultConfig="toolbarConfig"
                  :mode="mode"
              />
              <Editor
                  v-show="showDesc"
                  style="height: 300px; overflow-y: hidden;"
                  v-model="clickValueHtmlReadOnly"
                  :defaultConfig="{
                      readOnly: true
                    }"
                  :mode="mode"
                  @onCreated="handleCreatedClickReadOnlyEditor"
              />
            </div>
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
                <el-button @click="closeClickEditor" link text>取消</el-button>
                <el-button @click="submitClickEditor(clickedDemand.demandId)" type="primary">保存</el-button>
              </div>
            </div>
            <el-tabs v-model="secondTagName" class="click-row-bottom-tags">
              <el-tab-pane label="评论" name="comment">
                <div v-if="firstLevelComment.length <= 0" v-loading="loadingComments">
                  <a-empty description="暂无评论"/>
                </div>
                <div style="width: 90%" v-else>
                  <a-comment v-for="(item,index) in firstLevelComment" :key="index" v-if="firstLevelComment.length > 0"
                             style="background-color: rgba(234,234,234,0.12); border-radius: 10px; margin-bottom: 10px; padding: 10px 10px">
                    <template #actions>
                      <span @click="beforeReply(item, 'fromDemand')">回复</span>
                    </template>
                    <template #author>
                      <a>{{ item.nickName }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar :src="item.avatar" :alt="item.nickName" size="large"/>
                    </template>
                    <template #content>
                      <p>
                        {{ item.content }}
                      </p>
                    </template>
                    <div v-for="(r,i) in notFirstLevelComment" :key="i">
                      <a-comment v-if="r.toCommentId === item.commentId" style="margin: -20px 0">
                        <template #actions>
                          <span @click="beforeReply(r, 'fromDemand')">回复</span>
                        </template>
                        <template #author>
                          <a style="font-size: 14px;" @click="beforeReply(r, 'fromDemand')">{{ r.nickName }}</a>
                          <span style="margin: 0 5px; font-size: 12px">回复了</span>
                          <a><span style="color: #16acff; font-size: 14px; cursor: default"> @{{
                              r.toUserNickName
                            }}</span></a>
                        </template>
                        <template #avatar>
                          <a-avatar :src="r.avatar" :alt="r.nickName" size="default"/>
                        </template>
                        <template #content>
                          <p>
                            {{ r.content }}
                          </p>
                        </template>
                      </a-comment>
                    </div>
                  </a-comment>

                  <a-modal v-model:open="openRep" width="60%" :footer="null" :closable="false" :z-index="9999">
                    <div class="rep-box">
                      <a-textarea
                          class="rep-con"
                          v-model:value="replyContent"
                          placeholder="友善发言，文明评论~"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                          id="repCommentInput"
                          @keydown.enter.native="replyComment('fromDemand')"
                      />
                    </div>
                    <a-form-item>
                      <a-button style="float: right" type="primary" @click="replyComment('fromDemand')"
                                :disabled="replyContent === ''">回复
                      </a-button>
                    </a-form-item>
                  </a-modal>
                </div>
                <div style="width: 55vw; position: fixed; bottom: 10vh">
                  <div class="post-comment-form"
                       style="width: 100%; display: flex; justify-content: space-between; align-items: flex-end">
                    <a-textarea
                        :auto-size="{ minRows: 3, maxRows: 6 }"
                        placeholder="友善发言，文明评论~"
                        v-model:value="postComment.content"
                        id="postCommentInput"
                        @keydown.enter.native="submitComment(clickedDemand.demandId)"
                    />

                    <a-button style="margin-left: 30px" type="primary" @click="submitComment(clickedDemand.demandId)"
                              :disabled="postComment.content === ''">评论
                    </a-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="活动" name="active">
                <div v-if="demandActive.length <= 0">
                  <a-empty description="暂无活动记录"/>
                </div>
                <div v-else v-for="active in demandActive" :key="active.activeId" style="margin-bottom: 30px">
                  <div style="display: flex; align-items: center; text-align: center" v-for="member in members"
                       :key="member.userId" v-show="member.userId === active.createBy">
                    <div style="display: flex; align-items: center;">
                      <el-avatar :size="'default'" :src="member.avatar" style="position: relative; top: 0.2vh;"/>
                    </div>
                    <span style="margin-left: 10px">{{ member.nickName }}</span>
                    <span style="margin-left: 10px; font-size: 12px; color: #aaa">{{
                        formatDate(new Date(active.createTime), 'YYYY-MM-DD HH:mm:ss')
                      }}</span>
                  </div>
                  <div style="margin-left: 4%; margin-top: 10px">
                    <span>{{ active.activeType }}了</span>
                    <span>{{ active.activeContent }}</span>
                  </div>
                  <div style="margin-left: 4%; margin-top: 20px; display: flex; align-items: center "
                       v-show="active.activeContent === '状态'">
                    <div>
                      <div class="table-statue" style="background-color: #56abfb;" v-show="active.fromActive==='0'">
                        打开
                      </div>
                      <div class="table-statue" style="background-color: #f6c659;" v-show="active.fromActive==='1'">进行中
                      </div>
                      <div class="table-statue" style="background-color: #9de4b6;" v-show="active.fromActive==='2'">已完成
                      </div>
                      <div class="table-statue" style="background-color: #c3c3c3;" v-show="active.fromActive==='-1'">
                        关闭
                      </div>
                    </div>
                    <span>&nbsp;&nbsp;→&nbsp;&nbsp;</span>
                    <div>
                      <div class="table-statue" style="background-color: #56abfb;" v-show="active.toActive==='0'">打开
                      </div>
                      <div class="table-statue" style="background-color: #f6c659;" v-show="active.toActive==='1'">进行中
                      </div>
                      <div class="table-statue" style="background-color: #9de4b6;" v-show="active.toActive==='2'">已完成
                      </div>
                      <div class="table-statue" style="background-color: #c3c3c3;" v-show="active.toActive==='-1'">
                        关闭
                      </div>
                    </div>

                  </div>
                  <div style="margin-left: 4%; margin-top: 20px; display: flex; align-items: center "
                       v-show="active.activeContent === '优先级'">
                    <div>
                      <div class="table-statue" style="background-color: #73d897;" v-show="active.fromActive==='0'">
                        最低
                      </div>
                      <div class="table-statue" style="background-color: #5dcfff;" v-show="active.fromActive==='1'">
                        较低
                      </div>
                      <div class="table-statue" style="background-color: #f6c659;" v-show="active.fromActive==='2'">
                        普通
                      </div>
                      <div class="table-statue" style="background-color: #ff9f73;" v-show="active.fromActive==='3'">
                        较高
                      </div>
                      <div class="table-statue" style="background-color: #ff7575;" v-show="active.fromActive==='4'">
                        最高
                      </div>
                    </div>
                    <span>&nbsp;&nbsp;→&nbsp;&nbsp;</span>
                    <div>
                      <div>
                        <div class="table-statue" style="background-color: #73d897;" v-show="active.toActive==='0'">
                          最低
                        </div>
                        <div class="table-statue" style="background-color: #5dcfff;" v-show="active.toActive==='1'">
                          较低
                        </div>
                        <div class="table-statue" style="background-color: #f6c659;" v-show="active.toActive==='2'">
                          普通
                        </div>
                        <div class="table-statue" style="background-color: #ff9f73;" v-show="active.toActive==='3'">
                          较高
                        </div>
                        <div class="table-statue" style="background-color: #ff7575;" v-show="active.toActive==='4'">
                          最高
                        </div>
                      </div>
                    </div>

                  </div>
                  <div style="margin-left: 4%; margin-top: 20px; display: flex; align-items: center "
                       v-show="active.activeContent === '开始时间' || active.activeContent === '结束时间'">
                    <div>
                      <span v-if="active.fromActive !== ''">{{
                          formatDate(new Date(active.fromActive), 'YYYY年MM月DD日')
                        }}</span>
                      <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </div>
                    <span>&nbsp;&nbsp;→&nbsp;&nbsp;</span>
                    <div>
                      {{ formatDate(new Date(active.toActive), 'YYYY年MM月DD日') }}
                    </div>

                  </div>
                  <div style="margin-left: 4%; margin-top: 20px; display: flex; align-items: center "
                       v-show="active.activeContent === '需求类型'">
                    <div>
                      <span v-if="active.fromActive !== ''" v-for="type in demandTypes"
                            v-show="type.dictionaryDataId === active.fromActive">{{
                          type.label
                        }}</span>
                      <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </div>
                    <span>&nbsp;&nbsp;→&nbsp;&nbsp;</span>
                    <div>
                      <span v-for="type in demandTypes" v-show="type.dictionaryDataId === active.toActive">{{
                          type.label
                        }}</span>
                    </div>

                  </div>
                  <div style="margin-left: 4%; margin-top: 20px; display: flex; align-items: center "
                       v-show="active.activeContent === '需求来源'">
                    <div>
                      <span v-if="active.fromActive !== ''" v-for="item in demandSource" :key="item.dictionaryDataId"
                            v-show="item.dictionaryDataId === active.fromActive">{{ item.label }}
                      </span>
                      <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </div>
                    <span>&nbsp;&nbsp;→&nbsp;&nbsp;</span>
                    <div>
                      <span v-for="type in demandSource" v-show="type.dictionaryDataId === active.toActive">{{
                          type.label
                        }}</span>
                    </div>

                  </div>
                  <div style="margin-left: 4%; margin-top: 20px; display: flex; align-items: center"
                       v-show="active.activeContent === '负责人'">
                    <div>
                      <span v-if="active.fromActive !== ''" v-for="item in demandSource" :key="item.dictionaryDataId"
                            v-show="item.dictionaryDataId === active.fromActive">{{ item.label }}
                      </span>

                      <div v-if="active.fromActive !== ''"
                           style="display: flex; align-items: center; text-align: center" v-for="member in members"
                           :key="member.userId" v-show="member.userId === active.fromActive">
                        <div style="display: flex; align-items: center;">
                          <el-avatar :size="'small'" :src="member.avatar" style="position: relative; top: 0.2vh;"/>
                        </div>
                        <span style="margin-left: 10px">{{ member.nickName }}</span>
                      </div>

                      <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </div>
                    <span>&nbsp;&nbsp;→&nbsp;&nbsp;</span>
                    <div>
                      <div style="display: flex; align-items: center; text-align: center" v-for="member in members"
                           :key="member.userId" v-show="member.userId === active.toActive">
                        <div style="display: flex; align-items: center;">
                          <el-avatar :size="'small'" :src="member.avatar" style="position: relative; top: 0.2vh;"/>
                        </div>
                        <span style="margin-left: 10px">{{ member.nickName }}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="流转" name="circulation">
                <div v-if="demandStatueActive.length <= 0">
                  <a-empty description="暂无流转记录"/>
                </div>
                <el-timeline v-else style="margin-top: 16px">
                  <el-timeline-item
                      v-for="(active, index) in demandStatueActive"
                      :key="active.activeId"
                      :color="index === 0 ? '#0bbd87' : ''"
                      :timestamp="formatDate(new Date(active.createTime), 'YYYY-MM-DD HH:mm:ss')"
                  >
                    <div class="table-statue" style="background-color: #56abfb;" v-show="active.toActive==='0'">打开
                    </div>
                    <div class="table-statue" style="background-color: #f6c659;" v-show="active.toActive==='1'">进行中
                    </div>
                    <div class="table-statue" style="background-color: #9de4b6;" v-show="active.toActive==='2'">已完成
                    </div>
                    <div class="table-statue" style="background-color: #c3c3c3;" v-show="active.toActive==='-1'">
                      关闭
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="子工作项" name="childrenWorkItem"
                       @click="clickDemandChildWorkItem(clickedDemand.demandId)">
            <div v-if="childrenWorkItem.length <= 0">
              <a-empty description="无子工作项"/>
            </div>
            <el-table
                v-else
                :data="childrenWorkItem"
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
              <el-table-column align="center" prop="demandNo" label="编号" sortable type="">
                <template #default="scope">
                  <span>{{ currentProInfo.proFlag }}—{{ scope.row.demandNo }}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" prop="title" label="标题" min-width="150px">
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
                </template>
              </el-table-column>
              <el-table-column align="center" prop="demandStatus" label="状态" class-name="table-statue-column">
                <template #default="scope">
                  <el-select
                      v-model="scope.row.demandStatus"
                      placeholder="请选择状态"
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
                      <div v-if="scope.row.demandStatus === 0" class="table-statue" style="background-color: #b5d8fa;">
                        打开
                      </div>
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
                      <div v-if="scope.row.demandStatus === -1" class="table-statue" style="background-color: #e0dede;">
                        关闭
                      </div>
                      <div v-else class="table-statue" style="background-color: #c3c3c3;">关闭</div>
                    </el-option>

                    <template #prefix>
                      <div class="table-statue" style="background-color: #56abfb;" v-show="scope.row.demandStatus===0">
                        打开
                      </div>
                      <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.demandStatus===1">
                        进行中
                      </div>
                      <div class="table-statue" style="background-color: #9de4b6;" v-show="scope.row.demandStatus===2">
                        已完成
                      </div>
                      <div class="table-statue" style="background-color: #c3c3c3;" v-show="scope.row.demandStatus===-1">
                        关闭
                      </div>
                    </template>
                  </el-select>


                  <!--        <div class="table-statue" style="background-color: #56abfb;" v-show="scope.row.demandStatus===0">打开</div>-->
                  <!--        <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.demandStatus===1">进行中</div>-->
                  <!--        <div class="table-statue" style="background-color: #9de4b6;" v-show="scope.row.demandStatus===2">已完成</div>-->
                  <!--        <div class="table-statue" style="background-color: #c3c3c3;" v-show="scope.row.demandStatus===-1">关闭</div>-->
                </template>
              </el-table-column>
              <el-table-column align="center" prop="headId" label="负责人" min-width="100px">
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
                      <div class="table-statue" style="background-color: #73d897;" v-show="scope.row.priority===0">
                        最低
                      </div>
                      <div class="table-statue" style="background-color: #5dcfff;" v-show="scope.row.priority===1">
                        较低
                      </div>
                      <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.priority===2">
                        普通
                      </div>
                      <div class="table-statue" style="background-color: #ff9f73;" v-show="scope.row.priority===3">
                        较高
                      </div>
                      <div class="table-statue" style="background-color: #ff7575;" v-show="scope.row.priority===4">
                        最高
                      </div>
                    </template>
                  </el-select>


                </template>
              </el-table-column>
              <el-table-column align="center" prop="type" label="需求类型">
                <template #default="scope">
                  <span v-for="type in demandTypes" v-show="type.dictionaryDataId === scope.row.type">{{
                      type.label
                    }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="storyPoint" label="故事点"/>
              <el-table-column align="center" prop="updateTime" label="更新时间">
                <template #default="scope">
                  {{ formatDate(new Date(scope.row.updateTime), 'YYYY-MM-DD HH:mm:ss') }}
                </template>
              </el-table-column>

            </el-table>
          </el-tab-pane>
          <el-tab-pane label="测试" name="tests">
            <div style="display: flex; justify-content: right; padding: 0 50px"  class="addTest" v-show="!hasTestPlan">
              <el-button type="primary" size="large" @click="openAddTestPlanDialog"><span
                  style="font-size: 20px; margin-right: 5px;">+</span>新建测试
              </el-button>
            </div>
            <div v-if="hasTestPlan" class="table">
              <el-table :data="testTableData"
                        style="width: 100%"
                        size="large"
                        stripe
                        v-loading="loading"
                        @row-click="clickTest"
              >
                <el-table-column prop="planName" label="测试计划名称">
                  <template #default="scope">
                    <div style="display: flex; align-items: center">
                      <font-awesome-icon style="color:#56abfb;" :icon="['fas', 'file-lines']"/>
                      <span style="margin-left: 10px">{{ scope.row.planName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                  <template #default="scope">
                    <el-tag v-if="scope.row.progress>0 && scope.row.progress < 100" type="warning" size="large" round
                            effect="dark">进行中
                    </el-tag>
                    <el-tag v-else-if="scope.row.progress === 100" type="success" size="large" round effect="dark">已完成
                    </el-tag>
                    <el-tag v-else-if="scope.row.progress === 0" type="danger" size="large" round effect="dark">未开始
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="headName" label="负责人">
                </el-table-column>
                <el-table-column prop="progress" label="计划进度">
                  <template #default="scope">
                    <el-progress
                        :percentage="scope.row.progress"
                        status="success"
                        :text-inside="true"
                        :stroke-width="24"
                        color="green"/>
                  </template>
                </el-table-column>
                <el-table-column prop="startTime" label="计划开始时间" align="center">
                </el-table-column>
                <el-table-column prop="endTime" label="计划结束时间" align="center">
                </el-table-column>
              </el-table>
            </div>
            <div v-else style="width: 95%;">
              <a-empty description="暂无测试计划"/>
            </div>
          </el-tab-pane>
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
                  <div class="table-statue" style="background-color: #73d897;" v-show="clickedDemand.priority===0">
                    最低
                  </div>
                  <div class="table-statue" style="background-color: #5dcfff;" v-show="clickedDemand.priority===1">
                    较低
                  </div>
                  <div class="table-statue" style="background-color: #f6c659;" v-show="clickedDemand.priority===2">
                    普通
                  </div>
                  <div class="table-statue" style="background-color: #ff9f73;" v-show="clickedDemand.priority===3">
                    较高
                  </div>
                  <div class="table-statue" style="background-color: #ff7575;" v-show="clickedDemand.priority===4">
                    最高
                  </div>
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
                  <div v-for="item in demandTypes" :key="item.dictionaryDataId"
                       v-show="item.dictionaryDataId === clickedDemand.type">{{ item.label }}
                  </div>
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
                  <div v-for="item in demandSource" :key="item.dictionaryDataId"
                       v-show="item.dictionaryDataId === clickedDemand.source">{{ item.label }}
                  </div>
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
              {{ formatDate(new Date(clickedDemand.createTime), 'YYYY-MM-DD HH:mm:ss') }}
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
              {{ formatDate(new Date(clickedDemand.updateTime), 'YYYY-MM-DD HH:mm:ss') }}
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
    <template #footer>

    </template>
  </el-dialog>

  <!--  编辑测试计划dialog-->
  <el-dialog
      v-model="openTestPlanDialog"
      title="编辑测试计划"
      width="80vw"
      top="8vh"
      :show-close="false"
      @close="handleCloseEditTestPlan"
  >
    <el-form
        :model="echoTestPlan"
        label-width="auto"
        label-position="top"
        require-asterisk-position="right"
        size="large">
      <div style="width: 100%; height: 70vh; margin: 0 auto; display: flex; justify-content: space-between">
        <div style="width: 73%;">
          <el-form-item label="标题" required>
            <el-input v-model="echoTestPlan.planName" placeholder="请输入需求标题" clearable></el-input>
          </el-form-item>
          <el-tabs type="border-card" @tab-click="handleTabClick" v-model="activeName">
            <el-tab-pane label="测试用例" name="caseList">
              <el-table :data="testCaseTableData"
                        style="width: 100%;"
                        size="large"
                        v-loading="loadTestCase"
                        max-height="535px"
                        stripe>
                <el-table-column prop="caseName" label="用例名称"/>
                <el-table-column prop="priorityLabel" label="优先级" sortable>
                  <template #default="scope">
                    <el-tag v-if="scope.row.priority === 0" type="info">低</el-tag>
                    <el-tag v-else-if="scope.row.priority === 1" type="warning">中</el-tag>
                    <el-tag v-else-if="scope.row.priority === 2" type="danger">高</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" sortable>
                  <template #default="scope">
                    <el-tag v-if="scope.row.status === false" type="info">未完成</el-tag>
                    <el-tag v-else-if="scope.row.status === true" type="success">已完成</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button type="primary" text size="large" @click="editTestCase(scope.row)">编辑</el-button>
                    <el-button type="danger" text size="large" @click="deleteTestCase(scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="添加测试用例" name="addCase">
              <el-form v-model="addTestCaseForm" label-width="100px" label-position="top" style="max-height: 704px">
                <el-form-item label="用例名称" required>
                  <el-input v-model="addTestCaseForm.caseName" placeholder="请输入用例名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="用例描述" required>
                  <el-input v-model="addTestCaseForm.caseContent" placeholder="请输入用例描述" type="textarea"
                            :rows="12" resize="none" clearable></el-input>
                </el-form-item>
                <el-form-item label="优先级" required>
                  <el-select v-model="addTestCaseForm.priority" placeholder="请选择优先级" clearable>
                    <el-option label="低" value="0"></el-option>
                    <el-option label="中" value="1"></el-option>
                    <el-option label="高" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="add-test-case-footer">
                <el-button type="primary" @click="submitAddTestCase" :disabled="addTestCaseBtnDisable"
                           :loading="loadingAddTestCase">
                  {{ addTestCaseBtnText }}
                </el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="测试报告" name="testReport">
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
              <div class="upload-progress">
                <el-progress v-if="uploadProgress > 0"
                             :percentage="uploadProgress"
                             :color="colors"
                             :stroke-width="15"
                             type="line"/>
              </div>
              <div class="test-report-card">
                <el-card v-if="testReport !== null" class="test-report">
                  <div class="test-report-top">
                    <div class="test-report-title">{{ testReport.testReportName }}</div>
                    <div class="approval">
                      <el-select v-model="testReport.approvalStatus" @change="updateTestReportApprovalStatus">
                        <el-option label="待审批" :value="0"/>
                        <el-option label="已通过" :value="1"/>
                        <el-option label="未通过" :value="2"/>
                      </el-select>
                    </div>
                  </div>
                  <div class="test-report-footer">
                    <el-button type="primary" text size="default" @click="downloadTestReport">下载</el-button>
                    <el-button type="danger" text size="default" @click="deleteTestReport">删除</el-button>
                  </div>
                </el-card>
                <el-empty description="暂未上传测试报告" v-else/>
              </div>
            </el-tab-pane>
            <el-tab-pane label="留言" name="message">
              <el-scrollbar height="37vh">
                <div v-if="firstLevelComment.length <= 0">
                  <a-empty description="暂无评论"/>
                </div>
                <div style="width: 90%" v-else>
                  <a-comment v-for="(item,index) in firstLevelComment" :key="index" v-if="firstLevelComment.length > 0">
                    <template #actions>
                      <span @click="beforeReply(item, 'fromTest')">回复</span>
                    </template>
                    <template #author>
                      <a>{{ item.nickName }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar :src="item.avatar" :alt="item.nickName"/>
                    </template>
                    <template #content>
                      <p>
                        {{ item.content }}
                      </p>
                    </template>
                    <div v-for="(r,i) in notFirstLevelComment" :key="i">
                      <a-comment v-if="r.toCommentId === item.commentId">
                        <template #actions>
                          <span @click="beforeReply(r,'fromTest')">回复</span>
                        </template>
                        <template #author>
                          <a style="font-size: 14px">{{ r.nickName }}</a>
                          <span style="margin: 0 5px; font-size: 12px">回复了</span>
                          <a><span style="color: #16acff; font-size: 14px"> @{{ r.toUserNickName }}</span></a>
                        </template>
                        <template #avatar>
                          <a-avatar :src="r.avatar" :alt="r.nickName"/>
                        </template>
                        <template #content>
                          <p>
                            {{ r.content }}
                          </p>
                        </template>
                      </a-comment>
                    </div>
                  </a-comment>

                  <a-modal v-model:open="openTestRep" width="60%" :footer="null" :closable="false" z-index="9999">
                    <div class="rep-box">
                      <a-textarea
                          class="rep-con"
                          v-model:value="replyContent"
                          placeholder="友善发言，文明评论~"
                          :auto-size="{ minRows: 3, maxRows: 5 }"
                          id="repCommentInput"
                          @keydown.enter.native="replyComment('fromTest')"
                      />
                    </div>
                    <a-form-item>
                      <a-button style="float: right" type="primary" @click="replyComment('fromTest')"
                                :disabled="replyContent === ''">回复
                      </a-button>
                    </a-form-item>
                  </a-modal>
                </div>
                <div style="width: 55vw; position: fixed; bottom: 15vh">
                  <div class="post-comment-form"
                       style="width: 100%; display: flex; justify-content: space-between; align-items: flex-end">
                    <a-textarea
                        :auto-size="{ minRows: 3, maxRows: 6 }"
                        placeholder="友善发言，文明评论~"
                        v-model:value="postComment.content"
                        id="postCommentInput"
                        @keydown.enter.native="submitComment(echoTestPlan.testPlanId)"
                    />

                    <a-button style="margin-left: 30px" type="primary" @click="submitComment(echoTestPlan.testPlanId)"
                              :disabled="postComment.content === ''">评论
                    </a-button>
                  </div>
                </div>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-scrollbar style="width: 25%; padding-left: 20px; border-left: rgba(0,0,0,0.1) solid 1px">
          <el-form-item label="负责人" required v-loading="loadingTestMembers">
            <el-select v-model="echoTestPlan.head" placeholder="请选择负责人">
              <el-option
                  v-for="item in projectTestMember"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目">
            <el-input v-model="echoTestPlan.projectName" disabled></el-input>
          </el-form-item>
          <el-form-item label="关联需求">
            <el-input v-model="echoTestPlan.demandName" disabled></el-input>
          </el-form-item>
          <el-form-item label="计划周期" required>
            <el-date-picker
                style="width: 155px;"
                v-model="echoTestPlan.startTime"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择开始日期">
            </el-date-picker>
            <span style="margin: 0 18px">-</span>
            <el-date-picker
                style="width: 155px;"
                v-model="echoTestPlan.endTime"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="echoTestPlan.creatorName" disabled/>
          </el-form-item>
          <el-progress
              style="margin-top: 10px"
              :percentage="echoTestPlan.progress"
              :color="colors"
              stroke-width="15"
              type="circle">
            <template #default="{ percentage }">
              <span class="percentage-value">{{ percentage }}%</span>
              <span class="percentage-label">测试进度</span>
            </template>
          </el-progress>
          <div class="dialog-footer">
            <el-button @click="handleCloseEditTestPlan">取消</el-button>
            <el-button type="primary" @click="handleSubmitEditTestPlan" :disabled="editTestPlanBtnDisable"
                       :loading="loadingEditTestPlan">
              {{ editTestPlanBtnText }}
            </el-button>
          </div>
        </el-scrollbar>
      </div>
    </el-form>
  </el-dialog>

  <!--  编辑测试用例dialog-->
  <el-dialog
      v-model="editTestCaseDialogVisible"
      title="编辑测试用例"
      width="40%"
      center
      :show-close="false">
    <el-form :model="echoTestCase" label-width="100px" label-position="top">
      <el-form-item label="用例名称">
        <el-input v-model="echoTestCase.caseName"
                  placeholder="请输入用例名称"
                  type="text"
                  clearable
                  size="large"/>
      </el-form-item>
      <el-form-item label="用例描述">
        <el-input v-model="echoTestCase.caseContent"
                  placeholder="请输入用例描述"
                  type="textarea"
                  :rows="12"
                  resize="none"
                  clearable/>
      </el-form-item>
      <el-form-item label="优先级">
        <el-select v-model="echoTestCase.priority" placeholder="请选择优先级" size="large">
          <el-option key="0" label="低" :value="0"/>
          <el-option key="1" label="中" :value="1"/>
          <el-option key="2" label="高" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="echoTestCase.status" placeholder="请选择状态" size="large">
          <el-option key="false" label="未完成" :value="false"/>
          <el-option key="true" label="已完成" :value="true"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editTestCaseDialogVisible = false" size="large" style="width: 90px;">取 消</el-button>
      <el-button type="primary" @click="submitEditTestCase" size="large" style="width: 90px;"
                 :disabled="editTestCaseBtnDisable" :loading="loadingEditTestCase">
        {{ editTestCaseBtnText }}
      </el-button>
    </div>
  </el-dialog>

  <!--  新增测试计划dialog-->
  <el-dialog
      title="新建测试计划"
      v-model="addTestPlanDialogVisible"
      width="42%"
      center
      :show-close="false"
  >
    <el-form :model="form" label-width="100px" label-position="top">
      <el-form-item label="测试计划名称">
        <el-input v-model="form.planName"
                  placeholder="请输入测试计划名称"
                  maxlength="255"
                  show-word-limit
                  type="text"
                  clearable
                  size="large"/>
      </el-form-item>
      <el-form-item label="关联项目">
        <el-input size="large" v-model="currentProInfo.proName" placeholder="请选择关联项目" disabled>
        </el-input>
      </el-form-item>
      <el-form-item label="关联需求">
        <el-input size="large" v-model="clickedDemand.title" placeholder="请选择关联需求" disabled no-data-text="暂无需求">
        </el-input>
      </el-form-item>
      <el-form-item label="负责人">
        <el-select size="large" v-model="form.head" placeholder="请选择负责人" no-data-text="暂无成员">
          <el-option
              v-for="item in projectTestMember"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="计划周期">
        <el-date-picker
            v-model="form.startTime"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择开始日期">
        </el-date-picker>
        <span style="margin: 0 15px">-</span>
        <el-date-picker
            v-model="form.endTime"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCloseAddTestPlanDialog" size="large" style="width: 90px;">取 消</el-button>
      <el-button type="primary" @click="submitForm" size="large" style="width: 90px;" :disabled="addTestPlanBtnDisable"
                 :loading="loadingAddTestPlan">
        {{ addTestPlanBtnText }}
      </el-button>
    </div>
  </el-dialog>

</template>


<script setup lang="ts">
import {onMounted, ref, shallowRef, onBeforeUnmount} from "vue";
import {IToolbarConfig} from "@wangeditor/editor";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  addComment, getAllDemandByHeadId,
  getAllDemandByProId, getChildrenWorkItemList, getCommentList, getDemandActiveList, getDemandById,
  insertNewDemand,
  queryDemandMembers,
  queryDemandSource,
  queryDemandTypes,
  queryProByProId,
  updateDemandDesc, updateDemandEndTime,
  updateDemandHeadId,
  updateDemandPriority,
  updateDemandSource, updateDemandStartTime,
  updateDemandStatus,
  updateDemandType
} from "../../../api/demandApi.ts";
import {recordVisit} from "../../../api/RecentVisitApi.ts";
import {formatDate} from "@vueuse/shared";
import {queryProjectTestMember} from "../../../api/userApi.ts";
import {
  addTestCase, addTestPlan,
  deleteTestCaseById,
  deleteTestReportById,
  queryTestCaseById,
  queryTestCaseByPlanId,
  queryTestPlanByDemandId,
  queryTestPlanById,
  queryTestReportByPlanId,
  updateTestCase,
  updateTestPlan,
  updateTestReportApprovalStatusById,
  uploadTestReport
} from "../../../api/TestPlanApi.ts";

const proId = ref('')
const currentProInfo = ref({})

const demandsByLevel = ref([])
const allDemands = ref([])
const allFatherDemands = ref([])

onMounted(() => {
  let recent = localStorage.getItem("recentVisit");
  if (recent) {
    getDemandById(recent).then((res) => {
      if (res.data.code === 2001) {
        clickedDemand.value = res.data.data
        clickValueHtmlReadOnly.value = clickedDemand.demandDesc
        proId.value = clickedDemand.proId
        getCurrentProInfo(res.data.data.proId)
        getDemandTypes()
        getDemandSource()
        getDemandMembers(res.data.data.proId)
        getDemandsList(res.data.data.proId)
        clickRowDialogVisible.value = true
      }
    })
  } else {
    proId.value = localStorage.getItem('proDetailId')
    getCurrentProInfo(proId.value)
    getDemandTypes()
    getDemandSource()
    getDemandMembers(proId.value)
    getDemandsList(proId.value)
  }
})

const loadingWorkItems = ref(true)

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

const getCurrentProInfo = (proId) => {
  queryProByProId(proId).then((res) => {
    if (res.data.code === 2001) {
      currentProInfo.value = res.data.data
      console.log(currentProInfo.value)



      if (localStorage.getItem("recentVisit")) {
        clickRow(clickedDemand.value)
        localStorage.removeItem("recentVisit")
      }



    } else {

    }
  })
}

const getDemandMembers = (proId) => {
  queryDemandMembers(proId).then((res) => {
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

const getDemandsList = (proId) => {
  console.log("proId2222")
  console.log(proId)
  getAllDemandByHeadId(proId).then((res) => {
    if (res.data.code === 2001) {
      demandsByLevel.value = res.data.data
      allDemands.value = res.data.data
      allFatherDemands.value = allDemands.value.filter(item => item.workItemType !== 3)
      loadingWorkItems.value = false
    } else {
      ElNotification({
        title: '通知',
        message: res.data.message,
        duration: 2000,
      })
      loadingWorkItems.value = false
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

const addDemandFatherDemandSelected = ref({})
const addDemandFatherDemandIdChange = (val) => {
  addDemandFatherDemandSelected.value = allDemands.value.find(item => item.demandId === val)
  console.log(addDemandFatherDemandSelected.value)
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
      getDemandsList(proId.value)
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

  addDemandFatherDemandSelected.value = {}

  valueHtml.value = ''
}

const handleCloseClickRow = () => {
  showDesc.value = true
  firstLevelComment.value = []
  notFirstLevelComment.value = []
  childrenWorkItem.value = []
  testTableData.value = []
}

const clickIcon = ref(false)
const addWorkItem = (row) => {
  clickIcon.value = true
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
const demandStartTimeChange = (row) => {
  let demand = {
    demandId: row.demandId,
    startTime: row.startTime
  }
  updateDemandStartTime(demand).then((res) => {
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
const demandEndTimeChange = (row) => {
  let demand = {
    demandId: row.demandId,
    endTime: row.endTime
  }
  updateDemandEndTime(demand).then((res) => {
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
  if (clickIcon.value) {
    clickIcon.value = false
    return
  }
  clickValueHtmlReadOnly.value = row.demandDesc
  clickRowDialogVisible.value = true
  clickedDemand.value = row
  getComments(clickedDemand.value.demandId)
  getChildrenWorkItem(clickedDemand.value.demandId)
  getDemandActive(clickedDemand.value.demandId)
  loadTestPlanList(clickedDemand.value.demandId)

  getProjectTestMember(currentProInfo.value.proId)

  firstTagName.value = 'baseInfo'
  secondTagName.value = 'comment'
  recordVisit(row.demandId, 2)
}

const demandActive = ref([])
const demandStatueActive = ref([])

const getDemandActive = (demandId) => {
  console.log("获取活动：" + demandId)
  getDemandActiveList(demandId).then((res) => {
    if (res.data.code === 2001) {
      demandActive.value = res.data.data
      demandStatueActive.value = demandActive.value.filter((item) => item.activeContent === "状态")
      demandStatueActive.value.push({
        activeId: '0',
        demandId: demandId,
        activeType: '创建',
        activeContent: '状态',
        toActive: '0',
        createTime: clickedDemand.value.createTime,
      })
    } else {
      demandActive.value = []
      demandStatueActive.value = []
    }
  })
}

const childrenWorkItem = ref([])

const getChildrenWorkItem = (workItemId) => {
  getChildrenWorkItemList(workItemId).then((res) => {
    if (res.data.code === 2001) {
      childrenWorkItem.value = res.data.data
    } else {
      childrenWorkItem.value = []
    }
  })
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
      getDemandsList(proId.value)
      showDesc.value = true
      clickValueHtmlReadOnly.value = clickValueHtml.value
      clickedDemand.value.demandDesc = clickValueHtml.value
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

const openRep = ref(false)
const openTestRep = ref(false)
const replyContent = ref('')
const postComment = ref({
  toCommentId: '',
  content: '',
  workItemId: '',
  userId: '',
  avatar: '',
  nickName: '',
  toUserId: '',
  toUserNickName: '',
})
const loadingComments = ref(false)
const getComments = (workItemId) => {
  loadingComments.value = true
  getCommentList(workItemId).then((res) => {
    if (res.data.code === 2001) {
      let comments = res.data.data
      firstLevelComment.value = comments.filter((item) => item.toCommentId === '0')
      notFirstLevelComment.value = comments.filter((item) => item.toCommentId !== '0')
      loadingComments.value = false
    } else {
      firstLevelComment.value = []
      notFirstLevelComment.value = []
      loadingComments.value = false
    }
  })
}

const submitComment = (workItemId) => {
  if (postComment.value.content === '') {
    ElNotification({
      title: 'Error',
      message: '评论内容不能为空',
      type: 'error',
    })
    return;
  }

  let userInfo = JSON.parse(localStorage.getItem("userInfo"))

  postComment.value.workItemId = workItemId;
  postComment.value.toCommentId = '0';
  postComment.value.toUserId = '0';
  postComment.value.toUserNickName = '';
  postComment.value.avatar = userInfo.avatar;
  postComment.value.nickName = userInfo.nickName;

  addComment(postComment.value).then((res) => {
    if (res.data.code === 3001) {
      postComment.value.content = '';
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
      getComments(workItemId)
    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })

}

const beforeReply = (comment, flag) => {
  let userInfo = JSON.parse(localStorage.getItem("userInfo"))

  console.log("打开回复框")
  console.log(clickedDemand.value)

  if (flag === 'fromDemand') {
    openRep.value = true;
  } else if (flag === 'fromTest') {
    openTestRep.value = true;
  }

  postComment.value.workItemId = comment.workItemId
  // postComment.value.workItemId = clickedDemand.value.demandId;
  if (comment.toCommentId === '0') {
    postComment.value.toCommentId = comment.commentId;
  } else {
    postComment.value.toCommentId = comment.toCommentId;
  }
  postComment.value.toUserId = comment.userId;
  postComment.value.toUserNickName = comment.userNickName;
  postComment.value.avatar = userInfo.avatar
  postComment.value.nickName = userInfo.nickName
}
const replyComment = (flag) => {
  if (replyContent.value === '') {
    ElNotification({
      title: 'Error',
      message: '评论内容不能为空',
      type: 'error',
    })
    return;
  }
  postComment.value.content = replyContent.value;

  addComment(postComment.value).then((res) => {
    if (res.data.code === 3001) {
      postComment.value.content = '';
      replyContent.value = '';
      ElNotification({
        title: 'Success',
        message: res.data.message,
        type: 'success',
      })
      openRep.value = false;
      openTestRep.value = false;
      if (flag === 'fromDemand'){
        console.log("从需求")
        console.log(clickedDemand.value)
        getComments(clickedDemand.value.demandId)
      } else if (flag === 'fromTest') {
        console.log("从测试")
        console.log(echoTestPlan.value)
        getComments(echoTestPlan.value.testPlanId)
      }

    } else {
      ElNotification({
        title: 'Error',
        message: res.data.message,
        type: 'error',
      })
    }
  })
}

const firstLevelComment = ref([]);
const notFirstLevelComment = ref([]);

const testTableData = ref([])
const openTestPlanDialog = ref(false)
const loadingTestMembers = ref(false)
const projectTestMember = ref([])
const echoTestPlan = ref({})
const loadTestCase = ref(true)
const testCaseTableData = ref([])
const loading = ref(false)
const testReport = ref(null)
const uploadProgress = ref(0)
const activeName = ref('caseList')
const editTestCaseDialogVisible = ref(false)
const echoTestCase = ref({})
const addTestCaseForm = ref({
  caseName: '',
  caseContent: '',
  priority: ''
})
const addTestCaseBtnText = ref('提交')
const addTestCaseBtnDisable = ref(false)
const loadingAddTestCase = ref(false)
const colors = [
  {color: '#f56c6c', percentage: 25},
  {color: '#ff9400', percentage: 50},
  {color: '#ffb310', percentage: 75},
  {color: '#67c23a', percentage: 100},
]
const editTestPlanBtnText = ref('确定')
const editTestPlanBtnDisable = ref(false)
const loadingEditTestPlan = ref(false)
const editTestCaseBtnText = ref('确定')
const editTestCaseBtnDisable = ref(false)
const loadingEditTestCase = ref(false)
const addTestPlanDialogVisible = ref(false)
const form = ref({
  planName: '',
  projectId: '',
  demandId: '',
  head: '',
  startTime: '',
  endTime: '',
})
const addTestPlanBtnText = ref('提交')
const addTestPlanBtnDisable = ref(false)
const loadingAddTestPlan = ref(false)


const openAddTestPlanDialog = () => {
  form.value.projectId = currentProInfo.value.proId
  form.value.demandId = clickedDemand.value.demandId
  // projectTestMember.value = []
  addTestPlanDialogVisible.value = true
}

const handleCloseAddTestPlanDialog = () => {
  form.value = {
    planName: '',
    projectId: '',
    demandId: '',
    head: '',
    startTime: '',
    endTime: '',
  }
  addTestPlanDialogVisible.value = false
}

const submitForm = () => {
  addTestPlanBtnText.value = '提交中...'
  addTestPlanBtnDisable.value = true
  loadingAddTestPlan.value = true

  if (form.value.planName === '') {
    ElNotification({
      title: '提示',
      message: '请输入测试计划名称',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.projectId === '') {
    ElNotification({
      title: '提示',
      message: '请选择关联项目',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.demandId === '') {
    ElNotification({
      title: '提示',
      message: '请选择关联需求',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.head === '') {
    ElNotification({
      title: '提示',
      message: '请选择负责人',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.startTime === '') {
    ElNotification({
      title: '提示',
      message: '请选择计划开始时间',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  if (form.value.endTime === '') {
    ElNotification({
      title: '提示',
      message: '请选择计划结束时间',
      type: 'warning'
    })
    addTestPlanBtnText.value = '提交'
    addTestPlanBtnDisable.value = false
    loadingAddTestPlan.value = false
    return;
  }

  let formData = {
    planName: form.value.planName,
    projectId: form.value.projectId,
    demandId: form.value.demandId,
    head: form.value.head,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
  }

  addTestPlan(formData)
      .then(res => {
        if (res.data.code === 200) {
          handleCloseAddTestPlanDialog()
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          loadTestPlanList(clickedDemand.value.demandId)
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
        addTestPlanBtnText.value = '提交'
        addTestPlanBtnDisable.value = false
        loadingAddTestPlan.value = false
      })
}

const hasTestPlan = ref(false)
const loadTestPlanList = (demandId) => {
  loading.value = true
  queryTestPlanByDemandId(demandId)
      .then(res => {
        if (res.data.code === 200) {
          testTableData.value = res.data.data
          hasTestPlan.value = testTableData.value !== null && testTableData.value.length > 0
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
          testTableData.value = []
        }
      })
      .finally(() => {
        loading.value = false
      })
}

const clickTest = (row) => {
  openTestPlanDialog.value = true
  getProjectTestMember(currentProInfo.value.proId)
  getTestPlanDetailById(row.testPlanId)
}

const getProjectTestMember = (projectId) => {
  loadingTestMembers.value = true
  console.log("获取项目成员：" + projectId)
  queryProjectTestMember(projectId)
      .then(res => {
        if (res.data.code === 200) {
          projectTestMember.value = res.data.data
          loadingTestMembers.value = false
          console.log(projectTestMember.value)
        }
      })
}

const getTestPlanDetailById = (planId) => {
  queryTestPlanById(planId)
      .then(res => {
        if (res.data.code === 200) {
          echoTestPlan.value = res.data.data
          console.log("res.data.data")
          console.log(res.data.data)
          getTestCaseData()
          getProjectTestMember(currentProInfo.value.proId)
        }
      })
}

const getTestCaseData = () => {
  loadTestCase.value = true
  queryTestCaseByPlanId(echoTestPlan.value.testPlanId)
      .then(res => {
        if (res.data.code === 200) {
          testCaseTableData.value = res.data.data
          loadTestCase.value = false
        }
      })
}

const handleTabClick = (tab) => {
  if (tab.props.name === 'caseList') {
    getTestCaseData()
  } else if (tab.props.name === 'testReport') {
    queryTestReport()
  } else if (tab.props.name === 'message') {
    getComments(echoTestPlan.value.testPlanId)
  }
}

const queryTestReport = () => {
  queryTestReportByPlanId(echoTestPlan.value.testPlanId)
      .then(res => {
        if (res.data.code === 200) {
          testReport.value = res.data.data
          testReport.value.oldStatus = res.data.data.approvalStatus
        } else {
          testReport.value = null
        }
      })
}

const editTestCase = (row) => {
  editTestCaseDialogVisible.value = true
  queryTestCaseById(row.testCaseId)
      .then(res => {
        if (res.data.code === 200) {
          echoTestCase.value = res.data.data
        }
      })
}

const deleteTestCase = (row) => {
  ElMessageBox.confirm('此操作将永久删除该测试用例, 是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteTestCaseById(row.testCaseId)
        .then(res => {
          if (res.data.code === 200) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            getTestCaseData()
          } else {
            ElNotification({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
        })
  }).catch(() => {
    ElNotification({
      title: '提示',
      message: '已取消删除',
      type: 'info'
    })
  })
}

const submitAddTestCase = () => {
  addTestCaseBtnText.value = '提交中'
  addTestCaseBtnDisable.value = true
  loadingAddTestCase.value = true

  if (addTestCaseForm.value.caseName === '') {
    ElNotification({
      title: '提示',
      message: '请输入用例名称',
      type: 'warning'
    })
    addTestCaseBtnText.value = '提交'
    addTestCaseBtnDisable.value = false
    loadingAddTestCase.value = false
    return;
  }

  if (addTestCaseForm.value.caseContent === '') {
    ElNotification({
      title: '提示',
      message: '请输入用例描述',
      type: 'warning'
    })
    addTestCaseBtnText.value = '提交'
    addTestCaseBtnDisable.value = false
    loadingAddTestCase.value = false
    return;
  }

  if (addTestCaseForm.value.priority === '') {
    ElNotification({
      title: '提示',
      message: '请选择优先级',
      type: 'warning'
    })
    addTestCaseBtnText.value = '提交'
    addTestCaseBtnDisable.value = false
    loadingAddTestCase.value = false
    return;
  }

  let formData = {
    caseName: addTestCaseForm.value.caseName,
    caseContent: addTestCaseForm.value.caseContent,
    priority: addTestCaseForm.value.priority,
    testPlanId: echoTestPlan.value.testPlanId
  }
  addTestCase(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          addTestCaseForm.value = {
            caseName: '',
            caseContent: '',
            priority: ''
          }
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
        addTestCaseBtnText.value = '提交'
        addTestCaseBtnDisable.value = false
        loadingAddTestCase.value = false
      })
}

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
  uploadProgress.value = 0

  let formData = new FormData();
  formData.append('file', file.file);
  formData.append('testPlanId', echoTestPlan.value.testPlanId);

  const config = {
    onUploadProgress: (progressEvent) => {
      console.log(progressEvent.loaded * 100)
      console.log(progressEvent.total)
      uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    },
  };

  uploadTestReport(formData, config)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          queryTestReport()
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })

}

const updateTestReportApprovalStatus = () => {
  ElMessageBox.confirm('是否确认修改测试报告审批状态?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(() => {
        updateTestReportApprovalStatusById(testReport.value.testReportId, testReport.value.approvalStatus)
            .then(res => {
              if (res.data.code === 200) {
                ElNotification({
                  title: '成功',
                  message: res.data.message,
                  type: 'success'
                })
              } else {
                testReport.value.approvalStatus = testReport.value.oldStatus
                ElNotification({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            })
      })
      .catch(() => {
        testReport.value.approvalStatus = testReport.value.oldStatus
        ElNotification({
          title: '提示',
          message: '已取消修改',
          type: 'info'
        })
      })
}

const downloadTestReport = () => {
  window.open(testReport.value.reportFile)
}

const deleteTestReport = () => {
  ElMessageBox.confirm('此操作将永久删除该测试报告, 是否继续?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteTestReportById(testReport.value.testReportId)
        .then(res => {
          if (res.data.code === 200) {
            ElNotification({
              title: '成功',
              message: res.data.message,
              type: 'success'
            })
            queryTestReport()
          } else {
            ElNotification({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
        })
  }).catch(() => {
    ElNotification({
      title: '提示',
      message: '已取消删除',
      type: 'info'
    })
  })
}

const handleCloseEditTestPlan = () => {
  openTestPlanDialog.value = false
  echoTestPlan.value = {}
  testCaseTableData.value = []
  activeName.value = 'caseList'
  testReport.value = null
  uploadProgress.value = 0
  postComment.value = {
    toCommentId: '',
    content: '',
    workItemId: '',
    userId: '',
    avatar: '',
    nickName: '',
    toUserId: '',
    toUserNickName: '',
  }
  replyContent.value = ''
  getComments(clickedDemand.value.demandId)
  loadTestPlanList(clickedDemand.value.demandId)
}

const handleSubmitEditTestPlan = () => {
  editTestPlanBtnText.value = '提交中'
  editTestPlanBtnDisable.value = true
  loadingEditTestPlan.value = true

  if (echoTestPlan.value.planName === '') {
    ElNotification({
      title: '提示',
      message: '请输入测试计划名称',
      type: 'warning'
    })
    editTestPlanBtnText.value = '提交'
    editTestPlanBtnDisable.value = false
    loadingEditTestPlan.value = false
    return;
  }

  if (echoTestPlan.value.head === '') {
    ElNotification({
      title: '提示',
      message: '请选择负责人',
      type: 'warning'
    })
    editTestPlanBtnText.value = '提交'
    editTestPlanBtnDisable.value = false
    loadingEditTestPlan.value = false
    return;
  }

  if (echoTestPlan.value.startTime === '') {
    ElNotification({
      title: '提示',
      message: '请选择计划开始时间',
      type: 'warning'
    })
    editTestPlanBtnText.value = '提交'
    editTestPlanBtnDisable.value = false
    loadingEditTestPlan.value = false
    return;
  }

  if (echoTestPlan.value.endTime === '') {
    ElNotification({
      title: '提示',
      message: '请选择计划结束时间',
      type: 'warning'
    })
    editTestPlanBtnText.value = '提交'
    editTestPlanBtnDisable.value = false
    loadingEditTestPlan.value = false
    return;
  }

  let fromData = {
    testPlanId: echoTestPlan.value.testPlanId,
    planName: echoTestPlan.value.planName,
    head: echoTestPlan.value.head,
    startTime: echoTestPlan.value.startTime.replace('T', ' '),
    endTime: echoTestPlan.value.endTime.replace('T', ' ')
  }

  updateTestPlan(fromData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          handleCloseEditTestPlan()
          loadTestPlanList(clickedDemand.value.demandId)
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
        editTestPlanBtnText.value = '提交'
        editTestPlanBtnDisable.value = false
        loadingEditTestPlan.value = false
      })
}

const submitEditTestCase = () => {
  editTestCaseBtnText.value = '提交中'
  editTestCaseBtnDisable.value = true
  loadingEditTestCase.value = true

  if (echoTestCase.value.caseName === '') {
    ElNotification({
      title: '提示',
      message: '请输入用例名称',
      type: 'warning'
    })
    editTestCaseBtnText.value = '提交'
    editTestCaseBtnDisable.value = false
    loadingEditTestCase.value = false
    return;
  }

  if (echoTestCase.value.caseContent === '') {
    ElNotification({
      title: '提示',
      message: '请输入用例描述',
      type: 'warning'
    })
    editTestCaseBtnText.value = '提交'
    editTestCaseBtnDisable.value = false
    loadingEditTestCase.value = false
    return;
  }

  if (echoTestCase.value.priority === '') {
    ElNotification({
      title: '提示',
      message: '请选择优先级',
      type: 'warning'
    })
    editTestCaseBtnText.value = '提交'
    editTestCaseBtnDisable.value = false
    loadingEditTestCase.value = false
    return;
  }

  if (echoTestCase.value.status === '') {
    ElNotification({
      title: '提示',
      message: '请选择状态',
      type: 'warning'
    })
    editTestCaseBtnText.value = '提交'
    editTestCaseBtnDisable.value = false
    loadingEditTestCase.value = false
    return;
  }

  let formData = {
    testCaseId: echoTestCase.value.testCaseId,
    caseName: echoTestCase.value.caseName,
    caseContent: echoTestCase.value.caseContent,
    priority: echoTestCase.value.priority,
    status: echoTestCase.value.status,
    testPlanId: echoTestPlan.value.testPlanId
  }
  updateTestCase(formData)
      .then(res => {
        if (res.data.code === 200) {
          ElNotification({
            title: '成功',
            message: res.data.message,
            type: 'success'
          })
          editTestCaseDialogVisible.value = false
          getTestCaseData()
          getTestPlanDetailById(formData.testPlanId)
        } else {
          ElNotification({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
        editTestCaseBtnText.value = '提交'
        editTestCaseBtnDisable.value = false
        loadingEditTestCase.value = false
      })
}


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
  padding: 0 10px;
  text-align: right;
  position: absolute;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s;
}

.el-table__row .is-left:hover .table-title-cell {
  opacity: 1;
}

.line-throw {
  text-decoration: line-through;
  text-decoration-style: double;
  color: rgba(51, 51, 51, 0.38);
}

.epic-default-icon {
  color: #ff877b;
  width: 18px;
  margin-right: 5px
}

.epic-throw-icon {
  color: rgba(255, 135, 123, 0.5);
  width: 18px;
  margin-right: 5px
}

.special-default-icon {
  color: #9191f9;
  width: 18px;
  margin-right: 5px
}

.special-throw-icon {
  color: rgba(145, 145, 249, 0.5);
  width: 18px;
  margin-right: 5px
}

.story-default-icon {
  color: #30d1fc;
  width: 18px;
  margin-right: 5px
}

.story-throw-icon {
  color: rgba(48, 209, 252, 0.5);
  width: 18px;
  margin-right: 5px
}

.task-default-icon {
  color: #73d897;
  width: 18px;
  margin-right: 5px
}

.task-throw-icon {
  color: rgba(115, 216, 151, 0.5);
  width: 18px;
  margin-right: 5px
}

</style>