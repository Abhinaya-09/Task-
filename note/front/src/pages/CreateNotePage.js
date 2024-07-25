import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateNotePage.css';

const CreateNotePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:5000/notes', { title, content }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('Note created successfully!');
            setTitle('');
            setContent('');
        } catch (error) {
            console.error(error);
            alert('An error occurred while creating the note.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create a Note</h2>
            <Form onSubmit={handleSubmit} className="border p-4 rounded">
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter content"
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3">
                    Create Note
                </Button>
            </Form>
        </div>
    );
};

export default CreateNotePage;
