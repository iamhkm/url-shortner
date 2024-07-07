import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import necessary routing components
import '../user/ConfirmUser.css'; // Import CSS file for styling

const ConfirmUser = () => {
    const [username, setUsername] = useState('');
    const [confirmation_code, setConfirmationCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve username from local storage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        else {
            alert("could not fetch username... please try to sign up again")
            navigate('/'); // Redirect to dashboard
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Make API call to sign in
            await axios.post(`${process.env.REACT_APP_USER_API_ENDPOINT}/user/confirm-sign-up`, { username, confirmation_code });
            localStorage.removeItem("username");
            alert("sign up success")
            navigate('/'); // Redirect to dashboard
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <div className="confirm-signup-container">
            <h2>Confirm Sign Up</h2>
            <form onSubmit={handleSubmit} className="confirm-signup">
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        readOnly
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Confirmation Code:</label>
                    <input
                        type="text"
                        value={confirmation_code}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Confirm</button>
            </form>
        </div>
    );
};

export default ConfirmUser;
