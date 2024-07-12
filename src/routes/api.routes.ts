import {Request, Response, Router} from 'express'
import auth from '../middleware/auth'
import {addUserOrg, findUserByField} from '../db/user.db'
import { getOrgs, getOrgById, addOrg } from '../db/org.db';
import { orgSchema } from '../models/organisation.schema';
import { ZodError } from 'zod';
import connectionMgr from '../db/'
import { Org } from '..';


const router = Router();

router.get('/users/:id', auth, async (req: Request, res: Response)=>{
	//a user gets their own record or user record in organisations they belong to or created

    let [passiveUser, activeUser] = await connectionMgr([{func: findUserByField, params:['userId', req.params.id]}, {func: findUserByField, params: ['userId', req.body.userId]}]);

	if(!passiveUser[6].some((element:string) => 
		activeUser[6].includes(element))){
			res.status(403).json({message: "authorization error"})
			return;
		}
	res.status(200).json({
    status: "success",
    message: "<message>",
    data: {
		userId: passiveUser[0],
		firstName: passiveUser[1],
		lastName: passiveUser[2],
		email: passiveUser[3],
		phone: passiveUser[5],
	}})
})


router.get('/organisations', auth, async (req: Request, res: Response)=>{
	const [user] = await connectionMgr([{func: findUserByField, params:['userId', req.body.userId]}]);
	const [orgs] = await connectionMgr([{func: getOrgs, params: [user[6]]}]);

	const mappedOrgs:Org[] = [];
	orgs.forEach((org: any) => {
		const keys = ['orgId', 'name', 'description']
		const enteries = org.map((entry:string,id:number) => ([keys[id], entry]))
		mappedOrgs.push(Object.fromEntries(enteries) as Org)
	})
	res.status(200).json({
		status: 'success',
		data: {
			organisations: mappedOrgs
		}
	})
})


router.get('/organisations/:orgId', auth, async (req: Request, res: Response)=>{
	
	const [user, org] = await connectionMgr([{func: findUserByField, params:['userId', req.body.userId]}, {func: getOrgById, params: [req.params.orgId]}]);
	if(!user[6].includes(req.params.orgId)){
		res.status(403).json({message: "authorization error"})
		return;
	}
	
	res.status(200).json({
		status: 'success',
		message: '<message>',
		data: {
			orgId: org[0],
			name: org[1],
			description: org[2]
		}
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

		const [org] = await connectionMgr([{func: addOrg, params: [req.body]}]);
		await connectionMgr([{func: addUserOrg, params: [req.body.userId, org[0]]}]);
		res.status(201).json({
			status: 'success',
			message: 'Organisation created successfully',
			data: {
				orgId: org[0],
				name: org[1],
				description: org[2]
			}
		})
	}catch(err){
		res.status(400).json({
			status: 'Bad Request',
			message: 'Client error',
			statusCode: 400
		})
	}
})


router.post('/organisations/:orgId/users', auth, async (req: Request, res: Response)=>{
	

	try{

		const [userOrg] = await connectionMgr([{func:getOrgById, params:[req.params.orgId]}])
		if(!req.body.userId || 
		typeof(req.body.userId) !== 'string'|| 
		!!userOrg[0]){
			res.status(400).json({
				message: 'Bad Request'
			})
			return;
		}
		await connectionMgr([{func: addUserOrg, params: [req.body.userId, req.params.orgId]}])
		res.status(200).json({
			status: 'success',
			message: 'User added to organisation successfully'
		})
	}catch(err){
		res.status(500).send({message: "internal server error"})
	}
})

export default router