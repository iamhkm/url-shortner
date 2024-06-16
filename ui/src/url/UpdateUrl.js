import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import necessary routing components
import { useLocation } from 'react-router-dom';

const UpdateUrl = () => {
    const navigate = useNavigate();
    const { uuid } = useParams(); // Fetch URL's UUID from route parameters
    const location = useLocation();
    const { original_url, name, description, tags } = location.state || {};

    useEffect(() => {
        let isMounted = true; // Track if the component is still mounted
        const updateStatus = async () => {
            if (!uuid) return; // Ensure uuid is defined
            try {
                // Make API call to delete URL
                await axios.post(`${process.env.REACT_APP_USER_API_ENDPOINT}/urls?uuid=${uuid}`, {
                    original_url,
                    identification_name: name,
                    description,
                    tag: tags
                },{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
                    },
                });
                if (isMounted) {
                    alert("URL updated successfully");
                    navigate(`url/view/${uuid}`); // Redirect to dashboard after deletion
                }
            } catch (error) {
                if (isMounted) {
                    alert(error.message);
                    navigate(`url/view/${uuid}`); // Redirect to dashboard after deletion
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

export default UpdateUrl;
