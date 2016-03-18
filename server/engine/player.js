function Player(username, socket, joined) {
  this.username = username || 'anonymous';
  this.socket = socket;
  this.cards = [];
  this.joined = joined || false;
};

Player.prototype = {
  giveCard: function (card) {
    this.cards.push(card);
  },
  getUsername: function (card) {
    return this.username;
  },
  setUsername: function (username) {
    this.username = username;
  },
  getJoined: function (card) {
    return this.joined;
  },
  setJoined: function (joined) {
    this.joined = joined;
  }
}

module.exports = Player;
