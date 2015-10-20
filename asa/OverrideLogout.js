
function IQXLogout(){
	// override standard Logout, to divert to standard site.
	$.get('IQXLogout.php',null,function(data, textStatus){
			if (data=='Ok') {
				window.location="http://www.asarecruitment.co.uk";
			} else {
				$(".errormessage").html(data);
			}
	}, "text");	
}


