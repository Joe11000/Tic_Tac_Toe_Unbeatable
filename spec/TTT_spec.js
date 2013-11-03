describe("Game", function()
{
	var USER_ICON       = "U"
	var COMPUTER_ICON   = "C"
	var EMPTY_ICON      = " "

  var board = [
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

  var SPOTS = [
                [TOP.LEFT],[TOP, MIDDLE],[TOP, RIGHT],
                [MIDDLE, LEFT],[MIDDLE, MIDDLE],[MIDDLE, RIGHT],
                [BOTTOM, LEFT],[BOTTOM, MIDDLE],[BOTTOM, RIGHT]
              ]


	describe("Sample Game", function()
	{
		var game = new Game(COMPUTER_TURN_FIRST);

		describe("Computer Turn 1", function()
		{
			describe("All can ", function()
		  {
		  	it("see what round it is", function()
				{
					expect(game.getRound()).toBe(1);
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

			describe("User", function()
	    {
				describe("can not", function()
				{
					it("choose any spot", function()
					{
						expect(game.getRound()).toBe(1);
						expect(game.userChoose([BOTTOM,RIGHT])).toBe([BOTTOM,RIGHT]);

						expect(game.getBoard()).toEqual([
																           [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
				                                   [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ],
				                                   [ EMPTY_ICON, EMPTY_ICON, EMPTY_ICON ]
				                                 ]);
					});
				});
			});

			describe("Computer", function()
			{
				describe("can", function()
				{
					it("choose an empty spot", function()
					{
						expect(game.computerChoose()).not.toBe(false);

						// Computer logic always puts COMPUTER_ICON into [0,0] if goes first
						expect(game.getBoard()).toEqual([
																              [ COMPUTER_ICON, EMPTY_ICON, EMPTY_ICON ],
				                                      [ EMPTY_ICON, EMPTY_ICON,    EMPTY_ICON ],
				                                      [ EMPTY_ICON, EMPTY_ICON,    EMPTY_ICON ]
				                                    ]);
					});
				});
			});
		});


		describe("User Turn 1", function()
		{

			describe("All can ", function()
		  {
		  	it("see what round it is", function()
				{
							expect(game.getRound()).toBe(2);
				});

				it("query #whoseTurn() -> 'Computer'", function()
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

			describe("Computer", function()
			{
				describe("can not", function()
				{
					it("choose an empty spot", function()
					{
						expect(game.computerChoose()).toBe(false);

						// Computer logic always puts COMPUTER_ICON into [0,0] if goes first
						expect(game.getBoard()).toEqual([
																              [ COMPUTER_ICON, EMPTY_ICON, EMPTY_ICON ],
				                                      [ EMPTY_ICON, EMPTY_ICON,    EMPTY_ICON ],
				                                      [ EMPTY_ICON, EMPTY_ICON,    EMPTY_ICON ]
				                                    ]);
					});
				});
			});

			describe("User", function()
	    {
				describe("can not", function()
				{
					it("choose any taken spot", function()
					{
						expect(game.userChoose([TOP,LEFT])).toBe([TOP, LEFT]);

						expect(game.getBoard()).toEqual([
																              [ COMPUTER_ICON, EMPTY_ICON, EMPTY_ICON ],
				                                      [ EMPTY_ICON,    EMPTY_ICON, EMPTY_ICON ],
				                                      [ EMPTY_ICON,    EMPTY_ICON, EMPTY_ICON ]
				                                    ]);
					});

					describe("can", function()
					{
						it("choose any open spot", function()
						{
							expect(game.userChoose([BOTTOM,RIGHT])).toBe([BOTTOM, RIGHT]]);

							expect(game.getBoard()).toEqual([
																	              [ COMPUTER_ICON, EMPTY_ICON, EMPTY_ICON ],
					                                      [ EMPTY_ICON,    EMPTY_ICON, EMPTY_ICON ],
					                                      [ EMPTY_ICON,    EMPTY_ICON, USER_ICON ]
					                                    ]);
						});
					});
				});
			});
		});
	});
});