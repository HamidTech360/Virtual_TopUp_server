import  mongoose  from "mongoose";
import joi from 'joi-browser'

const reviewSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    review:{
        type:String,
        required:true
    }

}, {timestamps:true})

export function Validate (payload:any){
    const schema = {
        review:joi.string().required()
    }
    return joi.validate(payload, schema)
}
export const ReviewModel = mongoose.model('review', reviewSchema)

