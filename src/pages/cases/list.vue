<template>
  <view class="container">
    <CaseList
      :cases="cases"
      @search="handleSearch"
      @statusChange="handleStatusChange"
      @caseClick="handleCaseClick"
    />

    <view class="fab-button" @click="goToNewCase">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Case } from '../../types'
import CaseList from '../../components/CaseList.vue'
import { getCases } from '../../api/case'

const cases = ref<Case[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const keyword = ref('')
const status = ref('')

const loadCases = async () => {
  loading.value = true
  try {
    const res = await getCases({
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value,
      status: status.value
    })
    cases.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    uni.showToast({
      title: '获取案件列表失败',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

const handleSearch = async (value: string) => {
  keyword.value = value
  page.value = 1
  await loadCases()
}

const handleStatusChange = async (value: string) => {
  status.value = value
  page.value = 1
  await loadCases()
}

const handleCaseClick = (item: Case) => {
  uni.navigateTo({
    url: `/pages/cases/detail?id=${item._id}`
  })
}

const goToNewCase = () => {
  uni.navigateTo({
    url: '/pages/cases/new'
  })
}

onMounted(() => {
  loadCases()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
}

.fab-button {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #2a5298;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.2);
}

.fab-icon {
  color: white;
  font-size: 48rpx;
}
</style>