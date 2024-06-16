// SignInPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link and useHistory for routing
import './SignInPage.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Make API call to sign in
            const response = await axios.post(`${process.env.REACT_APP_USER_API_ENDPOINT}/user/sign-in`, { username: email, password });
            localStorage.setItem("id_token", response.data.id_token);
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);
            navigate('/dashboard'); // Redirect to sign-in page
        } catch (error) {
            alert(error.response.data.error);
            // setMessage('Error signing in. Please try again.');
        }
    };

    return (
        <div className="signin-container">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit} className="signin-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Sign In</button>
            </form>
            {message && <p className="message">{message}</p>}
            <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
        </div>
    );
};

export default SignInPage;
