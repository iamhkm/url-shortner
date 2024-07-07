import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import necessary routing components
import '../user/ConfirmUser.css'; // Import CSS file for styling

const ConfirmForgotPasswordPage = () => {
    const [email, setUsername] = useState('');
    const [confirmation_code, setConfirmationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve username from local storage
        const storedUsername = localStorage.getItem('email');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        else {
            alert("could not fetch username... please try to sign up again")
            navigate('/');
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (password !== confirm_password) throw new Error("password doesn't match");
            await axios.post(`${process.env.REACT_APP_USER_API_ENDPOINT}/user/confirm-forgot-password`, { email, confirmation_code, password });
            localStorage.removeItem("email");
            alert("password changed successfully");
            navigate('/'); // Redirect to dashboard
        } catch (error) {
            alert(error?.response?.data?.error || error.message);
        }
    };

    return (
        <div className="confirm-signup-container">
            <h2>Confirm Sign Up</h2>
            <form onSubmit={handleSubmit} className="confirm-signup">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="text"
                        value={email}
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
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="text"
                        value={confirm_password}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default ConfirmForgotPasswordPage;
