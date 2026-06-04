# Gully XI Premier League - Full Stack Setup Guide

## Lab Task 11: Build a Game Players API & Connect It to Website

This document covers the complete setup of the backend API server and its integration with the frontend Gully XI website.

---

## Part 1: Backend Setup

### Step 1: Install Node.js
1. Download [Node.js LTS](https://nodejs.org/)
2. Install the recommended version
3. Verify installation: `node --version` and `npm --version`

### Step 2: Navigate to Backend Folder
```bash
cd backend
```

### Step 3: Install Express and Dependencies
```bash
npm install
```

This installs:
- **express** - Web framework for API
- **cors** - Allow frontend requests from different origin

### Step 4: Verify Server Code
The `server.js` file contains:
- Express app initialization
- CORS middleware for cross-origin requests
- Data imports from `/data` folder
- API route definitions

### Step 5: Run the Server
```bash
npm start
```

You should see:
```
✅ Server running on http://localhost:3000
📊 Players API: http://localhost:3000/players
🏆 Tournaments API: http://localhost:3000/tournaments
👥 Teams API: http://localhost:3000/teams
🎮 Filter by game: http://localhost:3000/players?game=Tapeball
```

---

## Part 2: Test API Endpoints

### Step 6: Test in Browser

Open each URL in your browser:

1. **All Players**
   ```
   http://localhost:3000/players
   ```

2. **Filter Players by Game**
   ```
   http://localhost:3000/players?game=Tapeball
   ```

3. **Get Specific Player**
   ```
   http://localhost:3000/players/1
   ```

4. **All Tournaments**
   ```
   http://localhost:3000/tournaments
   ```

5. **All Teams**
   ```
   http://localhost:3000/teams
   ```

6. **Health Check**
   ```
   http://localhost:3000/health
   ```

---

## Part 3: Frontend Integration

### Step 7: Configure Frontend API URL

The frontend is already configured to use the API server. The configuration is in:
- **File**: `.env.local`
- **Variable**: `NEXT_PUBLIC_API_URL`
- **Default**: `http://localhost:3000`

### Step 8: How Frontend Fetches Data

**Before (JSON file):**
```javascript
fetch('/data/players.json')
  .then(res => res.json())
  .then(data => console.log(data))
```

**After (API Server):**
```javascript
fetch('http://localhost:3000/players')
  .then(res => res.json())
  .then(data => console.log(data))
```

### Step 9: Updated React Hooks

The frontend uses these hooks to fetch from the API server:

1. **usePlayersData** (`lib/use-players-data.ts`)
   - Fetches all players from `GET /players`
   - Supports filtering by game with `?game=Tapeball`
   - Returns: `{ players, loading, error }`

2. **useTournamentsData** (`lib/use-tournaments-data.ts`)
   - Fetches all tournaments from `GET /tournaments`
   - Returns: `{ tournaments, loading, error }`

3. **useTeamsData** (`lib/use-teams-data.ts`)
   - Fetches all teams from `GET /teams`
   - Returns: `{ teams, loading, error }`

---

## Part 4: Running Everything Together

### Terminal 1: Backend Server
```bash
cd backend
npm start
```

### Terminal 2: Frontend Development Server
```bash
npm run dev
```

This starts the Next.js development server on `http://localhost:3000` for Next.js, which connects to your API backend.

**Note**: The frontend actually runs on a different port (usually 3001 for Next.js), but the API backend stays on 3000.

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/players` | Get all players |
| GET | `/players?game=Tapeball` | Filter players by game |
| GET | `/players/:id` | Get single player |
| GET | `/tournaments` | Get all tournaments |
| GET | `/teams` | Get all teams |
| GET | `/teams/:id` | Get single team |
| GET | `/health` | Health check |

---

## Data Structure Examples

### Player Object
```json
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
```

### Tournament Object
```json
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
```

### Team Object
```json
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
```

---

## Troubleshooting

### Issue: Cannot GET /
**Solution**: This is normal. The API has no root route. Use specific endpoints like `/players`, `/tournaments`, etc.

### Issue: CORS Error
**Solution**: Make sure the backend server is running. The `cors` package in `server.js` handles cross-origin requests.

### Issue: API returns 404
**Solution**: Check the endpoint URL spelling and make sure the server is running on port 3000.

### Issue: Port 3000 already in use
**Solution**: Either close the other application or change the PORT:
```bash
PORT=3001 npm start
```

---

## File Structure

```
project/
├── backend/
│   ├── server.js          # Main Express server
│   ├── package.json       # Dependencies
│   ├── README.md         # Backend documentation
│   └── data/
│       ├── players.js    # Players data
│       ├── tournaments.js# Tournaments data
│       └── teams.js      # Teams data
├── lib/
│   ├── use-players-data.ts
│   ├── use-tournaments-data.ts
│   └── use-teams-data.ts
├── .env.local            # API URL configuration
└── app/
    ├── players/page.tsx
    ├── schedule/page.tsx
    └── ...
```

---

## Summary

✅ Backend API created with Express.js  
✅ Three main endpoints: Players, Tournaments, Teams  
✅ Filtering support (e.g., filter by game)  
✅ Frontend connected to API server  
✅ Environment configuration for different environments  
✅ Error handling and loading states  

The Gully XI Premier League website now has a complete backend infrastructure!
