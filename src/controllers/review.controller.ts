import { ReviewModel, Validate } from "../models/review.model"

export const postReview = async (req:any, res:any, next:any)=>{

    const {error} = Validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    try{
       const newReview = new ReviewModel({
           name:`${req.user._doc.firstName} ${req.user._doc.lastName}`,
           email:req.user._doc.email,
           review:req.body.review
       })
       const saveReview = await newReview.save()
       res.json({
           status:'success',
           message:'Review posted successfully'
       }) 
    }catch(ex){
        console.log(ex);
        res.status(500).send('Failed to save review')
    }
}

export const getReviews = async (req:any, res:any, next:any)=>{
    try{
        const reviews = await ReviewModel.find()
        res.json({
            status:'success',
            message:'Reviews fetched successfully',
            data:reviews
        })
    }catch(ex){
        res.status(500).send('Failed to fetch review')
    }
}