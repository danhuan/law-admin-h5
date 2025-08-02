<template>
  <view class="case-list">
    <view class="filters">
      <uni-search-bar
        v-model="searchKey"
        placeholder="搜索案件"
        @confirm="handleSearch"
      />
      <uni-data-select
        v-model="statusFilter"
        :localdata="statusOptions"
        @change="handleStatusChange"
      />
    </view>

    <uni-list>
      <uni-list-item
        v-for="item in cases"
        :key="item._id"
        :title="item.title"
        :note="item.description"
        clickable
        @click="handleCaseClick(item)"
      >
        <template #header>
          <text class="case-number">{{item.caseNumber}}</text>
        </template>
        <template #footer>
          <text :class="['status-tag', `status-${item.status}`]">
            {{getStatusLabel(item.status)}}
          </text>
        </template>
      </uni-list-item>
    </uni-list>

    <uni-load-more :status="loadMoreStatus" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Case } from '../types'

const props = defineProps<{
  cases: Case[]
}>()

const emit = defineEmits(['search', 'statusChange', 'caseClick'])

const searchKey = ref('')
const statusFilter = ref('')
const loadMoreStatus = ref('more')

const statusOptions = [
  { value: '', text: '全部状态' },
  { value: 'pending', text: '待处理' },
  { value: 'processing', text: '处理中' },
  { value: 'closed', text: '已结案' }
]

const getStatusLabel = (status: string) => {
  return statusOptions.find(opt => opt.value === status)?.text || '未知状态'
}

const handleSearch = () => {
  emit('search', searchKey.value)
}

const handleStatusChange = () => {
  emit('statusChange', statusFilter.value)
}

const handleCaseClick = (item: Case) => {
  emit('caseClick', item)
}
</script>

<style scoped>
.case-list {
  padding: 20rpx;
}

.filters {
  margin-bottom: 20rpx;
  display: flex;
  gap: 20rpx;
  align-items: center;
}

.case-number {
  font-size: 24rpx;
  color: #666;
}

.status-tag {
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.status-pending {
  background: #ffd591;
  color: #873800;
}

.status-processing {
  background: #91caff;
  color: #003a8c;
}

.status-closed {
  background: #b7eb8f;
  color: #135200;
}
</style>