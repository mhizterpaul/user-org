import {Response, Request, Router} from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {userRegistrationSchema, userLoginSchema}  from '../models/user.schema'
import { addUser, findUserByField } from '../db/user.db'
import { ZodError } from 'zod'
import connectionMgr from '../db/'

const router = Router()

const saltRounds = 16;

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
                errors: error.errors.map(err => ({field: err.path, 
                message: err.message}))
            }
            res.status(422).json(resData);
            return
        }          
    }
    try{
        const salt = await bcrypt.genSalt(saltRounds);
		data.password = await bcrypt.hash(data.password, salt);
        const [user] = await connectionMgr([{func: addUser, params: [data]}]);

        delete user.orgs;
        const token = await generateToken({id: data.userId});
        res.status(201).json({
            status: 'success',
            message: 'Registration',
            data: {
                accessToken: token,
                user
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
                errors: error.errors.map(err => ({field: err.path, 
                message: err.message}))
            }
            res.status(422).json(resData);
            return 
        }         
    }
    try{
        
        const [user] = await connectionMgr([{func: findUserByField, params: ['email', req.body.email]}]);
        const salt = await bcrypt.genSalt(saltRounds);
		const password = await bcrypt.hash(req.body.password, salt);
        if(password !== user.password) throw new Error('authentication failed');

        const token = await generateToken({id: user.userId});
        delete user.orgs;
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: token,
                user
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