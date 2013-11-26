describe("Game", function()
{
	var USER_ICON       = "U"
	var COMPUTER_ICON   = "C"
	var EMPTY_ICON      = " "

  var test_board = [
                     [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
                     [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
                     [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ]
                   ]

  var COMPUTER_TURN_FIRST = true;
  var USER_TURN_FIRST = false;

	var TOP    = 0;
	var LEFT   = 0;
	var MIDDLE = 1;
	var BOTTOM = 2;
	var RIGHT  = 2;

  var USER_FIRST_CHOICE  = [TOP, RIGHT];
  var USER_SECOND_CHOICE = [MIDDLE, RIGHT];
  var computer_first_choice = [0,0];  // temp values of this future used "constant"
  var computer_second_choice = [0,0]; // temp values of this future used "constant"

  var SPOTS = [
                [TOP,    LEFT], [TOP,    MIDDLE], [TOP,    RIGHT],
                [MIDDLE, LEFT], [MIDDLE, MIDDLE], [MIDDLE, RIGHT],
                [BOTTOM, LEFT], [BOTTOM, MIDDLE], [BOTTOM, RIGHT]
              ]

   var findSpotContaining = function(piece_looking_for, game)
   {
   	 for(var i = 0; i < 9; i++)
   	 {
   	 	 if(game.board[ SPOTS[i][0] ][ SPOTS[i][1] ] == piece_looking_for)
   	 	 	{
   	 	 		var returning = SPOTS[i];
   	 	 		return(returning);
   	 	 	}
   	 }
   }

	describe("sample game", function()
	{
	  game = new Game(COMPUTER_TURN_FIRST);
	  computer = new Computer();
	  user = new User();

		describe("computer turn 1", function()
		{
			describe("all can ", function()
		  {
		  	it("see what round it is", function()
				{
					expect(game.round).toBe(1);
				});

				it("query #whoseTurn() -> 'Computer'", function()
				{
					expect(game.whoseTurn()).toEqual("Computer");
				});

		  	it("see if no winner exists", function()
				{
					expect(game.hasWinner()).toBe(false);
				});

				it("see if game is over yet", function()
				{
					expect(game.isGameOver()).toBe(false);
				});
			});

			describe("user", function()
	    {
				describe("can not", function()
				{
					it("choose any open spot", function()
					{
						expect(game.round).toBe(1);

						expect(user.choose(findSpotContaining(EMPTY_ICON, game), game)).toBe(false);

						expect(game.board).toEqual(test_board);
					});
				});
			});

			describe("computer", function()
			{
				describe("can", function()
				{
					it("choose an empty spot", function()
					{
						computer_first_choice = computer.choose(game);
						expect(computer_first_choice).not.toBe(false);
						test_board[computer_first_choice[0]][computer_first_choice[1]] = COMPUTER_ICON;

						expect(game.board).toEqual(test_board);
					});
				});
			});
		});

		describe("user turn 1", function()
		{
			describe("all can ", function()
		  {
		  	it("see what round it is", function()
				{
					expect(game.round).toBe(2);
				});

				it("query #whoseTurn() -> 'User'", function()
				{
					expect(game.whoseTurn()).toEqual("User");
				});

		  	it("see if no winner exists", function()
				{
					expect(game.hasWinner()).toBe(false);
				});

				it("see if game is over yet", function()
				{
					expect(game.isGameOver()).toBe(false);
				});
			});

			describe("computer", function()
			{
				describe("can not", function()
				{
					it("choose an empty spot", function()
					{
						expect(computer.choose(game)).toBe(false);

						expect(game.board).toEqual(test_board);
					});
				});
			});

			describe("user", function()
	    {
				describe("can not", function()
				{
					it("choose any taken spot", function()
					{
						expect(user.choose(findSpotContaining(COMPUTER_ICON, game), game)).toBe(false);

						expect(game.board).toEqual(test_board);
					});
				});

				describe("can", function()
				{
					it("choose any open spot", function()
					{
						USER_FIRST_CHOICE = findSpotContaining(EMPTY_ICON, game);

						expect(user.choose(USER_FIRST_CHOICE, game)).toEqual(USER_FIRST_CHOICE);

						test_board[ USER_FIRST_CHOICE[0] ][ USER_FIRST_CHOICE[1] ] = USER_ICON;

						expect(game.board).toEqual(test_board);
					});
				});
			});
		});

		describe("computer turn 2", function()
		{
			describe("all can ", function()
		  {
		  	it("see what round it is", function()
				{
					expect(game.round).toBe(3);
				});

				it("query #whoseTurn() -> 'Computer'", function()
				{
					expect(game.whoseTurn()).toEqual("Computer");
				});

		  	it("see if no winner exists", function()
				{
					expect(game.hasWinner()).toBe(false);
				});

				it("see if game is over yet", function()
				{
					expect(game.isGameOver()).toBe(false);
				});
			});

			describe("user", function()
			{
				describe("can not", function()
				{
					it("choose an empty spot", function()
					{
						expect(game.whoseTurn()).toBe("Computer");

						expect(user.choose(findSpotContaining(EMPTY_ICON, game), game)).toBe(false);

						expect(game.board).toEqual(test_board);
					});
				});
			});

			describe("computer", function()
			{
				describe("can not", function()
				{
					it("choose any spot taken by computer", function()
					{
						expect(user.choose(computer_first_choice, game)).toBe(false);

						expect(game.board).toEqual(test_board);

						expect(game.whoseTurn()).toBe("Computer");
					});

					it("choose any spot taken by user", function()
					{
						expect(user.choose(USER_FIRST_CHOICE, game)).toBe(false);

						expect(game.board).toEqual(test_board);

						expect(game.whoseTurn()).toBe("Computer");
					});
				});

				describe("can", function()
				{
					it("choose any open spot", function()
					{
						expect(game.round).toBe(3);

						computer_second_choice = computer.choose(game);

						expect(computer_second_choice).not.toBe(false);

						test_board[computer_second_choice[0]][computer_second_choice[1]] = COMPUTER_ICON;

						expect(game.board).toEqual(test_board);
					});
				});

				describe("post computer turn", function()
				{
					it("is users turn after computer chose", function()
					{
						expect(game.whoseTurn()).toBe("User");
					});
				});
			});
		});
	});
});