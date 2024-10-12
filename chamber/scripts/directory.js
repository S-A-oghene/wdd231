async function fetchMembers() {
    try {
        const response = await fetch('data/members.json');
        const data = await response.json();
        return data.members;
    } catch (error) {
        console.error('Error fetching members:', error);
    }
}

function displayMembers(members, viewMode) {
    const container = document.getElementById('directory-container');
    container.innerHTML = '';
    container.className = viewMode;

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.innerHTML = `
            <img src="${member.image}" alt="${member.name}" loading="lazy">
            <h4>${member.name}</h4>
            <p>${member.address}</p>
            <p>Phone: ${member.phone}</p>
            <p><a href="${member.website}" target="_blank">Website</a></p>
            <p>Membership Level: ${member.membershipLevel}</p>
        `;
        container.appendChild(memberCard);
    });
}

function setupViewToggle() {
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');

    gridBtn.addEventListener('click', () => {
        document.getElementById('directory-container').className = 'grid-view';
    });

    listBtn.addEventListener('click', () => {
        document.getElementById('directory-container').className = 'list-view';
    });
}

async function initDirectory() {
    const members = await fetchMembers();
    displayMembers(members, 'grid-view');
    setupViewToggle();
}

document.addEventListener('DOMContentLoaded', initDirectory);
