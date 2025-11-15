import {z} from "zod";

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'The password is required'),
});

export type LoginFormRequest = z.infer<typeof LoginFormSchema>;
