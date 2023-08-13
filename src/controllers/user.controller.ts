import bcrypt from 'bcryptjs'
import joi from 'joi-browser'
import jwt from 'jsonwebtoken'
import {CONFIG} from '../config/index'
const config = CONFIG()
import { ValidateUser,  UserModel } from "../models/user.model"
import { PaymentModel } from '../models/payment.model'
import {sendMail} from './mail.controller'



export const createUser = async (req:any, res:any, next:any)=>{
    const {error} = ValidateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)

   
    try{
        const findUser = await UserModel.findOne({email:req.body.email})
        if (findUser) return res.status(401).send('Email has been taken')
        
        
        const token = jwt.sign({email:req.body.email}, `${process.env.JWT_SECRET}`)
       

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
        const email_body= `
            <div>
                <div>Welcome to EasyTopUp. We hope to serve you with the best experience</div>
                <div> click <a href="${process.env.CLIENT_URL}/verify_account/${newUser.confirmationCode}">HERE</a> to verify your account</div>
            </div>
        `
        sendMail(req.body.email, 'EasyTopUp Accout verification', email_body)
       
       
    }catch(ex){
        res.status(500).send(ex)
    }

    
}

export const verifyAccount = async (req:any, res:any, next:any)=>{
    const {ref} = req.body
    try{
        const checkCode = await UserModel.findOne({confirmationCode:ref})
        if(!checkCode) return res.status(400).send('Failed to verify account')

        checkCode.confirmationCode = "verified"
        checkCode.save()
        res.json({
            status:'success',
            message:'Account successfully verified'
        })
    }catch(ex){
        res.status(500).send('Server Error. Cannot verify account')
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
        
        
        
        const token= jwt.sign({...checkUser}, `${process.env.JWT_SECRET}`)
     
        
        res.json({
            status:'success',
            message:'Login successful',
            token,
           
        })
      
    }catch(ex){
        res.status(500).send('Server Error')
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
        const walletBalanceArr = users.map(item=>item.walletBalance)
        const totalWalletBalance = walletBalanceArr.reduce((Psum, a)=>Psum + a, 0)
        
        const Payments = await PaymentModel.find()
        const allPaymentArr = Payments.map(item=>item.amount/100)
        const totalPayment = allPaymentArr.reduce((Psum, a)=>Psum + a, 0)
        // const paymentArr = users.map(item=>item)
        res.json({
            status:'success',
            data:users,
            stats:{totalWalletBalance,totalPayment}
        })
    }catch(ex){
        res.status(500).send('Cannot fetch users')
    }
}

export const deleteUser = async (req:any, res:any, next:any)=>{
    try{
        const deleteUser = await UserModel.findByIdAndDelete(req.params.id)
        if(deleteUser){
            res.json({
                status:'success',
                message:'Post deleted successfully'
            })
        }
    }catch(ex){
        res.status(500).send('Failed to delete User. Server Error')
    }
}

export const ResetUser = async (req:any, res:any, next:any)=>{
    const {error} = Validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    try{
        const {password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const editUser = await UserModel.findOneAndUpdate({email:req.body.email},
            { password:hashedPassword},
            {new:true}
        )

        res.json({
            status:'success',
            message:'Password reset successfull',
            data:editUser
        })

    }catch(ex){
       res.status(500).send('Failed to edit User') 
    }
}

function Validate (user:any){
    const schema = {
        email:joi.string().required(),
        password:joi.string().required()
    }
    return joi.validate(user, schema)
}