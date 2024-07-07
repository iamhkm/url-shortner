// SignUpPage.js

import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPasswordPage.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
    });
    const [message] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_USER_API_ENDPOINT}/user/forgot-password`, formData);
            localStorage.setItem("email", formData.email)
            navigate('/confirmForgotPassword');
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <div className="signup-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Send Code</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ForgotPasswordPage;
