// The deck array contains 52 integers:
// 1-13 = 1-13 Hearts
// 14-26 = 1-13 Diamonds
// 27-39 = 1-13 Clubs
// 40-52 = 1-13 Spades

var libs = require('../libs');

function Deck() {
  this.deck = Array.apply(null, Array(52)).map(function (x, i) {
    return i + 1
  });
};

Player.prototype = {
  getCard: function (deck) {
    var self = this;

    var cIndex = libs.getRandomInt(0, self.deck.length);

    var card = {
      num: self.deck[cIndex]
    };
    
    self.deck.splice(cIndex, 1);              

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
}


module.exports = Deck;