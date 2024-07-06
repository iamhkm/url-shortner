import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GSignIn = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; // Flag to track component mount status

        const fetchQueryParams = async () => {
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const token = queryParams.get('code');

                if (token && isMounted) {
                    const response = await axios.get(`${process.env.REACT_APP_USER_API_ENDPOINT}/user/social/token`, {
                        params: { code: token }
                    });

                    console.log('API Response:', response.data);

                    localStorage.setItem("id_token", response.data.id_token);
                    localStorage.setItem("access_token", response.data.access_token);
                    localStorage.setItem("refresh_token", response.data.refresh_token);
                    localStorage.setItem("username", response.data.username);
                    localStorage.setItem("role", response.data.role);

                    navigate('/dashboard');
                } else {
                    console.warn('No token found in query parameters.');
                    navigate("/signin");
                }
            } catch (error) {
                console.error('API Error:', error);
                navigate("/signin");
            }
        };

        if (isMounted) {
            fetchQueryParams(); // Call the function when component mounts
        }

        return () => {
            isMounted = false; // Cleanup: Set mounted flag to false on component unmount
        };
    }); // Empty dependency array ensures it only runs once on mount

    return null; // Component doesn't render any UI, so return null
};

export default GSignIn;
