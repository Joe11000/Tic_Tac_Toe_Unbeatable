var game_underway = false;
var user_wins_total   = 0;
var user_ties_total   = 0;
var user_losses_total = 0;

var postGame = function()
{
	switch(game.hasWinner())
	{
		case "Computer": $('#status').text("Computer Wins");
										 user_losses_total++;
										 $('#user_losses_total').text(user_losses_total); // update score
										 break;

		case "User"    : $('#status').text("User Wins");
									   user_wins_total++;
									   $('#user_wins_total').text(user_wins_total); // update score
									   break;

		default        : $('#status').text("Tie Game");
									   user_ties_total++;
									   $('#user_ties_total').text(user_ties_total); // update score
									   break;
	}
	game_underway = false;
}

var clearGameBoard = function()
{
	$('td').each(function(element){
		$(this).removeClass("User")
		$(this).removeClass("Computer")
	});

	return true;
}

var startNewGame = function()
{
	computer_goes_first = $('form [value="Computer"]')[0].checked
	game = new Game(computer_goes_first);
	game_underway = true;
	clearGameBoard();
	$('#status').text("Game In Progress");

	return true;
}

// calculates next move, then puts image into spot
var computerTakesHisTurn = function()
{
	spot_chosen = computer.choose(game);
	spot_chosen_to_id = "#" + spot_chosen[0] + spot_chosen[1];
	$(spot_chosen_to_id).addClass("Computer");

	return true;
}

$(function()
{
	computer = new Computer();
	user = new User();

	// start new game
	$('#start').click(function(e){

		if(! game_underway)
		{
			startNewGame();

			if(game.whoseTurn() == "Computer")
				computerTakesHisTurn();
		}
	});

	// user clicked spot
	$('td').click(function(e)
	{
		if(game_underway && game.whoseTurn() == "User" )
		{
			td_id = $(this).attr('id');
			td_id_to_coordinates = [ Number(td_id[0]), Number(td_id[1]) ];

			if(user.choose(td_id_to_coordinates, game) != false)
				$(this).addClass("User")
			else
				return; // users choice broke behind the scenes.

			if(game.isGameOver())
			  postGame();
			else
			{
				computerTakesHisTurn();

				if(game.isGameOver())
				  postGame();
			}
		}
	});
});