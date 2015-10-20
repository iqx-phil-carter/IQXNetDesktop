/**
 * @author Michael Scott
 */

// Initializations
$IQXFormContext=null;
$.tablesorter.defaults=$.extend($.tablesorter.defaults,
{cssAsc:'headerSortUp ui-state-active',cssDesc:'headerSortDown ui-state-active',dateFormat: "uk"
});

function hook(){
	var x=1;
	return x;
}

function IQXInitSection(context) {
	$('table.tablesorter,fieldset').addClass('ui-corner-all');
	$('table.tablesorter thead,.qquestion').addClass('ui-widget-header');
	$(".nonformbutton",context).show();
	$(".formbutton",context).hide();
	$("select:not(.qsingleentry,.noncheckbox)",context).multiSelect();
	$("input",context).attr("readonly","readonly");
	$(":checkbox",context).attr("disabled","disabled");
	$(":radio",context).attr("disabled","disabled");
	$("select",context).attr("disabled","disabled");
	$("td.tickable",context).tickable();
	$("button:not(.qmultidropdown)",context).mouseoverclass();   
	$(".twodp",context).fixdecimal(2);
}

// $moTabs added by NATIVE, for Geneva, to allow for modified welcome screen. 
// See also gh_welcome_agency_body.html etc.
// See also line 50.
var $moTabs;	

function IQXSetupTabs(divContainingul) {
	var reqObj=readCookie('RequestedObject');
	var i=-1;
	if (reqObj){
		eraseCookie('RequestedObject');
		i=reqObj.indexOf('_');
		if (i>=0){
			var ob={recordtype:reqObj.substr(0,i),recordid:reqObj.substr(i+1)};
			$('body').data('RequestedObject',ob);
			reqObj=reqObj.substr(0,i);
		}
		i = $(divContainingul + ' ul li').index($('#' + reqObj).get(0));
	}	
	$IQXtabs=$(divContainingul).tabs({select: IQXTabSwitchCheck, show: IQXTabShow});
	$moTabs = $IQXtabs;	// added by NATIVE, for Geneva. See also line 31.
	if (i>=0) {
		$IQXtabs.tabs('select', i);
	}
}

function IQXTabShow() {
	$(".fullCalendar").fullCalendar('render'); // Required because on some browsers fullCalendar does not dispay correctly when returning to tab
}

function IQXDeepLink(xtype,xdatatable){
	var ob=$('body').data('RequestedObject');
	if (ob){
		if (ob.recordtype==xtype) {
			$('body').removeData('RequestedObject');
			if (ob.recordid){
				if (xdatatable) {
					xdatatable.fnFilter(ob.recordid);
				}
				else {
					var s = '#' + ob.recordid;
					$(s).addClass('requestedObject');
					setTimeout("IQXScrollToElement('" + s + "')", 100); // Scrolling done in timeout because doesn't work when called directly from jquery document ready
				}
				return true;
			}
		}
	}
	return false;
}

function IQXRefreshTab () {
	$(".formbutton").hide();  // Prevents a confusing button effect during the refresh
	//var theTab=$IQXtabs.data('selected.tabs');
	var theTab=$IQXtabs.tabs('option', 'selected');   // jquery ui 1.8.4 behaviour change 
	$IQXtabs.tabs("load",theTab);
}
	
function IQXRefreshBrowser(){
	window.location.reload(true);
}	

function IQXLogout(){
	$.get('IQXLogout.php',null,function(data, textStatus){
			if (data=='Ok') {
				IQXRefreshBrowser();
			} else {
				$(".errormessage").html(data);
			}
	}, "text");	
}

function hideAnyCluetips() {
	$(document).trigger('hideCluetip');
}

function IQXTabSwitchCheck (ui) {
	if ($IQXFormContext && $IQXFormContext.blocktabswitch) {
		alert($IQXFormContext.switchmessage);
		return false;
		}
	$IQXFormContext = null;
	hideAnyCluetips();
	return true;
}

