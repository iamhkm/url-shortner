import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignInPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_USER_API_ENDPOINT}/user/sign-in`, { username: email, password });
            localStorage.setItem("id_token", response.data.id_token);
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);
            navigate('/dashboard');
        } catch (error) {
            alert(error.response.data);
        }
    };

    const handleGoogleSignIn = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get(`${process.env.REACT_APP_USER_API_ENDPOINT}/user/social/url`);
            console.log(response.data.url);
            window.location.href = response.data.url;
        } catch (error) {
            console.log("error ", error);
            alert(error.response.data.error);
            navigate("/");
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
                <div className="button-group">
                    <button type="submit" className="btn btn-primary">Sign In</button>
                    <button type="button" className="btn btn-primary google-btn" onClick={handleGoogleSignIn}>
                        <FontAwesomeIcon icon={faGoogle} style={{ marginRight: '8px' }} />
                        Sign In
                    </button>
                </div>
            </form>
            {message && <p className="message">{message}</p>}
            <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
            <p>Forgot Password? <Link to="/forgotPassword" className="signup-link">Forgot Password</Link></p>
        </div>
    );
};

export default SignInPage;
