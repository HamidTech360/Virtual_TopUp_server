import mongoose from 'mongoose'

const vtuSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true
    }
}, {timestamps:true})

export const VtuModel = mongoose.model('vtu_transaction', vtuSchema)