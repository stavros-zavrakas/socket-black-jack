var socket = io.connect();
var game;

$('#notifications form').submit(function (e) {
  e.preventDefault();

  socket.emit('join_request', $('#username').val(), function (game_info) {
    $('#notifications form').slideUp(200);
    $('#notifications ul').append('You joined the game.');

    $('#username').val('');
  });
});

$('.player_actions a').click(function (e) {
  e.preventDefault();

  var request = {
    action: $(this).data('action')
  };

  socket.emit('action', request, function (response) {
    if (response.type === 'get_card') {
      $('.' + response.data.pName).find('.hand').append(create_card(response.data.card));
    } else if (response.type === 'change_turn') {
      $('.player_actions').addClass('hide'); 
    }
  });
});

socket.on('guest', function (game_info) {
  game = game_info;
  print_players_space(game.players);

  if (game.started) {
    $('#notifications form').hide();
    $('#notifications ul').append($('<li>').text('The game already started. Stay with us to watch!'));
  }
});

socket.on('join_player', function (player_name, game_info) {
  game = game_info;

  $('#notifications ul').append($('<li>').text(player_name + ' joined the game.'));
  print_players_space(game.players);
});

socket.on('game_start', function (message) {
  $('#notifications form').hide();
  
  $('#notifications ul').append($('<li>').text('Game just started.'));
  $('#notifications ul').append($('<li>').text('Dealer is shuffling the cards.'));
});

socket.on('init_cards', function (message) {
  $('.' + message.pName).find('.hand').append(create_card(message.c1));
  $('.' + message.pName).find('.hand').append(create_card(message.c2));

  $('.dealer').find('.hand').append(create_card({}));
  $('.dealer').find('.hand').append(create_card({}));
  
  $('.player:not(.' + message.pName + ')').find('.hand').append(create_card({}));
  $('.player:not(.' + message.pName + ')').find('.hand').append(create_card({}));
});

socket.on('turn', function (message) {
  $('#notifications ul').append($('<li>').text(message));
  $('.player_actions').removeClass('hide');  
});

socket.on('notification', function (notification) {
  if (notification.type === 'get_card') {
    $('#notifications ul').append($('<li>').text(notification.data.message));
    $('.' + notification.data.pName).find('.hand').append(create_card({}));
  } else if (notification.type === 'change_turn') {
    $('#notifications ul').append($('<li>').text(notification.data.message));
  } else if (notification.type === 'game_end') {
    console.log(notification);
    $('#notifications ul').append($('<li>').text(notification.data.message));

    // @todo: iterate over the players and reveal the cards.
    redraw_players_space(notification.data.players);
  }
});

socket.on('custom_error', function (error) {
  if (error.code === 100) {
    $('#notifications ul').append($('<li>').text(error.message));
    $('#notifications form').slideDown();
  }
});


function print_players_space (players) {
  for (var player of players) {
    if (!$('.' + player).length) {
      $('.players').append('<div class="player ' + player + ' left"><div class="name">' + player + '</div><div class="deck"><ul class="hand"></ul></div></div>');
    }
  }
}

function redraw_players_space (players) {
  console.log(players);
  for (var i in players) {
    if(players.hasOwnProperty(i) && players[i].hasOwnProperty('name')) {
      $('.' + players[i].name + ' .hand').html('');
      for (var card of players[i].cards) {
        $('.' + players[i].name).find('.hand').append(create_card(card));
      }
    }
  }
}

function create_card(card) {
  var cardDom = '<li><div class="card back">*</div></li>';
  
  if (typeof card.num !== 'undefined') {
    cardDom  = '<li><a class="card little rank-' + card.num + ' ' + card.type + '">';
    cardDom += '  <span class="rank">' + card.num + '</span>';
    cardDom += '  <span class="suit">&' + card.type + ';</span>';
    cardDom += '</a></li>';
  }

  return cardDom;
}