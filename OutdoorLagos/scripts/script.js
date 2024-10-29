// Constants and Configuration
const API_KEY = 'e4a264b33afd8e63434ebd6a942dd800';
const LAGOS_COORDS = {
    lat: 6.5244,
    lon: 3.3792
};

// DOM Elements Cache
const weatherInfo = document.getElementById('weather-info');
const weatherForecast = document.getElementById('weather-forecast');
const hamburgerMenu = document.getElementById('hamburger-menu');
const nav = document.querySelector('nav ul');

// Weather Functions
async function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAGOS_COORDS.lat}&lon=${LAGOS_COORDS.lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather fetch failed');
    return await response.json();
}

function displayWeather(weatherData) {
    const current = weatherData.list[0];
    weatherInfo.innerHTML = `
        <h3>Current Weather</h3>
        <p>Temperature: ${current.main.temp.toFixed(0)}°C</p>
        <p>Description: ${capitalizeWords(current.weather[0].description)}</p>
        <p>Humidity: ${current.main.humidity}%</p>
    `;

    weatherForecast.innerHTML = '<h3>3-Day Forecast</h3>';
    for (let i = 1; i <= 3; i++) {
        const forecast = weatherData.list[i * 8];
        const date = new Date(forecast.dt * 1000);
        weatherForecast.innerHTML += `
            <p>${date.toLocaleDateString('en-US', { weekday: 'short' })}: 
               ${forecast.main.temp.toFixed(0)}°C</p>
        `;
    }
}

// Activities Functions
async function loadActivities() {
    const response = await fetch('data/activities.json');
    if (!response.ok) throw new Error('Activities fetch failed');
    const data = await response.json();
    return data.activities;
}

function displayActivities(activities, container) {
    container.innerHTML = activities.map(activity => `
        <div class="activity-card" data-id="${activity.id}">
            <img src="${activity.imageUrl}" alt="${activity.name}" loading="lazy">
            <div class="activity-info">
                <h3>${activity.name}</h3>
                <p>${activity.description}</p>
                <p class="price-range">${activity.priceRange}</p>
                <button class="view-details" data-id="${activity.id}">View Details</button>
            </div>
        </div>
    `).join('');
}

async function displayFeaturedActivities() {
    const spotlightContainer = document.getElementById('spotlight-container');
    if (!spotlightContainer) return;

    const activities = await loadActivities();
    const featured = activities
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    displayActivities(featured, spotlightContainer);
}

async function setupActivityFilter() {
    const filterSelect = document.getElementById('activity-type');
    const activitiesGrid = document.getElementById('activities-grid');
    
    if (!filterSelect || !activitiesGrid) return;
    
    const activities = await loadActivities();
    
    filterSelect.addEventListener('change', () => {
        const selectedType = filterSelect.value;
        const filteredActivities = selectedType === 'all' 
            ? activities 
            : activities.filter(activity => activity.type === selectedType);
        
        displayActivities(filteredActivities, activitiesGrid);
    });
    
    displayActivities(activities, activitiesGrid);
}

function showActivityDetails(activityId) {
    const modal = document.getElementById('activity-modal');
    const modalContent = document.getElementById('modal-content');
    
    loadActivities().then(activities => {
        const activity = activities.find(a => a.id === parseInt(activityId));
        if (activity) {
            modalContent.innerHTML = `
                <h2>${activity.name}</h2>
                <img src="${activity.imageUrl}" alt="${activity.name}">
                <p>${activity.description}</p>
                <p>Price Range: ${activity.priceRange}</p>
                <p>Best Time: ${activity.bestTime}</p>
                <p>Location: ${activity.location}</p>
            `;
            modal.showModal();
        }
    });
}

// Planner Functions
async function initializePlanner() {
    const plannerForm = document.getElementById('planner-form');
    const activitySelect = document.getElementById('activity-select');
    
    if (!plannerForm || !activitySelect) return;

    const activities = await loadActivities();
    
    activitySelect.innerHTML = activities.map(activity => 
        `<option value="${activity.id}">${activity.name}</option>`
    ).join('');
    
    const dateInput = document.getElementById('activity-date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
    
    plannerForm.addEventListener('submit', handlePlanSubmit);
}

async function populateActivitySelect() {
    const activitySelect = document.getElementById('activity-select');
    if (!activitySelect) return;
    
    const activities = await loadActivities();
    activitySelect.innerHTML = `
        <option value="">Select an activity...</option>
        ${activities.map(activity => 
            `<option value="${activity.id}">${activity.name}</option>`
        ).join('')}
    `;
}

function handlePlanSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const planData = Object.fromEntries(formData.entries());
    
    // Add to schedule timeline
    const timeline = document.getElementById('schedule-timeline');
    if (timeline) {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.innerHTML = `
            <h3>${planData.activity}</h3>
            <p>Date: ${planData.date}</p>
            <p>Time: ${planData.time}</p>
            <p>Duration: ${planData.duration} hours</p>
        `;
        timeline.appendChild(scheduleItem);
    }
}

// Utility Functions
function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

function updateFooter() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.getElementById('last-modified').textContent = document.lastModified;
}

// Event Listeners
function setupEventListeners() {
    hamburgerMenu?.addEventListener('click', () => {
        nav.classList.toggle('show');
    });

    document.addEventListener('click', e => {
        if (e.target.classList.contains('view-details')) {
            showActivityDetails(e.target.dataset.id);
        }
    });

    document.querySelector('.close-modal')?.addEventListener('click', () => {
        document.getElementById('activity-modal').close();
    });
}

// Initialize Application
async function initializeApp() {
    try {
        updateFooter();
        setupEventListeners();

        if (weatherInfo && weatherForecast) {
            const weatherData = await fetchWeather();
            displayWeather(weatherData);
        }

        await displayFeaturedActivities();
        await setupActivityFilter();
        await populateActivitySelect();
        await initializePlanner();

    } catch (error) {
        console.error('Initialization error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Failed to initialize application';
        document.querySelector('main').prepend(errorDiv);
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', initializeApp);
