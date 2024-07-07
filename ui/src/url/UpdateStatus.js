import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import necessary routing components

const UpdateStatus = () => {
    const navigate = useNavigate();
    const { uuid, status } = useParams(); // Fetch URL's UUID from route parameters

    useEffect(() => {
        let isMounted = true; // Track if the component is still mounted
        const updateStatus = async () => {
            if (!uuid || !status) return; // Ensure uuid is defined
            try {
                // Make API call to delete URL
                await axios.post(`${process.env.REACT_APP_USER_API_ENDPOINT}/urls?uuid=${uuid}`, {
                    status: (Number(status) === 1) ? true : false
                },{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
                    },
                });
                if (isMounted) {
                    alert("URL status changed successfully");
                    navigate('/dashboard'); // Redirect to dashboard after deletion
                }
            } catch (error) {
                if (isMounted) {
                    alert(error?.response?.data?.error || error.message);
                    navigate('/dashboard'); // Navigate back to dashboard on error
                }
            }
        };
        updateStatus(); // Call deleteUrl function when component mounts
        return () => {
            isMounted = false; // Cleanup function to set isMounted to false when component unmounts
        };
    }); // Dependencies for useEffect

    return null; // or you can return a loading indicator or message here
};

export default UpdateStatus;
