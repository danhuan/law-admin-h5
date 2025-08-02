import { db } from '../utils/cloudbase'

export async function getCases(params = {}) {
  return await db.callFunction({
    name: 'case',
    data: {
      action: 'getCases',
      ...params
    }
  })
}

export async function getCaseDetail(id: string) {
  return await db.callFunction({
    name: 'case',
    data: {
      action: 'getCaseDetail',
      id
    }
  })
}

export async function createCase(caseData: any) {
  return await db.callFunction({
    name: 'case',
    data: {
      action: 'createCase',
      caseData
    }
  })
}

export async function updateCase(id: string, caseData: any) {
  return await db.callFunction({
    name: 'case',
    data: {
      action: 'updateCase',
      id,
      caseData
    }
  })
}

export async function updateCaseStatus(id: string, status: string) {
  return await db.callFunction({
    name: 'case',
    data: {
      action: 'updateCaseStatus',
      id,
      status
    }
  })
}

export async function addCaseLog(id: string, log: any) {
  return await db.callFunction({
    name: 'case',
    data: {
      action: 'addCaseLog',
      id,
      log
    }
  })
}