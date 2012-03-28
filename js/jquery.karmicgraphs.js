/**
 * KarmicGraphs for jQuery
 * https://github.com/karmacracy/KarmicGraphs
 * 
 * by Karmacracy
 * 
 */

;(function($) {
	
	/* Sacada de aqui
	* http://stackoverflow.com/a/1038930
	* Ligeramente modificada
	* asi no se hacen los comentarios de bloque ^^
	*/
	String.prototype.format = function() {
	  var s = this;
	  for (var i = 0; i < arguments.length; i++) {       
	    var reg = new RegExp("\\{" + i + "\\}", "gm");             
	    s = s.replace(reg, arguments[i]);
	  }

	  return s;
	}
	
	$.fn.karmicGraph = function(data,options){

		//data [ [ value, ['minuto','23']  ], []]
		var settings = $.extend({
			'color' : 'blue',
			'showLabel': true,
			'label' : '{val} cosas para el {0} num. {1} ',
			'outLabel' : 'Ponte encima de una columna',
			'noLabel': ' -- ',
			'freeColumn' : -1 //Donde se colocan las barras sin datos (<0 a la izquieda, >0 a la derecha) y por donde se cortan los datos
		},options);


		var numVar = 124;

		//Si es mayor que el maximo que barras que entran cortamos por un lado o por otro dependiendo de freeColumn (igual sacar esto de aqui)
		if(data.length>numVar){
			factor = -1;
			if (settings.freeColumn>0){factor = 1;}
			data = data.slice(numVar * factor);
		}

		var dataLength = data.length,
			numFree = numVar - dataLength;

		//Graph class

		var graphBarClass = 'graphHBlue';
		switch(settings.color){
			case 'blue' :
				graphBarClass = 'graphHBlue';break;
			case 'red':
				graphBarClass = 'graphHRed';break;
			case 'green':
				graphBarClass = 'graphHGreen';break;
			case 'yellow':
				graphBarClass = 'graphHYellow';break;
			case 'orange':
				graphBarClass = 'graphHOrange';break;
			case 'dark-orange':
				graphBarClass = 'graphHOrangeDark';break;
			case 'violet':
				graphBarClass = 'graphHVioleta';break;
			case 'gold':
				graphBarClass = 'graphHGold';break;
			default:
				graphBarClass = 'graphHBlue';break;
		}

		var graph = document.createElement('div');
		graph.setAttribute('class', graphBarClass);


		//Rellenamos las barras que no tienen nada
		var freeBar = $('<div><span style="height:0%"></span><span class="graphBarZero"></span><span class="bar-label" style="display:none">'+settings.noLabel+'</span></div>');
		for(i=0;i<numFree;i++){
			freeBar.clone().appendTo(graph);
		}

		//las barras
		//addFunction = (settings.freeColumn>0) ? $.appendTo : $.prependTo ;

		var key = 0,
			max = 0;
		dataArray = new Array();
		while(key<dataLength){
			//Looking for the max value
			var tmpl=parseInt(data[key][0]);
			if(max<tmpl) { max = tmpl; }
			key++;
		}

		if(settings.freeColumn>0){data.reverse();}

		key= 0;
		while(key<dataLength){
			percentage = (parseInt(data[key][0])*100/max);
			label = settings.label.replace('{val}', data[key][0]);
			label = String.prototype.format.apply(label,data[key][1]);

			var bar = $('<div><span style="height:'+ percentage +'%"></span><span class="graphBarZero"></span><span class="bar-label" style="display:none">'+label+'</span></div>');
			if(settings.freeColumn<0){bar.appendTo(graph);}
			else {$(graph).prepend(bar);}
			key++;
		}

		$(this).find('*').remove();
		$(graph).appendTo(this);
		if(settings.showLabel == true){
			var label = $('<div class="graphBarData"></div>');
			$(label).appendTo(this);
		}

		$('div',graph).hover(function(){
			barra = $(this);
			barra.find('span').addClass('hover');

			texto = barra.find('.bar-label').first().text();
			barra.parent().parent().find('.graphBarData').first().text(texto);


		}, function(){
			$(this).find('span').removeClass('hover');
			barra.parent().parent().find('.graphBarData').first().text(settings.outLabel);

		});
	}

})( jQuery );