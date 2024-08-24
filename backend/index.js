import express from 'express'
import { connectDb } from './db/connectDb.js';  
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js'

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.listen(PORT,() => {
    console.log(`server is running in port:${PORT}`)
    connectDb()
});

