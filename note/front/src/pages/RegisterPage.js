// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, notification } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import './RegisterPage.css';

const RegisterPage = () => {
    // Define state variables
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            await axios.post('http://localhost:5000/register', {
                username: values.username,
                email: values.email,
                password: values.password
            });

            // Display success message
            notification.success({
                message: 'Registration Successful',
                description: 'You can now log in.'
            });

            // Redirect to the login page
            window.location.href = '/login';

        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Registration Failed',
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
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { min: 4, message: 'Username must be at least 4 characters long.' }
                    ]}
                >
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please input a valid email!' }
                    ]}
                >
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 8, message: 'Password must be at least 8 characters long.' },
                        { pattern: /[A-Z]/, message: 'Password must include at least one uppercase letter.' },
                        { pattern: /[a-z]/, message: 'Password must include at least one lowercase letter.' },
                        { pattern: /\d/, message: 'Password must include at least one number.' }
                    ]}
                >
                    <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="link" href="/login">
                        Already have an account? Log in here
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterPage;
