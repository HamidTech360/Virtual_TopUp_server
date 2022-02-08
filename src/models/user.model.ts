import mongoose from 'mongoose'
import joi from 'joi-browser'

interface user {
    firstName:string,
    lastname:string,
    email:string,
    password:string
}

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },  
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNo:{
        type:String,
        required:true
    },
    walletBalance:{
        type:Number,
        required:true
    },
    referralBonus:{
        type:Number,
        required:true
    }
}, {timestamps:true})

 export function ValidateUser (user:user){
    const schema = {
        firstName:joi.string().required(),
        lastName:joi.string().required(),
        password:joi.string().min(5).required(),
        email:joi.string().email().required(),
        phoneNo:joi.string().required()
    }

    return joi.validate(user, schema)

}
export const UserModel = mongoose.model('user', userSchema)

// export {ValidateUser as ValidateUser};

