import sgMail from '@sendgrid/mail'
import {CONFIG} from '../config'
const config= CONFIG()

export const sendMail =async  (receiver_email:any, subject:any, email_body:any)=>{
    
    //console.log('in the mail functiion');
    
    try{
        sgMail.setApiKey(`${process.env.SEND_GRID_EMAIL_KEY}`)
        const message = {
           to: receiver_email, 
           from:{
               name:'Hamid',
               email:'hamid@icopystory.com'
           },
           subject,
           text:'Email from Easytopup',
           html:email_body
        }

        const response = await sgMail.send(message)
        console.log('Email sent successfully');
        
    }catch(ex){
       console.log(ex);
       
    }
}