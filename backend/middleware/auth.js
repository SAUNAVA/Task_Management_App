import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const auth = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.token;
    
    // 2. Verify token exists
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    // 3. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // 4. Find user in database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    // 5. Attach user to request object
    req.user = decoded
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      error: 'Unauthorized - Invalid token' 
    });
  }
};

export default auth;