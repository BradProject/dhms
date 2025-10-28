import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  hubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub' },
  type: { type: String, enum: ['usage','impact','financial'], default: 'usage' },
  payload: { type: Object, default: {} }
}, { timestamps: true })

export default mongoose.model('Report', reportSchema)
