import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Configure axios defaults
    axios.defaults.baseURL = '/api';
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.withCredentials = true;
    
    // Check if the user is already authenticated
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            axios.get('/user')
                .then(response => {
                    setUser(response.data);
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);
    
    const login = async (email, password) => {
        try {
            const response = await axios.post('/login', {
                email,
                password
            });
            
            const { access_token, user } = response.data;
            
            localStorage.setItem('token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            setUser(user);
            setIsAuthenticated(true);
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error occurred' };
        }
    };
    
    const register = async (name, email, password, password_confirmation) => {
        try {
            const response = await axios.post('/register', {
                name,
                email,
                password,
                password_confirmation
            });
            
            const { access_token, user } = response.data;
            
            localStorage.setItem('token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            
            setUser(user);
            setIsAuthenticated(true);
            
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error occurred' };
        }
    };
    
    const logout = async () => {
        try {
            await axios.post('/logout');
            
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
