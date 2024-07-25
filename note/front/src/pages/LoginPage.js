import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });

            const { access_token, username: user } = response.data;

            localStorage.setItem('token', access_token);

            alert(`Welcome, ${user}!`);
            window.location.href = '/notes';

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card p-4">
                            <h2 className="text-center mb-4">Login</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Log In
                                </Button>
                                <Button variant="link" href="/register" className="w-100 mt-2">
                                    Don't have an account? Register here
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
