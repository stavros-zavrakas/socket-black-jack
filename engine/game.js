// The deck array contains 52 integers:
// 1-13 = 1-13 Hearts
// 14-26 = 1-13 Diamonds
// 27-39 = 1-13 Clubs
// 40-52 = 1-13 Spades

function Game(started, max_players) {
  // Convention: Empty turnsList array below, means that only the delaer is on the game. 
  this.players_size = 0;
  this.turn = false;
  this.turnsList = [];
  this.deck = Array.apply(null, Array(52)).map(function (x, i) {
    return i + 1
  });

  this.started = started || false;
  this.max_players = max_players || 1;

  this.players = {
    names: [],
    dealer: {
      name: 'dealer',
      socket: null, // It means that we need to broadcast to everybody
      cards: [],
      sum: 0
    }
  };
};

Game.prototype = {
  initPlayer: function (player_name, socket) {
    // @todo: maybe checking the indexOf players.names array?
    if (typeof this.players[player_name] !== 'undefined') {
      return false;
    }

    this.players.names.push(player_name);
    this.players[player_name] = {
      name: player_name,
      socket: socket,
      cards: [],
      sum: 0
    };

    return true;
  },
  updatePlayerCards: function (player_name, card) {
    // @todo: check if the players_name exists in the object
    this.players[player_name].cards.push(card);
  },
  getPlayers: function () {
    return this.players;
  },
  getPlayerNames: function () {
    return this.players.names;
  },
  getStarted: function () {
    return this.started;
  },
  setStarted: function (started_over) {
    this.started = started_over;
  },
  getMaxPlayers: function () {
    return this.max_players;
  },
  setMaxPlayers: function (max_players_over) {
    this.max_players = max_players_over;
  }
}

module.exports = Game;
