/**
 * @author user
 */
 
 
function diag(t,e){
	return true;
}

function csvToArray(s){  // s must contain well formed CSV 
	var ar1=s.split("\n");
	var ar2=[];
	var bErrReported=false;
	for (var x in ar1) {
		if (ar1[x]) {
			try {
				var ar3=$.parseJSON('['+ar1[x]+']');
				ar2.push(ar3);
			} 
			catch (e) {
				if (!bErrReported) {
					alert('CSV error on line ' + (++x));
					bErrReported=true;
				}
			}
		}
	}
	return ar2;
}

function arrayToTable(ar,aCols,oSelection){   
// ar is a 2D array with the first row containing the headings
// aCols is an array containing the column titles either as simple strings or as objects of form {sTitle:"",sClass:""}
// If provided, the contents of sClass are put in the class attributes of all td and th elements for table
	var aColNos=[];
	function makeRow(sTag,nRow){
		var rv='<tr>';
		for (var x in aColNos){
			var xcol=aColNos[x].nColumn;
			var xclass=aColNos[x].sClass;
			rv+='<'+sTag+xclass+'>'+ar[nRow][xcol]+'</'+sTag+'>';
		}
		rv+='</tr>';
		return rv;
	}
	function passesSelection(sValue,xSelection,nRow){
		if (typeof(xSelection)=='function'){
			return xSelection(sValue,ar[nRow],ar[0]);  // Pass in the row and the title row so that multi-column criteria can be used based on column titles
		} else {
			return (sValue==xSelection);
		}
	}
	var aSelections=[];
	var aTitles=ar[0];
	for (var x in aCols){
		if (typeof(aCols[x])=='string'){
			var xtitle=aCols[x];
			var xclass='';
		} else {
			var xtitle=aCols[x].sTitle;
			var xclass=aCols[x].sClass;
		}
		var xcol=$.inArray(xtitle,aTitles);
		if (xclass) {
			xclass=' class="'+xclass+'"'
		} else {
			xclass='';
		}
		if (xcol>=0){
			aColNos.push({
				"nColumn":xcol,
				"sClass":xclass
			});
			}
		}
	for (var x in oSelection){
		var xcol=$.inArray(x,aTitles);
		if (xcol>=0){
			aSelections.push({
				"nColumn": xcol,
				"xSelection": oSelection[x]
			});
			}
		}
	var rv='<table><thead>'+makeRow('th',0)+'</thead><tbody>'
	for (var nRow in ar){
		if (nRow>0){  // Row 0 is header
		    var bIn=true;
			for (var nSel in aSelections) {
				bIn=bIn && passesSelection(ar[nRow][aSelections[nSel].nColumn],aSelections[nSel].xSelection,nRow);
			}
			if (bIn) {
				rv += makeRow('td', nRow);
			}
		}
	}
	rv+='</tbody></table>';
	return rv;
}

//		var ar=csvToArray(s);
//		$('#someTbl').html(arrayToTable(ar,["Line","Digit"],{"No.":"2"}));


