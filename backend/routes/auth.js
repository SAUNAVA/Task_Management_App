import express from 'express'
const router = express.Router();
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      // Check for existing user
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(409).json({ 
          error: existingUser.email === email 
            ? 'Email already exists' 
            : 'Username already taken'
        });
      }
  
      // Create and save user
      const user = new User({ username, email, password });
      await user.save();
      
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        userId: user._id
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.post('/admin/register', async(req,res)=>{

    try {
        const {adminKey , username,email,password} = req.body;
        if(adminKey !== process.env.ADMIN_SECRET_KEY){
            return res.status(403).json({error : 'Invalid admin key'});
        }

        const user = new User({
            username,
            email,
            password,
            role:'admin'

        })
        await user.save();
        res.status(201).json({message:'Admin registration succesfull'});
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

// server/routes/auth.js
// auth.js check route
router.get('/check', async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(200).json(null); // Return 200 with null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId)
      .select('-password -__v')
      .lean();

    if (!user) {
      return res.status(200).json(null); // Don't clear cookie here
    }

    return res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      
    });
  } catch (err) {
    res.status(200).json(null); // Maintain consistent response format
  }
});
router.post('/logout', (req, res) => {
  res.clearCookie('token')
    .status(200)
    .json({ message: 'Logged out successfully' });
  
});

router.post('/login', async(req,res)=>{

    try {
        const {email,password} = req.body;
        const user = await User.findOne({email})

        if(!user || (user.password!==password)){
            return res.status(403).json({error:'Invalid credentials'});
        }

        const token = jwt.sign(
            {userId: user._id , role: user.role},
            process.env.JWT_SECRET_KEY,
            {expiresIn:'1h'}
        )

        res.cookie('token', token, {
          httpOnly: true,
          secure: false, // Disable in development (enable in production)
          sameSite: 'lax', // Changed from 'strict'
          domain: 'localhost', // Explicit domain declaration
          path: '/',
          maxAge: 3600000 // 1 hour
        });

          const userData = {
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            
          };
      
          return res.json(userData);


        

    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

export default router