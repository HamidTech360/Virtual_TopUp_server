import {CONFIG} from '../config'
const config = CONFIG()
import joi from 'joi-browser'
import axios from 'axios'
import {VtuModel} from '../models/vtu.model'
import { UserModel } from '../models/user.model'
import {PaymentModel} from '../models/payment.model'




export const FetchNetworkID = async(req:any, res:any, next:any)=>{
    try{
        const response = await axios.get(`${config.VTU_URL}/get/network/`, {headers:{
            'Authorization':`Token ${config.VTU_API_KEY}`
        }})
        res.send(response.data)
    }catch(ex){
        res.status(500).send('Server Error')
    }
}

export const GetDataPlans = async (req:any, res:any, next:any)=>{
    try{
        const response = await axios.get(`${config.VTU_URL}/network`, {headers:{
            'Authorization':`Token ${config.VTU_API_KEY}`
        }})
        res.send(response.data)
    }catch(ex){
        res.status(500).send('Server Error')
    }
}

export const BuyAirTime = async (req:any, res:any, next:any)=>{
    const {error} = ValidateAirtimeReq(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = await UserModel.findOne({email:req.user._doc.email})
    if(!user) return res.status(400).send('you are not an authorized user')

    req.body.amount= parseInt(req.body.amount)
    //console.log(req.body);
    

    if(user.walletBalance < req.body.amount) return res.status(400).send('Insufficient Balance')
    if(req.body.amount < 50) return res.status(400).send('The least you can purchase is NGN 30')
    try{
        const payload= {
            network:req.body.network,
            amount:req.body.amount,
            mobile_number:req.body.mobile_number,
            airtime_type: "VTU" ,
            Ported_number:false,
        }
        console.log(payload);
        
        const response = await axios.post(`${config.VTU_URL}/topup/`, {...payload}, {headers:{
            'Authorization':`Token ${config.VTU_API_KEY}`,
         
        }})
        console.log(response.data);
        
       if(response.data.Status !== "successful") return res.status(400).send("something went wrong")
        user.set({
            walletBalance: user.walletBalance - req.body.amount
        })
        const result = await user.save()

        const newTransaction = new VtuModel({
            amount:response.data.amount,
            type:'Airtime',
            email:user.email
        })
        const saveTransaction = newTransaction.save()
     
        res.json({
            status:true,
            message:"Airtime purchase successfull",
            data:result,
            details:response.data
        })
        console.log(response.data);
        

        
    }catch(ex:any){
        res.status(500).send('Something went wrong in the server. Please refer to the Admin')
        console.log(ex.response?.data);
        
    }
}

export const BuyData = async (req:any, res:any, next:any)=>{
    const {error} = ValidateDataReq(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = await UserModel.findOne({email:req.user._doc.email})
    if(!user) return res.status(400).send('you are not an authorized user')
    
    const splitPlan = req.body.plan.split('-')
    const planAmount = parseInt(splitPlan[1])

    if(user.walletBalance < (planAmount + (0.05*planAmount))) return res.status(400).send('Insufficient Balance')
    try{
        const payload= {
            network:req.body.network,
            mobile_number:req.body.mobile_number,
            plan: splitPlan[0],
            Ported_number:false,
        }
        console.log(payload, planAmount);
        
        const response = await axios.post(`${config.VTU_URL}/data/`, {...payload}, {headers:{
            'Authorization':`Token ${config.VTU_API_KEY}`,
         
        }})
        console.log(response.data);

        if(response.data.Status !== "successful") return res.status(400).send("something went wrong")
        user.set({
            walletBalance: user.walletBalance - (planAmount + (0.05*planAmount))
        })
        const result = await user.save()

        const newTransaction = new VtuModel({
            amount:response.data.amount,
            type:'Data',
            email:user.email
        })
        const saveTransaction = newTransaction.save()
     
        res.json({
            status:true,
            message:"Data purchase successfull",
            data:result,
            details:response.data
        })


    }catch(ex:any){
        res.status(500).send('Something went wrong in the server. Please refer to the Admin')
        console.log(ex.response?.data);
        
    }
} 

export const GetTransactions = async (req:any, res:any, next:any)=>{
    try{
        const response = await VtuModel.find({email:req.user._doc.email})
        res.json({
            status:'success',
            message:'Payment history retrieved successfully',
            data:response
        })
    }catch(ex){
        res.status(500).send("Failed to load transaction history")
    }
}

export const GetAllTransactions = async (req:any, res:any, next:any)=>{
    try{
        const response = await VtuModel.find()
        
        res.json({
            status:'success',
            message:'Payment history retrieved successfully',
            data:response
        })

    }catch(ex){
        res.status(500).send("Failed to load transaction history") 
    }
}

export const Statistics = async (req:any, res:any, next:any)=>{
    // let walletTotal = 0
    // let vtuTotal = 0
    try{

        const vtu = await VtuModel.find({email:req.user._doc.email})
        let vtuArr = vtu.map((item, i)=>item.amount)
        const totalVtu = vtuArr.reduce((Psum, a)=>Psum + a, 0)
        

        const payment = await PaymentModel.find({email:req.user._doc.email})
        let paymentArr = payment.map(item=>(item.amount-5000)/100)
        const totalPayment = paymentArr.reduce((Psum, a)=>Psum + a, 0)

        const Checkbalance = await UserModel.findOne({email:req.user._doc.email})
        const walletBalance = Checkbalance.walletBalance
        

        res.json({
            status:'success',
            message:'data retrieved successfully',
            data:{
                totalVtu, totalPayment, walletBalance
            }
        })
   
        

    }catch(ex){
        res.status(500).send("Failed to load statistics")
    }
}




function ValidateDataReq (payload:any){
    const schema = {
        network:joi.string().required(),
        plan:joi.string().required(),
        mobile_number:joi.string().required()
    }

    return joi.validate(payload, schema)
}

function ValidateAirtimeReq (payload:any){
    const schema = {
        network:joi.string().required(),
        amount:joi.string().required(),
        mobile_number:joi.string().required()
    }

    return joi.validate(payload, schema)
}