var play_all_possible_games = function(does_computer_move_first)
{
  var USER_ICON       = "U"
	var COMPUTER_ICON   = "C"
	var EMPTY_ICON      = " "

  var board = [
                [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
                [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
                [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ]
              ]

	var TOP    = 0;
	var LEFT   = 0;
	var MIDDLE = 1;
	var BOTTOM = 2;
	var RIGHT  = 2;

  var SPOTS = [
                [TOP,    LEFT],[TOP,    MIDDLE],[TOP,    RIGHT],
                [MIDDLE, LEFT],[MIDDLE, MIDDLE],[MIDDLE, RIGHT],
                [BOTTOM, LEFT],[BOTTOM, MIDDLE],[BOTTOM, RIGHT]
              ]

  var computer_games_lost = 0;
  var computer_games_tied = 0;
  var computer_games_won  = 0;

  var computer = new Computer();
	var user = new User();

	// all possible USER attempts. Branch and Bound.
	for(var move1 = 0; move1 < 9; move1++)
	{
		for(var move2 = 0; move2 < 9; move2++)
		{
			if(move2 == move1){ continue }

	    for(var move3 = 0; move3 < 9; move3++)
	    {
	    	if(move3 == move1 || move3 == move2){ continue }

	      for(var move4 = 0; move4 < 9; move4++)
	      {
	    		if(move4 == move1 || move4 == move2 || move4 == move3){ continue }

	        for(var move5 = 0; move5 < 9; move5++)
		    	{

		    		if(does_computer_move_first == false && move1 == 0 && move2 == 8 && move3 == 7 &&  move4 == 2 && move5 == 3)
		    			{ console.log("debug from here"); }
		    		game = new Game(does_computer_move_first);

		    		var turn = 1;
            while(turn <= 9)
            {
            	if(game.whoseTurn() == "Computer") // computer turn
            		computer.choose(game)
            	else									             // user turn
            	{
            		var move;
            		switch(turn)                     // determine which user move it is
            		{
            			case 1:
            			case 2: user.choose(SPOTS[move1], game); break;

            			case 3:
            			case 4: user.choose(SPOTS[move2], game); break;

            			case 5:
            			case 6: user.choose(SPOTS[move3], game); break;

            			case 7:
            			case 8: user.choose(SPOTS[move4], game); break;

            			case 9: user.choose(SPOTS[move5], game);
            		}
            	}

            	if(game.round >= 5)              // test for a possible win starting round 5
            	{
            		if(game.isGameOver())
            		{
            			switch(game.hasWinner())
            			{
            				case "Computer" : computer_games_won++; break;
            				case "User"     : computer_games_lost++; game.printBoard(); console.log(move1 + " " + move2 + " " + move3 + " " + move4 + " " + move5); break;
            				default         : computer_games_tied++;
            			}
            			break;
            		}
            	}
              turn++;
            }
		    	}
		    }
		  }
		}
	}
	return([computer_games_won, computer_games_lost, computer_games_tied])
}

describe("Every possible game outcome", function()
{
  describe("user moves first", function()
	{
		console.log("user first");
		var computer_record = play_all_possible_games(false);

		it("computer never lost", function() { expect(computer_record[1]).toBe(0); });

		console.log("computer");
		console.log("wins "  + computer_record[0] );
		console.log("loses " + computer_record[1] );
		console.log("ties "  + computer_record[2] + "\n");
	});

  describe("computer moves first", function()
	{
		console.log("computer first");
		var computer_record = play_all_possible_games(true);

		it("computer never lost", function() { expect(computer_record[1]).toBe(0); });
		console.log("computer");
		console.log("wins "  + computer_record[0] );
		console.log("loses " + computer_record[1] );
		console.log("ties "  + computer_record[2] );
	});
});