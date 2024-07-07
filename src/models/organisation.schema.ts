import { z } from 'zod';
import {getOrgById} from '../../../db/org.db'

export const orgSchema = z.object({
    orgId: z.string().refine(async (value) => await getOrgById(value), {
      message: 'User ID must be unique'
    }),
    name: z.string().min(3, {message: 'First name must not be null'}),
    description: z.string().min(3, {message: 'Last name must not be null'}),
});