import express from 'express'
const app = express()
import mongoose from 'mongoose'
import cors from 'cors'
import {CONFIG}  from './config/index'
const config = CONFIG()
import user from './routes/user.route'



if(!config.JWT_SECRET){
    console.log('No Jwt key provided');
    process.exit(1)  
}



mongoose.connect(config.DATABASE_URL as string)
.then(()=>console.log('connection established'))
.catch(()=>console.log('Failed to establish connection'))

app.use(cors())
app.use(express.json())
app.use('/api/user', user)

app.listen(config.PORT, ()=>console.log(`Listening to port ${config.PORT}`))
