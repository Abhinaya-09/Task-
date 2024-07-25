from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
import re

app = Flask(__name__)

# Configurations
app.config['SECRET_KEY'] = 'e2df750cd3ecb9ddcd958f67137b9213a5ae709c7190bf224cd183e25446f265'  # Change this to a strong secret key
app.config['JWT_SECRET_KEY'] = '4c2af3819a61685ca3338b871edb64239a12cf46a96edc11dc215893ae846713'  # Change this to a strong JWT secret key

# Initialize extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# Initialize MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['notepad_database']  # Replace 'user_database' with your database name
users_collection = db['notepad_users']  # Replace 'users' with your collection name
notes_collection = db['user_notes']  # Replace 'notes' with your collection name

# Register route with validations
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate username
    if len(username) < 4:
        return jsonify({"message": "Username must be at least 4 characters long."}), 400

    # Validate email
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"message": "Invalid email format."}), 400

    # Validate password strength
    if len(password) < 8 or not re.search(r"[A-Z]", password) or not re.search(r"[a-z]", password) or not re.search(r"\d", password):
        return jsonify({"message": "Password must be at least 8 characters long and include a mix of uppercase, lowercase letters, and numbers."}), 400

    # Check if user already exists
    if users_collection.find_one({'username': username}):
        return jsonify({"message": "User already exists"}), 400

    # Register the new user
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    try:
        users_collection.insert_one({'username': username, 'email': email, 'password': hashed_password})
    except DuplicateKeyError:
        return jsonify({"message": "User already exists"}), 400
    return jsonify({"message": "User registered successfully. Please log in."}), 201

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'username': username})

    if not user:
        return jsonify({"message": "User does not exist"}), 404

    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity={'username': username})
    return jsonify(access_token=access_token, username=username, message="Login successful"), 200

# Create a new note
@app.route('/notes', methods=['POST'])
@jwt_required()
def create_note():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    current_user = get_jwt_identity()
    username = current_user['username']

    try:
        notes_collection.insert_one({'username': username, 'title': title, 'content': content})
    except DuplicateKeyError:
        return jsonify({"message": "Note already exists"}), 400
    
    return jsonify({"message": "Note created successfully."}), 201

# Get all notes for the logged-in user
@app.route('/notes', methods=['GET'])
@jwt_required()
def get_notes():
    current_user = get_jwt_identity()
    username = current_user['username']
    notes = list(notes_collection.find({'username': username}, {'_id': 1, 'title': 1, 'content': 1}))
    for note in notes:
        note['_id'] = str(note['_id'])  # Convert ObjectId to string for JSON serialization
    return jsonify(notes), 200

# Update a note
@app.route('/notes/<note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    current_user = get_jwt_identity()
    username = current_user['username']

    try:
        result = notes_collection.update_one(
            {'_id': ObjectId(note_id), 'username': username},
            {'$set': {'title': title, 'content': content}}
        )
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    if result.matched_count == 0:
        return jsonify({"message": "Note not found or unauthorized"}), 404

    return jsonify({"message": "Note updated successfully."}), 200

# Delete a note
@app.route('/notes/<note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    current_user = get_jwt_identity()
    username = current_user['username']

    try:
        result = notes_collection.delete_one({'_id': ObjectId(note_id), 'username': username})
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    if result.deleted_count == 0:
        return jsonify({"message": "Note not found or unauthorized"}), 404

    return jsonify({"message": "Note deleted successfully."}), 200

# Protected route example
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    username = current_user['username']
    return jsonify(username=username), 200

if __name__ == '__main__':
    app.run(debug=True)
