export type ForgotPasswordData = { email: string };
export type ForgotPasswordResponse = { success: boolean; message: string };

export type VerifyResetParams = { id: string | number; token: string };
export type VerifyResetResponse = { success: boolean; message: string };

export type ResetPasswordData = {
  id: string | number;
  token: string;
  password: string;
};
export type ResetPasswordResponse = { success: boolean; message: string };
export type AcceptInviteResponse = { success: boolean; message: string };
export type AcceptInvitedData = {
  id: string | number;
  token: string;
  password: string;
};
export type UserRole = "admin";
export type adminProfile = {
  id?: string;
  email?: string;
  phone?: string;
  display_name?: string;
  role?: UserRole;
  is_active?: boolean;
  is_email_verified?: boolean;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at?:any,
  updated_at?:any,
  bio?: string;
};


export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  token?: {
    access: string;
    refresh: string;
  };
}
