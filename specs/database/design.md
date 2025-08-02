# 数据库设计文档

## 集合设计

### cases 集合
用于存储案件信息
```typescript
interface Case {
  _id: string             // 文档ID
  caseNumber: string      // 案件编号
  title: string          // 案件标题  
  caseType: string       // 案件类型
  description: string    // 案件描述
  clientInfo: {          // 当事人信息
    name: string         // 姓名
    contact: string      // 联系方式 
    idNumber: string     // 身份证号
  }
  status: string         // 案件状态: pending|processing|closed
  startDate: Date        // 立案时间
  endDate?: Date         // 结案时间
  attachments: string[]  // 附件列表
  logs: {               // 案件进度日志
    date: Date          // 日期
    content: string     // 内容
    operator: string    // 操作人
  }[]
  createTime: Date      // 创建时间
  updateTime: Date      // 更新时间
}