function IQXEnableForm(form,options){
	if ($IQXFormContext) {
		return;
	}
  	var defaults = { 
	  successhandler: IQXRefreshTab,   
	  row: "", 
	  idfieldname: "",
	  idvalue: "",  
	  date:true,
	  dateofbirth:false,
	  time:false,
	  contextform:form,
	  validator:null,
	  wholeformvalidator:null,
	  blocktabswitch:true,
	  loadmessagetarget:null,
	  errortarget:".errormessage",
	  switchmessage:"You are currently editing data. Please Save or Undo before switching.", 
	  responsetype:null
     }; 
    options = $.extend(defaults, options); 
	var context=form;
	if (options.row){
		context=options.row;
		$(options.row).gridrowedit("create",{
			idfieldname: options.idfieldname,
			idvalue: options.idvalue
		});
		}
	$(".formbutton",context).show();
	$(".nonformbutton").hide();
	$("input:not(.qmultisummary,.multiSelect)",context).removeAttr("readonly");
	$(":checkbox",context).removeAttr("disabled");
	$(":radio",context).removeAttr("disabled");
	$("select",context).removeAttr("disabled");
	if (options.date) {
		$("input.date", context).datepicker({dateFormat: 'dd/mm/yy', firstDay: 1});
		$("input.longdate", context).datepicker({dateFormat: 'D dd/mm/yy', firstDay: 1});
	}
	if (options.dateofbirth) {
		$("input.dateofbirth", context).datepicker({dateFormat: 'dd/mm/yy', yearRange: '-80:-10', firstDay: 1});
	}
	if (options.time){
		$("input.time", context).clockpick({ starthour:0,endhour:23,military:true,minutedivisions:12 });	
	}
	$IQXFormContext=options;
	$IQXFormContext.validator=$(form).validate({
		submitHandler: function(frm){
			    if ($IQXFormContext.wholeformvalidator) {
					var err=$IQXFormContext.wholeformvalidator();
					if (err){
						$($IQXFormContext.errortarget).html(err);
						return;	
					}
				}
				$($IQXFormContext.errortarget).html("");
				if ($IQXFormContext.loadmessagetarget) {
					$($IQXFormContext.loadmessagetarget).html(IQXLoadMessage());
				}
				if ($IQXFormContext.responsetype) {
					$(frm).ajaxSubmit({
						success: function(data, textStatus){
							if (textStatus == 'success') {
								$IQXFormContext = null;
								options.successhandler(data,textStatus);
								$(".nonformbutton").show();
							}
							else {
								if ($IQXFormContext.loadmessagetarget) {
									$($IQXFormContext.loadmessagetarget).text('');
								}
								$($IQXFormContext.errortarget).html('Error: '+textStatus);
							}
						},
						dataType: $IQXFormContext.responsetype
					});
				}
				else {   // Default method where the error message is in the text of the response data
					$(frm).ajaxSubmit({
						success: function(data, textStatus){
							if (data == 'Ok') {
								$IQXFormContext = null;
								options.successhandler();
								$(".nonformbutton").show();
							}
							else {
								if ($IQXFormContext.loadmessagetarget) {
									$($IQXFormContext.loadmessagetarget).text('');
								}
								$($IQXFormContext.errortarget).html(data);
							}
						},
						dataType: "text"
					});
				}
			}
		});
}
	
function IQXDisableForm(){
	if ($IQXFormContext) {
		if ($IQXFormContext.date) {
			$("input.date").datepicker("destroy");
			$("input.longdate").datepicker("destroy");
		}
		$IQXFormContext.validator.resetForm();
		$("input", $IQXFormContext.contextform).attr("readonly", "readonly");
		$(":checkbox",$IQXFormContext.contextform).attr("disabled","disabled");
		$(":radio",$IQXFormContext.contextform).attr("disabled","disabled");
		$("select", $IQXFormContext.contextform).attr("disabled", "disabled");
		$("input.multiSelect", $IQXFormContext.contextform).multiSelectOptionsHide();
		$("div.multiSelectOptions", $IQXFormContext.contextform).multiSelectUpdateSelected();
		$(".formbutton").hide();
		$(".nonformbutton").show();
		$($IQXFormContext.errortarget).html("");
		if ($IQXFormContext.row) {
			$($IQXFormContext.row).gridrowedit("destroy");
			$("td.tickable", $IQXFormContext.row).tickable();
			$("button", $IQXFormContext.row).mouseoverclass();
		}
		$(".qmultientry",$IQXFormContext.contextform).hide();
		$(".qanswer",$IQXFormContext.contextform).questionsummarise();
		$IQXFormContext = null;
	}
}

function IQXopenInNewWindow(href) {
	var newWindow = window.open(href, '_blank');
	newWindow.focus();
}
	
function IQXUpperCase(c){
 	if ((c > 0x60) && (c < 0x7B)) {
 		c = c - 0x20;
 		}
 	return c;
}

function IQXLoadMessage(mess) {
	if (mess==undefined){
		mess='Loading...';
	}
	return '<p class="loadmessage"><img src="css/images/loading.gif" alt=" " /> '+mess+'</p>';
}

