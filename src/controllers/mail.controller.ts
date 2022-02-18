import nodemailer from 'nodemailer'
import {CONFIG} from '../config'
const config= CONFIG()

export const sendMail =  (receiver_email:any, subject:any, email_body:any)=>{
    //console.log(process.env);
    console.log('in the mail functiion');
    
    try{

        const user_name     = config.EMAIL
        const refresh_token = config.REFRESH_TOKEN;
        const access_token  = config.ACCESS_TOKEN;
        const client_id     = config.CLIENT_ID;
        const client_secret = config.CLIENT_SECRET;
        
        //console.log(user_name, refresh_token, access_token, client_id, client_secret);
        
    
    
        let transporter = nodemailer
        .createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                clientId: client_id,
                clientSecret: client_secret
            }
        });
        transporter.on('token', token => {
            console.log('A new access token was generated');
            console.log('User: %s', token.user);
            console.log('Access Token: %s', token.accessToken);
            console.log('Expires: %s', new Date(token.expires));
        });
        return

        // setup e-mail data with unicode symbols
        let mailOptions = {
            from    : 'owolabihammed3600@gmail.com', 
            to      : receiver_email, 
            subject : subject, 
            text    : 'Email from easy topUp', 
            html    :email_body, 
    
            auth : {
                user         : user_name,
                refreshToken : refresh_token,
                accessToken  : access_token,
                expires      : 1494388182480
            }
        };

        
 

      transporter.sendMail(mailOptions, async function(err, data){
        if(err){
            return err
        }else{
            return true
        }
      })
    }catch(ex){
       return ex
    }
}