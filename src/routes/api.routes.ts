import {Request, Response, Router} from 'express'
import auth from '../middleware/auth'
import {addUserOrg, findUserByField} from '../db/user.db'
import { getOrgs, getOrgById, addOrg } from '../db/org.db';
import { orgSchema } from '../models/organisation.schema';
import { ZodError } from 'zod';

const router = Router();


router.get('/users/:id', auth, async (req: Request, res: Response)=>{
	//a user gets their own record or user record in organisations they belong to or created
    let passiveUser = await findUserByField('userId', req.params.id),
	activeUser = await findUserByField('userId', req.userId);
	if(!passiveUser.orgs.some(element => 
		activeUser.orgs.includes(element))){
			res.status(403).json({message: "authorization error"})
			return;
		}
	delete passiveUser.orgs;
	res.status(200).json({
    status: "success",
    message: "<message>",
    data: passiveUser})
})


router.get('/organisations', auth, async (req: Request, res: Response)=>{
	const user = await findUserByField('userId', req.userId);
	const orgs = await getOrgs(user.orgs);
	res.status(200).json({
		status: 'success',
		data: {
			organisations: orgs
		}
	})
})


router.get('/organisations/:orgId', auth, async (req: Request, res: Response)=>{
	const user = await findUserByField('userId', req.userId);
	if(!user.orgs.includes(req.params.orgId)){
		res.status(403).json({message: "authorization error"})
		return;
	}
	const org = await getOrgById(req.params.orgId);
	res.status(200).json({
		status: 'success',
		message: '<message>',
		data: org
	})
})


router.post('/organisations', auth, async (req: Request, res: Response)=>{
	try{
        await orgSchema.parseAsync(req.body);
    }catch(error: unknown){
		if(!(error instanceof ZodError)){
			res.status(500).json({message: "internal server error"});
			return;
		}
        const resData = {
            errors: error.errors.map(err => ({field: err.path, 
            message: err.message}))
        }
        res.status(422).json(resData);
        return          
    }
	try{
		const org = await addOrg(req.body);
		res.status(201).json({
			status: 'success',
			message: 'Organisation created successfully',
			data: org
		})
	}catch(err){
		res.status(400).json({
			status: 'Bad Request',
			message: 'Client error',
			statusCode: 400
		})
	}
})


router.post('/organisations/:orgId/users', async (req: Request, res: Response)=>{

	if(!req.body.userId || 
		typeof(req.body.userId) !== 'string'|| 
		!!await getOrgById(req.params.orgId)){
		res.status(400).json({
			message: 'Bad Request'
		})
		return;
	}
	try{
		const org = await addUserOrg(req.body.userId, req.params.orgId)
		res.status(200).json({
			status: 'success',
			message: 'User added to organisation successfully'
		})
	}catch(err){
		res.status(500).send({message: "internal server error"})
	}
})

export default router