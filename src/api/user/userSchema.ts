import { z } from 'zod';


export const RegisterUserValidationSchema = z
  .object({
    username: z.string({ required_error: 'Username is required' }),
    email: z.string().email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }),  
});


export const LoginUserValidationSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(1, 'Password is required'),
  
});