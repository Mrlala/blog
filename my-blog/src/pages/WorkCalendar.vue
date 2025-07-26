<template>
  <div class="work-calendar-bg">
    <div class="work-calendar-card">
      <div class="work-calendar-panel">
        <n-calendar v-model:value="selectedTimestamp" @update:value="handleUpdateValue" class="calendar-container">
          <template #default="{ year, month, date }">
            <div class="custom-cell-wrapper">
              <div class="custom-cell" :class="getDateCellClass(year, month, date)">
                <div v-if="getTaskCountText(year, month, date)" class="task-count-badge">
                  {{ getTaskCountText(year, month, date) }}
                </div>
              </div>
            </div>
          </template>
        </n-calendar>
      </div>
      <div class="work-task-panel">
        <h3>
          {{ selectedDate ? formatDisplayDate(selectedDate) : '选择日期' }} 工作备忘
        </h3>
        <div class="task-controls">
          <n-button type="primary" :disabled="!selectedDate" @click="showTaskModal = true">
            添加任务
          </n-button>
          <n-button v-if="hasDoneTasks" type="tertiary" @click="clearDoneTasks" style="margin-left:8px">
            清除已完成
          </n-button>
        </div>
        <h4>待办任务</h4>
        <TaskList :tasks="incompleteTasks" @remove="removeTask" @toggle-done="toggleDone" @edit="editTask"
          @view="viewTask" />
        <h4 style="margin-top: 1.5em;">已完成任务</h4>
        <TaskList :tasks="completedTasks" @remove="removeTask" @toggle-done="toggleDone" @edit="editTask"
          @view="viewTask" />
      </div>
    </div>
    <TaskDetailModal v-model:modelValue="detailModalShow" :task="detailTask" />
    <TaskInputModal v-model:show="showTaskModal" :modalTitle="editingTask ? '编辑任务' : '添加任务'" :editTask="editingTask"
      @submit="onModalSubmit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { NCalendar, NButton } from 'naive-ui'
import TaskInputModal from '@/components/calendar/TaskInputModal.vue'
import TaskList from '@/components/calendar/TaskList.vue'
import TaskDetailModal from '@/components/calendar/TaskDetailModal.vue'
import { getTasks, addTask, updateTask, deleteTask } from '@/api/calendarTasks'

