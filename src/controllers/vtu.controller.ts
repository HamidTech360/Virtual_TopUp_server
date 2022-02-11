import {CONFIG} from '../config'
const config = CONFIG()
import joi from 'joi-browser'
import axios from 'axios'
import {VtuModel} from '../models/vtu.model'
import { UserModel } from '../models/user.model'



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

export const BuyAirTime = async (req:any, res:any, next:any)=>{
    const {error} = ValidateAirtimeReq(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    if(req.user._doc.walletBalance < req.body.amount) return res.status(400).send('Insufficient Balance')
    try{
        const payload= {
            network:req.body.network,
            amount:req.body.amount,
            mobile_number:req.body.mobile_number,
            airtime_type: "VTU" 
        }
        const response = await axios.post(`${config.VTU_URL}/topup`, payload, {headers:{
            'Authorization':`Token ${config.VTU_API_KEY}`
        }})

        // const user = await UserModel.findOne({email:req.user._doc.email})
        // if(!user) return

        // user.set({
        //     walletBalance: user.walletBalance - req.body.amount
        // })
        // const result = await user.save()
        res.send(response.data)

        
    }catch(ex){
        res.status(500).send(ex)
    }
}

function ValidateAirtimeReq (payload:any){
    const schema = {
        network:joi.string().required(),
        amount:joi.string().required(),
        mobile_number:joi.string().required()
    }

    return joi.validate(payload, schema)
}