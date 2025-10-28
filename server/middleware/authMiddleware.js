

import jwt from 'jsonwebtoken'

/**
 * Middleware to protect routes by requiring a valid JWT
 */
export function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' })
    }

    // Verify JWT with proper secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Not authorized, invalid token payload' })
    }

    req.user = decoded // attach user payload (id, role, etc.)
    next()
  } catch (err) {
    console.error('JWT verification failed:', err.message)
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' })
  }
}

/**
 * Middleware to restrict access to specific roles
 * Example: router.post('/admin-only', protect, permit('admin'), handler)
 */
export function permit(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden, insufficient role' })
    }
    next()
  }
}
