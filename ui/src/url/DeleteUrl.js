import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import necessary routing components

const DeleteUrl = () => {
    const navigate = useNavigate();
    const { uuid } = useParams(); // Fetch URL's UUID from route parameters

    useEffect(() => {
        let isMounted = true; // Track if the component is still mounted

        const deleteUrl = async () => {
            if (!uuid) return; // Ensure uuid is defined

            try {
                // Make API call to delete URL
                await axios.delete(`${process.env.REACT_APP_USER_API_ENDPOINT}/urls?uuid=${uuid}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
                    },
                });
                if (isMounted) {
                    alert("URL deleted successfully");
                    navigate('/dashboard'); // Redirect to dashboard after deletion
                }
            } catch (error) {
                if (isMounted) {
                    alert(error?.response?.data?.error || error.message);
                    navigate('/dashboard'); // Navigate back to dashboard on error
                }
            }
        };

        deleteUrl(); // Call deleteUrl function when component mounts

        return () => {
            isMounted = false; // Cleanup function to set isMounted to false when component unmounts
        };
    }, [navigate, uuid]); // Dependencies for useEffect

    return null; // or you can return a loading indicator or message here
};

export default DeleteUrl;
