import Community from '../models/Community.js'

export async function listCommunity(req,res){
  const items = await Community.find().populate('hubId','name').sort({ createdAt:-1 })
  res.json(items.map(i=>({ ...i.toObject(), hub: i.hubId })))
}

export async function createCommunity(req,res){
  const payload = { ...req.body, author: req.user?.email || 'anonymous' }
  const item = await Community.create(payload)
  res.status(201).json(item)
}
