export interface CaseStatus {
  value: 'pending' | 'processing' | 'closed'
  label: string
  color: string
}

export interface Case {
  _id?: string
  caseNumber: string
  title: string
  caseType: string
  description: string
  clientInfo: {
    name: string
    contact: string
    idNumber: string
  }
  status: CaseStatus['value']
  startDate: Date
  updateTime: Date
  createTime: Date
}