function IQXErrorMessage(mess) {
	if (mess) {
		return '<span class="errormessage">' + mess + '</span>';
	} else {
		return '';
	}
}

function IQXChain(target,options){
  	 var defaults = { 
	  action: "",   // func, send or load
	  url: "",     // One of url, service, job or proc must be specified for a send
	  service: "", 
      job: "",  
      proc: "",
	  page: "",   // Used by load
	  func: null,   // Used by func
	  postdata: null,
	  nextlink: null,
	  failFunc: null  // If a send fails this func will be called
     }; 
     options = $.extend(defaults, options); 
	 if (!options.action){
	 	return;
	 }
	 if (options.action == 'func') {
	 	if (!(options.func()==false)){    // The function can break the chain by returning false
			IQXChain(target,options.nextlink);
		}
	 }
	 else if (options.action == 'load') {
	 	if (target) {   // Can't load if target not specified
			$(target).html(IQXLoadMessage());
			$(target).load('IQXPage.php?page=' + options.page, options.postdata, function(){
				IQXChain(target, options.nextlink);
			});
		}
	 }
	 else if (options.action == 'send') {
		var fChainMessage=function(sMess,bErr){  
		 	if (target){
				$(target).html(sMess);
				return false;
			} else {
				if (bErr){  // If no target we use dialogs
					return IQXUIDialog(sMess,{title:'Error',xDlgType:'Ok'});
				} else {
					return IQXUIDialog(sMess);
				}
			}
		};
	 	var dlgMess = fChainMessage(IQXLoadMessage('Processing...'));
	 	var url = "IQXPost.php?";
	 	if (options.url) {
	 		url = options.url;
	 	}
	 	else 
	 		if (options.service) {
	 			url = url + 'service=' + options.service;
	 		}
	 		else 
	 			if (options.job) {
	 				url = url + 'job=' + options.job;
	 			}
	 			else 
	 				if (options.proc) {
	 					url = url + 'proc=' + options.proc;
	 				}
	 	$.post(url, options.postdata, function(data){
	 		if (dlgMess) {
	 			IQXcloseUIdialog(dlgMess);
	 		}
	 		if (data == 'Ok') {
	 			IQXChain(target, options.nextlink);
	 		}
	 		else {
	 			fChainMessage(IQXErrorMessage(data), true);
				if (typeof(options.failFunc)=='function') options.failFunc();
	 		}
	 	}, "text");
	 }
}

function IQXNearestAncestor(theNode,ancType){
	theNode=theNode.parentNode;
	ancType=ancType.toUpperCase();
	while (theNode != null){
		if (theNode.nodeName.toUpperCase()==ancType){
			return theNode;
		}
		theNode=theNode.parentNode;
	}
	return null;
}

function IQXScrollToElement(theElement){
// theElement can be a DOM element or a jQuery selector string
  if (typeof(theElement)=='string'){
  	 theElement=$(theElement).get(0);
  }
  if (theElement){
  	 theElement.scrollIntoView();
  }
}

// Cookie functions - from Quirksmode
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";  // No expiry = Session cookie
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
// End of Quirksmode cookie functions


// Graphing stuff

