// Lazy loading implementation
const images = document.querySelectorAll('[data-src]');

const loadImage = (img) => {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = () => {
        img.removeAttribute('data-src');
    };
};

const imageOptions = {
    threshold: 0,
    rootMargin: '0px 0px 50px 0px'
};

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, imageOptions);
    images.forEach(img => imageObserver.observe(img));
}

// Visit tracking
function getVisitMessage() {
    const visitMessage = document.getElementById('visitMessage');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentDate = Date.now();

    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const daysSinceLastVisit = Math.floor((currentDate - lastVisit) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastVisit < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else if (daysSinceLastVisit === 1) {
            visitMessage.textContent = "You last visited 1 day ago.";
        } else {
            visitMessage.textContent = `You last visited ${daysSinceLastVisit} days ago.`;
        }
    }
    
    localStorage.setItem('lastVisit', currentDate);
}

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
        const forecast = weatherData.list[i * 8];
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

// Set up join form
function setupJoinForm() {
    const form = document.querySelector('form');
    const timestampInput = document.getElementById('timestamp');

    if (form && timestampInput) {
        timestampInput.value = new Date().toISOString();

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'thankyou.html?' + new URLSearchParams(new FormData(form));
        });
    }
}

// Set up membership card modals
function setupMembershipModals() {
    const modalLinks = document.querySelectorAll('.modal-link');
    const closeButtons = document.querySelectorAll('.close-modal');

    modalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Display form summary on thank you page
function displayFormSummary() {
    const formSummary = document.getElementById('form-summary');
    if (formSummary) {
        const params = new URLSearchParams(window.location.search);
        formSummary.innerHTML = `
            <p><strong>First Name:</strong> ${params.get('first-name')}</p>
            <p><strong>Last Name:</strong> ${params.get('last-name')}</p>
            <p><strong>Email:</strong> ${params.get('email')}</p>
            <p><strong>Phone:</strong> ${params.get('phone')}</p>
            <p><strong>Business Name:</strong> ${params.get('business-name')}</p>
            <p><strong>Membership Level:</strong> ${params.get('membership-level')}</p>
            <p><strong>Date Submitted:</strong> ${new Date(params.get('timestamp')).toLocaleString()}</p>
        `;
    }
}

// Initialize the page
async function init() {
    setupNavigationMenu();
    updateFooter();

    if (document.querySelector('.company-spotlights')) {
        displaySpotlights();
    }

    if (document.querySelector('.weather')) {
        displayWeather();
    }

    if (document.querySelector('.join-page')) {
        setupJoinForm();
        setupMembershipModals();
    }

    if (document.querySelector('.thank-you-page')) {
        displayFormSummary();
    }
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
