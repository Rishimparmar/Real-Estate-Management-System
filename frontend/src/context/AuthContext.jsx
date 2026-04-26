import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
    });

    // Interceptor to add token
    api.interceptors.request.use((config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    useEffect(() => {
        const loadUser = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/me');
                    setUser({ ...res.data, token });
                } catch (err) {
                    console.error("Token invalid");
                    sessionStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        sessionStorage.setItem('token', res.data.token);
        setUser(res.data);
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/register', { name, email, password, role });
        return res.data;
    };

    const verifyOtp = async (email, otp) => {
        const res = await api.post('/verify-otp', { email, otp });
        sessionStorage.setItem('token', res.data.token);
        setUser(res.data);
        return res.data;
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, logout, api }}>
            {children}
        </AuthContext.Provider>
    );
};