function UKtoJSdate(sUKDate) {
	var ix=sUKDate.indexOf(' ');
	if (ix>=0){
		sUKDate=sUKDate.substr(ix+1);
	}
	var datAr=sUKDate.split(/\//);
	var dat=new Date(datAr[2],datAr[1]-1,datAr[0]);
	return dat.getTime();
}

function makeFlotData(table,timeColumn,dataSeries) {
	var colheads=new Array();
	$('thead tr th',table).each(function(i){
		colheads[i]=$(this).text();
	});
	var timeColumnNo=$.inArray(timeColumn,colheads);
	if (timeColumnNo<0){
		return;
	}
	for (var i in dataSeries){
		dataSeries[i].data=new Array();
		dataSeries[i].tdIX=$.inArray(dataSeries[i].label,colheads);
	}
	$('tbody tr',table).each(function(i){
		var tds=$('td',this);
		var dt=UKtoJSdate($(tds.get(timeColumnNo)).text());
		if (dt){
			for (var i in dataSeries) {
				var j = dataSeries[i].tdIX;
				if (j >= 0) {
					dataSeries[i].data.push([dt, parseFloat($(tds.get(j)).text())]);
				}
			}
		}
	});
	return dataSeries;
}

function getDayDate(dt){  // Whole days since 1/1/70 from javaScript date
    var d=dt.getTime() - dt.getTimezoneOffset() * 60 * 1000;
	return Math.floor(d / (24 * 60 * 60 * 1000));
}	
	
function makeGraphableDateTime(s,defDays,defHours){
	if (s) {
		var re = /[a-z]*\s*(\d+)\/(\d+)\/(\d+)(\s+(\d+)\:(\d+))?/i;
		var ar = re.exec(s);
		if (ar) {
			var noTime=(typeof(ar[6])=='undefined' || ar[6].length==0);
			var dt = noTime ? new Date(ar[3], ar[2]-1, ar[1]) : new Date(ar[3], ar[2]-1, ar[1], ar[5], ar[6]);
			return {
				dayDate: getDayDate(dt),
				realHours: noTime ? defHours : dt.getHours() + dt.getMinutes() / 60
			}
		}
	}
	return {dayDate:defDays, realHours:defHours};
}		
	
function FlotTimeTickGenerator(axis) {
    var res = [];
	var lab;
	for(var i=Math.round(axis.min);i<=axis.max;i++) {
	  lab = i % 2 == 0 ? '' : i + ':00';
      res.push([i, lab]);
    } 
    return res;
  }
  
function makeFlotDateAxis(startDate,numDays) {
    var Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var res = [];
	var lab;
	for(var i=0;i<numDays;i++) {
	  var d = new Date((startDate+i)*24 * 60 * 60 * 1000);
	  lab = Days[d.getDay()]+' '+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
      res.push([numDays-(i+1), lab]);
    } 
    return res;
  }

function makeFlotDiaryData(table,classColumn,fromColumn,toColumn,startDate,numDays){
	var colheads=new Array();
	$('thead tr th',table).each(function(i){
		colheads[i]=$(this).text();
	});
	var classColumnNo=$.inArray(classColumn,colheads);
	var fromColumnNo=$.inArray(fromColumn,colheads);
	var toColumnNo=$.inArray(toColumn,colheads);
	if (classColumnNo<0 || fromColumnNo<0 || toColumnNo<0){
		return;
	}
	var ar=[];
	var minLimit=startDate;
	var maxLimit=startDate+numDays-1;
	$('tbody tr',table).each(function(i){
		var tds=$('td',this);
		var cls=$(tds.get(classColumnNo)).text();
		var dfrom=makeGraphableDateTime($(tds.get(fromColumnNo)).text(),maxLimit+1,0);
		var dto=makeGraphableDateTime($(tds.get(toColumnNo)).text(),maxLimit+1,24);
		for (var x=Math.max(dfrom.dayDate,minLimit); x<=Math.min(dto.dayDate,maxLimit); x++){
			var nfrom = x==dfrom.dayDate ? dfrom.realHours : -1;
			var nto = x==dto.dayDate ? dto.realHours : 25;
			var ndate = (numDays-1) + (minLimit-x);
			ar.push({dataClass:cls, data:[nto,ndate,nfrom]});
		}
	});	
	return ar;
}

function extractFlotDiaryDataClass(ar,cls){
	var res=[];
	for (var i in ar){
		if (ar[i].dataClass==cls){
			res.push(ar[i].data);
		}
	}
	return res;
}

// End of graphing stuff

// Dialogs

function IQXcloseUIdialog(dlg){
	dlg=dlg || ((typeof(IQXActiveUIDialog)=='undefined') ? false : IQXActiveUIDialog);  // If dlg not provided use the global variable
	if (!dlg) return;
	if ($(dlg).data('iqxDlgIsClosing')) return;  // Prevent recursion
	$(dlg).data('iqxDlgIsClosing',true);
	$(dlg).dialog('close');
	$(dlg).dialog('destroy');
	$(dlg).remove();
}
	
function IQXUIDialog(sContent,oOptions,fCallback,fOtherCallback){
	//options: xDlgType:YesNo/OkCancel/Ok/Close (or omit and specify buttons object directly), 
	//modal:true/false, title, xDlgTimeout, any ui dialog options 
    if (typeof(fCallback)!='function'){
		fCallback=function(){};
	}
    if (typeof(fOtherCallback)!='function'){   // Called when press No or Cancel. Also x in corner and timeout 
		fOtherCallback=function(){};
	}
	var fClose=function(){IQXcloseUIdialog(this);fOtherCallback();};
	var fCloseAndCallback=function(){IQXcloseUIdialog(this);fCallback();};
	var sDlg='<div>'+sContent+'</div>';
	var oDefaults={close: fClose,
					xDlgType: '',
					xDlgTimeout: 0
					};
    oOptions = $.extend(oDefaults, oOptions);
	if (oOptions.xDlgType == 'YesNo') {
		oOptions.buttons = {
			'No': fClose,
			'Yes': fCloseAndCallback
		}
	}
	else 
		if (oOptions.xDlgType == 'OkCancel') {
			oOptions.buttons = {
				'Cancel': fClose,
				'Ok': fCloseAndCallback
			}
		}
		else 
			if (oOptions.xDlgType == 'Ok') {
				oOptions.buttons = {
					'Ok': fCloseAndCallback
				}
			}
			else 
				if (oOptions.xDlgType == 'Close') {
					oOptions.buttons = {
						'Close': fCloseAndCallback
					}
				}
	IQXActiveUIDialog=$(sDlg).dialog(oOptions);  // assign to global var
	if (oOptions.xDlgTimeout){
		setTimeout("IQXcloseUIdialog()",oOptions.xDlgTimeout);
	}
	return IQXActiveUIDialog;
}

// End of dialogs



//NATIVE ADDITIONS 

var personnamestring ;
var clientnamestring ;

$(document).ready(function(){

	// Native Make live 21 May 2012
	//if(window.location.search.indexOf("staging") > -1 )
	//{
		// Load the custom welcome page
		//$('#tabcontent-1').load('main_genevahealth.html');

		$('#divheading').load('gh_welcome_client_header.html',initBanner);

  	 			
		if ($('#divheading h3:contains("Candidate")').get(0))
		{
   			
			$('#tabcontent-1').load('gh_welcome_candidate_body.html');		
			var candidate = $('#divheading h3').html();
			
			personnamestring = candidate.substring(21,candidate.length);
						
			$('#divheading').load('gh_welcome_candidate_header.html',setnamescandidate);				

			
		}
		else if ($('#divheading h3:contains("Client")').get(0))
		{
			$('#tabcontent-1').load('gh_welcome_client_body.html');
   			
		
			var client = $('#divheading h3').html();
			if(client){
				comma = client.indexOf(",",0);
				personnamestring = client.substring(18,comma);
				clientnamestring = client.substring(comma+2,client.length);			
				$('#divheading').load('gh_welcome_client_header.html',setnamesclient);
			}
			
				
			
		}
		else // agency
		{
			$('#tabcontent-1').load('gh_welcome_agency_body.html');
   			
		
			var client = $('#divheading h3').html();
			if(client){
				// to remove
				//client = "Agency Portal for Maria Finnegan";
				comma = client.indexOf(",",0);
				if(comma == -1) 
				{
					personnamestring = client.substring(18,client.length);
					clientnamestring = "";
				}
				else
				{
					personnamestring = client.substring(18,comma);
					clientnamestring = client.substring(comma+2,client.length);	
				}
		
				$('#divheading').load('gh_welcome_agency_header.html',setnamesclient);
			}
			
				
			
		}

	//};
	function setnamesclient()
	{
		$('#personname').html(personnamestring);
		if(clientnamestring != "")
		{
			$('#clientname').html("- " + clientnamestring);
		}
		else
		{
		 	$('#clientname').html("");	
		}

	}
	function setnamescandidate()
	{
		$('#personname').html(personnamestring);
		
	}

	function initBanner()
	{
		$('#personname').html('');
		$('#clientname').html('');

		
	}


});
function testchangepassword()
{

	//debugger;
	$("#frmclicontact").hide();
	IQXChain('#test1',{action:'load',page:'changepassword'});
	//StartChangePassword();

}

//NATIVE ADDITIONS 


function StoreDateChange(Prefix){
	// store current filter dates

	if(Prefix=='Vac'){var DefaultDataSet='CurrentRequirements'};
	if(Prefix=='PT'){var DefaultDataSet='CurrentTimesheets'};
	if(Prefix=='TS'){var DefaultDataSet='HistoricTimesheets'};
	if(Prefix=='TE'){var DefaultDataSet='PreviousTemps'};
	
	var StartVal=$('#'+Prefix+'FilterStart').val();
	var EndVal=$('#'+Prefix+'FilterEnd').val();
	var SearchString=$('#'+Prefix+'SearchString').val();
	var SampleSize=$('#'+Prefix+'SampleSize').val();

	$.data(document.body,DefaultDataSet,{Start:StartVal,End:EndVal,Search:SearchString,Sample:SampleSize});
}

