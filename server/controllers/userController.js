import User from '../models/User.js'
import { signToken } from '../utils/token.js'

export async function register(req,res){
  const { name, email, password, role='manager' } = req.body
  const exists = await User.findOne({ email })
  if(exists) return res.status(400).json({ message: 'Email already registered' })
  const user = await User.create({ name, email, password, role })
  res.status(201).json({ id: user._id, email: user.email })
}

export async function login(req,res){
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if(!user) return res.status(400).json({ message: 'Only Admin can log in' })
  const ok = await user.comparePassword(password)
  if(!ok) return res.status(400).json({ message: 'Only Admin can log in' })
  const token = signToken(user)
  res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role } })
}

export async function profile(req,res){
  const user = await User.findById(req.user.id).select('-password')
  res.json(user)
}
