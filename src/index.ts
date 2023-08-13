import express from 'express'
const app = express()
import mongoose from 'mongoose'
import cors from 'cors'
import {CONFIG}  from './config/index'
import { config } from "dotenv";
import user from './routes/user.route'
import Payment from './routes/payment.route'
import VTU from './routes/vtu.route'
import Review from './routes/review.route'
import Admin from './routes/admin.route'

config();

if(!process.env.JWT_SECRET){
    console.log('No Jwt key provided');
    process.exit(1)  
}



mongoose.connect(process.env.DATABASE_URL as string)
.then(()=>console.log('connection established'))
.catch(()=>console.log('Failed to establish connection'))

app.use(cors())
app.use(express.json())
app.use('/api/user', user)
app.use('/api/pay', Payment)
app.use('/api/vtu', VTU )
app.use('/api/review', Review )
app.use('/api/admin', Admin )

app.listen(process.env.PORT, ()=>console.log(`Listening to port ${process.env.PORT}`))
