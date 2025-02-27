import {Response, Request, Router} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {userRegistrationSchema, userLoginSchema}  from '../models/user.schema'
import { addUser, findUserByField } from '../db/user.db'
import { ZodError } from 'zod'
import connectionMgr from '../db/'


const router = Router()




export const generateToken = (payload: {id: string})=>{
    return jwt.sign(payload, process.env.JWTSECRET||'secret', { expiresIn: '3h' })
}

router.post('/register', async (req: Request, res: Response)=>{
    const data = req.body;
    
    try{
        await userRegistrationSchema.parseAsync(data);
    }catch(error: unknown){
        if(error instanceof ZodError){
            const resData = {
                errors: error.errors.map(err => ({field: err.path[0], 
                message: err.message}))
            }
            res.status(422).json(resData);
            return
        }          
    }
    try{
		data.password = await bcrypt.hash(data.password, process.env.SALT||'$2b$16$hCKkfrrDexC9DBkHa5U/MO');
        const [user] = await connectionMgr([{func: addUser, params: [data]}]);

        const token = await generateToken({id: data.userId});
        res.status(201).json({
            status: 'success',
            message: 'Registration',
            data: {
                accessToken: token,
                userId: user[0],
                firstName: user[1],
                lastName: user[2],
                email: user[3],
                phone: user[5]
            }
        })
    }catch(error){
        res.status(400).json({
            status: 'Bad Request',
            message: 'Registration unsuccessful', 
            statusCode: 400
        })
    }
		
})

router.post('/login', async (req:Request, res: Response)=>{

    try{
        await userLoginSchema.parseAsync(req.body);
    }catch(error: unknown){
        if(error instanceof ZodError){
            const resData = {
                errors: error.errors.map(err => ({field: err.path[0], 
                message: err.message}))
            }
            res.status(422).json(resData);
            return 
        }         
    }
    try{
        
        const [user] = await connectionMgr([{func: findUserByField, params: ['email', req.body.email]}]);
        const password = await bcrypt.hash(req.body.password, process.env.SALT||'$2b$16$hCKkfrrDexC9DBkHa5U/MO');
        console.log(user[4], password);
        if(password !== user[4]) throw new Error('authentication failed');

        const token = await generateToken({id: user.userId});
        delete user.orgs;
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: token,
                userId: user[0],
                firstName: user[1],
                lastName: user[2],
                email: user[3],
                phone: user[5]
            }
        })
    }catch(error){
        res.status(401).json({
            status: 'Bad request',
            message: 'Authentication failed',
            statusCode: 401
        })
    }
})

export default router;