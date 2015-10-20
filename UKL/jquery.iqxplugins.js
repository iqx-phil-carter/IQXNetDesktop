/**
 * @author Michael Scott
 */

function IQXIsValidTime(t){
	return /^([01][0-9]|2[0-3])(:)([0-5][0-9])$/.test(t);
	}

function IQXIsValidUKDate(t){
	return /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/.test(t);
	}

function IQXIsValidLongUKDate(t){              // Includes day of week
	return /^([a-zA-Z]*\s*)?(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/.test(t);
	}
	
function IQXIsValidNI(n){						// Valid NI number - XX 99 99 99 X
	return /^[A-Z][A-Z][0-9][0-9][0-9][0-9][0-9][0-9][A-Z]$/i.test(n);
	}

function IQXIsValidUTR(n){						// Valid Unique Tax Reference number - 9999999999
	return /^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test(n);
	}

function IQXIsValidSortCode(n){						// Valid Bank Sort number - 99-99-99
	return /^[0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/.test(n);
	}

function IQXIsValidBankAccount(n){						// Valid Bank Account number - 99999999
	return /^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test(n);
	}

function IQXIsValidMaskedBankAccount(n){						// Valid Bank Account number - 99999999 or ******99
	return /^[;*0-9][;*0-9][;*0-9][;*0-9][;*0-9][;*0-9][0-9][0-9]$/.test(n);
	}

function IQXIsValidPhoneNumberFive(n){						// Valid Phone number - 09999 99999
	return /^0[0-9][0-9][0-9][0-9] [0-9][0-9][0-9][0-9][0-9]$/.test(n);
	}

function IQXIsValidPhoneNumberSix(n){						// Valid Phone number - 09999 999999
	return /^0[0-9][0-9][0-9][0-9] [0-9][0-9][0-9][0-9][0-9][0-9]$/.test(n);
	}

function IQXIsValidPostCodeTwo(n){							// Valid Post Code - two character outbound
	return /^[a-zA-Z][1-9] [0-9][a-zA-Z][a-zA-Z]$/.test(n);
	}

function IQXIsValidPostCodeThree(n){							// Valid Post Code - four character outbound
	return /^[a-zA-Z][a-zA-Z1-9][a-zA-Z1-9] [0-9][a-zA-Z][a-zA-Z]$/.test(n);
	}

function IQXIsValidPostCodeFour(n){							// Valid Post Code - four character outbound
	return /^[a-zA-Z][a-zA-Z1-9][a-zA-Z1-9][a-zA-Z1-9] [0-9][a-zA-Z][a-zA-Z]$/.test(n);
	}

(function($){  

  $.validator.addMethod("time", function(value, element) { 
  		return this.optional(element) || IQXIsValidTime(value); 
		}, "Please enter a valid 24 hour time");

  $.validator.addMethod("longdate", function(value, element) { 
  		return this.optional(element) || IQXIsValidLongUKDate(value); 
		}, "Please enter a valid date");
		
  $.validator.addMethod("dateofbirth", function(value, element) { 
  		return this.optional(element) || IQXIsValidUKDate(value); 
		}, "Please enter a valid date in the format dd/mm/yyyy");

  $.validator.addMethod("date", function(value, element) {         // Recent javascript versions do proper date validation which rules out uk dates, so over-ride the default functionality
  		return this.optional(element) || IQXIsValidUKDate(value); 
		}, "Please enter a valid date in the format dd/mm/yyyy");

  $.validator.addMethod("nosurrroundingspace", function(value, element) {
  		return this.optional(element) || ( value == $.trim(value) ); 
		}, "Leading or trailing spaces not allowed");
		
  $.validator.addMethod("safepassword", function(value, element) {
  		return this.optional(element) || (digitalspaghetti.password.totalscore > digitalspaghetti.password.options.scores[0] ); 
		}, "This password is too weak");

  $.validator.addMethod("validNiNumber", function(value, element) {
		return this.optional(element) || (IQXIsValidNI(value) ); 
		}, "Please use 'XX999999X' format for NI number");
  
  $.validator.addMethod("validSortCode", function(value, element) {
		return this.optional(element) || (IQXIsValidSortCode(value) ); 
		}, "Please use '99-99-99' format for Sort Code");
  
  $.validator.addMethod("validBankAccountNumber", function(value, element) {
		return this.optional(element) || (IQXIsValidMaskedBankAccount(value) ); 
		}, "Please use '99999999' format for Bank Account");
  
  $.validator.addMethod("validUTRNumber", function(value, element) {
		return this.optional(element) || (IQXIsValidUTR(value) ); 
		}, "Please use '9999999999' format for UTR Number");

  $.validator.addMethod("validPhoneNumber", function(value, element) {
		return this.optional(element) || (IQXIsValidPhoneNumberFive(value)|| IQXIsValidPhoneNumberSix(value) ); 
		}, "Please use '09999 999999' format for Phone Number");

  $.validator.addMethod("validPostCode", function(value, element) {
		return this.optional(element) || (IQXIsValidPostCodeTwo(value) || IQXIsValidPostCodeThree(value) || IQXIsValidPostCodeFour(value) ); 
		}, "Please use 'XX99 9XX' format for Post Code");
  
  $.fn.mouseoverclass = function(){
  	return this.each(function(){
  		var obj = $(this);
		obj.removeClass("mouseover");
		obj.mouseover(function () {
      		$(this).addClass("mouseover");
    	});
		obj.mouseout(function () {
      		$(this).removeClass("mouseover");
    	});
  	});
  };
  
  $.fn.fixdecimal = function(dp){   // Does not work correctly for dp=0
  	return this.each(function(){
  		var obj = $(this);
		var x = obj.text();
		var i = x.indexOf('.')+1;
		var l = x.length;
		if (l > 0) {
			if ((i > 0) && ((l - i) > dp)) {
				x = x.substring(0, i + dp);
				l = x.length;
			}
			if (i <= 0) {
				x = x + '.';
				i = l;
			}
			var z = dp - (l - i);
			while (z > 0) {
				x = x + '0';
				z = z - 1;
			}
			obj.text(x);
		}
  	});
  };

  $.fn.totalcolumn = function(tdid,dp){
  	var tot=0;
  	var rv = this.each(function(){
  		var x = +($(this).text());
		if (x){
			tot = tot + x;
			}
		});
	$(tdid).text(tot);
	if (!(dp==undefined)){
		$(tdid).fixdecimal(dp);
	}
	return rv;
	};

  $.fn.tickable = function(){
  	return this.each(function(){
  		var obj = $(this);
		if (obj.find("button").length == 0) {
			var ticked = "";
			var icon = " ui-icon-minus";
			if (obj.text() == "1") {
				ticked = " ticked";
				icon = " ui-icon-check";
			};
			//obj.html('<button type="button" class="tickable' + ticked + '" />');
			obj.html('<button type="button" class="tickable' + ticked + '" ><span  class="ui-icon' + icon + '" /></button>');
		}
		if (!obj.hasClass("locked")) {
			obj.children("button").click(function(){
				//$(this).toggleClass("ticked");
				$(this).toggleClass("ticked").find('span').toggleClass('ui-icon-check').toggleClass('ui-icon-minus');
			});
		}
		obj.children("button").focus(function () {
      		$(this).trigger("blur");    // We don't want an unsightly focus rectangle spoiling the appearance
    	});
  	});
  };

  $.fn.statebutton = function(states,attrs){
  	if (attrs==undefined) attrs='';
  	return this.each(function(){
  		var obj = $(this);
		if (obj.find("button").length == 0) {
			var txt = obj.text();
			obj.html('<button type="button" class="statebutton" '+attrs+'>'+ txt + '</button>');
			obj.children("button").data('states',states);
		}
		if (!obj.hasClass("locked")) {
			obj.children("button").click(function(){
				var states=$(this).data('states');
				var txt=$(this).text();
				var i=$.inArray(txt,states)+1;
				if (i>=states.length) i=0;
				$(this).text(states[i]);
			});
		}
		obj.children("button").focus(function () {
      		$(this).trigger("blur");    // We don't want an unsightly focus rectangle spoiling the appearance
    	});
  	});
  };

  $.fn.gridcelledit = function(idsplitter){
     return this.each(function() {
	  	var obj = $(this);
		var id = obj.attr("id");
		var cls = obj.attr("class");
		var ar = id.split(idsplitter);
		if (ar.length >= 2) {
    		var w = obj.width();
    		var h = obj.height();
			var val = obj.text(); 
    		obj.css({width: w + "px", height: h + "px", padding: "1px", margin: "1px"});
			obj.html('<input type="text"  name="' + ar[1] + '" value="' + val + 
			'" class="' + cls + '" style="margin:1px 0px 0px 1px;padding:1px;border:single;width: ' + w + 'px;" />');
		}
	  	});  
 };


  $.fn.gridrowedit = function(command,options) {
	 command = command || "create";
	 
  	 if (command=="destroy"){
     	return this.each(function() {  
			var obj = $(this);  
			var oldrow = obj.data("oldrow");
			if (oldrow) {
				obj.html(oldrow);
				obj.removeData("oldrow");
			}
	 	});
	 }  
	 
  	 var defaults = { 
	  idfieldname: "id",
	  idvalue: "", 
      tdclass: "tdeditable",  
      tdidsplitter: "_"  
     };  
     options = $.extend(defaults, options);  
  	
  	 if (command == "create") {
	 	return this.each(function(){
	 		var obj = $(this);
			var id = obj.attr("id");
	 		var oldrow = obj.data("oldrow");
	 		if (!oldrow) {
	 			oldrow = obj.html();
	 			obj.data("oldrow", oldrow);
				obj.prepend('<input type="hidden" id="' + id+'_hiddenid' + '" name="' + options.idfieldname + '" value="' + options.idvalue + '" />');
	 			obj.find("td." + options.tdclass).gridcelledit(options.tdidsplitter);
	 		}
	 	});
	 }
	  
  };  
  
  function nodeOwnText(n){  //jQuery text() returns amalgamated text of all descendents which we don't always want
  	var nlist=$.grep(n.childNodes, function(x) {
               return x.nodeType == 3;
            });
	if (nlist.length){
		return nlist[0].nodeValue;
	} else {
		return '';
	}
  }
  
  $.fn.questionsummarise = function(){
     return this.each(function() {
	  	var summary = $(this).find("input.qmultisummary");
		if (summary) {
			var s = '';
			var comma='';
			$(this).find("div.qmultientry :checked").each(function(){
				s=s+comma+nodeOwnText(this.parentNode);
				comma=', ';
			});
			$(this).find("div.qmultientry :selected").each(function(){
				var v=nodeOwnText(this);
				if (v) {
					s = s + comma + nodeOwnText(this.parentNode.parentNode) + ' ' + v;
					comma = ', ';
				}
			});
			$(this).find("div.qmultientry :text").each(function(){
				var v=$(this).val();
				if (v) {
					s = s + comma + nodeOwnText(this.parentNode)+' '+v;
					comma=', ';
				}
			});
			summary.val(s);
		}
		});
  };
  
  function answernode(n) {
  	n=n.parentNode;
  	while (n!=null) {
		if ($(n).hasClass('qanswer')) {
			return n;		
		}
		n=n.parentNode;
	}
	return null;
  }
  
  $.fn.questionnaire = function(options){
  	 var defaults = {
	 	disabled: false
	 };
     options = $.extend(defaults, options);  
     return this.each(function() {
	  	var obj = $(this);
		$("div.qmultientry",this).hide();
		
		if(options.disabled){
			$("input.qmultisummary",this).addClass('disabled');
		}
		
		$("input.qmultisummary",this).cluetip(function(){return $(this).val();}, 
		  {cluetipClass: 'jtip', cluezIndex: 4000, width: 350, showTitle: false, positionBy: 'bottomTop', onActivate: function(e){return e.context.value;}});
		
		$("input.qmultisummary",this).click(function () {
			var x=$("div.qmultientry:visible",this.parentNode).length;
			$("div.qmultientry",obj).hide();
			$("input.qmultisummary",obj).removeClass('active');
			if (x == 0 && !options.disabled) {
				$("div.qmultientry", this.parentNode).show();
				$(this).addClass('active');
			} 
			$(this).trigger("blur");
    	});
		
		$("div.qmultientry label",this).children().change(function () {
			$(answernode(this)).questionsummarise();
		});
		
		$(".qanswer",this).questionsummarise();
		
		});
  };
  
  $.fn.rowafter = function (options) {
  	 var defaults = { 
	  rowid: "",
	  rowclass: "", 
      divs: [],
	  alldivsclass: "",
	  dataTable: null
	  };  
     options = $.extend(defaults, options);  
	 if (options.alldivsclass!=""){
	 	$.each(options.divs,function(arix){
			options.divs[arix].divclass += ' ' + options.alldivsclass;
		});
	 }
	 var dvs="";
	 for (i in options.divs) {
		dvs=dvs + '<div';
		dvs=dvs + ((options.divs[i].divid) ? ' id="'+options.divs[i].divid+'"' : '');
		dvs=dvs + ((options.divs[i].divclass) ? ' class="'+options.divs[i].divclass+'"' : '');
		dvs=dvs + '></div>';
	 }
     return this.each(function() {
		if (options.dataTable) {
			options.dataTable.fnOpen(this,dvs,options.rowclass);
		}
		else {
 			var colcount=0;
			$('td',this).each(function(){
				colcount=colcount+($(this).attr('colspan') || 1);
			});
			if (colcount==0){return TRUE;}
			var x='<tr';
			x=x + ((options.rowid) ? ' id="'+options.rowid+'"' : '');
			x=x + ((options.rowclass) ? ' class="'+options.rowclass+'"' : '');
			x=x + '><td colspan=' + colcount +'>';
			x=x + dvs + '</td></tr>';
			$(this).after(x);
		}
		});
  };
  
  	// TableTools init overrides
	TableToolsInit.sSwfPath="lib/ZeroClipboard/ZeroClipboard.swf";
	TableToolsInit.sCsvBoundary='"';
  	// End of TableTools init overrides
  
	// dataTables sorting plugins for IQX style dates (UK format with optional day of week and time)
	  
	var iqx_long_date_re = /^[a-z]*\s*(\d+)\/(\d+)\/(\d+)(\s+(\d+)\:(\d+))?/i;
	
	$.fn.dataTableExt.aTypes.unshift(   // Note unshift rather than push because this date format also matches dataTable standard date which evaluates it incorrectly
		function ( sData )
		{
			if (iqx_long_date_re.test(sData))
			{
				return 'iqx_long_date';
			}
			return null;
		} 
	);
	
	$.sortable_iqx_long_date = function(sData){    // Add the function to $ for easy external use
		var ar = iqx_long_date_re.exec(sData);
		if (ar) {
			var noTime = (typeof(ar[6]) == 'undefined' || ar[6].length == 0);
			return (noTime ? Date.UTC(ar[3], ar[2] - 1, ar[1], 0, 0, 0, 0) : Date.UTC(ar[3], ar[2] - 1, ar[1], ar[5], ar[6], 0, 0));
		}
		return 0;
	};
	
	$.fn.dataTableExt.oSort['iqx_long_date-asc']  = function(a,b) {
		return ($.sortable_iqx_long_date(a)-$.sortable_iqx_long_date(b));
	};
	
	$.fn.dataTableExt.oSort['iqx_long_date-desc'] = function(a,b) {
		return ($.sortable_iqx_long_date(b)-$.sortable_iqx_long_date(a));
	};

	// End of dataTables sorting plugins
	
	// dataTables date range feature
	
	$.fn.dataTableExt.aoFeatures.push( {
    	"fnInit": function( oSettings ) {
			var theData=$(oSettings.nTable).data('IQXdtDateFilter');
			if (typeof(theData) == 'undefined') {
				return null;
			}
			var text1 = theData.text1 || 'Between';
			var text2 = theData.text2 || 'and';
			var searchText = theData.searchButtonText || 'Search';
			var theHTML = '<div class="dataTables_dateRange">'
			   +text1+' <input class="dataTables_dateRange_from"/> '
			   +text2+' <input class="dataTables_dateRange_to"/> '
			   +'<button class="fixed dataTables_search">'+searchText+'</button>'
			   +(theData.clearButtonText ? ' <button class="fixed dataTables_clearSearch">'+theData.clearButtonText+'</button>' : '')
			   +'</div>';
			var theDiv=$('body').append(theHTML).children('div.dataTables_dateRange').get(0);
			$('input',theDiv).datepicker({dateFormat: 'dd/mm/yy', firstDay: 1});
			$('button.dataTables_search',theDiv).click(function(){oSettings.oApi._fnReDraw(oSettings);});
			$('button.dataTables_clearSearch',theDiv).click(function(){$('input',theDiv).val('');oSettings.oApi._fnReDraw(oSettings);});
			theData.searchDiv = theDiv;
			return theDiv;
    		},
    	"cFeature": "D",
    	"sFeature": "DateRange"
		} );

	$.fn.dataTableExt.afnFiltering.push(
		function( oSettings, aData, iDataIndex ) {
			var theData=$(oSettings.nTable).data('IQXdtDateFilter');
			if (typeof(theData) === 'undefined') {
				return true;
			}
			var theDiv=theData.searchDiv;
			var theCol1=theData.dateColumn;
			var theCol2=theData.dateColumn2;
			if ( typeof(theDiv) == 'undefined' || typeof(theCol1) == 'undefined' ) {
				return true;
			}
			var sMin = $('input.dataTables_dateRange_from',theDiv).val();
			var sMax = $('input.dataTables_dateRange_to',theDiv).val();
			if (!(sMin || sMax)) {
				return true;
			}
			var dMin = $.sortable_iqx_long_date(sMin);
			var dMax = $.sortable_iqx_long_date(sMax);
			if (dMax && dMax < dMin) {  // Tolerate a backwards range
				var dxx=dMax;
				dMax=dMin;
				dMin=dxx;
			}
			var dCmp1 = $.sortable_iqx_long_date(aData[theCol1]);
			var dCmp2 = typeof(theCol2) == 'undefined' ? dCmp1 : $.sortable_iqx_long_date(aData[theCol2]);
			if (theData.inclusive){  // If inclusive, Data date range must fall entirely within search date range, not just overlap it
				var dxx=dCmp1;
				dCmp1=dCmp2;
				dCmp2=dxx;
			}
			if ( dCmp2 < dMin )
			{
				return false;
			}
			if ( dMax && dCmp1 > dMax )
			{
				return false;
			}
			return true;
		}
	);

	// End of dataTables date range feature
   
})(jQuery);
 
 
