// src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, notification } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import './LoginPage.css';

const LoginPage = () => {
    // Define state variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: values.username,
                password: values.password
            });

            const { access_token, username } = response.data;

            // Store the token in local storage
            localStorage.setItem('token', access_token);

            // Display success message
            notification.success({
                message: 'Login Successful',
                description: `Welcome, ${username}!`
            });

            // Redirect to the notes page
            window.location.href = '/notes';

        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Login Failed',
                description: error.response?.data?.message || 'An error occurred'
            });
        }
    };

    return (
        <div className="container mt-5">
            <Form onFinish={handleSubmit} className="border p-4 rounded">
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Log In
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="link" href="/register">
                        Don't have an account? Register here
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;
