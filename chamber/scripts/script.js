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

// Display members
function displayMembers(members, viewType) {
    const container = document.getElementById('directory-container');
    container.innerHTML = '';
    container.className = viewType;

    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <h2>${member.name}</h2>
            <img src="images/${member.image}" alt="${member.name}" width="100">
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p>Website: <a href="${member.website}" target="_blank">${member.website}</a></p>
            <p>Membership Level: ${member.membershipLevel}</p>
        `;
        container.appendChild(card);
    });
}

// Toggle view
function setupViewToggle() {
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');

    gridBtn.addEventListener('click', () => {
        document.getElementById('directory-container').className = 'grid-view';
    });

    listBtn.addEventListener('click', () => {
        document.getElementById('directory-container').className = 'list-view';
    });
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
    const members = await fetchMembers();
    displayMembers(members, 'grid-view');
    setupViewToggle();
    setupNavigationMenu();
    updateFooter();
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
