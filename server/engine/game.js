function Game(gameStarted, maxPlayers) {
  this.turn = null;

  this.gameStarted = gameStarted || false;
  this.minPlayers = 2; // Dealer and at least one player
  this.maxPlayers = maxPlayers && maxPlayers > 1 ? maxPlayers : 2;

  this.guests = {};
  this.players = {};
};

Game.prototype = {
  // @todo: how should we handle that this username already joined as guest?
  guestJoin: function (player) {
    var username = player.getUsername();

    if (this.guests[username]) {
      return;
    }

    this.guests[username] = player;
  },
  playerJoin: function (player) {
    var username = player.getUsername();

    if (this.players[username]) {
      return;
    }

    this.players[username] = player;
  },
  isGuestJoined: function (username) {
    return !!this.guests[username];
  },
  isPlayerJoined: function (username) {
    return !!this.players[username];
  },
  getPlayers: function () {
    return this.players;
  },
  getGameStarted: function () {
    return this.gameStarted;
  },
  setGameStarted: function (started) {
    this.gameStarted = started;
  },
  getMaxPlayers: function () {
    return this.maxPlayers;
  },
  setMaxPlayers: function (maxPlayers) {
    this.maxPlayers = maxPlayers;
  }
}

module.exports = Game;
