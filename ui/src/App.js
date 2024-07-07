import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInPage from './user/SignInPage';
import SignUpPage from './user/SignUpPage';
import Dashboard from './user/Dashboard';
import ConfirmUser from './user/ConfirmUser';
import DeleteUrl from './url/DeleteUrl'
import UpdateStatus from './url/UpdateStatus'
import AddUrl from './url/AddUrl'
import ViewUrl from './url/ViewUrl'
import UpdateUrl from './url/UpdateUrl'
import GSignIn from './user/GSignIn'
import ForgotPasswordPage from './user/ForgotPasswordPage';
import ConfirmForgotPasswordPage from './user/ConfirmForgotPasswordPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GSignIn />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/confirmUser" element={<ConfirmUser/>} />
                <Route path="/url/delete/:uuid" element={<DeleteUrl />} />
                <Route path="/url/view/:uuid" element={<ViewUrl />} />
                <Route path="/url/update/:uuid" element={<UpdateUrl />} />
                <Route path="/url/:uuid/status/:status" element={<UpdateStatus />} />
                <Route path="/url/new" element={<AddUrl/>} />
                <Route path="/forgotPassword" element={<ForgotPasswordPage/>} />
                <Route path="/confirmForgotPassword" element={<ConfirmForgotPasswordPage/>} />
            </Routes>
        </Router>
    );
};

export default App;
