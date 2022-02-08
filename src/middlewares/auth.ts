import {CONFIG} from '../config/index'
const config = CONFIG()
import jwt from 'jsonwebtoken'

function auth (req:any, res:any, next:any){
    const token = req.header('Authorization')

    if(!token) return res.status(403).send('Access denied')
    try{
        const decoded = jwt.verify(token, `${config.JWT_SECRET}` )
        req.user = decoded
        next()
    }catch(error){
        res.status(403).send('Invalid token supplied')
    }
}
export default auth