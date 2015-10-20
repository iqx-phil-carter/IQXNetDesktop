
function IQXLogout(){
	// override standard Logout, to divert to standard site.
	$.get('IQXLogout.php',null,function(data, textStatus){
			if (data=='Ok') {
				window.location="http://br-iqx.xcitestaging.co.uk/wp-login.php";
			} else {
				$(".errormessage").html(data);
			}
	}, "text");	
}


