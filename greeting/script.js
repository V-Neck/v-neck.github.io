$(document).ready(function(){
	var i = 0;
	var height = $(window).height();
	var width  = $(window).width();

	var a = function (n){
		return Math.floor(Math.random()*n)	;
	}

	var b = function(){
		var height = $(window).height();
		var width  = $(window).width();
		i++;
		var dim = a(20)+3;
		$('body').append('<div id = "'+i+'" class = "snow"></div>');
		if(i%2 == 0){
			$('#'+i).addClass('shadow')
		}
		$('#'+i).css('height',dim);
		$('#'+i).css('width',dim);
		$('#'+i).css('left',a(width));
		$('#'+i).animate({"top":"+"+(height-c(i))},a(300)+4500);
		if( i == 20){
			$('#message').fadeIn(5000);
			console.log('fuck');
		}
		if( i == 20){
			$('#mes2').fadeIn(5000);
		}
		console.log(i)
	}	

	var c = function(n){
		var d = 50;	
		if(n > d*100){
			return 100;
		}else{
			return n/d;
		}
	}
	setInterval(function(){b()},10);
}); 