const teamDataSection = document.getElementById('teamDataSection');
const cardsDataSection = document.getElementById('cardsDataSection');

const UpdateButtons = document.getElementsByClassName('Updateor');
const deleteButtons = document.getElementsByClassName('Terminator');

document.addEventListener('DOMContentLoaded', () => {
    const teamForm = document.getElementById('teamForm');
    const cardsForm = document.getElementById('cardsForm');
  
    teamForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const name = teamForm.querySelector('#teamName').value.trim();
      const role = teamForm.querySelector('#teamRole').value.trim();
      const photo = teamForm.querySelector('#teamPhoto').files[0];
  
      try {
        // Create a new team
        const { id } = await createTeam(name, role, photo);
        console.log('Team created successfully with ID:', id);
  
        // Fetch and display updated team data
        await displayTeamData();
      } catch (error) {
        console.error('Error creating team:', error);
      }
    });
  
    cardsForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const title = cardsForm.querySelector('#cardTitle').value.trim();
      const description = cardsForm.querySelector('#cardDescription').value.trim();
      const photo = cardsForm.querySelector('#cardPhoto').files[0];
  
      try {
        // Create a new card
        const { id } = await createCard(title, description, photo);
        console.log('Card created successfully with ID:', id);
  
        // Fetch and display updated cards data
        await displayCardsData();
      } catch (error) {
        console.error('Error creating card:', error);
      }
    });
  
    // Fetch and display initial data
    displayTeamData();
    displayCardsData();
});
  
async function createTeam(name, role, photo) {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('role', role);
      formData.append('photo', photo);
  
      const response = await fetch('/admin/teams', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
}
  
async function createCard(title, description, photo) {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('photo', photo);
  
      const response = await fetch('/admin/cards', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
}
  
async function displayTeamData() {
    try {
        // Fetch team data from the server
        const teamData = await fetchTeamData();

        // Display team data in the section
        renderTeamData(teamData);
    } catch (error) {
        console.error('Error fetching team data:', error);
    }
}

async function displayCardsData() {
    try {
        // Fetch cards data from the server
        const cardsData = await fetchCardsData();

        // Display cards data in the section
        renderCardsData(cardsData);
    } catch (error) {
        console.error('Error fetching cards data:', error);
    }
}

async function fetchTeamData() {
    try {
        const response = await fetch('/admin/teams');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching team data:', error);
        throw error;
    }
}

async function fetchCardsData() {
  try {
    const response = await fetch('/admin/cards');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cards data:', error);
    throw error;
  }
}

// async function updateTeamMemeber(id){
//   try{
//     const response = await fetch('');
//     const data = await response.json();
//     return data;
//   } catch (error){
//     console.error('Error Updating Team Member Data:', error);
//     throw error;
//   }
// }

function openUpdateTeamPopup(teamMember){
  document.getElementById('TeamupdatePopup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}
function closeUpdateTeamPopup() {
  document.getElementById('TeamupdatePopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function openUpdateCardPopup(teamMember){
  document.getElementById('CardupdatePopup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}
function closeUpdateCardPopup() {
  document.getElementById('CardupdatePopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function openDeleteMemberPopup(route){
  document.getElementById('MemberDeletePopup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}
function closeDeleteMemberPopup() {
  document.getElementById('MemberDeletePopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function openDeleteCardPopup(route){
  document.getElementById('CardDeletePopup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}
function closeDeleteCardPopup() {
  document.getElementById('CardDeletePopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function renderTeamData(teamData) {
    // Clear existing content in the teamDataSection
    teamDataSection.innerHTML = '';
  
    // Create and append new content based on teamData
    teamData.forEach((teamMember) => {
      const teamMemberContainer = document.createElement('div');
      teamMemberContainer.className = 'team-member';
      const newLine = document.createElement('br');

      const updateButton = document.createElement('button');
      updateButton.innerText = 'Update'
      updateButton.className = 'Updateor'
      const updateIcon = document.createElement('i');
      updateIcon.className = 'fas fa-edit update-icon';
      updateButton.appendChild(updateIcon);
      // Add event listener for update action if needed
      updateButton.addEventListener('click', () => {
        openUpdateTeamPopup(teamMember);
      });

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete'
      deleteButton.className = 'Terminator'
      const deleteIcon = document.createElement('i');
      deleteIcon.className = 'fas fa-trash-alt delete-icon';
      deleteButton.appendChild(deleteIcon);
      const route = `/admin/teams/${teamMember.id}`;
      // Add event listener for delete action if needed
      deleteButton.addEventListener('click', () => {
        openDeleteMemberPopup(route);
      });

      const teamMemberImage = document.createElement('img');
      teamMemberImage.src = `images/assets/${teamMember.photo}`;
      teamMemberImage.alt = `Team Member ${teamMember.id}`;
      teamMemberImage.className = 'team-member-image';
  
      const teamMemberName = document.createElement('h3');
      teamMemberName.textContent = teamMember.name;
  
      const teamMemberRole = document.createElement('p');
      teamMemberRole.textContent = teamMember.role;
  
      teamMemberContainer.appendChild(updateButton);
      teamMemberContainer.appendChild(deleteButton);
      teamMemberContainer.appendChild(newLine);
      teamMemberContainer.appendChild(teamMemberImage);
      teamMemberContainer.appendChild(teamMemberName);
      teamMemberContainer.appendChild(teamMemberRole);
  
      teamDataSection.appendChild(teamMemberContainer);
    });
}
  
function renderCardsData(cardsData) {
    // Clear existing content in the cardsDataSection
    cardsDataSection.innerHTML = '';
  
    // Create and append new content based on cardsData
    cardsData.forEach((card) => {
      const cardContainer = document.createElement('div');
      cardContainer.className = 'card';

      const newLine = document.createElement('br');

      const updateButton = document.createElement('button');
      updateButton.innerText = 'Update'
      updateButton.className = 'Updateor'
      const updateIcon = document.createElement('i');
      updateIcon.className = 'fas fa-edit update-icon';
      updateButton.appendChild(updateIcon);
      // Add event listener for update action if needed
      updateButton.addEventListener('click', () => {
        openUpdateCardPopup(cardsData);
      });

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete'
      deleteButton.className = 'Terminator'
      const deleteIcon = document.createElement('i');
      deleteIcon.className = 'fas fa-trash-alt delete-icon';
      deleteButton.appendChild(deleteIcon);
      // Add event listener for delete action if needed
      const route = `/admin/cards/${card.id}`
      deleteButton.addEventListener('click', () => {
        openDeleteCardPopup(route);
      });
      const cardImage = document.createElement('img');
      cardImage.src = `images/assets/${card.photo}`;
      cardImage.alt = `Card ${card.id}`;
      cardImage.className = 'card-image';
  
      const cardTitle = document.createElement('h3');
      cardTitle.textContent = card.title;
  
      const cardDescription = document.createElement('p');
      cardDescription.textContent = card.description;
  
      cardContainer.appendChild(updateButton);
      cardContainer.appendChild(deleteButton);
      cardContainer.appendChild(newLine);
      cardContainer.appendChild(cardImage);
      cardContainer.appendChild(cardTitle);
      cardContainer.appendChild(cardDescription);
  
      cardsDataSection.appendChild(cardContainer);
    });
}