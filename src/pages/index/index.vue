<template>
  <view class="container">
    <view class="header">
      <text class="title">律所案件管理系统</text>
      <text class="subtitle">高效管理案件,提升工作效率</text>
    </view>

    <view class="statistics">
      <view class="stat-card">
        <text class="stat-number">{{totalCases}}</text>
        <text class="stat-label">总案件数</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{activeCases}}</text>
        <text class="stat-label">进行中案件</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{closedCases}}</text>
        <text class="stat-label">已结案件</text>
      </view>
    </view>

    <view class="actions">
      <button class="btn btn-primary" @click="goToNewCase">
        新增案件
      </button>
      <button class="btn btn-success" @click="goToCaseList">
        案件列表
      </button>
      <button class="btn btn-info" @click="goToProfile">
        个人中心
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const totalCases = ref(0)
const activeCases = ref(0)
const closedCases = ref(0)

// 页面跳转函数
const goToNewCase = () => {
  uni.navigateTo({
    url: '/pages/cases/new'
  })
}

const goToCaseList = () => {
  uni.navigateTo({
    url: '/pages/cases/list'
  })
}

const goToProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/profile'
  })
}

// 获取统计数据
const fetchStatistics = async () => {
  // 这里将来需要对接云数据库
  totalCases.value = 0
  activeCases.value = 0
  closedCases.value = 0
}

onMounted(() => {
  fetchStatistics()
})
</script>

<style scoped>
.container {
  padding: 40rpx;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}

.statistics {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60rpx;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10rpx);
  border-radius: 20rpx;
  padding: 30rpx;
  flex: 1;
  margin: 0 10rpx;
  text-align: center;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10rpx;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.btn {
  width: 100%;
  padding: 20rpx 30rpx;
  border-radius: 40rpx;
  border: none;
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  box-shadow: 0 8rpx 20rpx rgba(255, 107, 107, 0.3);
}

.btn-success {
  background: linear-gradient(45deg, #56ab2f, #a8e6cf);
  color: white;
  box-shadow: 0 8rpx 20rpx rgba(86, 171, 47, 0.3);
}

.btn-info {
  background: linear-gradient(45deg, #3498db, #74b9ff);
  color: white;
  box-shadow: 0 8rpx 20rpx rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.footer {
  margin-top: 60rpx;
  text-align: center;
}

.footer .logo {
  width: 300rpx;
  opacity: 0.8;
}
</style>
