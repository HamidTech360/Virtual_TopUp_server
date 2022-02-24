import mongoose from 'mongoose'
import joi from 'joi-browser'

const adminSchema = new mongoose.Schema({
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
    }
}, {timestamps:true})

export function ValidateAdmin (user:any){
    const schema = {
        firstName:joi.string().required(),
        lastName:joi.string().required(),
        password:joi.string().min(5).required(),
        email:joi.string().email().required(),
    }

    return joi.validate(user, schema)

}
export const AdminModel = mongoose.model('admin', adminSchema)
