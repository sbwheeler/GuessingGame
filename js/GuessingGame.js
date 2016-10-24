function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

function generateWinningNumber() {
  return Math.ceil(Math.random() * 100);
}

function shuffle(array) {
  var descendCounter = array.length;
  var unshuffled, randomNum;

  while (descendCounter) {
    randomNum = Math.floor(Math.random() * descendCounter--);
    unshuffled = array[descendCounter];
    array[descendCounter] = array[randomNum];
    array[randomNum] = unshuffled;
  }
  return array;
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  return (this.playersGuess < this.winningNumber) ? "Guess Higher!" : "Guess Lower!";
};

Game.prototype.playersGuessSubmission = function(guess) {
  if (guess > 100 || guess < 1 || typeof guess != "number") {
    throw "That is an invalid guess.";
  }
  this.playersGuess = guess;
  return this.checkGuess();
};

Game.prototype.checkGuess = function() {
  if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
    $('#subtitle').text("Guess Again!");
    return 'You have already guessed that number.';
  }

  else {
    var temp = this.playersGuess;
    var hint = this.isLower(temp);
    //adding your guess to the list
    $('#guesslist').find("li").each(function() {
      if ($(this).text() === "--") {
        $(this).text(temp);
        return false;
      }
    });

    if (this.playersGuess === this.winningNumber) {
      winLose();
      return "You Win!";
    }
    else if (this.pastGuesses.length === 4) {
      winLose();
      return "You Lose.";
    }
    else {
      this.pastGuesses.push(this.playersGuess);
      var diff = this.difference();
      $('#subtitle').text(hint);
      if (diff < 10) { return "You're burning up!"; } 
      else if (diff < 25) { return "You're lukewarm."; }
      else if (diff < 50) { return "You're a bit chilly."; }
      else { return "You're ice cold!"; }
    }
  }
};

function newGame() {
  return new Game();
}

Game.prototype.provideHint = function() {
  return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

function madeGuess(game) {
  event.preventDefault();
  var guess = +$('#player-input').val();
  var result = game.playersGuessSubmission(guess);
  $('#player-input').val("").focus();
  $('#title').text(result);
  console.log(game.playersGuess);
}

function reset() {
  $('#guesslist').find("li").each(function() {
    if ($(this).text() !== "--") {
      $(this).text('--');
    }
  });
  $('#title').text('PLAY THE GUESSING GAME');
  $('#subtitle').text('GUESS A NUMBER BETWEEN 1 AND 100');
  $('#submit, #hintbutton').prop("disabled", false);
}

function hint(game) {
  var hintList = game.provideHint();
  $('#title').text('The winning number is ' + hintList[0] + ", " + hintList[1] + ", or " + hintList[2] + ".");
}

function winLose() {
  $('#subtitle').text('Click the reset button.');
  $('#submit, #hintbutton').prop("disabled", true);
}


$(document).ready(function() {
  var game = new Game();
  $('#submit').click(function(e) {
    madeGuess(game);
  });

  $('#player-input').keypress(function(e) {
    if (e.which === 13){
      if ($('#app').find('#title').text() !== "You Lose." && $('#app').find('#title').text() !== "You Win!") {
        madeGuess(game);
      }
    }
  });

  $('#resetbutton').click(function() {
    game = new Game();
    reset();
  });

  $('#hintbutton').click(function() {
    hint(game);
  });
});



