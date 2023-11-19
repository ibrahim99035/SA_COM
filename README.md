# Company Application

## File Structure:

```
/SA_COM
|-- /views
|   |-- /CSS
|   |   |-- styles.css
|   |   |-- admin.css
|   |-- /images
|   |   |--/assets
|   |   |--logo.png
|   |-- /JS
|   |   |-- app.js
|   |   |-- admin.js
|   |-- admin.html
|   |-- home.html
|-- index.js
|-- .gitignore
|-- mydatabase.db
|-- package.json
|-- package-lock.json
|-- README.md
```

## Backend Mechanism:

This code sets up a simple web server using the Express framework in Node.js, with an SQLite3 database for storing information about teams and cards. It also uses Multer for handling file uploads and Moment.js for working with timestamps.

---

### **Dependencies:**
   - `express`: Web framework for Node.js.
   - `sqlite3`: SQLite database library for Node.js.
   - `multer`: Middleware for handling file uploads.
   - `moment`: Library for working with dates and times.

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "moment": "^2.29.4",
    "multer": "^1.4.5-lts.1",
    "sqlite3": "^5.1.6"
  }
}
```

---

### **Database Setup:**
   - Defines two tables in an SQLite database (`Team` and `Cards`) using the `sqlite3` library.
   - Each table has columns for various attributes like `id`, `name`, `role`, `photo`, `title`, `description`, etc.

Using SQLite3 Database, the tables we have are `Team`, `Cards`.

#### Team Table

| Column    | Data Type     | Description     |
|-----------|---------------|-----------------|
| id        | INTEGER       | Primary Key     |
| name      | TEXT          | Team Name       |
| role      | TEXT          | Team Role       |
| photo     | TEXT          | Photo URL       |

```javascript
    const sqlite3 = require('sqlite3').verbose();
    db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Team (
        id INTEGER PRIMARY KEY,
        name TEXT,
        role TEXT,
        photo TEXT
        )
    `);
    });
```
**Columns:**
- id (INTEGER): Primary key for uniquely identifying each team entry.
- name (TEXT): Represents the name of the team.
- role (TEXT): Describes the role of the team.
- photo (TEXT): Stores the URL of the team's photo.

**Table Creation:**
The JavaScript code uses the SQLite3 library to create the `Team` table.
The `CREATE TABLE IF NOT EXISTS` statement ensures that the table is only created if it doesn't already exist.

#### Cards Table

| Column       | Data Type     | Description        |
|--------------|---------------|--------------------|
| id           | INTEGER       | Primary Key        |
| title        | TEXT          | Card Title         |
| description  | TEXT          | Card Description   |
| photo        | TEXT          | Photo URL          |

