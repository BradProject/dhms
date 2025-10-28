import User from '../models/User.js'

export default async function seed(){
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@dhms.go.ke'
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123'
  const exists = await User.findOne({ email })
  if(!exists){
    await User.create({ name:'System Admin', email, password, role:'admin' })
    console.log('[SEED] Admin user created:', email)
  } else {
    console.log('[SEED] Admin exists')
  }
}
