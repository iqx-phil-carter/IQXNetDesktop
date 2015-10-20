
function TPA(KeyWordLength){
	// Two-Part Authentication
	
	var KWL=KeyWordLength-1;
	
	$('select').each(function(){
		for(var LoopCounter=1;LoopCounter<=9;LoopCounter++){
			$(this).html($(this).html()+'<option value="'+LoopCounter+'">'+LoopCounter+'</option>');	
		}
		$(this).html($(this).html()+'<option value="0">0</option>');
		for(var LoopCounter=65;LoopCounter<=90;LoopCounter++){
			$(this).html($(this).html()+'<option value="'+String.fromCharCode(LoopCounter)+'">'+String.fromCharCode(LoopCounter)+'</option>');	
		}
	});
	
	var RNA=Math.floor(Math.random()*KWL)+1;
		
	$('#CharOne').html(RNA);
	$('#CharOneA').html(RNA);
	$('#CharOneB').val(RNA);
	RNB=Math.floor(Math.random()*7+1);
	while(RNB==RNA){RNB=Math.floor(Math.random()*KWL)+1;}
	$('#CharTwo').html(RNB);
	$('#CharTwoA').html(RNB);
	$('#CharTwoB').val(RNB);
		
}