```javascript
// Create Cards table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Cards (
      id INTEGER PRIMARY KEY,
      title TEXT,
      description TEXT,
      photo TEXT
    )
  `);
});
```
**Columns:**
- id (INTEGER): Primary key for uniquely identifying each card entry.
- title (TEXT): Represents the title of the card.
- description (TEXT): Contains the description of the card.
- photo (TEXT): Stores the URL of the card's photo.

**Table Creation:**
Similar to the `Team` table, the Cards table is created using the SQLite3 library.
`The CREATE TABLE IF NOT EXISTS` statement ensures that the table is only created if it doesn't already exist.

---

### **Multer Setup:**
   - Configures Multer for handling file uploads.
   - Determines the destination folder and filename for uploaded files based on the route.

Multer is a middleware for handling `multipart/form-data`, which is commonly used for file uploads. This section documents the configuration of Multer for a specific use case, including setting up storage and defining file naming conventions.

```javascript
const multer = require('multer');
const moment = require('moment');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isTeam = req.baseUrl === '/admin/teams';
    const destinationPath = isTeam ? 'views/images/assets' : 'views/images/assets';
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    cb(null, `${timestamp}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
```

**Configuration Details:**

1. **Multer Initialization:**
   - `const multer = require('multer');`: Imports the Multer library.

2. **Storage Configuration:**
   - `const storage = multer.diskStorage({ ... });`: Configures disk storage for uploaded files.

3. **Destination Function:**
   - `destination: function (req, file, cb) { ... }`: Defines the destination folder for uploaded files.
   - Checks the route's base URL to determine whether it's related to teams (`/admin/teams`) and sets the destination path accordingly.
   - The `cb(null, destinationPath);` callback signals Multer where to store the file.

4. **Filename Function:**
   - `filename: function (req, file, cb) { ... }`: Defines the filename for uploaded files.
   - Uses the Moment.js library to generate a timestamp formatted as `YYYYMMDD_HHmmss`.
   - Concatenates the timestamp with the original filename to create a unique filename.
   - The `cb(null, filename);` callback signals Multer how to name the file.

5. **Multer Instance:**
   - `const upload = multer({ storage: storage });`: Creates a Multer instance with the configured storage.

---

### **Express Setup:**
   - Creates an Express application (`app`).
   - Serves static files from the `views` directory.
   - Parses JSON requests using `express.json()`.

```javascript
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const moment = require('moment');

const app = express();
const db = new sqlite3.Database('mydatabase.db');

app.use(express.static(__dirname + '/views'));
app.use(express.json());
```

---

### **Frontend Routes:**

#### 1. Route for the Home Page:

```javascript
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html');
});
```

- **Description:**
  - This route responds to HTTP GET requests at the root path (`'/'`).
  - When a user accesses the root path, the server sends the HTML file located at the specified path (`'/views/home.html'`).
  
- **Usage Example:**
  - Accessing the root URL would serve the `home.html` page to the client.

#### 2. Route for the Admin Page:

```javascript
app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/views/admin.html');
});
```

- **Description:**
  - This route responds to HTTP GET requests at the `/admin` path.
  - When a user accesses the `/admin` path, the server sends the HTML file located at the specified path (`'/views/admin.html'`).

- **Usage Example:**
  - Accessing the `/admin` URL would serve the `admin.html` page to the client.

---

### Team CRUD Operations Routes Documentation:

This section documents a set of Express routes responsible for performing CRUD (Create, Read, Update, Delete) operations on the `Team` table in the SQLite database. These routes handle various HTTP methods and interact with the database using SQLite queries.

#### 1. Retrieve All Teams:

```javascript
// Retrieve all teams
app.get('/admin/teams', (req, res) => {
  db.all('SELECT * FROM Team', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
```

- **Description:**
  - Handles a GET request at the `/admin/teams` endpoint.
  - Retrieves all teams from the `Team` table in the database.
  - Responds with a JSON array containing the retrieved teams.

#### 2. Create a New Team:

```javascript
// Create a new team
app.post('/admin/teams', upload.single('photo'), (req, res) => {
  const { name, role } = req.body;
  const photo = req.file.filename;

  db.run('INSERT INTO Team (name, role, photo) VALUES (?, ?, ?)', [name, role, photo], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});
```

- **Description:**
  - Handles a POST request at the `/admin/teams` endpoint.
  - Expects JSON data in the request body containing `name` and `role`.
  - Uses Multer middleware to handle the uploaded team photo.
  - Inserts a new team into the `Team` table with the provided data.
  - Responds with a JSON object containing the ID of the newly created team.

#### 3. Update Team Name:

```javascript
// Update team name
app.put('/admin/teams/name/:id', (req, res) => {
  const { name } = req.body;
  const teamId = req.params.id;
  db.run('UPDATE Team SET name = ? WHERE id = ?', [name, teamId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Team name updated successfully' });
  });
});
```

- **Description:**
  - Handles a PUT request at the `/admin/teams/name/:id` endpoint.
  - Expects JSON data in the request body containing the updated `name`.
  - Updates the `name` of the team with the specified ID in the `Team` table.
  - Responds with a JSON object containing a success message.

#### 4. Update Team Role:

```javascript
// Update team role
app.put('/admin/teams/role/:id', (req, res) => {
  const { role } = req.body;
  const teamId = req.params.id;
  db.run('UPDATE Team SET role = ? WHERE id = ?', [role, teamId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Team role updated successfully' });
  });
});
```

- **Description:**
  - Handles a PUT request at the `/admin/teams/role/:id` endpoint.
  - Expects JSON data in the request body containing the updated `role`.
  - Updates the `role` of the team with the specified ID in the `Team` table.
  - Responds with a JSON object containing a success message.

#### 5. Update Team Photo:

```javascript
// Update team photo
app.put('/admin/teams/photo/:id', upload.single('photo'), (req, res) => {
  const { photo } = req.file;
  const teamId = req.params.id;
  db.run('UPDATE Team SET photo = ? WHERE id = ?', [photo, teamId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Team photo updated successfully' });
  });
});
```

- **Description:**
  - Handles a PUT request at the `/admin/teams/photo/:id` endpoint.
  - Uses Multer middleware to handle the uploaded team photo.
  - Updates the `photo` of the team with the specified ID in the `Team` table.
  - Responds with a JSON object containing a success message.

#### 6. Delete a Team:

```javascript
// Delete a team
app.delete('/admin/teams/:id', (req, res) => {
  const teamId = req.params.id;
  db.run('DELETE FROM Team WHERE id = ?', [teamId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Team deleted successfully' });
  });
});
```

- **Description:**
  - Handles a DELETE request at the `/admin/teams/:id` endpoint.
  - Deletes the team with the specified ID from the `Team` table.
  - Responds with a JSON object containing a success message.

---

### Cards CRUD Operations Routes Documentation:

This section documents a set of Express routes responsible for performing CRUD (Create, Read, Update, Delete) operations on the `Cards` table in the SQLite database. These routes handle various HTTP methods and interact with the database using SQLite queries.

#### 1. Retrieve All Cards:

```javascript
// Retrieve all cards
app.get('/admin/cards', (req, res)) => {
  db.all('SELECT * FROM Cards', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
}
```

- **Description:**
  - Handles a GET request at the `/admin/cards` endpoint.
  - Retrieves all cards from the `Cards` table in the database.
  - Responds with a JSON array containing the retrieved cards.

#### 2. Create a New Card:

```javascript
// Create a new card
app.post('/admin/cards', upload.single('photo'), (req, res) => {
  const { title, description } = req.body;
  const photo = req.file.filename;

  db.run('INSERT INTO Cards (title, description, photo) VALUES (?, ?, ?)', [title, description, photo], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});
```

- **Description:**
  - Handles a POST request at the `/admin/cards` endpoint.
  - Expects JSON data in the request body containing `title` and `description`.
  - Uses Multer middleware to handle the uploaded card photo.
  - Inserts a new card into the `Cards` table with the provided data.
  - Responds with a JSON object containing the ID of the newly created card.

#### 3. Update Card Title:

```javascript
// Update card title
app.put('/admin/cards/title/:id', (req, res) => {
  const { title } = req.body;
  const cardId = req.params.id;
  db.run('UPDATE Cards SET title = ? WHERE id = ?', [title, cardId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Card title updated successfully' });
  });
});
```

- **Description:**
  - Handles a PUT request at the `/admin/cards/title/:id` endpoint.
  - Expects JSON data in the request body containing the updated `title`.
  - Updates the `title` of the card with the specified ID in the `Cards` table.
  - Responds with a JSON object containing a success message.

#### 4. Update Card Description:

```javascript
// Update card description
app.put('/admin/cards/description/:id', (req, res) => {
  const { description } = req.body;
  const cardId = req.params.id;
  db.run('UPDATE Cards SET description = ? WHERE id = ?', [description, cardId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Card description updated successfully' });
  });
});
```

- **Description:**
  - Handles a PUT request at the `/admin/cards/description/:id` endpoint.
  - Expects JSON data in the request body containing the updated `description`.
  - Updates the `description` of the card with the specified ID in the `Cards` table.
  - Responds with a JSON object containing a success message.

#### 5. Update Card Photo:

```javascript
// Update card photo
app.put('/admin/cards/photo/:id', upload.single('photo'), (req, res) => {
  const { photo } = req.file;
  const cardId = req.params.id;
  db.run('UPDATE Cards SET photo = ? WHERE id = ?', [photo, cardId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Card photo updated successfully' });
  });
});
```

- **Description:**
  - Handles a PUT request at the `/admin/cards/photo/:id` endpoint.
  - Uses Multer middleware to handle the uploaded card photo.
  - Updates the `photo` of the card with the specified ID in the `Cards` table.
  - Responds with a JSON object containing a success message.

#### 6. Delete a Card:

```javascript
// Delete a card
app.delete('/admin/cards/:id', (req, res) => {
  const cardId = req.params.id;
  db.run('DELETE FROM Cards WHERE id = ?', [cardId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Card deleted successfully' });
  });
});
```

- **Description:**
  - Handles a DELETE request at the `/admin/cards/:id` endpoint.
  - Deletes the card with the specified ID from the `Cards` table.
  - Responds with a JSON object containing a success message.

#### 7. Retrieve All Data from Both Team and Cards Tables:

```javascript
// Retrieve all data from both Team and Cards tables
app.get('/admin/allData', (req, res) => {
  // Retrieve data from Team table
  const teamsQuery = 'SELECT * FROM Team';
  db.all(teamsQuery, (err, teams) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Retrieve data from Cards table
    const cardsQuery = 'SELECT * FROM Cards';
    db.all(cardsQuery, (err, cards) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Combine and send the data
      const allData = {
        teams: teams,
        cards: cards,
      };

      res.json(allData);
    });
  });
});
```

- **Description:**
  - Handles a GET request at the `/admin/allData` endpoint.
  - Retrieves all data from both the `Team` and `Cards` tables.
  - Responds with a JSON object containing arrays of team and card data.

---
## Frontend Mechanism:

### Home Page Functionality Documentation:

This section documents a set of JavaScript functions responsible for displaying team and cards data on a web page. These functions use asynchronous requests to fetch data from the server and dynamically render the information in designated HTML elements.

#### 1. Display Team Data Function:

```javascript
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
```

- **Description:**
  - Asynchronously fetches team data from the server using the `fetchTeamData` function.
  - Calls the `renderTeamData` function to dynamically display the team data on the web page.
  - Logs an error message if there's an issue fetching or rendering the team data.

#### 2. Display Cards Data Function:

```javascript
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
```

- **Description:**
  - Asynchronously fetches cards data from the server using the `fetchCardsData` function.
  - Calls the `renderCardsData` function to dynamically display the cards data on the web page.
  - Logs an error message if there's an issue fetching or rendering the cards data.

#### 3. Fetch Team Data Function:

```javascript
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
```

- **Description:**
  - Asynchronously fetches team data from the server by making a GET request to `/admin/teams`.
  - Parses the JSON response and returns the data.
  - Logs an error message and throws an error if there's an issue with the fetch operation.

#### 4. Fetch Cards Data Function:

```javascript
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
```

- **Description:**
  - Asynchronously fetches cards data from the server by making a GET request to `/admin/cards`.
  - Parses the JSON response and returns the data.
  - Logs an error message and throws an error if there's an issue with the fetch operation.

#### 5. Render Team Data Function:

```javascript
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

    teamMembersContainer.appendChild(teamMemberDiv)
  });
}
```

- **Description:**
  - Dynamically renders team data on the web page.
  - Clears the existing content of the `.team-members-container` element.
  - Iterates over each team member in the provided data and creates HTML elements for display.

- **DOM Manipulation:**
    The `renderTeamData` function is responsible for rendering team member data on a web page within a container. Similar to the `renderCardsData` function, it dynamically creates HTML elements for each team member in the `teamData` array, configures their properties, and appends them to the DOM. Below is an explanation of the function:

    1. **Select the Team Members Container Element:**
    ```javascript
    const teamMembersContainer = document.querySelector('.team-members-container');
    ```
    - Retrieves the DOM element with the class 'team-members-container' using `document.querySelector`. This element likely represents a container for displaying team members.

    2. **Clear Existing Content in the Team Members Container:**
    ```javascript
    teamMembersContainer.innerHTML = '';
    ```
    - Clears the existing content inside the `teamMembersContainer` element. This ensures that the team members container is empty before rendering new team member data.

    3. **Iterate Over Each Team Member in `teamData`:**
    ```javascript
    teamData.forEach((teamMember) => { /* ... */ });
    ```
    - The function iterates over each `teamMember` in the `teamData` array.

    4. **Create Team Member Container (`teamMemberDiv`):**
    ```javascript
    const teamMemberDiv = document.createElement('div');
    teamMemberDiv.className = 'team-member';
    ```
    - Creates a `div` element to serve as the container for each team member.
    - Assigns the class name 'team-member' to the created `div` for styling purposes.

    5. **Create Team Member Image (`teamMemberImage`):**
    ```javascript
    const teamMemberImage = document.createElement('img');
    teamMemberImage.src = `images/assets/${teamMember.photo}`;
    teamMemberImage.alt = `Team Member ${teamMember.id}`;
    ```
    - Creates an `img` (image) element for displaying the team member's image.
    - Sets the `src` attribute to the path of the team member's image using the `teamMember.photo` property.
    - Sets the `alt` attribute to provide alternative text for accessibility.

    6. **Create Team Member Name (`teamMemberName`):**
    ```javascript
    const teamMemberName = document.createElement('h3');
    teamMemberName.textContent = teamMember.name;
    ```
    - Creates an `h3` (heading level 3) element for displaying the team member's name.
    - Sets the text content of the heading to the `teamMember.name` property.

    7. **Create Team Member Role (`teamMemberRole`):**
    ```javascript
    const teamMemberRole = document.createElement('p');
    teamMemberRole.textContent = teamMember.role;
    ```
    - Creates a `p` (paragraph) element for displaying the team member's role.
    - Sets the text content of the paragraph to the `teamMember.role` property.

    8. **Append Elements to Team Member Container:**
    ```javascript
    teamMemberDiv.appendChild(teamMemberImage);
    teamMemberDiv.appendChild(teamMemberName);
    teamMemberDiv.appendChild(teamMemberRole);
    ```
    - Appends the created elements (team member image, name, and role) to the `teamMemberDiv`.

    9. **Append Team Member Container to Team Members Container:**
    ```javascript
    teamMembersContainer.appendChild(teamMemberDiv);
    ```
    - Appends the `teamMemberDiv` to the `teamMembersContainer`, effectively adding the entire team member representation to the team members container.

#### 6. Render Cards Data Function:

```javascript
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
```

- **Description:**
  - Dynamically renders cards data on the web page.
  - Clears the existing content of the `.card-slider` element.
  - Iterates over each card in the provided data and creates HTML elements for display.

- **DOM Manipulation:**
    The `renderCardsData` function manipulates the DOM (Document Object Model) by dynamically creating and appending HTML elements to display card data within a card slider on a web page. Here's a breakdown of the DOM manipulation in this function:

    1. **Select the Card Slider Element (`cardSlider`):**
    ```javascript
    const cardSlider = document.querySelector('.card-slider');
    ```
    - Retrieves the DOM element with the class 'card-slider' using `document.querySelector`. This element likely represents a container for the card slider.

    2. **Clear Existing Content in the Card Slider:**
    ```javascript
    cardSlider.innerHTML = '';
    ```
    - Clears the existing content inside the `cardSlider` element. This ensures that the card slider is empty before rendering new card data.

    3. **Create and Append New Content Based on `cardsData`:**
    ```javascript
    cardsData.forEach((card) => {
        // ... (code for creating card elements)
    });
    ```
    - The function iterates over each `card` in the `cardsData` array.

    4. **Create Card Container (`cardDiv`):**
    ```javascript
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    ```
    - Creates a `div` element to serve as the container for each card.
    - Assigns the class name 'card' to the created `div` for styling purposes.

    5. **Create Card Image (`cardImage`):**
    ```javascript
    const cardImage = document.createElement('img');
    cardImage.src = `images/assets/${card.photo}`;
    cardImage.alt = `Card ${card.id}`;
    ```
    - Creates an `img` (image) element for displaying the card image.
    - Sets the `src` attribute to the path of the card image using the `card.photo` property.
    - Sets the `alt` attribute to provide alternative text for accessibility.

    6. **Create Card Title (`cardTitle`):**
    ```javascript
    const cardTitle = document.createElement('h3');
    cardTitle.textContent = card.title;
    ```
    - Creates an `h3` (heading level 3) element for displaying the card title.
    - Sets the text content of the heading to the `card.title` property.

    7. **Create Card Description (`cardDescription`):**
    ```javascript
    const cardDescription = document.createElement('p');
    cardDescription.textContent = card.description;
    ```
    - Creates a `p` (paragraph) element for displaying the card description.
    - Sets the text content of the paragraph to the `card.description` property.

    8. **Append Elements to Card Container:**
    ```javascript
    cardDiv.appendChild(cardImage);
    cardDiv.appendChild(cardTitle);
    cardDiv.appendChild(cardDescription);
    ```
    - Appends the created elements (card image, card title, and card description) to the `cardDiv`.

    9. **Append Card Container to Card Slider:**
    ```javascript
    cardSlider.appendChild(cardDiv);
    ```
    - Appends the `cardDiv` to the `cardSlider`, effectively adding the entire card representation to the card slider.

---

### Admin Page Functionality Documentation:

This section documents a set of JavaScript functions and event listeners responsible for managing the admin page's functionality. These functions handle the creation of teams and cards, as well as the display and rendering of team and cards data on the admin page.

#### 1. Event Listeners and Initialization:

```javascript
const teamDataSection = document.getElementById('teamDataSection');
const cardsDataSection = document.getElementById('cardsDataSection');
document.addEventListener('DOMContentLoaded', () => {
    const teamForm = document.getElementById('teamForm');
    const cardsForm = document.getElementById('cardsForm');
  
    // Team Form Submission
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

    // Cards Form Submission
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
```

- **Description:**
  - Initializes the admin page by setting up event listeners for team and cards form submissions.
  - Calls functions to fetch and display initial team and cards data when the page loads.

#### 2. Create Team Function:

```javascript
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
```

- **Description:**
  - Asynchronously sends a POST request to create a new team with the provided name, role, and photo.
  - Uses FormData to handle file uploads.
  - Returns the data (including the new team's ID) received from the server.

#### 3. Create Card Function:

```javascript  
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
```

- **Description:**
  - Asynchronously sends a POST request to create a new card with the provided title, description, and photo.
  - Uses FormData to handle file uploads.
  - Returns the data (including the new card's ID) received from the server.

#### 4. Display Team Data Function:

```javascript
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
```

- **Description:**
  - Asynchronously fetches team data from the server using the `fetchTeamData` function.
  - Calls the `renderTeamData` function to dynamically display the team data on the admin page.
  - Logs an error message if there's an issue fetching or rendering the team data.

#### 5. Display Cards Data Function:

```javascript
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
```

- **Description:**
  - Asynchronously fetches cards data from the server using the `fetchCardsData` function.
  - Calls the `renderCardsData` function to dynamically display the cards data on the admin page.
  - Logs an error message if there's an issue fetching or rendering the cards data.

#### 6. Fetch Team Data Function:

```javascript
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
```

- **Description:**
  - Asynchronously sends a GET request to fetch team data from the server (`/admin/teams`).
  - Parses the JSON response and returns the data.
  - Logs an error message and throws an error if there's an issue with the fetch operation.

#### 7. Fetch Cards Data Function:

```javascript
async function fetchCardsData() {
    try {
        const response = await fetch

('/admin/cards');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cards data:', error);
        throw error;
    }
}
```

- **Description:**
  - Asynchronously sends a GET request to fetch cards data from the server (`/admin/cards`).
  - Parses the JSON response and returns the data.
  - Logs an error message and throws an error if there's an issue with the fetch operation.

#### 8. Render Team Data Function:

```javascript
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

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete'
      deleteButton.className = 'Terminator'
      const deleteIcon = document.createElement('i');
      deleteIcon.className = 'fas fa-trash-alt delete-icon';
      deleteButton.appendChild(deleteIcon);
      // Add event listener for delete action if needed
  
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
```

- **Description:**
  - Dynamically renders team data on the admin page.
  - Clears the existing content of the `teamDataSection` element.
  - Iterates over each team member in the provided data and creates HTML elements for display.

- **DOM Manipulation:**
    The `renderTeamData` function manipulates the DOM (Document Object Model) by dynamically creating and appending HTML elements to display team member data on a web page. Here's a breakdown of the DOM manipulation in this function:

    1. **Clear Existing Content:**
    ```javascript
    teamDataSection.innerHTML = '';
    ```
    - This line clears the existing content inside the `teamDataSection` element. This ensures that the section is empty before rendering new team member data.

    2. **Create and Append New Content Based on `teamData`:**
    ```javascript
    teamData.forEach((teamMember) => {
        // ... (code for creating team member elements)
    });
    ```
    - The function iterates over each `teamMember` in the `teamData` array.

    3. **Create Team Member Container (`teamMemberContainer`):**
    ```javascript
    const teamMemberContainer = document.createElement('div');
    teamMemberContainer.className = 'team-member';
    ```
    - Creates a `div` element to serve as the container for each team member.
    - Assigns the class name 'team-member' to the created `div` for styling purposes.

    4. **Create Line Break (`newLine`):**
    ```javascript
    const newLine = document.createElement('br');
    ```
    - Creates a `br` (line break) element to add some spacing between the update/delete buttons and the team member image.

    5. **Create Update Button (`updateButton`):**
    ```javascript
    const updateButton = document.createElement('button');
    updateButton.innerText = 'Update';
    updateButton.className = 'Updateor';
    const updateIcon = document.createElement('i');
    updateIcon.className = 'fas fa-edit update-icon';
    updateButton.appendChild(updateIcon);
    // Add event listener for update action if needed
    ```
    - Creates a button labeled 'Update' with the class 'Updateor' for styling.
    - Appends a Font Awesome edit icon (`fas fa-edit`) to the button for a visual representation of the update action.
    - Event listener for the update action can be added if needed, but it's currently commented out.

    6. **Create Delete Button (`deleteButton`):**
    ```javascript
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'Terminator';
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash-alt delete-icon';
    deleteButton.appendChild(deleteIcon);
    // Add event listener for delete action if needed
    ```
    - Creates a button labeled 'Delete' with the class 'Terminator' for styling.
    - Appends a Font Awesome trash icon (`fas fa-trash-alt`) to the button for a visual representation of the delete action.
    - Event listener for the delete action can be added if needed, but it's currently commented out.

    7. **Create Team Member Image (`teamMemberImage`):**
    ```javascript
    const teamMemberImage = document.createElement('img');
    teamMemberImage.src = `images/assets/${teamMember.photo}`;
    teamMemberImage.alt = `Team Member ${teamMember.id}`;
    teamMemberImage.className = 'team-member-image';
    ```
    - Creates an `img` (image) element for displaying the team member image.
    - Sets the `src` attribute to the path of the team member image using the `teamMember.photo` property.
    - Sets the `alt` attribute to provide alternative text for accessibility.
    - Assigns the class 'team-member-image' for styling.

    8. **Create Team Member Name (`teamMemberName`):**
    ```javascript
    const teamMemberName = document.createElement('h3');
    teamMemberName.textContent = teamMember.name;
    ```
    - Creates an `h3` (heading level 3) element for displaying the team member's name.
    - Sets the text content of the heading to the `teamMember.name` property.

    9. **Create Team Member Role (`teamMemberRole`):**
    ```javascript
    const teamMemberRole = document.createElement('p');
    teamMemberRole.textContent = teamMember.role;
    ```
    - Creates a `p` (paragraph) element for displaying the team member's role.
    - Sets the text content of the paragraph to the `teamMember.role` property.

    10. **Append Elements to Team Member Container:**
        ```javascript
        teamMemberContainer.appendChild(updateButton);
        teamMemberContainer.appendChild(deleteButton);
        teamMemberContainer.appendChild(newLine);
        teamMemberContainer.appendChild(teamMemberImage);
        teamMemberContainer.appendChild(teamMemberName);
        teamMemberContainer.appendChild(teamMemberRole);
        ```
        - Appends the created elements (update button, delete button, line break, team member image, team member name, and team member role) to the `teamMemberContainer`.

    11. **Append Team Member Container to `teamDataSection`:**
        ```javascript
        teamDataSection.appendChild(teamMemberContainer);
        ```
        - Appends the `teamMemberContainer` to the `teamDataSection`, effectively adding the entire team member representation to the section.

#### 9. Render Cards Data Function:

```javascript  
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

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete'
      deleteButton.className = 'Terminator'
      const deleteIcon = document.createElement('i');
      deleteIcon.className = 'fas fa-trash-alt delete-icon';
      deleteButton.appendChild(deleteIcon);
      // Add event listener for delete action if needed
  
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
```

- **Description:**
  - Dynamically renders cards data on the admin page.
  - Clears the existing content of the `cardsDataSection` element.
  - Iterates over each card in the provided data and creates HTML elements for display.

- **DOM Manipulation:**
    The `renderCardsData` function manipulates the DOM (Document Object Model) by dynamically creating and appending HTML elements to display card data on a web page. Here's a breakdown of the DOM manipulation in this function:

    1. **Clear Existing Content:**
    ```javascript
    cardsDataSection.innerHTML = '';
    ```
    - This line clears the existing content inside the `cardsDataSection` element. This ensures that the section is empty before rendering new card data.

    2. **Create and Append New Content Based on `cardsData`:**
    ```javascript
    cardsData.forEach((card) => {
        // ... (code for creating card elements)
    });
    ```
    - The function iterates over each `card` in the `cardsData` array.

    3. **Create Card Container (`cardContainer`):**
    ```javascript
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card';
    ```
    - Creates a `div` element to serve as the container for each card.
    - Assigns the class name 'card' to the created `div` for styling purposes.

    4. **Create Line Break (`newLine`):**
    ```javascript
    const newLine = document.createElement('br');
    ```
    - Creates a `br` (line break) element to add some spacing between the update/delete buttons and the card image.

    5. **Create Update Button (`updateButton`):**
    ```javascript
    const updateButton = document.createElement('button');
    updateButton.innerText = 'Update';
    updateButton.className = 'Updateor';
    const updateIcon = document.createElement('i');
    updateIcon.className = 'fas fa-edit update-icon';
    updateButton.appendChild(updateIcon);
    // Add event listener for update action if needed
    ```
    - Creates a button labeled 'Update' with the class 'Updateor' for styling.
    - Appends a Font Awesome edit icon (`fas fa-edit`) to the button for a visual representation of the update action.
    - Event listener for the update action can be added if needed, but it's currently commented out.

    6. **Create Delete Button (`deleteButton`):**
    ```javascript
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'Terminator';
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash-alt delete-icon';
    deleteButton.appendChild(deleteIcon);
    // Add event listener for delete action if needed
    ```
    - Creates a button labeled 'Delete' with the class 'Terminator' for styling.
    - Appends a Font Awesome trash icon (`fas fa-trash-alt`) to the button for a visual representation of the delete action.
    - Event listener for the delete action can be added if needed, but it's currently commented out.

    7. **Create Card Image (`cardImage`):**
    ```javascript
    const cardImage = document.createElement('img');
    cardImage.src = `images/assets/${card.photo}`;
    cardImage.alt = `Card ${card.id}`;
    cardImage.className = 'card-image';
    ```
    - Creates an `img` (image) element for displaying the card image.
    - Sets the `src` attribute to the path of the card image using the `card.photo` property.
    - Sets the `alt` attribute to provide alternative text for accessibility.
    - Assigns the class 'card-image' for styling.

    8. **Create Card Title (`cardTitle`):**
    ```javascript
    const cardTitle = document.createElement('h3');
    cardTitle.textContent = card.title;
    ```
    - Creates an `h3` (heading level 3) element for displaying the card title.
    - Sets the text content of the heading to the `card.title` property.

    9. **Create Card Description (`cardDescription`):**
    ```javascript
    const cardDescription = document.createElement('p');
    cardDescription.textContent = card.description;
    ```
    - Creates a `p` (paragraph) element for displaying the card description.
    - Sets the text content of the paragraph to the `card.description` property.

    10. **Append Elements to Card Container:**
        ```javascript
        cardContainer.appendChild(updateButton);
        cardContainer.appendChild(deleteButton);
        cardContainer.appendChild(newLine);
        cardContainer.appendChild(cardImage);
        cardContainer.appendChild(cardTitle);
        cardContainer.appendChild(cardDescription);
        ```
        - Appends the created elements (update button, delete button, line break, card image, card title, and card description) to the `cardContainer`.

    11. **Append Card Container to `cardsDataSection`:**
        ```javascript
        cardsDataSection.appendChild(cardContainer);
        ```
        - Appends the `cardContainer` to the `cardsDataSection`, effectively adding the entire card representation to the section.

---