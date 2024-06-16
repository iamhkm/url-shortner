import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Dashboard.css";
import { useNavigate } from 'react-router-dom'; // Import necessary routing components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrashAlt, faBan } from '@fortawesome/free-solid-svg-icons';
import ProfileImage from "../media/default_profile.jpeg";
import Chart from "chart.js/auto"; // Importing the Chart.js library
import { Bar, Line } from "react-chartjs-2";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [selectedStatType, setSelectedStatType] = useState("Monthly");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); // Redirect to the logout page or component
  };

  const handleView = (urlId) => {
    navigate(`/url/view/${urlId}`);
  };

  const handleAddUrl = () => {
    navigate('/url/new');
  };

  const handleDisable = (urlId, status) => {
    navigate(`/url/${urlId}/status/${status}`);
  };

  const handleDelete = (urlId) => {
    navigate(`/url/delete/${urlId}`);
  };

  const getButtonStyle = (status) => {
    return status === 1 ? 'colorful-button' : 'colorless-button';
  };

  const getMonthlyStatsData = (stat_type, year, month) => {
    const statsData = [];
    if (data?.[stat_type]?.[year]?.[month]) {
      const map = data[stat_type][year][month];
      for (let i = 1; i <= 31; i++) {
        const key = i.toString().padStart(2, '0');
        map[key] ? statsData.push(map[key]) : statsData.push(0);
      }
    } else {
      for (let i = 1; i <= 31; i++) statsData.push(0);
    }
    return statsData;
  }

  const getYearlyStatsDate = (stat_type, year) => {
    const statsData = [];
    if (data?.[stat_type]?.[year]) {
      const map = data[stat_type][year];
      for (let i = 1; i <= 12; i++) {
        const key = i.toString().padStart(2, '0');
        map[key] ? statsData.push(map.total) : statsData.push(0);
      }
    } else {
      for (let i = 1; i <= 12; i++) statsData.push(0);
    }
    return statsData;
  }

  const getAddData = (statType) => {
    const dateToday = new Date();
    const year = dateToday.getFullYear().toString();
    const month = (dateToday.getMonth() + 1).toString().padStart(2, '0');
    let labels = [];
    let addStatsData = [];
    let deleteStatsData = [];
    if (statType === "Monthly") {
      for (let i = 1; i <= 31; i++) labels.push(i);
      addStatsData = getMonthlyStatsData("add_stats", year, month);
      deleteStatsData = getMonthlyStatsData("delete_stats", year, month);
    }
    else if (statType === "Yearly") {
      labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      addStatsData = getYearlyStatsDate("add_stats", year);
      deleteStatsData = getYearlyStatsDate("delete_stats", year);
    }
    else {
      const map = data.add_stats;
      const deleteMap = data.delete_stats;
      if (!map) {
        for (let i = Number(year) + 5; i >= year; i--) labels.push(i);
        labels = labels.reverse();
        addStatsData = [0, 0, 0, 0, 0];
        deleteStatsData = [0, 0, 0, 0, 0];
      }
      else {
        labels = Object.keys(map);
        for (let key of labels) {
          addStatsData.push(map[key].total);
          deleteStatsData.push(deleteMap[key].total);
        }
      }
    }
    // Setting up the data for the chart, including the labels and datasets
    const chartData = {
      labels,
      datasets: [
        {
          label: "Url Add Stats", // Setting up the label for the dataset
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Setting up the background color for the dataset
          borderColor: "rgba(75, 192, 192, 1)", // Setting up the border color for the dataset
          borderWidth: 1, // Border width
          data: addStatsData, // Setting up the data for the dataset
        },
        {
          label: "Url Delete Stats", // Setting up the label for the dataset
          backgroundColor: "rgba(255, 99, 132, 0.2)", // Setting up the background color for the dataset
          borderColor: "rgba(255, 99, 132, 1)", // Setting up the border color for the dataset
          borderWidth: 1, // Border width
          data: deleteStatsData, // Setting up the data for the dataset
        },
      ],
    };
    return chartData;
  }

  const handleStatTypeChange = (event) => {
    setSelectedStatType(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_USER_API_ENDPOINT}/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("id_token")}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <div className="profile">
          <img src={ProfileImage} alt="Profile" className="profileImage" />
          <span className="username">{data.email}</span>
        </div>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      </div>
      <div className="stats">
        <div className="statsBox">
          <div className="boxContent">
            <div className="boxNumber">{data.total_url}</div>
            <div className="boxLabel">Total URLs</div>
          </div>
        </div>
        <div className="statsBox">
          <div className="boxContent">
            <div className="boxNumber">{data.total_active}</div>
            <div className="boxLabel">Total Active</div><br />
          </div>
        </div>
      </div>
      <div>
        <div className="dropdown">
          <select value={selectedStatType} onChange={handleStatTypeChange} className="dropdown-select">
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
            <option value="All time">All time</option>
          </select>
        </div>
        <Bar data={getAddData(selectedStatType)} />
      </div>
      <div className="header-container">
        <h2 className="urlHeader">URL Details</h2>
        <button className="add-button" onClick={handleAddUrl}>+</button>
      </div>
      <div className="urlList">
        {data.urls.map(url => (
          <div className="urlItem" key={url.unique_id}>
            <div className="urlInfo">
              <div className="uniqueId">ID: {url.unique_id}</div>
              <div className="identificationName">Name: {url.identification_name}</div>
              <div className="totalHit">Hits: {url.total_hit}</div>
            </div>
            <div className="urlActions">
              <button className="button" onClick={() => handleView(url.unique_id)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button className={`button ${getButtonStyle(url.url_status)}`} onClick={() => handleDisable(url.unique_id, (url.url_status === 1) ? 0 : 1)}>
                <FontAwesomeIcon icon={faBan} />
              </button>
              <button className="button" onClick={() => handleDelete(url.unique_id)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
