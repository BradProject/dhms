// import mongoose from 'mongoose'

// const fundingSchema = new mongoose.Schema({
//   hubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
//   source: { type: String, required: true },
//   amount: { type: Number, required: true },
//   notes: String
// }, { timestamps: true })

// export default mongoose.model('Funding', fundingSchema)

import mongoose from 'mongoose'

const fundingSchema = new mongoose.Schema({
  hubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  notes: String,
  allocationDate: { type: Date },    
  partner: { type: String }          
}, { timestamps: true })

export default mongoose.model('Funding', fundingSchema)

