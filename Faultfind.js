	
function FFInfo(Obj,PageName,ObjType){
	// provide details of object for faultfinding
	
	var space='<br />';
	var LocalObj=$(Obj).parent();
	var OutputString = 'Page: '+ PageName + space;
	var ContrastingColour='orange';
	OutputString = OutputString + 'ID: ' + $(Obj).attr('id') + space;
	OutputString = OutputString + 'Obj type: ' + ObjType + space;
	OutputString = OutputString + 'Text: ' + $(Obj).text();
	
	$('#FF').css('color',ContrastingColour);
	$('#FF').html(OutputString);
}

function AddFFEventHandlers(PageName,FaultFind){
	// add event handlers
	
	if(FaultFind!=1){return;}
	
	$(document).on('mouseout',function(e){
		$('#FF').html('');
	});
	
	//$.each($('a').data('events'),function(i,event){
	//	if(i=)
	//	alert(i + event.currentTarget);
		
	//});
	$('a').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'a');
		}
	}
	);		
	
	$('th').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'th');
		}
	});	
	
	$('img').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'img');
		}
	});	
	
	$('td').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'td');
		}
	});	
	
	
	$('span').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'span');
		}
	});		
	
	$('select').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'select');
		}
	});	
	
	$('input').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'input');
		}
	});	
	
	$('button').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'button');
		}
	});
	
	$('p').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'p');
		}
	});
	
	$('li').on('mouseover',function(e){
		if(e.ctrlKey==true){
			FFInfo(this,PageName,'li');
		}
	});
	

	
		
}