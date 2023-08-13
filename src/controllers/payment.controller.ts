import {CONFIG} from '../config/index'
import { UserModel } from '../models/user.model'
import {PaymentModel} from '../models/payment.model'
const config = CONFIG()
import joi from 'joi-browser'
import axios from 'axios'

function transactionCharge (amount:any){
    if(amount <= 1000){
        return 5000
    }else if(amount > 1000 && amount<=5000){
        return 10000
    }else if(amount > 5000 && amount <=15000){
        return 15000
    }else{
       return 20000
    }
}

export const Pay = async (req:any, res:any, next:any)=>{
    const {error} = Validate(req.body)
    if(error) return res.status(401).send(error.details[0].message)
    
    req.body.amount = parseFloat(req.body.amount)*100 
    console.log(req.body.amount);
    

    req.body.amount +=transactionCharge(req.body.amount/100)
  
    console.log(req.body);
    
    try{
        const response = await axios.post(`${process.env.PAYMENT_API}/transaction/initialize`, req.body, {
            headers:{
                'Authorization':`Bearer ${process.env.PAYMENT_SECRET_KEY}`
            }
        })

        res.send(response.data)


    }catch(ex){
        res.status(400).send('Error processing payment. Please try again')
        console.log(ex);
        
    }

}


export const VerifyPayment = async (req:any, res:any, next:any)=>{

    try{

        const findRef = await PaymentModel.findOne({reference:req.body.ref})
        if(findRef) return res.status(400).send('Transaction already verified')

        const response = await axios.get(`${process.env.PAYMENT_API}/transaction/verify/${req.body.ref}`, {
            headers:{
                'Authorization':`Bearer ${process.env.PAYMENT_SECRET_KEY}`
            }
        })
        if(!response.data.status) return res.status(400).send('could not verify')
        const user = await UserModel.findOne({email:req.user._doc.email})
        if(!user) return

        const {reference, gateway_response, id, amount, currency} = response.data.data
        const newPayment = new PaymentModel({
            reference, gateway_response, amount, currency, trxId:id, email:req.user._doc.email
        })
        const savePayment = await newPayment.save()

        const amountPaid = response.data.data.amount/100 - transactionCharge(response.data.data.amount/100)/100
        console.log(amountPaid);
        
        user.set({
            walletBalance:user.walletBalance+amountPaid
        })
        const result = await user.save()
      

        
        res.json({
            verified:true,
            message:'Transaction verified successfully',
            data:result
        })

    }catch(ex){
        res.status(500).send('Failed to verify transaction')
    }
}

export const getPayments = async (req:any, res:any, next:any)=>{
   
    
    try{
        const payments = await PaymentModel.find({email:req.user._doc.email})
     
        payments.map(item=>item.amount = (item.amount/100))
        //console.log(payments);
        
        res.json({
            status:'success',
            message:'Payment history retrieved successfully',
            data:payments
        })
    }catch(ex){
        res.status(500).send("Failed to load payment history")
    }
}

export const getAllPayments = async (req:any, res:any, next:any)=>{
    try{
        const allPayments = await PaymentModel.find()
        allPayments.map(item=>item.amount = item.amount/100)

        res.json({
            status:'success',
            message:'Payment history retrieved successfully',
            data:allPayments
        })

    }catch(ex){
        res.status(500).send("Failed to load payment history")
    }
}


function Validate (payload:any){
    const schema = {
        email:joi.string().required(),
        amount:joi.string().required()
    }

    return joi.validate(payload, schema)
}

