import {z} from "zod";

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'The password is required'),
});

export type LoginFormRequest = z.infer<typeof LoginFormSchema>;

export const AddSubmissionFormSchema = z.object({
  title: z.string().min(1, 'The title is required'),
  file: z.any().refine((f) => f instanceof File, "The file is required"),
  exclusion_bibliographic: z.boolean(),
  exclusion_quoted: z.boolean(),
  exclusion_small_sources: z.boolean(),
  exclusion_type: z.enum(['none', 'words', 'percentage']),
  exclusion_value: z.number().int(),
});

export type AddSubmissionFormRequest = z.infer<typeof AddSubmissionFormSchema>;

export const AddUserFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'The name is required'),
  email: z.email(),
  password: z.string().min(1, 'The password is required'),
  active: z.boolean(),
});

export type AddUserFormRequest = z.infer<typeof AddUserFormSchema>;
