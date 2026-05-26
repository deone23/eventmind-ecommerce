import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, logout as logoutAction, setLoading } from '../store/slices/authSlice';
import { clearCart } from '../store/slices/cartSlice';
import { authService } from '../services';
import { LoginCredentials, SignupData } from '../types';
import toast from 'react-hot-toast';
import { ROUTES } from '../utils/constants';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch(setLoading(true));
      const data = await authService.login(credentials);
      dispatch(setCredentials(data));
      toast.success('Login successful!');
      navigate(ROUTES.HOME);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate]);

  const signup = useCallback(async (data: SignupData) => {
    try {
      dispatch(setLoading(true));
      const result = await authService.signup(data);
      dispatch(setCredentials(result));
      toast.success('Account created successfully!');
      navigate(ROUTES.HOME);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
      dispatch(clearCart());
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      // Still logout locally even if API call fails
      dispatch(logoutAction());
      dispatch(clearCart());
      navigate(ROUTES.LOGIN);
    }
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };
};
