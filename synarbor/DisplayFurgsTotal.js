
	function DisplayFurgsTotal(){
	// Calculate and display the Furgs total, and modify tab colour. Used on load to set and populate tab name
		
	$.get('IQXRawData.php?page=SynNetFurgsTotalForClient', function(data,textStatus){
		ResultString = data;
		var FurgsRowCount=ResultString.substr(ResultString.indexOf('<LineCount>')+11,ResultString.indexOf('</LineCount>')-ResultString.indexOf('<LineCount>')-11);
		if(FurgsRowCount>0){
			$('#tabFurgsComplete').html('STARS To Complete ('+FurgsRowCount+')');
			$('#tabFurgsComplete').attr('class','tabFurgsComplete Highlight');
		}else{
			$('#tabFurgsComplete').html('STARS To Complete (0)');
			$('#tabFurgsComplete').attr('class','tabFurgsComplete');	
		}
	});
}

