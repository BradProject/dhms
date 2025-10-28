import mongoose from 'mongoose'

const communitySchema = new mongoose.Schema({
  hubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
  message: { type: String, required: true },
  author: { type: String, default: 'anonymous' }
}, { timestamps: true })

export default mongoose.model('Community', communitySchema)
