(function($) {
	$.fn.dragsand = function(options) {
		var collection = this;
		var grid = {};
		
		var currGridX, currGridY;
		
		var onStart = function() {
			var position = getGridPos($(this).position());
			currGridX = position[0];
			currGridY = position[1];			
		}
		
		var onStop = function() {
			return false;
			var position = getGridPos($(this).position());
			var x = position[0], y = position[1];
			console.log(x + " " + y);
			console.log(grid[x][y]);
			
			if(grid[x] && !grid[x][y]) {
				grid[x][y] = this;
				$(this).animate({
					duration : 100,
					left : (options.width * x),
					top : (options.height * y)
				});
			}
		}
		
		var onDrag = function(event, ui) {
			var position = getGridPos($(this).position());
			var x = position[0], y = position[1];
			if(grid[x] && grid[x][y]) {
				if(grid[x][y] != this) {
					if( (currGridX * 10 + currGridY) > (x * 10 + y) ) {
						move(x,y, "left");
					} else {
						move(x,y, "right");
					}
				}
			}
		}
		
		var move = function(x,y, where) {
			var rowLength = Math.floor(collection.parent().width()/collection.first().width());
			if(x < rowLength) {
				var traveler = grid[x][y];
				grid[x][y] = null;
				
				done = false;
				while(!done) {
					y += where == "left" ? -1 : 1;
					
					moveTo(grid[x][y], traveler);
					if(!grid[x][y]) {
						grid[x][y] = traveler;
						done = true;
					} else {
						var swap = grid[x][y];
						grid[x][y] = traveler;
						traveler = swap;
					}					
				}								
			}			
		}
		
		var getVerticalMargin = function() {
			var top = parseInt($(element).css("margin-top"));
			var bottom = parseInt($(element).css("margin-bottom"));
			return top+bottom;
		}
		
		var getHorizontalMargin = function(element) {
			var left = parseInt($(element).css("margin-left"));
			var right = parseInt($(element).css("margin-right"));
			return left+right;
		}
		
		var moveTo = function(element, where) {
			var width = $(element).width();
			var height = $(element).height();
			
			var whereOperator = where == 'left' ? "+=" : "-=";
			
			$(element).animate({
				duration : 100,
				left : whereOperator + (width+getHorizontalMargin(element))
			});
		}
		
		var getGridPos = function(position) {
			var elemHeight = options.height || collection.first().height();
			var elemWidth = options.width || collection.first().width();
			var x = Math.floor(position.top / elemHeight);
			var y = Math.floor(position.left / elemWidth);
			return [ x < 0 ? 0 : x, y < 0 ? 0 : y  ]
		}
		
		this.draggable({
			start : onStart,
			drag : onDrag,
			stop : onStop
		});
		
		return this.each(function(key, item) {
			$(item).parent().css({ position: "relative" });
			var gridPos = getGridPos($(item).position());
			var x = gridPos[0], y = gridPos[1];
			if(!grid[x]) grid[x] = {};
			grid[x][y] = item;
		});
	}
})(jQuery);
