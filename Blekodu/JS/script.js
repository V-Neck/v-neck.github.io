//M. Abedamalik, D. Zheng, V.Johnson
//IASMH, 2015

$(document).ready(function(){
	
	//holds colors for game
	var pallette = ['#69D2E7','#A7DBD8','#F38630','#FA6900','#fe4365','#fc9d9a','#f9cdad','#556270','#4ecdc4','#c7f464','#ff6b6b','#c44d58','#d1e751','#ffffff','#000000','#4dbce9','#26ade4','#d95b43','#c02942','#542437','#53777a','#cff09e','#a8dba8','#79bd9a','#3b8686','#0b486b','#00a0b0','#6a4a3c','#cc333f','#eb6841','#edc951']
	
	//Will hold colors for gradient. 
	var color = [];
	//Number of blocks
	var num = 7;
	//_num used to make random tiles. USED WITH UNSORT
	var _num = num -2;
	//Used to check players guess against actual
	var player_guess = ["#FF0088", "#0088ff"];
	//Scores
	var round_score = 0;
	var total_score = 0;

	makeBoard();

	function makeBoard(colorStop){
		//Holds color-stops in a gradient
		var colorStop = [pallette[a(pallette.length -1)], pallette[a(pallette.length -1)]];
		color = [];
		if(total_score>0){
			for(var i=0; i<num; i++){
				$('#'+i).remove();
				$('#'+(100+i)).remove();
			}
		}
		for(var i=0; i < (_num); i++){
			$("#unsort").append($("<div class='unsort tile' id='"+i+"'></div>"));
			$('#'+i).animate({'opacity': .8},1200);
		}

		for(var i=0; i < (num); i++){
			$("#sort").append("<div class='sort tile drop' id='"+(i+100)+"'></div>");
			$('#'+(100+i)).animate({'opacity': 1},500);
		}

		for(var i=1; i<=(_num); i++){
			color.push( $.xcolor.gradientlevel(colorStop[0], colorStop[1], i, num).getHex() );
		}

		console.log(color);

		$('#100').css('background-color', colorStop[0]);
		$('#100').removeClass("drop");

		$('#'+(100+(num-1))).css('background-color',colorStop[1]);
		$('#'+(100+(num-1))).removeClass('drop');

		//Deck will be shuffled
		var temp_color = color.slice();
		var deck = shuffle(color);
		color = temp_color;

		for(var i=0; i < (_num); i++){
			$("#"+i).css('background-color',deck[i]);
		}

		$(".unsort").draggable();
		$(".sort").droppable({
			drop: function(event,ui,num){
				console.log(color)
				console.log($(this));
				console.log(color);
				console.log(color[($(this).attr('id')-101)]);
				var rgb = $('#'+$(ui.draggable).attr('id')).css('background-color');
				console.log( getHex(rgb) );
				if(color[($(this).attr('id')-101)] == getHex($('#'+$(ui.draggable).attr('id')).css('background-color')) ){
					$(this).css('background-color',color[($(this).attr('id')-101)]);
					$(ui.draggable).fadeOut(300);
					round_score++;
					if(round_score==(_num)){
						console.log(_num);
						$('#win').fadeIn(500);
						total_score++;
						round_score = 0;	
						//var color = [];
						$("#score").replaceWith("<div id='score'>Level: "+total_score+"</div><div id='ng_con' class='butt butt-con'><div id='ng' class='butt butt-mess'>New Game</div>");
					}
				} else{
					$(ui.draggable).animate({'top':'-=50'},50);
				}
			}
		});
	}




	/*
	 * CSS stuff (position)
	 *
	*/
	function resize(num, board){
		var win_y = $(window).height();
		var win_x = $(window).width();

		var border = 10;

		if(board == '#sort'){
			var board_width = win_x * .9;
		} else {
			var board_width = win_x * (_num/9);
		}
		var tile_s = (board_width - border)/num - border;
		var board_height = tile_s + 2*border;
		var margin_left = -board_width/2;

		$('#'+board).css({
			"width" : board_width + "px",
			"height" : board_height + "px",
			"margin-left" : margin_left + "px"
		});

		$('.tile.'+board).css({
			"width":tile_s,
			"height":tile_s,
			"margin-left": border,
			"margin-top" : border,
			"margin-bottom" : border
		});
	}

	setInterval(function() {resize(num, 'sort')}, 100);
	setInterval(function() {resize(_num, 'unsort')}, 100);

	/*
	 * Extension of styles
	*/
	$('.butt').mousedown(function(event){
		$(this).css('background-color','#2277ee');
	});

	$('.butt').mouseup(function(event){
		$(this).css('background-color','#3388FF');
		makeBoard();
		$("#win").fadeOut(500);
	});


	/*
	 * Fischer-Yates shuffle
	*/
	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex ;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}

	//Function to convert hex format to a rgb color
	function getHex(rgb){
	 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	 return (rgb && rgb.length === 4) ? "#" +
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}

	function a(n){
		return Math.floor(Math.random()*n)	;
	}

});