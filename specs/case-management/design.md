# 技术方案设计

## 架构设计
- 前端: uni-app框架(实现多端统一)
- 后端: 云开发CloudBase
- 数据库: CloudBase数据库

## 数据模型

### 案件集合(cases)
```
{
  _id: string,           // 案件ID
  caseNumber: string,    // 案件编号
  caseType: string,      // 案件类型
  title: string,         // 案件标题
  description: string,   // 案件描述
  clientInfo: {          // 当事人信息
    name: string,
    contact: string,
    idNumber: string
  },
  status: string,        // 案件状态
  startDate: Date,       // 立案时间
  updateTime: Date,      // 更新时间
  createTime: Date       // 创建时间
}
```

## 页面结构
- 首页: 案件统计概览
- 案件列表页: 展示所有案件
- 案件详情页: 查看/编辑具体案件信息
- 新增案件页: 案件信息录入表单