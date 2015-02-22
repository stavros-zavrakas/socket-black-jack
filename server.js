var path = require('path');
var express = require('express');
var Game = require('./game');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Game between 2 and 5 players
var args = {
  max_players: getRandomInt(1, 4)
};

console.log('max players: ' + args.max_players);
var black_jack = new Game(args);

io.on('connection', function (socket) {

  console.info('New guest connected (id=' + socket.id + ').');

  // Populate the game information to every guest
  var game_info = {
    started: black_jack.getStarted(),
    players: black_jack.getPlayerNames()
  };
  io.emit('guest', game_info);

  // Join request from a guest. We are checking:
  // - if the game already started.
  // - if the player name that the guest picked already exists.
  // - if is the last player and the table is full, start the game.
  // http://stackoverflow.com/questions/20337832/is-socket-io-emit-callback-appropriate
  socket.on('join_request', function (player_name, callback) {
    if (!black_jack.getStarted()) {

      var player = black_jack.initPlayer(player_name, socket);
      if (!player) {
        var error = {
          code: 100,
          message: player_name + ' already exists.'
        };

        socket.emit('custom_error', error);
      } else {
        black_jack.players_size++;
        game_info.players = black_jack.getPlayerNames();
        io.emit('join_player', player_name, game_info);

        callback(game_info);
        if (black_jack.players_size > black_jack.getMaxPlayers()) {
          black_jack.setStarted(true);
          io.emit('game_start', {start: true});

          // Start the game engine.
          var players = black_jack.getPlayers();
          for (var i in players) {
            if (players.hasOwnProperty(i) && players[i].hasOwnProperty('name')) {
              // Give two cards on every player.
              var cards = {};

              cards.pName = players[i].name;
              cards.dealerCards = 2;
              cards.c1 = getCard(black_jack.deck);
              cards.c2 = getCard(black_jack.deck);

              // Update player cards
              black_jack.updatePlayerCards(players[i].name, cards.c1);
              black_jack.updatePlayerCards(players[i].name, cards.c2);

              console.log(players[i].name);
              console.log(cards.c1, cards.c2);
              console.log('=========================');

              if (players[i].socket) {
                io.to(players[i].socket.id).emit('init_cards', cards);
              }
            }
          }

          if (!black_jack.turn) {
            // @todo: check that the first element of the players array exist.
            black_jack.turnsList = black_jack.getPlayerNames(); 
            var turnIndex = black_jack.turnsList.shift();
            black_jack.turn = players[turnIndex];
          }

          // @todo: check that socket id exists. Could be also dealers turn
          // that we do not have a socket.
          io.to(black_jack.turn.socket.id).emit('turn', 'your turn');
        }
      }
    }
  });

  socket.on('action', function (data, callback) {
    if (socket.id === black_jack.turn.socket.id) {
      if (data.action === 'get_card') {
        var card = getCard(black_jack.deck);
        black_jack.updatePlayerCards(black_jack.turn.name, card);

        var notification = {
          type: 'get_card',
          data: {
            card: card,
            pName: black_jack.turn.name,
            message: black_jack.turn.name + ' got a card'
          }
        };

        callback(notification);
        socket.broadcast.emit('notification', notification);

      } else if (data.action === 'change_turn') {
        var players = black_jack.getPlayers();

        var notification = {
          type: 'change_turn',
          data: {
            message: ''
          }
        };

        if (black_jack.turnsList.length === 0) {
          // Implement dealer's turn
          notification.data.message = 'Dealer\' s turn';
          // Notify the current player that 'stopped' successfully.
          callback(notification);
          // Notify everybody else that the turn changed.
          io.emit('notification', notification);

          // Here we start the 'game' of the dealer

          // @todo: ceate something smart of the 'game' of the dealer.
          black_jack.turn = players['dealer'];

          var card = getCard(black_jack.deck);
          black_jack.updatePlayerCards(black_jack.turn.name, card);

          notification = {
            type: 'get_card',
            data: {
              card: card,
              pName: black_jack.turn.name,
              message: black_jack.turn.name + ' got a card'
            }
          };

          io.emit('notification', notification);

          // Notify that the game ends and send the winners.

          // @todo: 
          //  - iterate over the players cards and find the sum for each
          //      and send back the winner
          //  - send back all the cards
          var winner = {
            sum: 0
          };

          var players = black_jack.getPlayers();
          for (var i in players) {
            if (players.hasOwnProperty(i) && players[i].hasOwnProperty('name') && players[i].hasOwnProperty('cards')) {
              delete players[i].socket;

              for (var x = 0; x < players[i].cards.length; x++) {
                players[i].sum = players[i].sum + players[i].cards[x].num_original;
              }

              if ((players[i].sum > winner.sum) && (players[i].sum < 22)) {
                winner = players[i];
              }
            }
          }

          var message = (winner.sum === 0) ? 'There is no winner' : 'The winner is ' + winner.name
          notification = {
            type: 'game_end',
            data: {
              players: players,
              message: message
            }
          };

          // @todo: think how to inform the players.
          // if (typeof winner.socket !== 'undefined') {
          //   io.to(black_jack.turn.socket.id).emit('turn', 'your turn');
          // }

          io.emit('notification', notification);
        } else {
          // @todo: check if this index exist in the players object.
          var turnIndex = black_jack.turnsList.shift();
          black_jack.turn = players[turnIndex];

          notification.data.message = black_jack.turn.name + ' \'s turn';
          
          // Inform specifically the player that is his turn
          io.to(black_jack.turn.socket.id).emit('turn', 'your turn');

          // Notify the current player that 'stopped' successfully.
          callback(notification);

          // Notify everybody else that the turn changed.
          io.emit('notification', notification);
        }

      }
    } else {
      callback({err: 'it is not your turn'});
    }
  });

});

function getCard(deck) {
  var cIndex = getRandomInt(0, deck.length);
  var card = {
    num: deck[cIndex]
  };
  
  deck.splice(cIndex, 1);              

  console.log('cards before and after conversion');
  console.log(card.num);
  if (card.num >= 14 && card.num < 27) {
    card.num -= 13;
    card.type = 'diams';
  } else if (card.num >= 27 && card.num < 40) {
    card.num -= 26;
    card.type = 'clubs';
  } else if (card.num >= 40 && card.num < 53) {
    card.num -= 39;
    card.type = 'spades';
  } else {
    card.type = 'hearts';
  }

  // Re-Normalize
  if (card.num === 1) {
    card.num = 'a';    
    card.num_original  = 11;    
  } else if (card.num === 11) {
    card.num = 'j';    
    card.num_original = 10
  } else if (card.num === 12) {
    card.num = 'q';    
    card.num_original = 10
  } else if (card.num === 13) {
    card.num = 'k';    
    card.num_original = 10
  } else {
    card.num_original = card.num;
  }

  console.log('Symbol/num: ' + card.num);
  console.log('Original: ' + card.num_original);
 
  return card;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

http.listen(3000, function () {
  console.log('listening on *:3000');
});