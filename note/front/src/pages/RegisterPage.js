import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './RegisterPage.css'; // Import custom CSS

const RegisterPage = () => {
    // Define state variables
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        try {
            await axios.post('http://localhost:5000/register', {
                username,
                email,
                password
            });

            // Display success message
            alert('Registration Successful! You can now log in.');

            // Redirect to the login page
            window.location.href = '/login';

        } catch (error) {
            console.error(error);
            alert('Registration Failed: ' + (error.response?.data?.message || 'An error occurred'));
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="registration-form">
                <h2 className="text-center mb-4">Register</h2>
                <div className="form-group mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-2">Register</button>
                <p className="text-center">
                    Already have an account? <a href="/login" className="text-primary">Log in here</a>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
