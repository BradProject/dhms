import mongoose from 'mongoose'
import { logger } from './logger.js'

export async function connectDB(){
  const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/dhms'
  await mongoose.connect(url)
  logger.info('MongoDB connected')
}
