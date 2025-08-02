<template>
  <view class="container">
    <!-- 筛选器 -->
    <view class="filters">
      <view class="search-box">
        <uni-easyinput
          v-model="filters.keyword"
          placeholder="搜索案件标题或编号"
          prefixIcon="search"
          @confirm="handleSearch"
        />
      </view>
      
      <view class="filter-row">
        <uni-data-select
          v-model="filters.status"
          :localdata="statusOptions"
          placeholder="案件状态"
          @change="handleFilterChange"
        />
        <uni-data-select
          v-model="filters.type"
          :localdata="caseTypes"
          placeholder="案件类型"
          @change="handleFilterChange"
        />
        <uni-data-select
          v-model="filters.sort"
          :localdata="sortOptions"
          placeholder="排序方式"
          @change="handleFilterChange"
        />
      </view>
    </view>

    <!-- 案件列表 -->
    <scroll-view 
      class="case-list"
      scroll-y
      @scrolltolower="handleLoadMore"
      :refresher-enabled="true"
      @refresherrefresh="handleRefresh"
      :refresher-triggered="refreshing"
    >
      <view 
        v-for="item in cases"
        :key="item._id"
        class="case-item"
        @click="navigateToDetail(item._id)"
      >
        <view class="case-header">
          <text class="case-title">{{ item.title }}</text>
          <text :class="['status-tag', `status-${item.status}`]">
            {{ getStatusText(item.status) }}
          </text>
        </view>
        
        <view class="case-info">
          <text class="case-number">案件编号: {{ item.caseNumber }}</text>
          <text class="case-type">{{ getCaseTypeText(item.type) }}</text>
        </view>
        
        <view class="case-client">
          <text>当事人: {{ item.client.name }}</text>
          <text>{{ formatDate(item.createTime) }}</text>
        </view>
      </view>

      <uni-load-more :status="loadMoreStatus" />
    </scroll-view>

    <!-- 悬浮按钮 -->
    <view class="fab" @click="navigateToNew">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Case } from '@/types'

// 选项数据
const statusOptions = [
  { value: '', text: '全部状态' },
  { value: 'pending', text: '待处理' },
  { value: 'processing', text: '处理中' },
  { value: 'closed', text: '已结案' }
]

const caseTypes = [
  { value: '', text: '全部类型' },
  { value: 'civil', text: '民事案件' },
  { value: 'criminal', text: '刑事案件' },
  { value: 'administrative', text: '行政案件' },
  { value: 'other', text: '其他案件' }
]

const sortOptions = [
  { value: 'createTime_desc', text: '创建时间降序' },
  { value: 'createTime_asc', text: '创建时间升序' },
  { value: 'updateTime_desc', text: '更新时间降序' },
  { value: 'updateTime_asc', text: '更新时间升序' }
]

// 状态管理
const cases = ref<Case[]>([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const refreshing = ref(false)
const loadMoreStatus = ref<'more'|'loading'|'noMore'>('more')

const filters = reactive({
  keyword: '',
  status: '',
  type: '',
  sort: 'createTime_desc'
})

// 工具函数
const getStatusText = (status: string) => {
  return statusOptions.find(item => item.value === status)?.text || '未知状态'
}

const getCaseTypeText = (type: string) => {
  return caseTypes.find(item => item.value === type)?.text || '未知类型'
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

// 事件处理
const handleSearch = () => {
  page.value = 1
  loadCases()
}

const handleFilterChange = () => {
  page.value = 1
  loadCases()
}

const handleRefresh = async () => {
  refreshing.value = true
  page.value = 1
  await loadCases()
  refreshing.value = false
}

const handleLoadMore = async () => {
  if (loadMoreStatus.value === 'noMore') return
  page.value++
  await loadCases(true)
}

const navigateToDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/cases/detail?id=${id}`
  })
}

const navigateToNew = () => {
  uni.navigateTo({
    url: '/pages/cases/new'
  })
}

// 数据加载
const loadCases = async (append = false) => {
  try {
    loadMoreStatus.value = 'loading'
    
    const [sortField, sortOrder] = filters.sort.split('_')
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      keyword: filters.keyword,
      status: filters.status,
      type: filters.type,
      sortField,
      sortOrder
    }
    
    const res = await uni.cloud.callFunction({
      name: 'cases',
      data: {
        action: 'getCases',
        params
      }
    })
    
    const { list, total: totalCount } = res.result
    total.value = totalCount
    
    if (append) {
      cases.value.push(...list)
    } else {
      cases.value = list
    }
    
    loadMoreStatus.value = cases.value.length >= total.value ? 'noMore' : 'more'
  } catch (error) {
    console.error('加载案件列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'error'
    })
    loadMoreStatus.value = 'more'
  }
}

onMounted(() => {
  loadCases()
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.filters {
  background: white;
  padding: 20rpx;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .search-box {
    margin-bottom: 20rpx;
  }
  
  .filter-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
  }
}

.case-list {
  flex: 1;
  padding: 20rpx;
}

.case-item {
  background: white;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  
  .case-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }
  
  .case-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .status-tag {
    padding: 4rpx 16rpx;
    border-radius: 6rpx;
    font-size: 24rpx;
    
    &.status-pending {
      background: #ffd591;
      color: #873800;
    }
    
    &.status-processing {
      background: #91caff;
      color: #003a8c;
    }
    
    &.status-closed {
      background: #b7eb8f;
      color: #135200;
    }
  }
  
  .case-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12rpx;
    font-size: 28rpx;
    color: #666;
  }
  
  .case-client {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    color: #999;
  }
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  width: 100rpx;
  height: 100rpx;
  background: #2a5298;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.2);
  
  .fab-icon {
    color: white;
    font-size: 48rpx;
  }
}
</style>