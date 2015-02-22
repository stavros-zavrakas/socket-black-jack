// The deck array contains 52 integers:
// 1-13 = 1-13 Hearts
// 14-26 = 1-13 Diamonds
// 27-39 = 1-13 Clubs
// 40-52 = 1-13 Spades

function Game (values) {
  if (values === null || typeof values === 'undefined') {
    values = {};
  }

  // Convention: Empty turnsList array below, means that only the delaer is on the game. 
  this.players_size = 0;
  this.turn = false;
  this.turnsList = [];
  this.deck = Array.apply(null, Array(52)).map(function (x, i) { 
    return i+1 
  });

  var started = values.started || false;
  var max_players = values.max_players || 1;
  
  var players = {
    names: [],
    dealer: {
      name: 'dealer',
      socket: null, // It means that we need to broadcast to everybody
      cards: [],
      sum: 0
    }
  };

  this.initPlayer = function (player_name, socket) {
    // @todo: maybe checking the indexOf players.names array?
    if (typeof players[player_name] !== 'undefined') {
      return false;
    }
    
    players.names.push(player_name);
    players[player_name] = {
      name: player_name,
      socket: socket,
      cards: [],
      sum: 0
    };

    return true;
  };

  this.updatePlayerCards = function (player_name, card) {
    // @todo: check if the players_name exists in the object
    players[player_name].cards.push(card);
  };

  this.getPlayers = function () {
    return players;
  };

  this.getPlayerNames = function () {
    return players.names;
  };

  this.getStarted = function() {
    return started;
  };

  this.setStarted = function(started_over) {
    started = started_over;
  };

  this.getMaxPlayers = function() {
    return max_players;
  };

  this.setMaxPlayers = function(max_players_over) {
    max_players = max_players_over;
  };
};

module.exports = Game;