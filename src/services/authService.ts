import { userServiceApi } from '../api';
import { LoginCredentials, SignupData, User, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string; refreshToken: string }> => {
    const response = await userServiceApi.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data.data!;
  },

  signup: async (data: SignupData): Promise<{ user: User; token: string; refreshToken: string }> => {
    const response = await userServiceApi.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>(
      API_ENDPOINTS.SIGNUP,
      data
    );
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await userServiceApi.post(API_ENDPOINTS.LOGOUT);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await userServiceApi.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await userServiceApi.post(API_ENDPOINTS.RESET_PASSWORD, { token, password });
  },

  getProfile: async (): Promise<User> => {
    const response = await userServiceApi.get<ApiResponse<User>>(API_ENDPOINTS.USER_PROFILE);
    return response.data.data!;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await userServiceApi.put<ApiResponse<User>>(API_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data.data!;
  },
};
