
function TickAll(TickButton){
	var IsTicked=false;
	var ButtonText="Tick All";
	if($(TickButton).text()=='Tick All'){
		IsTicked=true;
		ButtonText='Untick All';
	}
	$("[ID^=AA_]").each(function(){
		var RowID=$(this).attr('id').substring(3);
		if($('#UT_'+RowID).html() == '0' || $('#CT_'+RowID).html() == '0'){
			$('#AA_'+RowID).attr('disabled','disabled');
		}else{
			$('#AA_'+RowID).attr('checked',IsTicked);
		}
	});
	$(TickButton).text(ButtonText);
}	

function CompleteAll(LoopCounter){
	
	$("tr:not(:first)").each(function(){
		var RowID=$(this).attr('id');
		//alert(RowID);
		if($('#AA_'+RowID).attr('checked')=='checked'){
			var TSType=$('#TSType'+RowID).val();
			var TSCompleted=$('#TSComp'+RowID).val();
			
			if($('#btn_'+RowID).html()=='Complete'){
				var Routine="proc=NetProvTimesheetComplete";										
				if(window.IPAddr){
					var IPAddr=$.trim(window.IPAddr);
					var Params='ptempprovtimesheetid='+RowID+'&pInstruction=&pConfirmString='+IPAddr;
				}else{
					var Params='ptempprovtimesheetid='+RowID+'&pInstruction=';
				}
				//processtimesheet(RowID,Routine,Params,false);
				
				$('#LineReturn_'+RowID).html('processing');
				var TheirRefRequired=$('#AuthoriseRequired_'+RowID).html();
				if(TheirRefRequired!='0'){$('#LineReturn_'+RowID).html('Reference required');};
	
				$('#frmSubmitCompleteAll').attr('action','IQXPost.php?'+Routine+'?'+Params);
				$('#frmSubmitCompleteAll').ajaxSubmit({
					success: function(data, textStatus) {
		   				if (data == 'Ok') {
		   					//alert('Complete ok');
		   		
		       				$('#LineReturn_'+RowID).html('Completed');
		       				$('#btn_'+RowID).html('Authorise');
		       				//$('#btn_'+RowID).css('visibility','hidden');
		       				CompleteLogAction(RowID);
		       				
		    			}else{
		       				var ErrCode=data.substr(0,1);
							if(ErrCode=='#'){
								ErrCode=data.substr(1,data.indexOf(':'));
								$('#LineReturn_'+RowID).html('Error code ' + ErrCode);
							}else{
								$('#LineReturn_'+RowID).html('Error: ' + data);
							}
		   				}
					},
					error: function(data, textStatus) {
						$('#LineReturn_'+RowID).css('background-color','#CCFF02');
						$('#LineReturn_'+RowID).html('Transmission error: ' + data);
					},
				dataType: "text"
				});	// end submit
			};	// end complete
		
			if($('#btn_'+RowID).html()=='Authorise'){
			 	var Params='ID='+RowID;
			 	if (TSType == 'S') {
					var Routine = 'service=PROVTSCOMPLETE';
				}else{
					var Routine = 'service=PROVNONSHIFTTSCOMPLETE';
				} 
				//processtimesheet(RowID,Routine,Params,true);
				
				$('#LineReturn_'+RowID).html('processing');
				var TheirRefRequired=$('#AuthoriseRequired_'+RowID).html();
				if(TheirRefRequired!='0'){$('#LineReturn_'+RowID).html('Reference required');};
	
				$('#frmSubmitCompleteAll').attr('action','IQXPost.php?'+Routine+'?'+Params);
				$('#frmSubmitCompleteAll').ajaxSubmit({
					success: function(data, textStatus) {
		   			if (data == 'Ok') {
		   				//alert('authorise ok');
		   			
		       			$('#LineReturn_'+RowID).html('Authorised');
		       			$('#btn_'+RowID).html('Authorised');
		       			//$('#btn_'+RowID).css('visibility','hidden');
			       	
		    		}else{
		       			var ErrCode=data.substr(0,1);
						if(ErrCode=='#'){
							ErrCode=data.substr(1,data.indexOf(':'));
							$('#LineReturn_'+RowID).html('Error code ' + ErrCode);
						}else{
							$('#LineReturn_'+RowID).html('Error: ' + data);
						}
		   			}
				},	// Success
				error: function(data, textStatus) {
					$('#LineReturn_'+RowID).css('background-color','#CCFF02');
					$('#LineReturn_'+RowID).html('Transmission error: ' + data);
				},
				dataType: "text"
				});	// submit
	
			}; // end authorise
			
			if(LoopCounter==0){		// Go round twice, to authorise 
				CompleteAll(1)
			}
			
	}	// end checked
});		// end function
}	// end LoopCounter

/*
function processtimesheet(RowID,Routine,Params,authorising){
	
	$('#LineReturn_'+RowID).html('processing');
	var TheirRefRequired=$('#AuthoriseRequired_'+RowID).html();
	if(TheirRefRequired!='0'){$('#LineReturn_'+RowID).html('Reference required');};
	
	$('#frmSubmitCompleteAll').attr('action','IQXPost.php?'+Routine+'?'+Params);
	$('#frmSubmitCompleteAll').ajaxSubmit({
		success: function(data, textStatus) {
		   	if (data == 'Ok') {
		   		alert($('#btn_'+RowID).html());
		   		if($('#btn_'+RowID).html()=='Authorise'){
		       		$('#LineReturn_'+RowID).html('Authorised');
		       		$('#btn_'+RowID).html('Complete');
		       		$('#btn_'+RowID).css('visibility','hidden');
		       	}
				if($('#btn_'+RowID).html()=='Complete'){
		       		$('#LineReturn_'+RowID).html('Completed');
		       		$('#btn_'+RowID).html('Authorise');
		       		$('#btn_'+RowID).css('visibility','hidden');
		       		CompleteLogAction(RowID);
		       	}
		    }else{
		       	var ErrCode=data.substr(0,1);
				if(ErrCode=='#'){
					ErrCode=data.substr(1,data.indexOf(':'));
					$('#LineReturn_'+RowID).html('Error code ' + ErrCode);
				}else{
					$('#LineReturn_'+RowID).html('Error: ' + data);
				}
		   }
		},
		error: function(data, textStatus) {
		$('#LineReturn_'+RowID).css('background-color','#CCFF02');
		$('#LineReturn_'+RowID).html('Transmission error: ' + data);
		},
		dataType: "text"
	});
}
*/

function CompleteLogAction(RowID){

	var nxt={action:'func',func:function(){
		$('#LineReturn_'+RowID).html('Logged');
	}};
	
	if(window.IPAddr){
		var IPAddr=window.IPAddr;
		var postdata = {ptempprovtimesheetid: RowID, pInstruction: null,pConfirmString: IPAddr};
		IQXChain('#LineReturn_'+RowID, {action: 'send',proc: 'NetProvTimesheetCompleteLogAction',postdata: postdata,nextlink:nxt});
		}
}