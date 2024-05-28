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
    <el-input placeholder="请输入缺陷编号或标题" size="large" style="height: 38px; width: 260px" clearable>

    </el-input>
    <el-button type="primary" @click="openAddDefectDialog">新建缺陷</el-button>
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
        <span :class="{'line-throw': scope.row.demandStatus === 2 || scope.row.demandStatus === -1}">
          <span
              :class="[(scope.row.demandStatus === 2 || scope.row.demandStatus === -1) ? 'task-throw-icon':'task-default-icon']">
            <font-awesome-icon style="width: 14px; height: 14px;" :icon="['fas', 'bug']"/>
          </span>
          {{ scope.row.title }}
        </span>
      </template>
    </el-table-column>
    <el-table-column min-width="150px" align="center" prop="demandStatus" label="状态" class-name="table-statue-column">
      <template #default="scope">
        <el-select
            v-model="scope.row.demandStatus"
            class="demand-status-select"
            @change="defectStatusChange(scope.row)"
        >
          <el-option
              class="demand-table-select-options-menu"
              :key="0"
              label="新提交"
              :value="0"
              :disabled="scope.row.demandStatus === 0"
          >
            <div v-if="scope.row.demandStatus === 0" class="table-statue" style="background-color: #b5d8fa;">新提交
            </div>
            <div v-else class="table-statue" style="background-color: #56abfb;">新提交</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="1"
              label="处理中"
              :value="1"
              :disabled="scope.row.demandStatus === 1 || scope.row.demandStatus === -1"
          >
            <div v-if="scope.row.demandStatus === 1 || scope.row.demandStatus === -1" class="table-statue"
                 style="background-color: #fae3b2;">处理中
            </div>
            <div v-else class="table-statue" style="background-color: #f6c659;">处理中</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="2"
              label="已修复"
              :value="2"
              :disabled="scope.row.demandStatus === 2 || scope.row.demandStatus === -1"
          >
            <div v-if="scope.row.demandStatus === 2 || scope.row.demandStatus === -1" class="table-statue"
                 style="background-color: #c0fad5;">已修复
            </div>
            <div v-else class="table-statue" style="background-color: #9de4b6;">已修复</div>
          </el-option>
          <el-option
              class="demand-table-select-options-menu"
              :key="-1"
              label="已拒绝"
              :value="-1"
              :disabled="scope.row.demandStatus === -1"
          >
            <div v-if="scope.row.demandStatus === -1" class="table-statue" style="background-color: #e0dede;">已拒绝
            </div>
            <div v-else class="table-statue" style="background-color: #c3c3c3;">已拒绝</div>
          </el-option>

          <template #prefix>
            <div class="table-statue" style="background-color: #56abfb;" v-show="scope.row.demandStatus===0">新提交
            </div>
            <div class="table-statue" style="background-color: #f6c659;" v-show="scope.row.demandStatus===1">处理中
            </div>
            <div class="table-statue" style="background-color: #9de4b6;" v-show="scope.row.demandStatus===2">已修复
            </div>
            <div class="table-statue" style="background-color: #c3c3c3;" v-show="scope.row.demandStatus===-1">已拒绝
            </div>
          </template>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column min-width="150px" align="center" prop="headId" label="负责人">
      <template #default="scope">
        <el-select
            v-model="scope.row.headId"
            placeholder="—"
            class="demand-headId-select"
            @change="defectHeadIdChange(scope.row)"
            v-loading="members.length <= 0"
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
            @change="defectPriorityChange(scope.row)"
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
    <el-table-column min-width="150px" align="center" prop="severity" label="严重程度">
      <template #default="scope">
        <el-select
            v-model="scope.row.severity"
            placeholder="请选择优先级"
            class="demand-status-select"
            @change="defectSeverityChange(scope.row)"
        >
          <el-option
              class="add-demand-priority-select-options-menu"
              :key="3"
              label="致命"
              :value="3"
          >
            <div class="select-severity-options" style="background-color: #fa5a55;"></div>
            致命
          </el-option>
          <el-option
              class="add-demand-priority-select-options-menu"
              :key="2"
              label="严重"
              :value="2"
          >
            <div class="select-severity-options" style="background-color: #ffa415;"></div>
            严重
          </el-option>
          <el-option
              class="add-demand-priority-select-options-menu"
              :key="1"
              label="一般"
              :value="1"
          >
            <div class="select-severity-options" style="background-color: #ffd234;"></div>
            一般
          </el-option>
          <el-option
              class="add-demand-priority-select-options-menu"
              :key="0"
              label="建议"
              :value="0"
          >
            <div class="select-severity-options" style="background-color: #22d7bb;"></div>
            建议
          </el-option>


          <template #prefix>
            <div class="select-severity-options" style="background-color: #fa5a55;"
                 v-show="scope.row.severity===3">
            </div>
            <a v-show="scope.row.severity===3">致命</a>
            <div class="select-severity-options" style="background-color: #ffa415;"
                 v-show="scope.row.severity===2">
            </div>
            <a v-show="scope.row.severity===2">严重</a>
            <div class="select-severity-options" style="background-color: #ffd234;"
                 v-show="scope.row.severity===1">
            </div>
            <a v-show="scope.row.severity===1">一般</a>
            <div class="select-severity-options" style="background-color: #22d7bb;"
                 v-show="scope.row.severity===0">
            </div>
            <a v-show="scope.row.severity===0">建议</a>
          </template>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column min-width="150px" align="center" prop="probability" label="复现概率">
      <template #default="scope">
        <el-select
            v-model="scope.row.probability"
            placeholder="请选择优先级"
            class="defect-status-select"
            @change="defectProbabilityChange(scope.row)"
        >
          <el-option
              class="demand-table-select-options-menu"
              :key="3"
              label="必现"
              :value="3"
          />
          <el-option
              class="demand-table-select-options-menu"
              :key="2"
              label="大概率复现"
              :value="2"
          />
          <el-option
              class="demand-table-select-options-menu"
              :key="1"
              label="小概率复现"
              :value="1"
          />
          <el-option
              class="demand-table-select-options-menu"
              :key="0"
              label="仅出现一次"
              :value="0"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column min-width="130px" align="center" prop="type" label="缺陷类型">
      <template #default="scope">
        <span v-for="type in demandTypes" v-show="type.dictionaryDataId === scope.row.type">{{ type.label }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="180px" align="center" prop="updateTime" label="更新时间">
      <template #default="scope">
        {{ formatDate(new Date(scope.row.updateTime), 'YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
  </el-table>

  <!--  新建需求弹窗-->
  <el-dialog
      v-model="addDemandDialogVisible"
      title="新建缺陷"
      width="80vw"
      :before-close="handleClose"
      top="7vh"
      @close="closeAddDefectDialog"
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
            <el-input
                size="large"
                readonly
                disabled
            >
              <template #prefix>
                <span class="task-default-icon">
                  <font-awesome-icon style="width: 14px; height: 14px;" :icon="['fas', 'bug']"/>
                </span>
                缺陷
              </template>
            </el-input>
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
          <el-form-item label="严重程度">
            <el-select
                v-model="newDemandFormData.severity"
                placeholder="请选择严重程度"
                size="large"
                clearable
            >
              <el-option
                  class="add-demand-priority-select-options-menu"
                  :key="3"
                  label="致命"
                  :value="3"
              >
                <div class="select-severity-options" style="background-color: #fa5a55;"></div>
                致命
              </el-option>
              <el-option
                  class="add-demand-priority-select-options-menu"
                  :key="2"
                  label="严重"
                  :value="2"
              >
                <div class="select-severity-options" style="background-color: #ffa415;"></div>
                严重
              </el-option>
              <el-option
                  class="add-demand-priority-select-options-menu"
                  :key="1"
                  label="一般"
                  :value="1"
              >
                <div class="select-severity-options" style="background-color: #ffd234;"></div>
                一般
              </el-option>
              <el-option
                  class="add-demand-priority-select-options-menu"
                  :key="0"
                  label="建议"
                  :value="0"
              >
                <div class="select-severity-options" style="background-color: #22d7bb;"></div>
                建议
              </el-option>
              <template #prefix>
                <div class="select-severity-options" style="background-color: #fa5a55;"
                     v-show="newDemandFormData.severity===3">
                </div>
                <div class="select-severity-options" style="background-color: #ffa415;"
                     v-show="newDemandFormData.severity===2">
                </div>
                <div class="select-severity-options" style="background-color: #ffd234;"
                     v-show="newDemandFormData.severity===1">
                </div>
                <div class="select-severity-options" style="background-color: #22d7bb;"
                     v-show="newDemandFormData.severity===0">
                </div>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="缺陷类型">
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
          <el-form-item label="复现概率">
            <el-select
                v-model="newDemandFormData.probability"
                placeholder="请选择复现概率"
                size="large"
                clearable
            >
              <el-option
                  :key="3"
                  label="必现"
                  :value="3"
              />
              <el-option
                  :key="2"
                  label="大概率复现"
                  :value="2"
              />
              <el-option
                  :key="1"
                  label="小概率复现"
                  :value="1"
              />
              <el-option
                  :key="0"
                  label="仅出现一次"
                  :value="0"
              />
            </el-select>
          </el-form-item>
        </el-scrollbar>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDemandDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddDefect">
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
                  @change="defectHeadIdChange(clickedDemand)"
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
                  @change="defectStatusChange(clickedDemand)"
                  style="width: 80%"
              >
                <el-option
                    class="demand-table-select-options-menu"
                    :key="0"
                    label="新提交"
                    :value="0"
                    :disabled="clickedDemand.demandStatus === 0"
                >
                  <div v-if="clickedDemand.demandStatus === 0" class="table-statue" style="background-color: #b5d8fa;">
                    新提交
                  </div>
                  <div v-else class="table-statue" style="background-color: #56abfb;">新提交</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="1"
                    label="处理中"
                    :value="1"
                    :disabled="clickedDemand.demandStatus === 1 || clickedDemand.demandStatus === -1"
                >
                  <div v-if="clickedDemand.demandStatus === 1 || clickedDemand.demandStatus === -1" class="table-statue"
                       style="background-color: #fae3b2;">处理中
                  </div>
                  <div v-else class="table-statue" style="background-color: #f6c659;">处理中</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="2"
                    label="已修复"
                    :value="2"
                    :disabled="clickedDemand.demandStatus === 2 || clickedDemand.demandStatus === -1"
                >
                  <div v-if="clickedDemand.demandStatus === 2 || clickedDemand.demandStatus === -1" class="table-statue"
                       style="background-color: #c0fad5;">已修复
                  </div>
                  <div v-else class="table-statue" style="background-color: #9de4b6;">已修复</div>
                </el-option>
                <el-option
                    class="demand-table-select-options-menu"
                    :key="-1"
                    label="已拒绝"
                    :value="-1"
                    :disabled="clickedDemand.demandStatus === -1"
                >
                  <div v-if="clickedDemand.demandStatus === -1" class="table-statue" style="background-color: #e0dede;">
                    已拒绝
                  </div>
                  <div v-else class="table-statue" style="background-color: #c3c3c3;">已拒绝</div>
                </el-option>

                <template #prefix>
                  <div class="table-statue" style="background-color: #56abfb;" v-show="clickedDemand.demandStatus===0">
                    新提交
                  </div>
                  <div class="table-statue" style="background-color: #f6c659;" v-show="clickedDemand.demandStatus===1">
                    处理中
                  </div>
                  <div class="table-statue" style="background-color: #9de4b6;" v-show="clickedDemand.demandStatus===2">
                    已修复
                  </div>
                  <div class="table-statue" style="background-color: #c3c3c3;" v-show="clickedDemand.demandStatus===-1">
                    已拒绝
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
                  @change="defectStartTimeChange(clickedDemand)"
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
                  @change="defectEndTimeChange(clickedDemand)"
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
                        新提交
                      </div>
                      <div class="table-statue" style="background-color: #f6c659;" v-show="active.fromActive==='1'">处理中
                      </div>
                      <div class="table-statue" style="background-color: #9de4b6;" v-show="active.fromActive==='2'">已修复
                      </div>
                      <div class="table-statue" style="background-color: #c3c3c3;" v-show="active.fromActive==='-1'">
                        已拒绝
                      </div>
                    </div>
                    <span>&nbsp;&nbsp;→&nbsp;&nbsp;</span>
                    <div>
                      <div class="table-statue" style="background-color: #56abfb;" v-show="active.toActive==='0'">新提交
                      </div>
                      <div class="table-statue" style="background-color: #f6c659;" v-show="active.toActive==='1'">处理中
                      </div>
                      <div class="table-statue" style="background-color: #9de4b6;" v-show="active.toActive==='2'">已修复
                      </div>
                      <div class="table-statue" style="background-color: #c3c3c3;" v-show="active.toActive==='-1'">
                        已拒绝
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
                       v-show="active.activeContent === '缺陷类型'">
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
                       v-show="active.activeContent === '严重程度'">
                    <div style="display: flex; align-items: center">
                      <div class="select-severity-options" style="background-color: #fa5a55;"
                           v-show="active.fromActive==='3'">
                      </div>
                      <span v-show="active.fromActive==='3'">致命</span>
                      <div class="select-severity-options" style="background-color: #ffa415;"
                           v-show="active.fromActive==='2'">
                      </div>
                      <span v-show="active.fromActive==='2'">严重</span>
                      <div class="select-severity-options" style="background-color: #ffd234;"
                           v-show="active.fromActive==='1'">
                      </div>
                      <span v-show="active.fromActive==='1'">一般</span>
                      <div class="select-severity-options" style="background-color: #22d7bb;"
                           v-show="active.fromActive==='0'">
                      </div>
                      <span v-show="active.fromActive==='0'">建议</span>
                      <span style="margin: 0 10px">&nbsp;&nbsp;→&nbsp;&nbsp;</span>
                      <div class="select-severity-options" style="background-color: #fa5a55;"
                           v-show="active.toActive==='3'">
                      </div>
                      <span v-show="active.toActive==='3'">致命</span>
                      <div class="select-severity-options" style="background-color: #ffa415;"
                           v-show="active.toActive==='2'">
                      </div>
                      <span v-show="active.toActive==='2'">严重</span>
                      <div class="select-severity-options" style="background-color: #ffd234;"
                           v-show="active.toActive==='1'">
                      </div>
                      <span v-show="active.toActive==='1'">一般</span>
                      <div class="select-severity-options" style="background-color: #22d7bb;"
                           v-show="active.toActive==='0'">
                      </div>
                      <span v-show="active.toActive==='0'">建议</span>
                    </div>

                  </div>
                  <div style="margin-left: 4%; margin-top: 20px; display: flex; align-items: center "
                       v-show="active.activeContent === '复现概率'">
                    <div>
                      {{ active.fromActive === '3' ? '必现' : '' }}
                      {{ active.fromActive === '2' ? '大概率复现' : '' }}
                      {{ active.fromActive === '1' ? '小概率复现' : '' }}
                      {{ active.fromActive === '0' ? '仅出现一次' : '' }}
                    </div>
                    <span>&nbsp;&nbsp;→&nbsp;&nbsp;</span>
                    <div>
                      {{ active.toActive === '3' ? '必现' : '' }}
                      {{ active.toActive === '2' ? '大概率复现' : '' }}
                      {{ active.toActive === '1' ? '小概率复现' : '' }}
                      {{ active.toActive === '0' ? '仅出现一次' : '' }}
                    </div>

                  </div>
                  <div style="margin-left: 4%; margin-top: 20px; display: flex; align-items: center"
                       v-show="active.activeContent === '负责人'">
                    <div>
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
                    <div class="table-statue" style="background-color: #56abfb;" v-show="active.toActive==='0'">新提交
                    </div>
                    <div class="table-statue" style="background-color: #f6c659;" v-show="active.toActive==='1'">处理中
                    </div>
                    <div class="table-statue" style="background-color: #9de4b6;" v-show="active.toActive==='2'">已修复
                    </div>
                    <div class="table-statue" style="background-color: #c3c3c3;" v-show="active.toActive==='-1'">
                      已拒绝
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </el-tab-pane>
            </el-tabs>
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
                  @change="defectPriorityChange(clickedDemand)"
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
            <div style="width: 25%;font-size: 14px; line-height: 38px;">缺陷类型</div>
            <div style="width: 50%;line-height: 30px">
              <el-select
                  v-model="clickedDemand.type"
                  placeholder="请选择需求类型"
                  size="large"
                  class="demand-status-select"
                  @change="defectTypeChange(clickedDemand)"
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
            <div style="width: 25%;font-size: 14px; line-height: 38px;">严重程度</div>
            <div style="width: 50%;line-height: 30px">
              <el-select
                  v-model="clickedDemand.severity"
                  placeholder="请选择优先级"
                  size="large"
                  class="demand-status-select"
                  @change="defectSeverityChange(clickedDemand)"
              >
                <el-option
                    class="add-demand-priority-select-options-menu"
                    :key="3"
                    label="致命"
                    :value="3"
                >
                  <div class="select-severity-options" style="background-color: #fa5a55;"></div>
                  致命
                </el-option>
                <el-option
                    class="add-demand-priority-select-options-menu"
                    :key="2"
                    label="严重"
                    :value="2"
                >
                  <div class="select-severity-options" style="background-color: #ffa415;"></div>
                  严重
                </el-option>
                <el-option
                    class="add-demand-priority-select-options-menu"
                    :key="1"
                    label="一般"
                    :value="1"
                >
                  <div class="select-severity-options" style="background-color: #ffd234;"></div>
                  一般
                </el-option>
                <el-option
                    class="add-demand-priority-select-options-menu"
                    :key="0"
                    label="建议"
                    :value="0"
                >
                  <div class="select-severity-options" style="background-color: #22d7bb;"></div>
                  建议
                </el-option>


                <template #prefix>
                  <div class="select-severity-options" style="background-color: #fa5a55;"
                       v-show="clickedDemand.severity===3">
                  </div>
                  <a v-show="clickedDemand.severity===3">致命</a>
                  <div class="select-severity-options" style="background-color: #ffa415;"
                       v-show="clickedDemand.severity===2">
                  </div>
                  <a v-show="clickedDemand.severity===2">严重</a>
                  <div class="select-severity-options" style="background-color: #ffd234;"
                       v-show="clickedDemand.severity===1">
                  </div>
                  <a v-show="clickedDemand.severity===1">一般</a>
                  <div class="select-severity-options" style="background-color: #22d7bb;"
                       v-show="clickedDemand.severity===0">
                  </div>
                  <a v-show="clickedDemand.severity===0">建议</a>
                </template>
              </el-select>
              <!--              <el-select-->
              <!--                  v-model="clickedDemand.severity"-->
              <!--                  placeholder="请选择严重程度"-->
              <!--                  size="large"-->
              <!--                  class="demand-status-select"-->
              <!--                  @change="demandSourceChange(clickedDemand)"-->
              <!--              >-->
              <!--                <el-option-->
              <!--                    v-for="item in demandSource"-->
              <!--                    :key="item.dictionaryDataId"-->
              <!--                    :label="item.label"-->
              <!--                    :value="item.dictionaryDataId"-->
              <!--                />-->
              <!--                <template #prefix>-->
              <!--                  <div v-if="clickedDemand.source === null || clickedDemand.source === ''">——</div>-->
              <!--                  <div v-for="item in demandSource" :key="item.dictionaryDataId"-->
              <!--                       v-show="item.dictionaryDataId === clickedDemand.source">{{ item.label }}-->
              <!--                  </div>-->
              <!--                </template>-->
              <!--              </el-select>-->
            </div>
          </div>
          <div style="display: flex;">
            <div style="width: 25%;font-size: 14px; line-height: 38px;">复现概率</div>
            <div style="width: 50%;line-height: 30px">
              <el-select
                  v-model="clickedDemand.probability"
                  placeholder="请选择复现概率"
                  class="defect-status-select"
                  @change="defectProbabilityChange(clickedDemand)"
                  style="color: #a8abb2"
              >
                <el-option
                    class="demand-table-select-options-menu"
                    :key="3"
                    label="必现"
                    :value="3"
                />
                <el-option
                    class="demand-table-select-options-menu"
                    :key="2"
                    label="大概率复现"
                    :value="2"
                />
                <el-option
                    class="demand-table-select-options-menu"
                    :key="1"
                    label="小概率复现"
                    :value="1"
                />
                <el-option
                    class="demand-table-select-options-menu"
                    :key="0"
                    label="仅出现一次"
                    :value="0"
                />
              </el-select>


              <!--              <el-select-->
              <!--                  v-model="clickedDemand.probability"-->
              <!--                  placeholder="请选择严重程度"-->
              <!--                  size="large"-->
              <!--                  class="demand-status-select"-->
              <!--                  @change="demandSourceChange(clickedDemand)"-->
              <!--              >-->
              <!--                <el-option-->
              <!--                    v-for="item in demandSource"-->
              <!--                    :key="item.dictionaryDataId"-->
              <!--                    :label="item.label"-->
              <!--                    :value="item.dictionaryDataId"-->
              <!--                />-->
              <!--                <template #prefix>-->
              <!--                  <div v-if="clickedDemand.source === null || clickedDemand.source === ''">——</div>-->
              <!--                  <div v-for="item in demandSource" :key="item.dictionaryDataId"-->
              <!--                       v-show="item.dictionaryDataId === clickedDemand.source">{{ item.label }}-->
              <!--                  </div>-->
              <!--                </template>-->
              <!--              </el-select>-->
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
      <span :class="{'line-throw': clickedDemand.demandStatus === 2 || clickedDemand.demandStatus === -1}">
          <span
              :class="[(clickedDemand.demandStatus === 2 || clickedDemand.demandStatus === -1) ? 'task-throw-icon':'task-default-icon']">
            <font-awesome-icon style="width: 14px; height: 14px;" :icon="['fas', 'bug']"/>
          </span>
      {{ currentProInfo.proFlag }} - {{ clickedDemand.demandNo }}
        </span>
    </template>
    <template #footer>

    </template>
  </el-dialog>

</template>


<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, shallowRef} from "vue";
import {IToolbarConfig} from "@wangeditor/editor";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  addComment,
  getAllDefectsByProId,
  getCommentList,
  getDefectById,
  getDemandActiveList,
  insertNewDefect,
  queryDefectTypes,
  queryDemandMembers,
  queryProByProId,
  updateDefectDesc,
  updateDefectHeadId,
  updateDefectPriority,
  updateDefectProbability,
  updateDefectSeverity,
  updateDefectStartTime,
  updateDefectStatus,
  updateDefectType,
  updateDemandEndTime
} from "../../../api/defectApi.ts";
import {formatDate} from "@vueuse/shared";

const proId = ref('')
const currentProInfo = ref({})

const demandsByLevel = ref([])
const allDemands = ref([])
const allFatherDemands = ref([])

onMounted(() => {
  let recent = localStorage.getItem("recentVisit");
  if (recent) {
    getDefectById(recent).then((res) => {
      if (res.data.code === 2001) {
        clickedDemand.value = res.data.data
        clickValueHtmlReadOnly.value = clickedDemand.demandDesc
        proId.value = clickedDemand.proId
        getCurrentProInfo(res.data.data.proId)
        getDefectTypes()
        getDemandMembers(res.data.data.proId)
        getDefectList(res.data.data.proId)
        clickRowDialogVisible.value = true
      }
    })
  } else {
    proId.value = localStorage.getItem('proDetailId')
    getCurrentProInfo(proId.value)
    getDefectTypes()
    getDemandMembers(proId.value)
    getDefectList(proId.value)
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
  severity: 1,
  probability: '',
  type: '',
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

const getDefectTypes = () => {
  queryDefectTypes().then((res) => {
    demandTypes.value = res.data.data
    console.log(demandTypes.value)
  })
}

const getDefectList = (proId) => {
  getAllDefectsByProId(proId).then((res) => {
    if (res.data.code === 2001) {
      demandsByLevel.value = res.data.data.demandsByLevel.filter((item) => item.demandStatus === 1)
      allDemands.value = res.data.data.allDemands
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

const submitAddDefect = () => {
  newDemandFormData.value.demandDesc = valueHtml.value
  insertNewDefect(newDemandFormData.value).then((res) => {
    if (res.data.code === 3001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
      addDemandDialogVisible.value = false
      getDefectList(proId.value)
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
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

const openAddDefectDialog = () => {
  newDemandFormData.value.proId = currentProInfo.value.proId
  addDemandDialogVisible.value = true
}

const closeAddDefectDialog = () => {
  newDemandFormData.value.proId = currentProInfo.value.proId
  newDemandFormData.value.title = ''
  newDemandFormData.value.demandDesc = ''
  newDemandFormData.value.demandStatus = 0
  newDemandFormData.value.headId = ''
  newDemandFormData.value.priority = 2
  newDemandFormData.value.severity = 1
  newDemandFormData.value.probability = ''
  newDemandFormData.value.type = ''
  newDemandFormData.value.startTime = ''
  newDemandFormData.value.endTime = ''
  addDemandFatherDemandSelected.value = {}
  valueHtml.value = ''
}

const handleCloseClickRow = () => {
  showDesc.value = true
  firstLevelComment.value = []
  notFirstLevelComment.value = []
}

const defectStatusChange = (row) => {
  updateDefectStatus(row.demandId, row.demandStatus).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}
const defectHeadIdChange = (row) => {
  updateDefectHeadId(row.demandId, row.headId).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}
const defectPriorityChange = (row) => {
  updateDefectPriority(row.demandId, row.priority).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}
const defectSeverityChange = (row) => {
  updateDefectSeverity(row.demandId, row.severity).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}
const defectProbabilityChange = (row) => {
  updateDefectProbability(row.demandId, row.probability).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}
const defectTypeChange = (row) => {
  updateDefectType(row.demandId, row.type).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}
const defectStartTimeChange = (row) => {
  let demand = {
    demandId: row.demandId,
    startTime: row.startTime
  }
  updateDefectStartTime(demand).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}
const defectEndTimeChange = (row) => {
  let demand = {
    demandId: row.demandId,
    endTime: row.endTime
  }
  updateDemandEndTime(demand).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}

const clickedDemand = ref({})
const clickRow = (row) => {
  clickValueHtmlReadOnly.value = row.demandDesc
  clickRowDialogVisible.value = true
  clickedDemand.value = row
  getComments(clickedDemand.value.demandId)
  getDefectActive(clickedDemand.value.demandId)

  firstTagName.value = 'baseInfo'
  secondTagName.value = 'comment'
  // recordVisit(row.demandId, 2)
}

const demandActive = ref([])
const demandStatueActive = ref([])

const getDefectActive = (demandId) => {
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
  updateDefectDesc(demand).then((res) => {
    if (res.data.code === 4001) {
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
      getDefectList(proId.value)
      showDesc.value = true
      clickValueHtmlReadOnly.value = clickValueHtml.value
      clickedDemand.value.demandDesc = clickValueHtml.value
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
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
      title: '提示',
      message: '评论内容不能为空',
      type: 'warning',
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
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
      getComments(workItemId)
    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })

}

const beforeReply = (comment) => {
  let userInfo = JSON.parse(localStorage.getItem("userInfo"))
  openRep.value = true;
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
const replyComment = () => {
  if (replyContent.value === '') {
    ElNotification({
      title: '提示',
      message: '评论内容不能为空',
      type: 'warning',
    })
    return;
  }
  postComment.value.content = replyContent.value;

  addComment(postComment.value).then((res) => {
    if (res.data.code === 3001) {
      postComment.value.content = '';
      replyContent.value = '';
      ElNotification({
        title: '成功',
        message: res.data.message,
        type: 'success',
      })
      openRep.value = false;

      console.log(clickedDemand.value)
      getComments(clickedDemand.value.demandId)

    } else {
      ElNotification({
        title: '提示',
        message: res.data.message,
        type: 'warning',
      })
    }
  })
}

const firstLevelComment = ref([]);
const notFirstLevelComment = ref([]);


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

.select-severity-options {
  width: 10px;
  height: 10px;
  border-radius: 20px;
  margin-right: 10px;
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
  display: inline-block;
  background-color: #ff7575;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  border-radius: 4px
}

.task-throw-icon {
  display: inline-block;
  background-color: rgba(255, 117, 117, 0.5);
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  border-radius: 4px
}

</style>