import {CONFIG} from '../config/index'
import { UserModel } from '../models/user.model'
const config = CONFIG()
import joi from 'joi-browser'
import axios from 'axios'

export const Pay = async (req:any, res:any, next:any)=>{
    const {error} = Validate(req.body)
    if(error) return res.status(401).send(error.details[0].message)
    
    req.body.amount = parseFloat(req.body.amount)*100 
    req.body.amount+=3000

    try{
        const response = await axios.post(`${config.PAYMENT_API}/transaction/initialize`, req.body, {
            headers:{
                'Authorization':`Bearer ${config.PAYMENT_SECRET_KEY}`
            }
        })

        res.send(response.data)


    }catch(ex){
        res.status(400).send('Error processing payment. Please try again')
    }

}


export const VerifyPayment = async (req:any, res:any, next:any)=>{

    try{
        const response = await axios.get(`${config.PAYMENT_API}/transaction/verify/${req.body.ref}`, {
            headers:{
                'Authorization':`Bearer ${config.PAYMENT_SECRET_KEY}`
            }
        })

        const user = await UserModel.findOne({email:req.user._doc.email})
        if(!user) return

        const amountPaid = response.data.data.amount/100
        user.set({
            walletBalance:user.walletBalance+amountPaid
        })

        const result = await user.save()
        
        res.send(result)
        

    }catch(ex){
        res.status(500).send('Failed to verify transaction')
    }
}


function Validate (payload:any){
    const schema = {
        email:joi.string().required(),
        amount:joi.string().required()
    }

    return joi.validate(payload, schema)
}

