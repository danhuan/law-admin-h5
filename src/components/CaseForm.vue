<template>
  <view class="case-form">
    <uni-forms ref="form" :model="formData" :rules="rules">
      <uni-forms-item label="案件编号" name="caseNumber">
        <uni-easyinput v-model="formData.caseNumber" placeholder="请输入案件编号"/>
      </uni-forms-item>
      
      <uni-forms-item label="案件标题" name="title">
        <uni-easyinput v-model="formData.title" placeholder="请输入案件标题"/>
      </uni-forms-item>

      <uni-forms-item label="案件类型" name="caseType">
        <uni-data-select
          v-model="formData.caseType"
          :localdata="caseTypes"
          placeholder="请选择案件类型"
        />
      </uni-forms-item>

      <uni-forms-item label="当事人姓名" name="clientInfo.name">
        <uni-easyinput v-model="formData.clientInfo.name" placeholder="请输入当事人姓名"/>
      </uni-forms-item>

      <uni-forms-item label="联系方式" name="clientInfo.contact">
        <uni-easyinput v-model="formData.clientInfo.contact" placeholder="请输入联系方式"/>
      </uni-forms-item>

      <uni-forms-item label="身份证号" name="clientInfo.idNumber">
        <uni-easyinput v-model="formData.clientInfo.idNumber" placeholder="请输入身份证号"/>
      </uni-forms-item>

      <uni-forms-item label="案件描述" name="description">
        <uni-easyinput
          type="textarea"
          v-model="formData.description"
          placeholder="请输入案件描述"
        />
      </uni-forms-item>

      <uni-forms-item label="立案时间" name="startDate">
        <uni-datetime-picker
          v-model="formData.startDate"
          type="date"
        />
      </uni-forms-item>
    </uni-forms>

    <view class="form-actions">
      <button class="btn btn-primary" @click="submitForm">保存</button>
      <button class="btn btn-secondary" @click="resetForm">重置</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Case } from '../types'

const emit = defineEmits(['submit'])

const caseTypes = [
  { value: 'civil', text: '民事案件' },
  { value: 'criminal', text: '刑事案件' },
  { value: 'administrative', text: '行政案件' },
  { value: 'other', text: '其他案件' }
]

const formData = reactive<Partial<Case>>({
  caseNumber: '',
  title: '',
  caseType: '',
  description: '',
  clientInfo: {
    name: '',
    contact: '',
    idNumber: ''
  },
  status: 'pending',
  startDate: new Date(),
  updateTime: new Date(),
  createTime: new Date()
})

const rules = {
  caseNumber: {
    rules: [{ required: true, errorMessage: '请输入案件编号' }]
  },
  title: {
    rules: [{ required: true, errorMessage: '请输入案件标题' }]
  },
  caseType: {
    rules: [{ required: true, errorMessage: '请选择案件类型' }]
  },
  'clientInfo.name': {
    rules: [{ required: true, errorMessage: '请输入当事人姓名' }]
  }
}

const form = ref(null)

const submitForm = () => {
  form.value?.validate().then(res => {
    emit('submit', formData)
  }).catch(err => {
    console.error(err)
  })
}

const resetForm = () => {
  form.value?.resetFields()
}
</script>

<style scoped>
.case-form {
  padding: 20rpx;
}

.form-actions {
  margin-top: 40rpx;
  display: flex;
  gap: 20rpx;
}

.btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 10rpx;
  text-align: center;
}

.btn-primary {
  background: #2a5298;
  color: white;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}
</style>