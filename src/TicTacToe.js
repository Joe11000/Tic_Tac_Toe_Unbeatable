// user_turn_first is optional boolean parameter for user going first (true -> user goes first, false -> user goes second)
function Game(computer_turn_first)
{
  var round           = 1; // keep track of (how_many_pieces_have_been_placed_onto_board + 1)

  var USER_ICON       = "U"
  var COMPUTER_ICON   = "C"
  var EMPTY_ICON      = " "
  var COMPUTER_TURN_FIRST  = (computer_turn_first != true && computer_turn_first != false) ? (Math.random() > .5 ? true : false) : computer_turn_first;

  var board = [
	              [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
	              [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
	              [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ]
	            ]

  // number of reasons for computer to place a piece in a spot on board.
  // Start off with a value less than 0 to signify spot on board could be taken
  var computer_reasons = [
                           [ -1, -1, -1 ],
                           [ -1, -1, -1 ],
                           [ -1, -1, -1 ]
                         ]

	var TOP    = 0;
	var LEFT   = 0;
	var MIDDLE = 1;
	var BOTTOM = 2;
	var RIGHT  = 2;

	var TOP_ROW 	    = [ [TOP,    LEFT], [TOP,    MIDDLE], [TOP,    RIGHT] ]
	var MIDDLE_ROW    = [ [MIDDLE, LEFT], [MIDDLE, MIDDLE], [MIDDLE, RIGHT] ]
	var BOTTOM_ROW    = [ [BOTTOM, LEFT], [BOTTOM, MIDDLE], [BOTTOM, RIGHT] ]

	var LEFT_COLUMN   = [ [TOP, LEFT],   [MIDDLE, LEFT],   [BOTTOM, LEFT]   ]
	var MIDDLE_COLUMN = [ [TOP, MIDDLE], [MIDDLE, MIDDLE], [BOTTOM, MIDDLE] ]
	var RIGHT_COLUMN  = [ [TOP, RIGHT],  [MIDDLE, RIGHT],  [BOTTOM, RIGHT]  ]

	var TOP_LEFT_DIAGONAL  = [ [TOP, LEFT],  [MIDDLE, MIDDLE], [BOTTOM, RIGHT] ]
	var TOP_RIGHT_DIAGONAL = [ [TOP, RIGHT], [MIDDLE, MIDDLE], [BOTTOM, LEFT]  ]

	var WAYS_TO_WIN = [
								      TOP_ROW,            MIDDLE_ROW,        BOTTOM_ROW,
								      LEFT_COLUMN,        MIDDLE_COLUMN,     RIGHT_COLUMN,
								      TOP_LEFT_DIAGONAL,  TOP_RIGHT_DIAGONAL
			    			    ]

  var SPOTS = [
                [TOP, LEFT],   [TOP, MIDDLE],[TOP, RIGHT],
                [MIDDLE, LEFT],[MIDDLE, MIDDLE],[MIDDLE, RIGHT],
                [BOTTOM, LEFT],[BOTTOM, MIDDLE],[BOTTOM, RIGHT]
              ]


	this.getBoard = function()
	{
		return(board);
	}

	var spotAvailable = function(location){
		return(board[location[0]][location[1]] == EMPTY_ICON);
	}

  // return - "User" or "Computer" if winner , else false
	this.hasWinner = function()
	{
		for(var w in WAYS_TO_WIN)
		{
			if( (board[ WAYS_TO_WIN[w][0][0]][ WAYS_TO_WIN[w][0][1]] == board[ WAYS_TO_WIN[w][1][0]][ WAYS_TO_WIN[w][1][1]]) &&
				  (board[ WAYS_TO_WIN[w][1][0]][ WAYS_TO_WIN[w][1][1]] == board[ WAYS_TO_WIN[w][2][0]][ WAYS_TO_WIN[w][2][1]]) &&
				  (board[ WAYS_TO_WIN[w][0][0]][ WAYS_TO_WIN[w][0][1]] != EMPTY_ICON)
				)
			{
				return(board[ WAYS_TO_WIN[w][0][0]][ WAYS_TO_WIN[w][0][1]] == USER_ICON ? "User" : "Computer");
			}
		}
		return(false);
	}

	// return - true if a winner or a tie
	this.isGameOver = function()
	{
		return(round > 9 || this.hasWinner() != false);
	}

	this.getRound = function()
	{
		return(round);
	}

	// return : "User" or "Computer"
	this.whoseTurn = function()
	{
		if(round % 2 == 1)
			return(COMPUTER_TURN_FIRST ? "Computer" : "User");
		else
			return(COMPUTER_TURN_FIRST ? "User" : "Computer");
	}

 	// puts computer choice into board
	// return : [x, y] if successful, returns false if issues
  this.computerChoose = function()
  {
  	if( this.isGameOver() || this.whoseTurn() == "User")
  		return(false);

		choice = computerThinkUpMove();
		round++;
    board[ choice[0] ][ choice[1] ] = COMPUTER_ICON;
    return(choice);
  }

   // return [x,y] of board to place computer piece
  var findBestSpotForComputerChoice = function()
  {
    // set reasons array for computers turn
		for(var row = 0; row < 3; row++)
			for(var col = 0; col < 3; col++)
				computer_reasons[row][col] = -1;

    for(way in WAYS_TO_WIN)
    {
    	var val_of_spot_a = board[ WAYS_TO_WIN[way][0][0] ][ WAYS_TO_WIN[way][0][1] ]
    	var val_of_spot_b = board[ WAYS_TO_WIN[way][1][0] ][ WAYS_TO_WIN[way][1][1] ]
    	var val_of_spot_c = board[ WAYS_TO_WIN[way][2][0] ][ WAYS_TO_WIN[way][2][1] ]

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
      else // give a no value for possible, but not benificial, spots
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
				{
					if(computer_reasons[row][col] > highest_valued_spot_value)
          {
         	  highest_valued_spot_value = computer_reasons[row][col];
         	  highest_valued_spot_index = [row, col];
          }
        }
			}
		}
		return(highest_valued_spot_index);
  }

	// computer game logic
	var computerThinkUpMove = function()
	{
		switch(round)
		{
			case 1 :  // computer starts first
				return([TOP,LEFT])
				break

			case 2 : // computer starts second
				if(board[MIDDLE][MIDDLE] == EMPTY_ICON)
					return([MIDDLE,MIDDLE])
				else
					return([TOP,LEFT])
				break

			case 3 : // 2nd turn of computer started 1st
				if(board[BOTTOM][RIGHT] == EMPTY_ICON)
					return([BOTTOM, RIGHT]);
				else
					return([TOP, RIGHT]);
				break;

			case 4 : // 2nd turn of computer started 2nd
				if( board[TOP][LEFT] == USER_ICON && board[BOTTOM][RIGHT] == USER_ICON ||
					 (board[TOP][RIGHT] == USER_ICON && board[BOTTOM][LEFT] == USER_ICON) )
		    	return([TOP, MIDDLE])

				else if(board[MIDDLE][MIDDLE] == USER_ICON && board[TOP][LEFT] == USER_ICON)
		    	return([BOTTOM, RIGHT]);

		    else if(board[MIDDLE][MIDDLE] == USER_ICON && board[TOP][RIGHT] == USER_ICON)
		    	return([BOTTOM, LEFT]);

		    else if(board[MIDDLE][MIDDLE] == USER_ICON && board[BOTTOM][LEFT] == USER_ICON)
		    	return([TOP, RIGHT]);

		    else if(board[MIDDLE][MIDDLE] == USER_ICON && board[BOTTOM][RIGHT] == USER_ICON)
		    	return([TOP, RIGHT]);

				else if( (board[TOP][LEFT] == USER_ICON     && (board[MIDDLE][RIGHT] == USER_ICON || board[BOTTOM][MIDDLE] == USER_ICON )) ||
				         (board[TOP][RIGHT] == USER_ICON    && (board[MIDDLE][LEFT] == USER_ICON  || board[BOTTOM][MIDDLE] == USER_ICON )) ||
				         (board[BOTTOM][LEFT] == USER_ICON  && (board[TOP][MIDDLE] == USER_ICON   || board[MIDDLE][RIGHT]  == USER_ICON )) ||
				         (board[BOTTOM][RIGHT] == USER_ICON && (board[TOP][MIDDLE] == USER_ICON   || board[MIDDLE][LEFT]   == USER_ICON ))
				       )
			  {
			  	if(board[MIDDLE][LEFT]  == EMPTY_ICON && board[MIDDLE][RIGHT] == EMPTY_ICON)
			  	  return([MIDDLE, LEFT]);
			  	else
			  		return([TOP, MIDDLE]);
			  }
				else if ( board[TOP][LEFT] == USER_ICON && (board[MIDDLE][RIGHT] == USER_ICON || board[MIDDLE][BOTTOM] == USER_ICON) )
		    {
		    	return([TOP, MIDDLE]);
		    }

		    else if(board[TOP][MIDDLE] == USER_ICON && board[MIDDLE][LEFT] == USER_ICON)
		    	return([TOP, LEFT]);

		    else if(board[TOP][MIDDLE] == USER_ICON && board[MIDDLE][RIGHT] == USER_ICON)
		    	return([TOP, RIGHT]);

		    else if(board[BOTTOM][MIDDLE] == USER_ICON && board[MIDDLE][LEFT] == USER_ICON)
		    	return([BOTTOM, LEFT]);

		    else if(board[BOTTOM][MIDDLE] == USER_ICON && board[MIDDLE][RIGHT] == USER_ICON)
		    	return([BOTTOM, RIGHT]);

				else
				  return(findBestSpotForComputerChoice());

				break;

			default :
				return(findBestSpotForComputerChoice());
		}
	}

	// returns [x, y] coordinates that were passed in as row_col_index if piece now on board
	// returns false if problems
	this.userChoose = function(row_col_index)
	{
		if( this.isGameOver() || this.whoseTurn() == "Computer" ) // if game already over or not their turn
  		return(false);

  	if(board[ row_col_index[0] ][ row_col_index[1] ] != EMPTY_ICON) // if spot on board already taken
  		return(false);

  	round++;
		board[ row_col_index[0] ][ row_col_index[1] ] = USER_ICON;
		return([row_col_index[0], row_col_index[1]]);
	}

	this.printBoard = function(){
		console.log(board[0][0] + " | " + board[0][1] + " | " + board[0][2])
		console.log("----------")
		console.log(board[1][0] + " | " + board[1][1] + " | " + board[1][2])
		console.log("----------")
		console.log(board[2][0] + " | " + board[2][1] + " | " + board[2][2])
		console.log("")
	}



}