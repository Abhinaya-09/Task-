import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NotePage.css';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/notes', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setNotes(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchUsername = async () => {
            try {
                const response = await axios.get('http://localhost:5000/protected', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUsername(response.data.username);
                fetchNotes();
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsername();
    }, []);

    const handleCreateNote = async () => {
        try {
            await axios.post('http://localhost:5000/notes', {
                title,
                content
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setNotes([...notes, { _id: Date.now(), title, content }]); // Use a temporary ID for the new note
            setTitle('');
            setContent('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateNote = async () => {
        try {
            await axios.put(`http://localhost:5000/notes/${editingNote._id}`, {
                title: editingNote.title,
                content: editingNote.content
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setNotes(notes.map(note => note._id === editingNote._id ? { ...note, title: editingNote.title, content: editingNote.content } : note));
            setEditingNote(null);
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await axios.delete(`http://localhost:5000/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setNotes(notes.filter(note => note._id !== noteId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login page or another route
    };

    return (
        <div className="container mt-5">
            <h2>Notes for {username}</h2>
            <Button onClick={handleLogout} className="mb-3" variant="danger">
                Logout
            </Button>
            <Form onSubmit={e => { e.preventDefault(); handleCreateNote(); }} className="border p-4 rounded">
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
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
                    />
                </Form.Group>
                <Button onClick={handleCreateNote} className="mt-3" variant="primary">
                    Create Note
                </Button>
            </Form>
            <ListGroup className="mt-4">
                {notes.map(note => (
                    <ListGroup.Item key={note._id} className="note-item">
                        <h4>{note.title}</h4>
                        <p>{note.content}</p>
                        <Button onClick={() => { setEditingNote(note); setShowModal(true); }} className="me-2" variant="warning">
                            Update
                        </Button>
                        <Button onClick={() => handleDeleteNote(note._id)} variant="danger">
                            Delete
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingNote?.title || ''}
                                onChange={(e) => setEditingNote({
                                    ...editingNote,
                                    title: e.target.value
                                })}
                                placeholder="Enter title"
                            />
                        </Form.Group>
                        <Form.Group controlId="formContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editingNote?.content || ''}
                                onChange={(e) => setEditingNote({
                                    ...editingNote,
                                    content: e.target.value
                                })}
                                placeholder="Enter content"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateNote}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default NotesPage;
