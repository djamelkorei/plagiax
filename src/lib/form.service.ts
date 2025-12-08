import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "The password is required"),
});

export type LoginFormRequest = z.infer<typeof LoginFormSchema>;

// =====================================================================================================================

export const AddSubmissionFormSchema = z.object({
  title: z.string().min(1, "The title is required"),
  file: z.any().refine((f) => f instanceof File, "The file is required"),
  exclusion_bibliographic: z.boolean(),
  exclusion_quoted: z.boolean(),
  exclusion_small_sources: z.boolean(),
  exclusion_type: z.enum(["none", "words", "percentage"]),
  exclusion_value: z.number().int(),
});

export type AddSubmissionFormRequest = z.infer<typeof AddSubmissionFormSchema>;

// =====================================================================================================================

export const AddUserFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "The name is required"),
  email: z.email(),
  password: z.string().min(1, "The password is required"),
  active: z.boolean(),
});

export type AddUserFormRequest = z.infer<typeof AddUserFormSchema>;

// =====================================================================================================================

export const AccountInfoFormSchema = z.object({
  email: z.email(),
  name: z.string().min(1, "The name is required"),
});

export type AccountInfoFormRequest = z.infer<typeof AccountInfoFormSchema>;

// =====================================================================================================================

export const AccountPasswordFormSchema = z
  .object({
    email_otp: z.string().min(1, "The email otp is required"),
    current_password: z.string().min(1, "The current password is required"),
    new_password: z.string().min(1, "The new password is required"),
    confirm_password: z.string().min(1, "The confirm password is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

export type AccountPasswordFormRequest = z.infer<
  typeof AccountPasswordFormSchema
>;

// =====================================================================================================================

export const PasswordResetInitFormSchema = z.object({
  email: z.email(),
});

export type PasswordResetInitFormRequest = z.infer<
  typeof PasswordResetInitFormSchema
>;

// =====================================================================================================================

export const PasswordResetCompleteFormSchema = z
  .object({
    email: z.email(),
    token: z.string().min(1, "The token is required"),
    password: z.string().min(1, "The password is required"),
    confirm_password: z.string().min(1, "The confirm password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

export type PasswordResetCompleteFormRequest = z.infer<
  typeof PasswordResetCompleteFormSchema
>;
