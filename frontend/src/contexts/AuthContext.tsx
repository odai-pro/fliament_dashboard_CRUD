"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User, LoginData, RegisterData, OTPData } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    verifyOTP: (data: OTPData) => Promise<void>;
    resendOTP: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load user on mount
    useEffect(() => {
        const loadUser = () => {
            const currentUser = authApi.getCurrentUser();
            setUser(currentUser);
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const login = async (data: LoginData) => {
        try {
            const response = await authApi.login(data);

            // Check if OTP is required (user not verified)
            if (!response.user.email_verified_at || response.requires_otp) {
                // Store pending user ID in session for OTP page
                sessionStorage.setItem('pending_user_id', response.user.id.toString());
                sessionStorage.setItem('pending_context', 'login');
                sessionStorage.setItem('pending_email', response.user.email);
                router.push('/otp');
            } else {
                setUser(response.user);
                router.push('/home');
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response = await authApi.register(data);

            // Store pending user info for OTP
            sessionStorage.setItem('pending_user_id', response.user.id.toString());
            sessionStorage.setItem('pending_context', 'registration');
            sessionStorage.setItem('pending_email', response.user.email);

            router.push('/otp');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const verifyOTP = async (data: OTPData) => {
        try {
            const pendingUserId = sessionStorage.getItem('pending_user_id');
            const pendingContext = sessionStorage.getItem('pending_context') || 'login';
            
            if (!pendingUserId) {
                throw new Error('No pending verification found');
            }

            const response = await authApi.verifyOTP({
                ...data,
                user_id: parseInt(pendingUserId),
                context: pendingContext as 'registration' | 'login',
            });
            
            setUser(response.user);

            // Clear session storage
            sessionStorage.removeItem('pending_user_id');
            sessionStorage.removeItem('pending_context');

            router.push('/home');
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'OTP verification failed');
        }
    };

    const resendOTP = async () => {
        try {
            const pendingUserId = sessionStorage.getItem('pending_user_id');
            const pendingContext = sessionStorage.getItem('pending_context') || 'login';
            
            if (!pendingUserId) {
                throw new Error('No pending verification found');
            }

            await authApi.resendOTP({
                user_id: parseInt(pendingUserId),
                context: pendingContext as 'registration' | 'login',
            });
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to resend OTP');
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local storage even if API call fails
            setUser(null);
            router.push('/');
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyOTP,
        resendOTP,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
