import bcrypt from 'bcrypt'
import { ValidateUser,  UserModel } from "../models/user.model"



export const createUser = async (req:any, res:any, next:any)=>{
    const {error} = ValidateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)

   
    try{
        const findUser = await UserModel.findOne({email:req.body.email})
        if (findUser) return res.status(401).send('Email has been taken')
    
        const newUser = new UserModel ({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.password
        })
        
        const salt = await bcrypt.genSalt(10)
        newUser.password = await bcrypt.hash(newUser.password, salt)
        console.log(newUser);
        
        const saveUser = await newUser.save()
        res.json({
            status:'success',
            message:'User created successfully',
            data:{}
        })
    }catch(ex){
        res.status(500).send(ex)
    }

    
}