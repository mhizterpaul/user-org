import { z } from 'zod';

export const userRegistrationSchema = z.object({
    orgId: z.string().refine(async (value) => await checkUserIdUnique(value), {
      message: 'User ID must be unique',
      checkAsync: true,
    }),
    name: z.string().min(3, {message: 'First name must not be null'}),
    description: z.string().min(3, {message: 'Last name must not be null'}),
});