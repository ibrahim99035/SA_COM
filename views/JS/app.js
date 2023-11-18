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

function renderTeamData(teamData) {
  const teamMembersContainer = document.querySelector('.team-members-container');
  teamMembersContainer.innerHTML = '';

  teamData.forEach((teamMember) => {
    const teamMemberDiv = document.createElement('div');
    teamMemberDiv.className = 'team-member';

    const teamMemberImage = document.createElement('img');
    teamMemberImage.src = `images/assets/${teamMember.photo}`;
    teamMemberImage.alt = `Team Member ${teamMember.id}`;

    const teamMemberName = document.createElement('h3');
    teamMemberName.textContent = teamMember.name;

    const teamMemberRole = document.createElement('p');
    teamMemberRole.textContent = teamMember.role;

    teamMemberDiv.appendChild(teamMemberImage);
    teamMemberDiv.appendChild(teamMemberName);
    teamMemberDiv.appendChild(teamMemberRole);

    teamMembersContainer.appendChild(teamMemberDiv);
  });
}

function renderCardsData(cardsData) {
  const cardSlider = document.querySelector('.card-slider');
  cardSlider.innerHTML = '';

  cardsData.forEach((card) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    const cardImage = document.createElement('img');
    cardImage.src = `images/assets/${card.photo}`;
    cardImage.alt = `Card ${card.id}`;

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = card.title;

    const cardDescription = document.createElement('p');
    cardDescription.textContent = card.description;

    cardDiv.appendChild(cardImage);
    cardDiv.appendChild(cardTitle);
    cardDiv.appendChild(cardDescription);

    cardSlider.appendChild(cardDiv);
  });
}

displayTeamData();
displayCardsData();