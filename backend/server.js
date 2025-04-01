import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import express from 'express';
import dbConnect from './dbConfig/db.js';
import authRoutes from './routes/auth.js'
import cors from 'cors'
import taskRoutes from './routes/tasks.js'
import adminRouter from './routes/admin.js'

const app = express();
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true,
  exposedHeaders: ['set-cookie']
}));
dbConnect();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);
app.use('/api/tasks', taskRoutes)
app.use('/api/admin' , adminRouter)




  

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Server is ready at http://localhost:${port}`);
});