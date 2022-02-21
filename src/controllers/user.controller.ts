import bcrypt from 'bcrypt'
import joi from 'joi-browser'
import jwt from 'jsonwebtoken'
import {CONFIG} from '../config/index'
const config = CONFIG()
import { ValidateUser,  UserModel } from "../models/user.model"
// import {sendMail} from './mail.controller'



export const createUser = async (req:any, res:any, next:any)=>{
    const {error} = ValidateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)

   
    try{
        const findUser = await UserModel.findOne({email:req.body.email})
        if (findUser) return res.status(401).send('Email has been taken')
        
        
        const token = jwt.sign({email:req.body.email}, `${config.JWT_SECRET}`)
       

       console.log('Email sent successfully');
        const newUser = new UserModel ({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.password,
            phoneNo:req.body.phoneNo,
            walletBalance:0,
            referralBonus:0,
            confirmationCode:token
        })
        
        const salt = await bcrypt.genSalt(10)
        newUser.password = await bcrypt.hash(newUser.password, salt)
        // console.log(newUser);
        
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

export const AuthUser = async (req:any, res:any, next:any)=>{
    const {error} = Validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    try{
        const checkUser = await UserModel.findOne({email:req.body.email})
        if(!checkUser) return res.status(401).send('User not found')

        const checkPwd = await bcrypt.compare(req.body.password, checkUser.password)
        if(!checkPwd) return res.status(401).send('Invalid password')
        
        
        
        const token= jwt.sign({...checkUser}, `${config.JWT_SECRET}`)
     
        
        res.json({
            status:'success',
            message:'Login successful',
            token,
           
        })
      
    }catch(ex){

    }
}

export const getUser = async (req:any, res:any, next:any)=>{
    try{      
        const user = await UserModel.findById(req.user._doc._id)
        user.password=""
        res.json({
            status:'success',
            data:user
        })
    }catch(error){
        res.status(403).send(error)
    }
}

export const getAllUsers = async (req:any, res:any, next:any)=>{
    try{
        const users = await UserModel.find()
        res.json({
            status:'success',
            data:users
        })
    }catch(ex){

    }
}

function Validate (user:any){
    const schema = {
        email:joi.string().required(),
        password:joi.string().required()
    }
    return joi.validate(user, schema)
}