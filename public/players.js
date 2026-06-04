// Fetch API to load players from JSON file
fetch('./data/players.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(players) {
    displayPlayers(players);
  })
  .catch(function(error) {
    console.error('Error loading players:', error);
  });

// Function to display players in the DOM
function displayPlayers(players) {
  let container = document.getElementById('playersContainer');
  
  for (let i = 0; i < players.length; i++) {
    let card = document.createElement('div');
    card.className = 'playerCard';
    
    card.innerHTML = 
      '<div class="playerImage" style="background-image: url(' + players[i].image + ')"></div>' +
      '<h3>' + players[i].nickname + ' (' + players[i].name + ')</h3>' +
      '<p><strong>Game:</strong> ' + players[i].game + '</p>' +
      '<p><strong>Rank:</strong> ' + players[i].rank + '</p>' +
      '<p><strong>Score:</strong> ' + players[i].score + '</p>' +
      '<p><strong>Mohalla:</strong> ' + players[i].mohalla + '</p>' +
      '<p><strong>Batting:</strong> ' + players[i].batting_style + '</p>';
    
    container.appendChild(card);
  }
}
