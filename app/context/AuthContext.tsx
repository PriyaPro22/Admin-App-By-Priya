"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const authStatus = localStorage.getItem('isAdminAuthenticated');
        const token = localStorage.getItem('adminToken');
        if (authStatus === 'true' || token) {
            setIsAuthenticated(true);
            if (token && authStatus !== 'true') {
                localStorage.setItem('isAdminAuthenticated', 'true');
            }
        }
    }, []);

    const login = async (username: string, password: string) => {
        // Allow any login with non-empty credentials
        if (username.trim() !== '' && password.trim() !== '') {
            setIsAuthenticated(true);
            localStorage.setItem('isAdminAuthenticated', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token'); // Also remove legacy 'token' key
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
