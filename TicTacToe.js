var game_underway = false;
var user_wins_total   = 0;
var user_ties_total   = 0;
var user_losses_total = 0;


var postGame = function()
{
	switch(g.hasWinner())
	{
		case "Computer" : console.log("Computer Wins");
											user_losses_total++;
											$('#user_losses_total').text(user_losses_total); // update score
											break;
		case "User"     : console.log("User Wins");
											user_wins_total++;
											$('#user_wins_total').text(user_wins_total); // update score
											break;

		default         : console.log("Cats Game");
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
	window.g = new Game(computer_goes_first);
	game_underway = true;
	clearGameBoard();

	return true;
}

// calculates next move, then puts image into spot

var computerTakesHisTurn = function()
{
	spot_chosen = g.computerChoose();
	spot_chosen_to_id = "#" + spot_chosen[0] + spot_chosen[1];
	$(spot_chosen_to_id).addClass("Computer");

	return true;
}


$(function()
{
	// start new game
	$('#play').click(function(e){
		startNewGame();

		if(g.whoseTurn() == "Computer")
			computerTakesHisTurn();
	});

	// td clicked
	$('td').click(function(e)
	{
		if(game_underway && g.whoseTurn() == "User" )
		{
			td_id = $(this).attr('id');
			td_id_to_coordinates = [ Number(td_id[0]), Number(td_id[1]) ];

			if(g.userChoose(td_id_to_coordinates) != false)
				$(this).addClass("User")
			else
				return; // users choice broke behind the scenes.

			if(g.isGameOver())
			  postGame();
			else
			{
				computerTakesHisTurn();

				if(g.isGameOver())
				  postGame();
			}
		}
	});

});


