// src/pages/ProtectedPage.js
import React from 'react';
import { Button, Typography } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import './ProtectedPage.css';

const { Title } = Typography;

const ProtectedPage = () => {
    // Handle logout
    const handleLogout = () => {
        // Remove the token from local storage
        localStorage.removeItem('token');
        // Redirect to the login page
        window.location.href = '/login';
    };

    return (
        <div className="container mt-5">
            <Title level={2}>Protected Page</Title>
            <p>You are viewing a protected page. Only logged-in users can see this content.</p>
            <Button type="primary" onClick={handleLogout}>
                Log Out
            </Button>
            <Button type="link" href="/notes" className="mt-3">
                Go to Notes Page
            </Button>
        </div>
    );
};

export default ProtectedPage;
