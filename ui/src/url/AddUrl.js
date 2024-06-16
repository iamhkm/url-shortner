import React, { useState } from 'react';
import axios from 'axios';
import './AddUrl.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

const AddUrl = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        url: '',
        name: '',
        tag: [''], // Initially, one empty tag input
        description: ''
    });
    const [message] = useState('');

    const handleBack = () => {
        navigate(`/dashboard`)
    };

    // Handler to update URL, Name, Description
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler to update tags array
    const handleTagChange = (index, value) => {
        const newTag = [...formData.tag];
        newTag[index] = value;
        setFormData({ ...formData, tag: newTag });
    };

    // Handler to add a new empty tag input
    const handleAddTag = () => {
        setFormData({ ...formData, tag: [...formData.tag, ''] });
    };

    // Handler to remove a tag input
    const handleRemoveTag = (index) => {
        const newTag = [...formData.tag];
        newTag.splice(index, 1);
        setFormData({ ...formData, tag: newTag });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`${process.env.REACT_APP_USER_API_ENDPOINT}/urls`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("id_token")}`,
                },
            });
            alert("URL added successfully");
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            alert(error.response.data.error);
            navigate("/dashboard")
        }
    };

    return (
        <div className="signup-container">
            <h2>Add URL</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                    <label>URL:</label>
                    <input
                        type="text"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Tags:</label>
                    {formData.tag.map((tagHere, index) => (
                        <div key={index} className="tag-input-container">
                            <input
                                type="text"
                                value={tagHere}
                                onChange={(e) => handleTagChange(index, e.target.value)}
                                className="form-control tag-input"
                                placeholder="Enter tag"
                            />
                            <div className="tag-buttons">
                                {index === formData.tag.length - 1 && (
                                    <button type="button" className="add-tag-button" onClick={handleAddTag}>+</button>
                                )}
                                {formData.tag.length > 1 && (
                                    <button type="button" className="remove-tag-button" onClick={() => handleRemoveTag(index)}>-</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add URL</button><br></br>
                <button type="back" className="btn btn-primary" onClick={handleBack}>
                    Back
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AddUrl;
