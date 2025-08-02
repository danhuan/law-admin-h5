<template>
  <view class="container">
    <view class="header">
      <view class="title">{{caseData.title}}</view>
      <text :class="['status-tag', `status-${caseData.status}`]">
        {{getStatusLabel(caseData.status)}}
      </text>
    </view>

    <view class="info-card">
      <view class="info-item">
        <text class="label">案件编号</text>
        <text class="value">{{caseData.caseNumber}}</text>
      </view>
      <view class="info-item">
        <text class="label">案件类型</text>
        <text class="value">{{getCaseTypeLabel(caseData.caseType)}}</text>
      </view>
      <view class="info-item">
        <text class="label">立案时间</text>
        <text class="value">{{formatDate(caseData.startDate)}}</text>
      </view>
    </view>

    <view class="info-card">
      <view class="card-title">当事人信息</view>
      <view class="info-item">
        <text class="label">姓名</text>
        <text class="value">{{caseData.clientInfo?.name}}</text>
      </view>
      <view class="info-item">
        <text class="label">联系方式</text>
        <text class="value">{{caseData.clientInfo?.contact}}</text>
      </view>
      <view class="info-item">
        <text class="label">身份证号</text>
        <text class="value">{{caseData.clientInfo?.idNumber}}</text>
      </view>
    </view>

    <view class="info-card">
      <view class="card-title">案件描述</view>
      <view class="description">
        {{caseData.description}}
      </view>
    </view>

    <view class="actions">
      <button class="btn btn-primary" @click="handleEdit">编辑案件</button>
      <button class="btn btn-info" @click="showStatusPicker">更新状态</button>
    </view>

    <uni-popup ref="popup" type="bottom">
      <view class="status-picker">
        <view class="picker-header">
          <text>选择案件状态</text>
        </view>
        <view class="picker-content">
          <view
            v-for="status in statusOptions"
            :key="status.value"
            class="status-option"
            :class="{ active: status.value === caseData.status }"
            @click="updateStatus(status.value)"
          >
            {{status.text}}
          </view>
        </view>
      </view>
    </uni-popup>

    <view class="info-card">
      <view class="card-title">进度记录</view>
      <view class="log-list">
        <view v-for="(log, index) in caseData.logs" :key="index" class="log-item">
          <view class="log-header">
            <text class="log-date">{{formatDate(log.date)}}</text>
            <text class="log-operator">{{log.operator}}</text>
          </view>
          <view class="log-content">{{log.content}}</view>
        </view>
      </view>
      
      <view class="log-form">
        <uni-easyinput
          v-model="logContent"
          type="textarea"
          placeholder="输入进度更新内容"
        />
        <button class="btn btn-primary" @click="handleAddLog">添加进度</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCaseDetail, updateCaseStatus, addCaseLog } from '../../api/case'

const popup = ref(null)
const caseData = ref<Partial<Case>>({})
const logContent = ref('')

const statusOptions = [
  { value: 'pending', text: '待处理' },
  { value: 'processing', text: '处理中' },
  { value: 'closed', text: '已结案' }
]

const getStatusLabel = (status: string) => {
  return statusOptions.find(opt => opt.value === status)?.text || '未知状态'
}

const getCaseTypeLabel = (type: string) => {
  const types = {
    civil: '民事案件',
    criminal: '刑事案件',
    administrative: '行政案件',
    other: '其他案件'
  }
  return types[type] || '未知类型'
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

const handleEdit = () => {
  uni.navigateTo({
    url: `/pages/cases/edit?id=${caseData.value._id}`
  })
}

const showStatusPicker = () => {
  popup.value?.open()
}

const updateStatus = async (status: string) => {
  try {
    // TODO: 调用云函数更新状态
    popup.value?.close()
    uni.showToast({
      title: '状态更新成功',
      icon: 'success'
    })
    caseData.value.status = status
  } catch (error) {
    uni.showToast({
      title: '状态更新失败',
      icon: 'error'
    })
  }
}

const handleAddLog = async () => {
  if (!logContent.value) {
    uni.showToast({
      title: '请输入进度内容',
      icon: 'none'
    })
    return
  }

  try {
    await addCaseLog(caseData.value._id, {
      content: logContent.value,
      operator: '当前用户' // TODO: 替换为实际登录用户
    })
    
    logContent.value = ''
    await loadCaseDetail()
    
    uni.showToast({
      title: '添加进度成功',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: '添加进度失败',
      icon: 'error'
    })
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const id = currentPage.options.id
  // TODO: 根据id获取案件详情
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.header {
  background: white;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.info-card {
  background: white;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.label {
  color: #666;
  font-size: 28rpx;
}

.value {
  font-size: 28rpx;
}

.description {
  font-size: 28rpx;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 10rpx;
  text-align: center;
}

.status-picker {
  background: white;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
}

.picker-header {
  text-align: center;
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.status-option {
  padding: 20rpx;
  text-align: center;
  border-bottom: 1rpx solid #eee;
}

.status-option.active {
  color: #2a5298;
  font-weight: bold;
}

.log-list {
  margin: 20rpx 0;
}

.log-item {
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.log-date {
  color: #666;
  font-size: 24rpx;
}

.log-operator {
  color: #2a5298;
  font-size: 24rpx;
}

.log-content {
  font-size: 28rpx;
  line-height: 1.6;
}

.log-form {
  margin-top: 30rpx;
}
</style>