// 时间戳 <-> yyyy-MM-dd 字符串
function ts2str(ts) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${da}`
}


function str2ts(str) {
  if (!str) return Date.now()
  const [y, m, d] = str.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}
function formatDisplayDate(dateStr) {
  if (!dateStr) return ''
  const arr = dateStr.split('-')
  return `${arr[0]}年${parseInt(arr[1], 10)}月${parseInt(arr[2], 10)}日`
}

const selectedTimestamp = ref(Date.now())
const selectedDate = computed({
  get() { return ts2str(selectedTimestamp.value) },
  set(val) { selectedTimestamp.value = str2ts(val) }
})
const allTasks = ref([])

// 拉取所有任务（推荐全量拉，任务量很大时再改成按天拉）
async function fetchAllTasks() {
  try {
    const tasks = await getTasks()

    // 统一格式化 date 字段，去掉时间
    allTasks.value = (Array.isArray(tasks) ? tasks : []).map(task => ({
      ...task,
      date: task.date?.slice(0, 10) // 只保留前10位
    }))
    // 输出格式化后的数据

  } catch (e) {
    allTasks.value = []
    console.error('接口出错:', e)
  }
}



onMounted(fetchAllTasks)

const showTaskModal = ref(false)
const editingTask = ref(null)
const detailModalShow = ref(false)
const detailTask = ref(null)

// 本地筛选，速度快
const tasksForSelectedDay = computed(() => {
  return selectedDate.value
    ? allTasks.value.filter(t => t.date === selectedDate.value)
    : []
})
const incompleteTasks = computed(() => tasksForSelectedDay.value.filter(t => !t.done))
const completedTasks = computed(() => tasksForSelectedDay.value.filter(t => t.done))
const hasDoneTasks = computed(() => tasksForSelectedDay.value.some(t => t.done))

// 新建任务
async function submitTask(taskData) {
  if (!selectedDate.value || !taskData.title.trim()) return
  try {
// 新建任务
const data = await addTask({
  title: taskData.title,
  date: selectedDate.value,
  description: taskData.desc || '',
  icon: taskData.icon || '',
  priority: taskData.priority || ''
})
if (data && data.id) {
  allTasks.value.push({
    ...data,
    date: data.date?.slice(0, 10)
  })
  showTaskModal.value = false
  editingTask.value = null
}

  } catch (e) {
    // 全局弹窗提示失败
  }
}
// 编辑任务（只支持编辑标题/描述/优先级等，不改done）
async function saveTask(taskData) {
  const t = editingTask.value
  if (!t) return
  try {
    const data = await updateTask(t.id, {
      title: taskData.title,
      description: taskData.desc,
      icon: taskData.icon,
      priority: taskData.priority
    })
    const idx = allTasks.value.findIndex(tt => tt.id === t.id)
    if (idx !== -1 && data && data.id) allTasks.value[idx] = { ...allTasks.value[idx], ...data }
    showTaskModal.value = false
    editingTask.value = null
  } catch (e) {
    // 全局弹窗提示失败
  }
}
function editTask(task) {
  editingTask.value = { ...task }
  showTaskModal.value = true
}
function onModalSubmit(taskData) {
  if (editingTask.value) saveTask(taskData)
  else submitTask(taskData)
}
// 删除任务
async function removeTask(id) {
  try {
    await deleteTask(id)
    allTasks.value = allTasks.value.filter(t => t.id !== id)
  } catch (e) {
    // 全局弹窗提示失败
  }
}
// 完成/未完成
async function toggleDone(id, val) {
  const t = allTasks.value.find(t => t.id === id)
  if (t) {
    try {
      await updateTask(id, { done: val })
      t.done = val
    } catch (e) {
      // 全局弹窗提示失败
    }
  }
}
// 批量清除已完成
async function clearDoneTasks() {
  if (!selectedDate.value) return
  const doneTasks = allTasks.value.filter(t => t.date === selectedDate.value && t.done)
  // 并发删除
  await Promise.all(doneTasks.map(task => deleteTask(task.id)))
  allTasks.value = allTasks.value.filter(t => t.date !== selectedDate.value || !t.done)
}
// 查看详情
function viewTask(task) {
  detailTask.value = task
  detailModalShow.value = true
}

// 日历标记
function getDateCellClass(year, month, dateObj) {
  const tasks = getTasksForDate(year, month, dateObj)
  const hasImportant = tasks.some(t => !t.done && t.priority === 'important')
  const hasUrgent = tasks.some(t => !t.done && t.priority === 'urgent')
  return {
    'has-important': hasImportant,
    'has-urgent': hasUrgent
  }
}
function getTasksForDate(year, month, dateObj) {
  let dayNum
  if (typeof dateObj === 'number') {
    dayNum = dateObj
  } else if (dateObj instanceof Date) {
    dayNum = dateObj.getDate()
    month = dateObj.getMonth() + 1
    year = dateObj.getFullYear()
  } else {
    return []
  }
  const m = String(month).padStart(2, '0')
  const d = String(dayNum).padStart(2, '0')
  const cellDate = `${year}-${m}-${d}`
  return allTasks.value.filter(t => t.date === cellDate)
}
function getTaskCountText(year, month, dateObj) {
  const tasks = getTasksForDate(year, month, dateObj)
  if (tasks.length === 0) return ''
  const doneCount = tasks.filter(t => t.done).length
  return `${doneCount}/${tasks.length}`
}
function handleUpdateValue(ts, { year, month, date }) {
  selectedTimestamp.value = ts
}
</script>



<style scoped>
.work-calendar-bg {
  min-height: 80vh;
  background: var(--body-color, #f8fafb);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em 0;
}

.work-calendar-card {
  background: var(--card-color, #fff);
  border-radius: var(--card-radius, 1.5em);
  box-shadow: var(--card-shadow, 0 4px 22px #6091ff17);
  display: flex;
  gap: 0;
  min-width: 720px;
  max-width: 980px;
  width: 90%;
  margin: 0 auto;
  transition: background 0.3s, box-shadow 0.3s;
}

.work-calendar-panel {
  background: var(--cover-bg, #f2f6fd);
  flex: 0 0 450px;
  padding: 1.5em;
  border-right: 1.5px solid var(--card-border, #ecedf3);
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.work-task-panel {
  flex: 1 0 300px;
  background: var(--card-color, #fff);
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.calendar-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.calendar-container :deep(.n-calendar) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.calendar-container :deep(.n-calendar-table) {
  flex: 1;
}

.calendar-container :deep(.n-calendar-dates) {
  flex: 1;
  min-height: 0;
}

.task-controls {
  margin-bottom: 1.5em;
  display: flex;
  align-items: center;
}

.work-task-panel h3,
.work-task-panel h4 {
  font-weight: bold;
  font-size: 1.15em;
  margin-bottom: 1em;
  color: var(--card-title-color, #234087);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

li {
  margin-bottom: 1em;
  display: flex;
  align-items: center;
  gap: 0.8em;
}

.n-checkbox .n-checkbox-box {
  border-radius: 6px !important;
}

/* 自定义日历单元格样式 */
.custom-cell-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.custom-cell {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.n-calendar-date {
  position: relative;
  z-index: 1;
}

.n-calendar-date__date {
  font-size: 1.1em;
  font-weight: 600;
}

.task-count-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: var(--primary-color, #2563eb);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75em;
  font-weight: 600;
  line-height: 1;
  box-shadow: 0 1px 4px #2563eb80;
  z-index: 2;
}

.custom-cell.has-important {
  background-color: rgba(234, 179, 8, 0.15);
  border: 1px solid rgba(234, 179, 8, 0.4);
}

.custom-cell.has-urgent {
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.custom-cell.has-important.has-urgent {
  background: linear-gradient(135deg,
      rgba(234, 179, 8, 0.4) 50%,
      rgba(239, 68, 68, 0.4) 50%);
  border: 1px solid rgba(234, 179, 8, 0.8);
}

/* 调整Naive UI原生样式 */
.calendar-container :deep(.n-calendar-cell) {
  min-height: 60px;
  position: relative;
}

.calendar-container :deep(.n-calendar-date) {
  height: 100%;
}

.calendar-container :deep(.n-calendar-date__date) {
  position: relative;
  z-index: 1;
}

@media (max-width: 900px) {
  .work-calendar-bg {
    padding: 1em 0;
    min-height: 90vh;
  }

  .work-calendar-card {
    flex-direction: column;
    min-width: 0;
    width: 95%;
    border-radius: 1em;
  }

  .work-calendar-panel {
    border-right: none;
    border-bottom: 1px solid var(--card-border, #ecedf3);
    padding: 1em;
    min-height: 350px;
    flex: 0 0 auto;
  }

  .work-task-panel {
    padding: 1em;
    min-height: auto;
    flex: 0 0 auto;
  }

  .calendar-container {
    min-height: 300px;
  }
}

::v-deep(.n-calendar .n-calendar-cell) {
  padding: 0px !important;
}

::v-deep(.n-calendar-date) {
  position: absolute !important;
  z-index: 20 !important;
  /* 加 !important 确保覆盖 */
  background: rgba(255, 255, 255, 0);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-weight: 600;
  color: #2563eb;
  user-select: none;
  margin-left: 15px;
  margin-top: -15px;
}

::v-deep(.n-calendar-cell__bar) {
  position: relative;
  z-index: 5 !important;

}
</style>
