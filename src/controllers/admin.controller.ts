import { ValidateAdmin, AdminModel } from "../models/admin.model";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import joi from 'joi-browser'
import { CONFIG } from "../config";
const config = CONFIG()

export const createAdmin = async (req:any, res:any, next:any)=>{
    const {error} = ValidateAdmin(req.body)
    if(error) return res.status(400).send(error.details[0].message)

   
    try{
        const findAdmin = await AdminModel.findOne({email:req.body.email})
        if (findAdmin) return res.status(401).send('Email has been taken')
        
        
        
       

       console.log('Email sent successfully');
        const newAdmin = new AdminModel ({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.password,
        })
        
        const salt = await bcrypt.genSalt(10)
        newAdmin.password = await bcrypt.hash(newAdmin.password, salt)
        // console.log(newAdmin);
        
        const saveUser = await newAdmin.save()
        res.json({
            status:'success',
            message:'Admin created successfully',
            data:{}
        })
        

       
       
    }catch(ex){
        res.status(500).send(ex)
    }

    
}


export const AuthAdmin = async (req:any, res:any, next:any)=>{
    const {error} = Validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    try{
        const checkAdmin = await AdminModel.findOne({email:req.body.email})
        if(!checkAdmin) return res.status(401).send('Admin not found')

        const checkPwd = await bcrypt.compare(req.body.password, checkAdmin.password)
        if(!checkPwd) return res.status(401).send('Invalid password')
        
        
        
        const token= jwt.sign({...checkAdmin}, `${config.JWT_SECRET}`)
     
        
        res.json({
            status:'success',
            message:'Login successful',
            token,
           
        })
      
    }catch(ex){

    }
}

export const getAdmin = async (req:any, res:any, next:any)=>{
    try{      
        const admin = await AdminModel.findById(req.user._doc._id)
        admin.password=""
        res.json({
            status:'success',
            data:admin
        })
    }catch(error){
        res.status(403).send(error)
    }
}

function Validate (user:any){
    const schema = {
        email:joi.string().required(),
        password:joi.string().required()
    }
    return joi.validate(user, schema)
}
