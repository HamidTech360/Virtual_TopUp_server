import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    reference:{
        type:String
    },
    trxId:{
        type:String
    },
    currency:{
        type:String
    },
    gateway_response:{
        type:String
    },
    email:{
        type:String,
        required:true
    }

}, {timestamps:true})

export const PaymentModel = mongoose.model('payment',paymentSchema)