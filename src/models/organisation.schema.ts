import { z } from 'zod';
import {getOrgById} from '../db/org.db'
import connectionMgr from '../db/'

export const orgSchema = z.object({
    orgId: z.string().refine(async (value) => !!((await connectionMgr([{func:getOrgById, params:[value]}]))[0].length), {
      message: 'User ID must be unique'
    }).optional(),
    name: z.string().min(3, {message: 'First name must not be null'}),
    description: z.string().min(3, {message: 'Last name must not be null'})
    .optional(),
});