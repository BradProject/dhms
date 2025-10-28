import mongoose from 'mongoose'
import { logger } from './logger.js'

export async function connectDB(){
  const url = process.env.MONGO_URL || 'mongodb+srv://sammykibet300_db_user:uNn0snFgv8GnuybO@cluster0.8jdyirr.mongodb.net/'
  await mongoose.connect(url)
  logger.info('MongoDB connected')
}
