<template>
  <view class="container">
    <uni-forms ref="form" :modelValue="formData" :rules="rules">
      <view class="form-section">
        <view class="section-title">基本信息</view>
        
        <uni-forms-item name="title" label="案件标题">
          <uni-easyinput
            v-model="formData.title"
            placeholder="请输入案件标题"
          />
        </uni-forms-item>

        <uni-forms-item name="type" label="案件类型">
          <uni-data-select
            v-model="formData.type"
            :localdata="caseTypes"
            placeholder="请选择案件类型"
          />
        </uni-forms-item>

        <uni-forms-item name="description" label="案件描述">
          <uni-easyinput
            v-model="formData.description"
            type="textarea"
            placeholder="请输入案件描述"
          />
        </uni-forms-item>
      </view>

      <view class="form-section">
        <view class="section-title">当事人信息</view>
        
        <uni-forms-item name="client.name" label="姓名">
          <uni-easyinput
            v-model="formData.client.name"
            placeholder="请输入当事人姓名"
          />
        </uni-forms-item>

        <uni-forms-item name="client.phone" label="联系电话">
          <uni-easyinput
            v-model="formData.client.phone"
            placeholder="请输入联系电话"
          />
        </uni-forms-item>

        <uni-forms-item name="client.idNumber" label="身份证号">
          <uni-easyinput
            v-model="formData.client.idNumber"
            placeholder="请输入身份证号"
          />
        </uni-forms-item>

        <uni-forms-item name="client.address" label="联系地址">
          <uni-easyinput
            v-model="formData.client.address"
            placeholder="请输入联系地址"
          />
        </uni-forms-item>
      </view>

      <view class="form-section">
        <view class="section-title">相关文件</view>
        
        <uni-file-picker
          v-model="formData.attachments"
          file-mediatype="all"
          mode="grid"
          @select="handleFileSelect"
          @delete="handleFileDelete"
        />
      </view>

      <view class="form-actions">
        <button class="btn btn-primary" @click="handleSubmit">保存案件</button>
        <button class="btn btn-secondary" @click="handleCancel">取消</button>
      </view>
    </uni-forms>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const caseTypes = [
  { value: 'civil', text: '民事案件' },
  { value: 'criminal', text: '刑事案件' },
  { value: 'administrative', text: '行政案件' },
  { value: 'other', text: '其他案件' }
]

const formData = reactive({
  title: '',
  type: '',
  description: '',
  client: {
    name: '',
    phone: '',
    idNumber: '',
    address: ''
  },
  attachments: []
})

const rules = {
  title: {
    rules: [{ required: true, errorMessage: '请输入案件标题' }]
  },
  type: {
    rules: [{ required: true, errorMessage: '请选择案件类型' }]
  },
  'client.name': {
    rules: [{ required: true, errorMessage: '请输入当事人姓名' }]
  },
  'client.phone': {
    rules: [
      { required: true, errorMessage: '请输入联系电话' },
      { pattern: /^1[3456789]\d{9}$/, errorMessage: '手机号格式不正确' }
    ]
  },
  'client.idNumber': {
    rules: [
      { required: true, errorMessage: '请输入身份证号' },
      { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, errorMessage: '身份证号格式不正确' }
    ]
  }
}

const form = ref(null)

const handleFileSelect = (e: any) => {
  console.log('文件选择:', e)
}

const handleFileDelete = (e: any) => {
  console.log('文件删除:', e)
}

const handleSubmit = async () => {
  try {
    await form.value.validate()
    // TODO: 调用保存案件的云函数
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.log('表单错误:', error)
  }
}

const handleCancel = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.form-section {
  background: white;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  color: #333;
}

:deep(.uni-forms-item) {
  margin-bottom: 30rpx;
  
  .uni-forms-item__label {
    color: #666;
  }
  
  .uni-easyinput {
    background: #f8f8f8;
    border-radius: 8rpx;
    
    .uni-easyinput__content-input {
      color: #333;
    }
  }
}

.form-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
  
  .btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .btn-primary {
    background: #2a5298;
    color: white;
  }
  
  .btn-secondary {
    background: #f5f5f5;
    color: #666;
    border: 2rpx solid #ddd;
  }
}
</style>