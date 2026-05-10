import axios from 'axios';
// import { error } from 'console';
// import { headers } from 'next/headers';
// import { config } from 'process';

// Base url backend 
const api = axios.create({

    // Base URL fetch from .env.local 
    baseURL : process.env.NEXT_PUBLIC_API_URL,
    headers : {
        'Accept': "application/json",
        'Content-Type': 'application/json',
    } 
});

// Interceptor Auto Input Bearer Token Auth
api.interceptors.request.use(
    (config) => {
        if(typeof window !== 'undefined')
        {
            // Get token api auth
            const token = localStorage.getItem('token');
            if(token)
            {
                // Set token bearer
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },

    (error) => {
        return Promise.reject(error);
    },
);

// Interceptor Auto Response if  token expired(401)
api.interceptors.response.use(
    (response) => response,
    (error)   =>
    {
        if(error.response && error.response.status == 401)
        {
            if(typeof window !== undefined)
            {
                // Remove access token & redirect to auth page
                localStorage.removeItem('token');
                window.location.href= '/auth';            
            }
        }
        return Promise.reject(error);
    }
)
export default api;