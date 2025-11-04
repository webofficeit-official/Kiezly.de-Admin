
import apiClient from "@/lib/config/axios-client";
import { UserProfile } from "@/lib/types/auth-type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export interface MyProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
}

export interface UpdatePasswordData {
  old_password: string;
  new_password: string;
}

interface UploadProfilePicResponse {
  success: boolean;
  message: string; // adjust to your backend response
  data: {
    filePath: string
  }
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

interface UpdatePasswordResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export const updateProfile = (): UseMutationResult<
  UpdateProfileResponse,     
  Error,               
  UpdateProfileData 
> => {
  return useMutation({
    mutationFn: (data: UpdateProfileData) =>
      apiClient.put("/me", data).then(res => res.data),
  });
};

export const updatePassword = (): UseMutationResult<
  UpdatePasswordResponse,      // Type of data returned
  Error,               // Type of error
  UpdatePasswordData           // Variables you pass to mutate()
> => {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) =>
      apiClient.patch("/change-password", data).then(res => res.data),
  });
};


export const uploadProfilePic = (): UseMutationResult<
  UploadProfilePicResponse,
  Error,
  { file: File }
> => {
  return useMutation({
    mutationFn: async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post(
        `/upload/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    },
  });
};