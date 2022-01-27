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
    }
}, {timestamps:true})

 export function ValidateUser (user:user){
    const schema = {
        firstName:joi.string().required(),
        lastName:joi.string().required(),
        password:joi.string().required(),
        email:joi.string().email().required()
    }

    return joi.validate(user, schema)

}
export const UserModel = mongoose.model('user', userSchema)

// export {ValidateUser as ValidateUser};

