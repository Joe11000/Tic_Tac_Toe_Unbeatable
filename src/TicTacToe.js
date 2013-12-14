function Game(is_computer_turn_first)
{
  var TOP    = 0;
  var LEFT   = 0;
  var MIDDLE = 1;
  var BOTTOM = 2;
  var RIGHT  = 2;

  var USER_ICON       = "U";
  var COMPUTER_ICON   = "C";
  var EMPTY_ICON      = " ";

  var COMPUTER_TURN_FIRST  = (is_computer_turn_first != true && is_computer_turn_first != false) ? (Math.random() > .5 ? true : false) : is_computer_turn_first;

	this.round = 1;

	this.board = [
                [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
                [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
                [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ]
              ];

  var TOP_ROW       = [ [TOP,    LEFT], [TOP,    MIDDLE], [TOP,    RIGHT] ];
  var MIDDLE_ROW    = [ [MIDDLE, LEFT], [MIDDLE, MIDDLE], [MIDDLE, RIGHT] ];
  var BOTTOM_ROW    = [ [BOTTOM, LEFT], [BOTTOM, MIDDLE], [BOTTOM, RIGHT] ];

  var LEFT_COLUMN   = [ [TOP, LEFT],   [MIDDLE, LEFT],   [BOTTOM, LEFT]   ];
  var MIDDLE_COLUMN = [ [TOP, MIDDLE], [MIDDLE, MIDDLE], [BOTTOM, MIDDLE] ];
  var RIGHT_COLUMN  = [ [TOP, RIGHT],  [MIDDLE, RIGHT],  [BOTTOM, RIGHT]  ];

  var TOP_LEFT_DIAGONAL  = [ [TOP, LEFT],  [MIDDLE, MIDDLE], [BOTTOM, RIGHT] ];
  var TOP_RIGHT_DIAGONAL = [ [TOP, RIGHT], [MIDDLE, MIDDLE], [BOTTOM, LEFT]  ];

  var WAYS_TO_WIN = [
                      TOP_ROW,            MIDDLE_ROW,        BOTTOM_ROW,
                      LEFT_COLUMN,        MIDDLE_COLUMN,     RIGHT_COLUMN,
                      TOP_LEFT_DIAGONAL,  TOP_RIGHT_DIAGONAL
                    ];

  this.whoseTurn = function()
  {
    if(this.round % 2 == 1)
      return(COMPUTER_TURN_FIRST ? "Computer" : "User");
    else
      return(COMPUTER_TURN_FIRST ? "User" : "Computer");
  }

  // return - "User" or "Computer" if winner , else false
  this.hasWinner = function()
  {
    for(var w in WAYS_TO_WIN)
    {
      if( (this.board[ WAYS_TO_WIN[w][0][0]][ WAYS_TO_WIN[w][0][1]] == this.board[ WAYS_TO_WIN[w][1][0]][ WAYS_TO_WIN[w][1][1]]) &&
          (this.board[ WAYS_TO_WIN[w][1][0]][ WAYS_TO_WIN[w][1][1]] == this.board[ WAYS_TO_WIN[w][2][0]][ WAYS_TO_WIN[w][2][1]]) &&
          (this.board[ WAYS_TO_WIN[w][0][0]][ WAYS_TO_WIN[w][0][1]] != EMPTY_ICON)
        )
      {
        return(this.board[ WAYS_TO_WIN[w][0][0]][ WAYS_TO_WIN[w][0][1]] == USER_ICON ? "User" : "Computer");
      }
    }
    return(false);
  }

  // return - true if a winner or a tie
  this.isGameOver = function()
  {
    return(this.round > 9 || this.hasWinner() != false);
  }

  this.printBoard = function()
  {
   console.log(this.board[0][0] + " | " + this.board[0][1] + " | " + this.board[0][2])
   console.log("----------")
   console.log(this.board[1][0] + " | " + this.board[1][1] + " | " + this.board[1][2])
   console.log("----------")
   console.log(this.board[2][0] + " | " + this.board[2][1] + " | " + this.board[2][2])
   console.log("")
  }
}

function Computer()
{
  var TOP    = 0;
  var LEFT   = 0;
  var MIDDLE = 1;
  var BOTTOM = 2;
  var RIGHT  = 2;

  var USER_ICON       = "U";
  var COMPUTER_ICON   = "C";
  var EMPTY_ICON      = " ";

  // number of reasons for computer to place a piece in a spot on board.
  // Must start off with a value less than 0.
  var computer_reasons = [
                           [ -1, -1, -1 ],
                           [ -1, -1, -1 ],
                           [ -1, -1, -1 ]
                         ]

  var TOP_ROW       = [ [TOP,    LEFT], [TOP,    MIDDLE], [TOP,    RIGHT] ];
  var MIDDLE_ROW    = [ [MIDDLE, LEFT], [MIDDLE, MIDDLE], [MIDDLE, RIGHT] ];
  var BOTTOM_ROW    = [ [BOTTOM, LEFT], [BOTTOM, MIDDLE], [BOTTOM, RIGHT] ];

  var LEFT_COLUMN   = [ [TOP, LEFT],   [MIDDLE, LEFT],   [BOTTOM, LEFT]   ];
  var MIDDLE_COLUMN = [ [TOP, MIDDLE], [MIDDLE, MIDDLE], [BOTTOM, MIDDLE] ];
  var RIGHT_COLUMN  = [ [TOP, RIGHT],  [MIDDLE, RIGHT],  [BOTTOM, RIGHT]  ];

  var TOP_LEFT_DIAGONAL  = [ [TOP, LEFT],  [MIDDLE, MIDDLE], [BOTTOM, RIGHT] ];
  var TOP_RIGHT_DIAGONAL = [ [TOP, RIGHT], [MIDDLE, MIDDLE], [BOTTOM, LEFT]  ];

  var WAYS_TO_WIN = [
                      TOP_ROW,            MIDDLE_ROW,        BOTTOM_ROW,
                      LEFT_COLUMN,        MIDDLE_COLUMN,     RIGHT_COLUMN,
                      TOP_LEFT_DIAGONAL,  TOP_RIGHT_DIAGONAL
                    ];

  // return : [x, y] if successful, returns false if issues
  this.choose = function(game)
  {
    if( game.isGameOver() || game.whoseTurn() == "User")
      return(false);

    computer_choice = thinkUpMove(game);
    game.board[computer_choice[0]][computer_choice[1]] = COMPUTER_ICON;
    game.round++;
    return(computer_choice);
  }

  // required by thinkUpMove to find not obvious moves
  var findBestSpotForChoice = function(game)
  {
    for(var row = 0; row < 3; row++)
      for(var col = 0; col < 3; col++)
        computer_reasons[row][col] = -1;

    for(way in WAYS_TO_WIN)
    {
      var val_of_spot_a = game.board[ WAYS_TO_WIN[way][0][0] ][ WAYS_TO_WIN[way][0][1] ]
      var val_of_spot_b = game.board[ WAYS_TO_WIN[way][1][0] ][ WAYS_TO_WIN[way][1][1] ]
      var val_of_spot_c = game.board[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ]

      var user_icon_counter     = 0
      var computer_icon_counter = 0
      var empty_icon_counter    = 0

      switch(val_of_spot_a)
      {
         case USER_ICON     : user_icon_counter++; break
         case COMPUTER_ICON : computer_icon_counter++; break;
         default            : empty_icon_counter++;
      }
      switch(val_of_spot_b)
      {
         case USER_ICON     : user_icon_counter++; break
         case COMPUTER_ICON : computer_icon_counter++; break;
         default            : empty_icon_counter++;
      }

      switch(val_of_spot_c)
      {
         case USER_ICON     : user_icon_counter++; break
         case COMPUTER_ICON : computer_icon_counter++; break;
         default            : empty_icon_counter++;
      }

      if (computer_icon_counter == 2 && user_icon_counter == 0 ) // return empty slot to win game.
      {
        if (val_of_spot_a == EMPTY_ICON)
          return(WAYS_TO_WIN[way][0]);

        else if (val_of_spot_b == EMPTY_ICON)
          return(WAYS_TO_WIN[way][1]);

        else
          return(WAYS_TO_WIN[way][2]);
      }
      else if(user_icon_counter == 2 && computer_icon_counter == 0) // put a B in empty slot and block user from winning
      {
        if(val_of_spot_a == EMPTY_ICON)
          computer_reasons[ WAYS_TO_WIN[way][0][0] ][ WAYS_TO_WIN[way][0][1] ] = "B"

        else if(val_of_spot_b == EMPTY_ICON)
          computer_reasons[ WAYS_TO_WIN[way][1][0] ][ WAYS_TO_WIN[way][1][1] ] = "B"

        else
          computer_reasons[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ] = "B"
      }
      else if(user_icon_counter == 0) // +1 for every open slot
      {
        if(val_of_spot_a == EMPTY_ICON)
          if(computer_reasons[ WAYS_TO_WIN[way][0][0]][ WAYS_TO_WIN[way][0][1] ] != "B")
          {
            if(computer_reasons[ WAYS_TO_WIN[way][0][0]][ WAYS_TO_WIN[way][0][1] ] < 0)
              computer_reasons[ WAYS_TO_WIN[way][0][0]][ WAYS_TO_WIN[way][0][1] ] = 0;

            computer_reasons[ WAYS_TO_WIN[way][0][0]][ WAYS_TO_WIN[way][0][1] ]++;
          }

        if(val_of_spot_b == EMPTY_ICON)
          if(computer_reasons[ WAYS_TO_WIN[way][1][0] ][ WAYS_TO_WIN[way][1][1] ] != "B")
            {
              if(computer_reasons[ WAYS_TO_WIN[way][1][0]][ WAYS_TO_WIN[way][1][1] ] < 0)
                computer_reasons[ WAYS_TO_WIN[way][1][0]][ WAYS_TO_WIN[way][1][1] ] = 0;

              computer_reasons[ WAYS_TO_WIN[way][1][0] ][ WAYS_TO_WIN[way][1][1] ]++;
            }

        if(val_of_spot_c == EMPTY_ICON)
          if(computer_reasons[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ] != "B")
          {
            if(computer_reasons[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ] < 0)
              computer_reasons[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ] = 0;

             computer_reasons[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ]++;
          }
      }
      else // give a 0 value for possible, but not benificial, spots
      {
        if(val_of_spot_a == EMPTY_ICON)
          if(computer_reasons[ WAYS_TO_WIN[way][0][0]][ WAYS_TO_WIN[way][0][1] ] != "B")
            if(computer_reasons[ WAYS_TO_WIN[way][0][0]][ WAYS_TO_WIN[way][0][1] ] < 0)
              computer_reasons[ WAYS_TO_WIN[way][0][0]][ WAYS_TO_WIN[way][0][1] ] = 0;

        if(val_of_spot_b == EMPTY_ICON)
          if(computer_reasons[ WAYS_TO_WIN[way][1][0] ][ WAYS_TO_WIN[way][1][1] ] != "B")
            if(computer_reasons[ WAYS_TO_WIN[way][1][0]][ WAYS_TO_WIN[way][1][1] ] < 0)
              computer_reasons[ WAYS_TO_WIN[way][1][0]][ WAYS_TO_WIN[way][1][1] ] = 0;

        if(val_of_spot_c == EMPTY_ICON)
          if(computer_reasons[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ] != "B")
            if(computer_reasons[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ] < 0)
              computer_reasons[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ] = 0;
      }
    }

    var highest_valued_spot_index;
    var highest_valued_spot_value = -1;

    // look for highest valued spot on board. If a "B" is found, then return it.
    for(var row = 0; row < 3; row++)
    {
      for(var col = 0; col < 3; col++)
      {
        if (computer_reasons[row][col] == "B")
          return([row, col]);
        else
          if(computer_reasons[row][col] > highest_valued_spot_value)
          {
            highest_valued_spot_value = computer_reasons[row][col];
            highest_valued_spot_index = [row, col];
          }
      }
    }
    return(highest_valued_spot_index);
  }

  // returns computers choice for current round
  var thinkUpMove = function(game)
  {
    switch(game.round)
    {
      case 1 :  // computer starts first
        return([TOP,LEFT])
        break

      case 2 : // computer starts second
        if(game.board[MIDDLE][MIDDLE] == EMPTY_ICON)
          return([MIDDLE,MIDDLE])
        else
          return([TOP,LEFT])
        break

      case 3 : // 2nd turn of computer started 1st
        if(game.board[BOTTOM][RIGHT] == EMPTY_ICON)
          return([BOTTOM, RIGHT]);
        else
          return([TOP, RIGHT]);
        break;

      case 4 : // 2nd turn of computer started 2nd
        if( game.board[TOP][LEFT] == USER_ICON && game.board[BOTTOM][RIGHT] == USER_ICON ||
           (game.board[TOP][RIGHT] == USER_ICON && game.board[BOTTOM][LEFT] == USER_ICON) )
          return([TOP, MIDDLE])

        else if(game.board[MIDDLE][MIDDLE] == USER_ICON && game.board[TOP][LEFT] == USER_ICON)
          return([BOTTOM, RIGHT]);

        else if(game.board[MIDDLE][MIDDLE] == USER_ICON && game.board[TOP][RIGHT] == USER_ICON)
          return([BOTTOM, LEFT]);

        else if(game.board[MIDDLE][MIDDLE] == USER_ICON && game.board[BOTTOM][LEFT] == USER_ICON)
          return([TOP, RIGHT]);

        else if(game.board[MIDDLE][MIDDLE] == USER_ICON && game.board[BOTTOM][RIGHT] == USER_ICON)
          return([TOP, RIGHT]);

        else if( (game.board[TOP][LEFT] == USER_ICON     && (game.board[MIDDLE][RIGHT] == USER_ICON || game.board[BOTTOM][MIDDLE] == USER_ICON )) ||
                 (game.board[TOP][RIGHT] == USER_ICON    && (game.board[MIDDLE][LEFT] == USER_ICON  || game.board[BOTTOM][MIDDLE] == USER_ICON )) ||
                 (game.board[BOTTOM][LEFT] == USER_ICON  && (game.board[TOP][MIDDLE] == USER_ICON   || game.board[MIDDLE][RIGHT]  == USER_ICON )) ||
                 (game.board[BOTTOM][RIGHT] == USER_ICON && (game.board[TOP][MIDDLE] == USER_ICON   || game.board[MIDDLE][LEFT]   == USER_ICON ))
               )
        {
          if(game.board[TOP][LEFT] == USER_ICON)
            if(game.board[MIDDLE][RIGHT] == USER_ICON)
              return([TOP, RIGHT]);
            else
              return([BOTTOM, LEFT]);

          else if(game.board[TOP][RIGHT] == USER_ICON)
            if(game.board[MIDDLE][LEFT] == USER_ICON)
              return([TOP, LEFT]);
            else
              return([BOTTOM, RIGHT]);

          else if(game.board[BOTTOM][LEFT] == USER_ICON)
            if(game.board[TOP][MIDDLE] == USER_ICON)
              return([TOP, LEFT]);
            else
              return([BOTTOM, RIGHT]);

          else if(game.board[BOTTOM][RIGHT] == USER_ICON)
            if(game.board[TOP][MIDDLE] == USER_ICON)
              return([TOP, RIGHT]);
            else
              return([BOTTOM, LEFT]);
        }
        else if ( game.board[TOP][LEFT] == USER_ICON && (game.board[MIDDLE][RIGHT] == USER_ICON || game.board[MIDDLE][BOTTOM] == USER_ICON) )
        {
          return([TOP, MIDDLE]);
        }

        else if(game.board[TOP][MIDDLE] == USER_ICON && game.board[MIDDLE][LEFT] == USER_ICON)
          return([TOP, LEFT]);

        else if(game.board[TOP][MIDDLE] == USER_ICON && game.board[MIDDLE][RIGHT] == USER_ICON)
          return([TOP, RIGHT]);

        else if(game.board[BOTTOM][MIDDLE] == USER_ICON && game.board[MIDDLE][LEFT] == USER_ICON)
          return([BOTTOM, LEFT]);

        else if(game.board[BOTTOM][MIDDLE] == USER_ICON && game.board[MIDDLE][RIGHT] == USER_ICON)
          return([BOTTOM, RIGHT]);

        else
          return(findBestSpotForChoice(game));

        break;

      default :
        return(findBestSpotForChoice(game));
    }
  }
};

function User()
{
  var USER_ICON       = "U";
  var COMPUTER_ICON   = "C";
  var EMPTY_ICON      = " ";

	// return : [x, y] if successful, returns false if issues
  this.choose = function(location, game)
  {
    if( game.isGameOver() || game.whoseTurn() == "Computer" )
      return(false);

    if(game.board[location[0]][location[1]] != EMPTY_ICON)
      return(false);

    game.board[ location[0] ][ location[1] ] = USER_ICON;
    game.round++;
    return(location);
	}
}