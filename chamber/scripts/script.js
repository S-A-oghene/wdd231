// Fetch member data
async function fetchMembers() {
    try {
        const response = await fetch('data/members.json');
        const data = await response.json();
        return data.members;
    } catch (error) {
        console.error('Error fetching member data:', error);
    }
}

// Display company spotlights
async function displaySpotlights() {
    const members = await fetchMembers();
    const goldSilverMembers = members.filter(member => 
        member.membershipLevel === 'Gold' || member.membershipLevel === 'Silver'
    );
    
    const spotlights = [];
    while (spotlights.length < 3 && goldSilverMembers.length > 0) {
        const randomIndex = Math.floor(Math.random() * goldSilverMembers.length);
        spotlights.push(goldSilverMembers.splice(randomIndex, 1)[0]);
    }

    const container = document.getElementById('spotlight-container');
    spotlights.forEach(member => {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight';
        spotlight.innerHTML = `
            <h3>${member.name}</h3>
            <img src="${member.image}" alt="${member.name}" width="100" height="67">
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p>Website: <a href="${member.website}" target="_blank">${member.website}</a></p>
            <p>Membership Level: ${member.membershipLevel}</p>
        `;
        container.appendChild(spotlight);
    });
}

// Fetch weather data
async function fetchWeather() {
    const apiKey = 'e4a264b33afd8e63434ebd6a942dd800';
    const city = 'Lagos,NG';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Display weather information
async function displayWeather() {
    const weatherData = await fetchWeather();
    const currentWeather = weatherData.list[0];

    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h3>Current Weather</h3>
        <p>Temperature: ${currentWeather.main.temp.toFixed(0)}°C</p>
        <p>Description: ${capitalizeWords(currentWeather.weather[0].description)}</p>
    `;

    const weatherForecast = document.getElementById('weather-forecast');
    weatherForecast.innerHTML = '<h3>3-Day Forecast</h3>';
    for (let i = 1; i <= 3; i++) {
        const forecast = weatherData.list[i * 8]; // Every 8th entry is 24 hours apart
        const date = new Date(forecast.dt * 1000);
        weatherForecast.innerHTML += `
            <p>${date.toLocaleDateString('en-US', { weekday: 'short' })}: ${forecast.main.temp.toFixed(0)}°C</p>
        `;
    }
}

// Capitalize each word of a string
function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

// Update footer information
function updateFooter() {
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    const lastModified = new Date(document.lastModified);
    document.getElementById('last-modified').textContent = lastModified.toLocaleString();
}

// Toggle navigation menu
function setupNavigationMenu() {
    const menuBtn = document.getElementById('menu');
    const navMenu = document.querySelector('.nav-menu');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        menuBtn.classList.toggle('open');
    });
}

// Initialize the page
async function init() {
    displaySpotlights();
    displayWeather();
    setupNavigationMenu();
    updateFooter();
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
