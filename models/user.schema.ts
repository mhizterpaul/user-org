import { z } from 'zod';

export const userRegistrationSchema = z.object({

    userId: z.string().refine(async (value) => await checkUserIdUnique(value), {
      message: 'User ID must be unique',
      checkAsync: true,
    }),
    firstName: z.string().min(3, {message: 'First name must not be null'}),
    lastName: z.string().min(3, {message: 'Last name must not be null'}),
    email: z.string().email({ message: 'Email must be in the correct format' }),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'}),
    phone: z.string().regex(/^\d{10,}$/, { message: 'Phone number should include at least 10 digits' })
});

export const userLoginSchema = z.object({
  email: z.string().email({ message: 'Email must be in the correct format' }),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'})
});

