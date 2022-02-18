import { UserModel } from "../models/user.model";

export const VerifyAccount = async (req:any, res:any, next:any)=>{
    try{
        const user = await UserModel.findOne({confirmationCode:req.body.confirmationCode})
        if(!user) return res.status(400).send('User not found')
        user.set({
            staus:'verified'
        })
        const result = await user.save()
        res.json({
            status:'success',
            message:'User has been successfully verified',
            data:result
        })

    }catch(err){
        res.status(500).send('Problem occured while verifying email')
    }
}