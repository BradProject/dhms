// import Funding from '../models/Funding.js'

// export async function listFunding(req,res){
//   const funds = await Funding.find().populate('hubId', 'name').sort({ createdAt:-1 })
//   res.json(funds.map(x=>({ ...x.toObject(), hub: x.hubId })))
// }

// export async function createFunding(req,res){
//   const f = await Funding.create(req.body)
//   res.status(201).json(f)
// }


import Funding from '../models/Funding.js'

export async function listFunding(req, res) {
  const funds = await Funding.find().populate('hubId', 'name').sort({ createdAt:-1 })
  res.json(funds.map(x => ({ ...x.toObject(), hub: x.hubId })))
}

export async function createFunding(req, res) {
  const f = await Funding.create(req.body)
  res.status(201).json(f)
}

export async function updateFunding(req,res){
  const f = await Funding.findByIdAndUpdate(req.params.id, req.body, { new:true })
  res.json(f)
}

export async function deleteFunding(req,res){
  await Funding.findByIdAndDelete(req.params.id)
  res.json({ message: 'Funding deleted' })
}
