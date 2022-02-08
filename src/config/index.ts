// module.exports = (()=>{
// })()

export const CONFIG = () => {
    const env = process.env.NODE_ENV
    if(env!=='production') require ('dotenv').config()
    
    return{
        DATABASE_URL:process.env.DATABASE_URL,
        JWT_SECRET:process.env.JWT_SECRET,
        PORT:process.env.PORT,
        PAYMENT_SECRET_KEY:process.env.PAYMENT_SECRET_KEY,
        PAYMENT_API:process.env.PAYMENT_API
    }

}
