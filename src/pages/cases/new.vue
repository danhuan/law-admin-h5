<template>
  <view class="container">
    <CaseForm @submit="handleSubmit" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Case } from '../../types'
import CaseForm from '../../components/CaseForm.vue'

const handleSubmit = async (data: Case) => {
  try {
    // TODO: 调用云函数保存案件
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '保存失败',
      icon: 'error'
    })
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>