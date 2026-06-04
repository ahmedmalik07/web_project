# Gully XI Premier League - Backend API

Express.js REST API for the Gully XI Cricket Tournament management system.

## Setup Instructions

### Step 1: Install Node.js
Download and install [Node.js LTS](https://nodejs.org/)

### Step 2: Install Dependencies
```bash
cd backend
npm install
```

### Step 3: Run the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Players
- **GET /players** - Get all players
  ```
  http://localhost:3000/players
  ```

- **GET /players?game=Tapeball** - Filter players by game
  ```
  http://localhost:3000/players?game=Tapeball
  ```

- **GET /players/:id** - Get specific player by ID
  ```
  http://localhost:3000/players/1
  ```

### Tournaments
- **GET /tournaments** - Get all tournaments/matches
  ```
  http://localhost:3000/tournaments
  ```

### Teams
- **GET /teams** - Get all teams
  ```
  http://localhost:3000/teams
  ```

- **GET /teams/:id** - Get specific team by ID
  ```
  http://localhost:3000/teams/1
  ```

### Health Check
- **GET /health** - Check if server is running
  ```
  http://localhost:3000/health
  ```

## Example Responses

### Players Response
```json
[
  {
    "id": 1,
    "name": "Ahmed Khan",
    "nickname": "Sixer",
    "game": "Tapeball",
    "mohalla": "Saddar Strikers",
    "rank": "Champion",
    "score": 892,
    "batting_style": "Right-handed",
    "image": "/images/players/player-1.jpg"
  }
]
```

### Tournaments Response
```json
[
  {
    "id": 1,
    "match_number": 1,
    "team_a": "Saddar Strikers",
    "team_b": "Defence Dragons",
    "venue": "Gaddafi Stadium, Lahore",
    "date": "2026-05-01",
    "time": "18:00",
    "status": "Scheduled"
  }
]
```

### Teams Response
```json
[
  {
    "id": 1,
    "name": "Saddar Strikers",
    "city": "Lahore",
    "captain": "Ahmed Khan",
    "players": ["Ahmed Khan", "Saad Malik", "Zain Aslam"],
    "wins": 5,
    "losses": 2,
    "points": 45
  }
]
```

## Connecting Frontend

Update your frontend fetch calls to use the API:

```javascript
// Before (JSON file):
// fetch('/data/players.json')

// After (API Server):
fetch('http://localhost:3000/players')
  .then(res => res.json())
  .then(data => console.log(data))
```

## File Structure
```
backend/
├── server.js           # Main Express server
├── package.json        # Dependencies
├── README.md          # This file
└── data/
    ├── players.js     # Players data
    ├── tournaments.js # Tournaments data
    └── teams.js       # Teams data
```

## Notes
- CORS is enabled to allow requests from frontend
- API runs on port 3000 by default (can be changed with PORT env variable)
- All data is stored in-memory (no database)
