import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AddUrl.css'; // Ensure the correct path to your CSS file
import Chart from "chart.js/auto"; // Importing the Chart.js library
import { Line } from "react-chartjs-2";

const ViewUrl = () => {
    const [hover, setHover] = useState(false);
    const [selectedStatType, setSelectedStatType] = useState("Monthly");
    const navigate = useNavigate();
    const { uuid } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        original_url: '',
        name: '',
        description: '',
        tags: [],
        user_id: '',
        unique_id: '',
        short_url: '',
        total_hit: 0,
        url_status: 0,
        hit_stats: {}
    });

    const handleBack = () => {
        navigate(`/dashboard`);
    };

    const getMonthlyStatsData = (stat_type, year, month) => {
        console.log("formData ", formData);
        const statsData = [];
        console.log("formData?.[stat_type] ", formData?.[stat_type]);
        if (formData?.[stat_type]?.[year]?.[month]) {
            const map = formData[stat_type][year][month];
            for (let i = 1; i <= 31; i++) {
                const key = i.toString().padStart(2, '0');
                map[key] ? statsData.push(map[key]) : statsData.push(0);
            }
        } else {
            for (let i = 1; i <= 31; i++) statsData.push(0);
        }
        return statsData;
    };

    const getYearlyStatsDate = (stat_type, year) => {
        const statsData = [];
        if (formData?.[stat_type]?.[year]) {
            const map = formData[stat_type][year];
            for (let i = 1; i <= 12; i++) {
                const key = i.toString().padStart(2, '0');
                map[key] ? statsData.push(map.total) : statsData.push(0);
            }
        } else {
            for (let i = 1; i <= 12; i++) statsData.push(0);
        }
        return statsData;
    };

    const getAddData = (statType) => {
        const dateToday = new Date();
        const year = dateToday.getFullYear().toString();
        const month = (dateToday.getMonth() + 1).toString().padStart(2, '0');
        let labels = [];
        let hitStatsData;
        if (statType === "Monthly") {
            for (let i = 1; i <= 31; i++) labels.push(i);
            hitStatsData = getMonthlyStatsData("hit_stats", year, month);
        } else if (statType === "Yearly") {
            labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            hitStatsData = getYearlyStatsDate("hit_stats", year);
        } else {
            const map = formData.hit_stats;
            if (!map) {
                for (let i = Number(year) + 5; i >= year; i--) labels.push(i);
                labels = labels.reverse();
                hitStatsData = [0, 0, 0, 0, 0];
            } else {
                labels = Object.keys(map);
                hitStatsData = [];
                for (let key of labels) {
                    hitStatsData.push(map[key].total);
                }
            }
        }
        // Setting up the data for the chart, including the labels and datasets
        const chartData = {
            labels,
            datasets: [
                {
                    label: "Hit Stats", // Setting up the label for the dataset
                    backgroundColor: "rgba(255, 99, 132, 0.2)", // Setting up the background color for the dataset
                    borderColor: "rgba(255, 99, 132, 1)", // Setting up the border color for the dataset
                    borderWidth: 1, // Border width
                    data: hitStatsData, // Setting up the data for the dataset
                },
            ],
        };
        return chartData;
    };

    const handleStatTypeChange = (event) => {
        setSelectedStatType(event.target.value);
    };

    useEffect(() => {
        const fetchUrlData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_USER_API_ENDPOINT}/urls?uuid=${uuid}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("id_token")}`,
                    },
                });
                console.log("url detail ", response);
                setFormData({
                    original_url: response.data.original_url,
                    name: response.data.identification_name,
                    description: response.data.description,
                    tags: response.data.tag,
                    user_id: response.data.user_id,
                    unique_id: response.data.unique_id,
                    short_url: response.data.short_url,
                    total_hit: response.data.total_hit,
                    url_status: response.data.url_status,
                    hit_stats: response.data.hit_stats
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching URL details:', error);
                setLoading(false);
                navigate("/dashboard");
            }
        };
        fetchUrlData();
    }, [uuid, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleTagsChange = (e, index) => {
        const newTags = [...formData.tags];
        newTags[index] = e.target.value;
        setFormData({
            ...formData,
            tags: newTags,
        });
    };

    const handleAddTag = () => {
        setFormData({
            ...formData,
            tags: [...formData.tags, ''],
        });
    };

    const handleRemoveTag = (index) => {
        const newTags = [...formData.tags];
        newTags.splice(index, 1);
        setFormData({
            ...formData,
            tags: newTags,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            formData.url_status = formData.url_status === 1 ? true : false;
            formData.url = formData.original_url;
            delete formData.original_url;
            await axios.post(`${process.env.REACT_APP_USER_API_ENDPOINT}/urls?uuid=${formData.unique_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("id_token")}`,
                },
            });
            alert("URL updated successfully");
            navigate(`/url/view/${formData.unique_id}`);
        } catch (error) {
            alert(error.response.data.error);
            navigate("/dashboard");
        }
    };

    if (loading) {
        return <p>Loading URL details...</p>;
    }

    return (
        <div className="view-url-container">
            <div>
                <div className="dropdown">
                    <select value={selectedStatType} onChange={handleStatTypeChange} className="dropdown-select">
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="All time">All time</option>
                    </select>
                </div>
                <Line data={getAddData(selectedStatType)} />
            </div>
            <h2>URL Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Unique Id:</label>
                    <input
                        type="text"
                        name="unique_id"
                        readOnly
                        value={formData.unique_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group" style={{ position: 'relative', marginBottom: '1rem' }}>
                    <label>Short Url:</label>
                    <a
                        href={"https://"+formData.short_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'block',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        <input
                            type="url"
                            name="short_url"
                            readOnly
                            value={formData.short_url}
                            className="form-control"
                            required
                            style={{
                                width: '100%',
                                padding: '0.375rem 0.75rem',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                                color: '#0000FF', // Blue color
                                textDecoration: 'underline', // Add underline
                                backgroundColor: '#fff',
                                border: hover ? '1px solid #0056b3' : '1px solid #ced4da', // Change border color on hover
                                borderRadius: '0.25rem',
                                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                                cursor: 'pointer'
                            }}
                        />
                    </a>
                </div>
                <div className="form-group">
                    <label>Is Active:</label>
                    <input
                        type="text"
                        name="url_status"
                        readOnly
                        contentEditable="false"
                        value={formData.url_status === 1 ? 'true' : 'false'}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Original URL:</label>
                    <input
                        type="text"
                        name="original_url"
                        value={formData.original_url}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Tags:</label>
                    {formData.tags.map((tag, index) => (
                        <div key={index} className="tag-input-container">
                            <input
                                type="text"
                                value={tag}
                                onChange={(e) => handleTagsChange(e, index)}
                                className="form-control"
                            />
                            {index > 0 && (
                                <button type="button" onClick={() => handleRemoveTag(index)} className="remove-tag-button">
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddTag} className="add-tag-button">
                        Add Tag
                    </button>
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button><br></br>
                <button type="button" className="btn btn-primary" onClick={handleBack}>
                    Back
                </button>
            </form>
        </div>
    );
};

export default ViewUrl;
