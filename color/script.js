$(document).ready(function(){
	//var color = ['#69D2E7','#A7DBD8','#F38630','#FA6900','#fe4365','#fc9d9a','#f9cdad','#556270','#4ecdc4','#c7f464','#ff6b6b','#c44d58','#d1e751','#ffffff','#000000','#4dbce9','#26ade4','#d95b43','#c02942','#542437','#53777a','#cff09e','#a8dba8','#79bd9a','#3b8686','#0b486b','#00a0b0','#6a4a3c','#cc333f','#eb6841','#edc951'];
	
	$("#mess").fadeOut(5000);

	var A = "#dd8800";//First color stop
	var C = "#b000a0";//Second Color stop
	var bordrad = 0;
	var num = 80; //number of discrete points selected from the gradation between A&C
	var id = 0;//iterator used to define html id for spawned divs
	var currentMousePos = { x: $(window).width()/2, y: $(window).height()/2}; //x is horizontal, y is veritcal. Initilized in center
	var color = [A]; //Initialized the array that holds those points, beginning with the first color stop
	var showHex = false;
	var stupidHexCheckBecauseJqueryCallsTheFunctionTwice = 0;
	for( var i=1; i<=num; i++ ){
		/*
		Iterates through percentages between 0 & 100
		Uses those percentages to select colors 
		push works on the gradient from a to c
		unshift works on the gradient from c to a
		they meet in the middle, thus, a-c-c-a
		*/
		color.push($.xcolor.gradientlevel(A,C,i,num));
		color.unshift($.xcolor.gradientlevel(A,C,i,num));
	}

	var rand = function (n){ //returns random int between 0 and n
		return Math.floor(Math.random()*n)	;
	}

	var circsqu = function(){//A hidden extra. Iterates through border-radius of color blocks
		bordrad++;
		if( parseInt((bordrad/100)%2) == 0){//if even, count to 100, else, count down

			$('.round').css('border-radius', bordrad%100);
		}else{
			$('.round').css('border-radius',(100 - (bordrad%100)));
		}
	}
	var bubbler = function(){//main. Produces bubbles
		//number of bubble allowed on screen. Will between deleting bubbles in a queue fashion once this number is reached
		var n = 90;	
		//readjusts each time function is called
		var width = $(window).width();
		var height = $(window).height();

		/*
			Appends new div, which becomes bubble. 
			class: click, round
			id = the number of iterations of bubbler

		*/
		$("html").append("<div id='"+id+"' class = 'click round'><div class='text'>"+toggleHex()+"</div></div>");
		$('#'+id).css("background-color",color[id%color.length]);
		$('#'+id).css("margin-left",currentMousePos.x-94);
		$('#'+id).css("margin-top",currentMousePos.y-94);
		$('#'+id).animate({ "left": "+="+(rand(width)-width/2)+"px","top":"+="+((rand(height)-height/2))+"px"},900);
		$('#'+id).addClass('click');
		id = id+1;
		if(id>=n){
			$("#"+(id-n)).fadeOut(300)
		}
	}

	var toggleHex = function(){
		if(showHex){
			return color[id%color.length];
		} else{
			return "";
		}
	}

	$("#showHex").hoverIntent(function(){
		stupidHexCheckBecauseJqueryCallsTheFunctionTwice++;
		if(stupidHexCheckBecauseJqueryCallsTheFunctionTwice%2 != 0){
			console.log(showHex);
			if(!showHex){
			showHex = !showHex;
			} else {
			showHex = !showHex;
		}
	}
	});

	//var circ = setInterval(function(){circsqu()},1);
	var clicker = setInterval(function(){bubbler()},10);

	$(document).mousemove(function(event){
   		currentMousePos.x = event.pageX;
    	currentMousePos.y = event.pageY;
    });

	$(document).toggle(function(event){
		console.log(event);
		//clearInterval(circs)
		clearInterval(clicker);
	}, function(){
		clicker = setInterval(function(){bubbler()},10);
	});


	$("#rainbow").hoverIntent(function(){
		color = ['#69D2E7','#A7DBD8','#F38630','#FA6900','#fe4365','#fc9d9a','#f9cdad','#556270','#4ecdc4','#c7f464','#ff6b6b','#c44d58','#d1e751','#ffffff','#000000','#4dbce9','#26ade4','#d95b43','#c02942','#542437','#53777a','#cff09e','#a8dba8','#79bd9a','#3b8686','#0b486b','#00a0b0','#6a4a3c','#cc333f','#eb6841','#edc951'];

	});

	$("#bw").hoverIntent(function(){
		A = "#1E50E3";
		C = "#FD7C2F";
		color = [];
		for( var i=1; i<=num; i++ ){
			color.push($.xcolor.gradientlevel(A,C,i,num));
			color.unshift($.xcolor.gradientlevel(A,C,i,num));
		}
	});

	$("#hc").hoverIntent(function(){
		A = "#FF8800";
		C = "#b000aa";
		color = [];
		for( var i=1; i<=num; i++ ){
			color.push($.xcolor.gradientlevel(A,C,i,num));
			color.unshift($.xcolor.gradientlevel(A,C,i,num));
		}
	});
});