

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
	
	
	var methods = {
		    init : function(data,options) { 
		    	var settings = {
		    			'type' : 'flatbars', //Type. 'flatbars' or 'tinybars' at the moment
		    			'color' : 'blue', //Color of the graph
		    			'showLabel': true, // Wether show the laber or not
		    			'label' : '{val} cosas para el {0} num. {1} ',
		    			'outLabel' : 'Ponte encima de una columna', // Label showed when the cursor is out of the graph
		    			'noLabel': ' -- ', //Text showed when there is no defined label
		    			'freeColumn' : -1, //Donde se colocan las barras sin datos (<0 a la izquieda, >0 a la derecha) y por donde se cortan los datos
		    			'url' : '',
		    			'time': 0,
		    			'width' : 620
		    		},graph;
		    	
				//data [ [ value, ['minuto','23']  ], []]
				settings = $.extend(settings,options);		
				
				var state = this.data('karmicgraph');
				if(!state){
					state = {};					
				}
				state.settings = settings;
				
				
				//Graph class
				var type = settings.type=='flatbars' ? 'H' : 'W';				
				switch(settings.color){
					case 'blue' :
						graphBarClass = 'graph'+type+'Blue';break;
					case 'red':
						graphBarClass = 'graph'+type+'Red';break;
					case 'green':
						graphBarClass = 'graph'+type+'Green';break;
					case 'yellow':
						graphBarClass = 'graph'+type+'Yellow';break;
					case 'orange':
						graphBarClass = 'graph'+type+'Orange';break;
					case 'dark-orange':
						graphBarClass = 'graph'+type+'OrangeDark';break;
					case 'violet':
						graphBarClass = 'graph'+type+'Violeta';break;
					case 'gold':
						graphBarClass = 'graph'+type+'Gold';break;
					default:
						graphBarClass = 'grap'+type+'Blue';break;
				}
				
				graph = document.createElement('div');
				graph.setAttribute('class', 'karmicgraph');
				//En funcion de cuanto mide la barra y el grafico calculamos cuantas entran 
				var numBar = settings.type=='flatbars' ? Math.floor((settings.width-20)/20) : Math.floor(settings.width/5); 
				settings.width = settings.type=='flatbars' ? (numBar*20)+20 : numBar*5; 
				$(graph).css('width',settings.width+'px');
				var graphContent = document.createElement('div');
				graphContent.setAttribute('class', 'graphCont');
				var contentH = settings.type=='flatbars' ? 120 : 80; 
				//$(graph).css('height',contentH+'px');
				//*****************************************************************
				
				
				var bars = document.createElement('div');
				bars.setAttribute('class', graphBarClass);
				if(settings.type=='flatbars'){$(bars).css('padding-left','20px');}
				

				
				//Si es mayor que el maximo que barras que entran cortamos por un lado o por otro dependiendo de freeColumn (igual sacar esto de aqui)
				if(data.length>numBar){
					if (settings.freeColumn>0){	data = data.slice(0,numBar);}
					else { data = data.slice(numBar * -1); }					
				}
				
				var dataLength = data.length,
					numFree = numBar - dataLength;
				var key = 0,
				max = 0;
				dataArray = new Array();
				while(key<dataLength){
					//Looking for the max value
					var tmpl=parseInt(data[key][0]);
					if(max<tmpl) { max = tmpl; }
					key++;
				}								
				
				
				
				//Building de lines
				if(settings.type=='flatbars'){
					var graphLines = document.createElement('div');
					graphLines.setAttribute('class', 'graphLines');
					max = Math.ceil(max / 0.95);
					while(max%4!=0){
						max++;
					}
					var graphLinesSel = $(graphLines);
					graphLinesSel.append('<span class="first">'+max+'</span>')
						.append('<span class="second">'+max*3/4+'</span>')
						.append('<span class="third">'+max/2+'</span>')
						.append('<span class="fourth">'+max/4+'</span>');
					graphLinesSel.appendTo(graphContent);		
				}
				

				
				//Rellenamos las barras que no tienen nada
				var freeBar = $('<div><span class="bar" style="height:0%"></span><span class="graphBarZero"></span><span class="bar-label" style="display:none">'+settings.noLabel+'</span></div>');
				for(i=0;i<numFree;i++){
					freeBar.clone().appendTo(bars);
				}
				

				
				if(settings.freeColumn>0){data.reverse();}

				key= 0;
				while(key<dataLength){
					percentage = (parseInt(data[key][0])*100/max);
					label = settings.label.replace('{val}', data[key][0]);
					label = String.prototype.format.apply(label,data[key][1]);

					var bar = $('<div><span class="bar" style="height:'+ percentage +'%"></span><span class="graphBarZero"></span><span class="bar-label" style="display:none">'+label+'</span></div>');
					if(settings.freeColumn<0){bar.appendTo(bars);}
					else {$(bars).prepend(bar);}
					key++;
				}


				//$(this).find('karmicgraph > *').remove();
				$(bars).appendTo(graphContent);

				$(graphContent).appendTo(graph);
				if(settings.showLabel == true){
					var label = $('<div class="graphBarData">'+settings.outLabel+'</div>');
					$(label).appendTo(graph);
				}

				$(graph).appendTo(this);
				
				$('div',bars).hover(function(){
					barra = $(this);
					barra.find('span').addClass('hover');

					texto = barra.find('.bar-label').first().text();
					$(graph).find('.graphBarData').first().text(texto);
				}, function(){
					$(this).find('span').removeClass('hover');
					$(graph).find('.graphBarData').first().text(settings.outLabel);
				});
				state.graph = graph;
				this.data('karmicgraph',state);
		    },
		    
		    
		    update : function() {
		    	if('url'!=''){
		    		
		    	}else{
		    		$.error( 'You have to configure de url setting to use this method' );
		    	}
		    },
		    
		    setSetting : function(propertyName,value) { 		    	
		    	settings[propertyName] = value;
		    }
		  };
	
	$.fn.karmicGraph = function( method ) {	    
	    // Method calling logic (as previously seen on TV, or maybe here: http://docs.jquery.com/Plugins/Authoring)
	    if ( methods[method] ) {
	      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.karmicGraph' );
	    }    
	}

})( jQuery );