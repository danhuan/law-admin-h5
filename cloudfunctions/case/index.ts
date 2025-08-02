
import cloud from '@cloudbase/node-sdk'

const app = cloud.init({
  env: cloud.SYMBOL_CURRENT_ENV
})
const db = app.database()
const _ = db.command

// 获取案件列表
async function getCases(event) {
  const { status, keyword, page = 1, pageSize = 20 } = event
  
  let query = {}
  if (status) {
    query.status = status
  }
  if (keyword) {
    query = _.or([
      {
        title: db.RegExp({
          regexp: keyword,
          options: 'i',
        }),
      },
      {
        caseNumber: db.RegExp({
          regexp: keyword,
          options: 'i',
        }),
      },
    ])
  }

  const countResult = await db.collection('cases').where(query).count()
  const total = countResult.total

  const list = await db.collection('cases')
    .where(query)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .orderBy('createTime', 'desc')
    .get()
    .then(res => res.data)

  return {
    list,
    total,
    page,
    pageSize,
  }
}

// 获取案件详情
async function getCaseDetail(event) {
  const { id } = event
  return await db.collection('cases').doc(id).get()
    .then(res => res.data)
}

// 创建案件
async function createCase(event) {
  const { caseData } = event
  return await db.collection('cases').add({
    ...caseData,
    createTime: new Date(),
    updateTime: new Date()
  })
}

// 更新案件
async function updateCase(event) {
  const { id, caseData } = event
  return await db.collection('cases').doc(id).update({
    ...caseData,
    updateTime: new Date()
  })
}

// 更新案件状态
async function updateCaseStatus(event) {
  const { id, status } = event
  return await db.collection('cases').doc(id).update({
    status,
    updateTime: new Date()
  })
}

// 添加案件进度
async function addCaseLog(event) {
  const { id, log } = event
  return await db.collection('cases').doc(id).update({
    logs: _.push([{
      ...log,
      date: new Date()
    }]),
    updateTime: new Date()
  })
}

exports.main = async function(event) {
  switch (event.action) {
    case 'getCases':
      return await getCases(event)
    case 'getCaseDetail':
      return await getCaseDetail(event)
    case 'createCase':
      return await createCase(event)
    case 'updateCase':
      return await updateCase(event)
    case 'updateCaseStatus':
      return await updateCaseStatus(event)
    case 'addCaseLog':
      return await addCaseLog(event)
  }
}