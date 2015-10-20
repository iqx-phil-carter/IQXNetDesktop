<?php
define('TBS_IQX','clsTbsPlugInIQX');
$GLOBALS['_TBS_AutoInstallPlugIns'][] = TBS_IQX; // Auto-install

function f_IQX_GetPair(&$Source,&$Code,&$Description,&$Ticked) {
	$Code='';
	$Description='';
	$Ticked=FALSE;
	if (($i=strpos($Source,']~[')) === FALSE) {
		return FALSE;
	} else {
		$Code=substr($Source,0,$i);
		if (($j=strpos($Source,']~[',$i+3)) === FALSE) {
			$Description=substr($Source,$i+3);
			$Source='';
		} else {
			$Description=substr($Source,$i+3,$j-$i-3);
			$Source=substr($Source,$j+3);
		}
		if (substr($Description,-2) == '\/') {
			$Ticked=TRUE;
			$Description=substr($Description,0,-2);
		}
		return TRUE;
	}
}

class clsTbsPlugInIQX {

function OnInstall() {
	$this->Version = '1.0.0';
	return array('OnOperation');
}

function OnOperation($FieldName,&$Value,&$PrmLst,&$Source,$PosBeg,$PosEnd,&$Loc) {
	if ($PrmLst['ope']!=='iqx') return;
	if (isset($PrmLst['select'])) {
		/* Convert a value of format Code]~[Description]~[Code]~[Description...~[Code]~[Description into an option list for a select tag
		 * One or more descriptions may end with \/ to signify selected
     * Usage [var.selectlist;ope=iqx;select;htmlconv=no]    */
		$xCode='';
		$xDescrip='';
		$xTicked=FALSE;
		$xSource=$Value;
		$xRv='';
		while (f_IQX_GetPair($xSource,$xCode,$xDescrip,$xTicked)) {
			$xSel=$xTicked ? ' selected="selected"' : '';
			$xRv .= "<option value=\"$xCode\"$xSel>$xDescrip</option>\r\n";
		}
		$Value=$xRv;
	} elseif (isset($PrmLst['shortdate'])) {
    /* Get rid of the week day part of a date
     * Usage [var.thedate;ope=iqx;shortdate]    */
    $Value=preg_replace('/[ a-z]*/i','',$Value);
	} elseif (isset($PrmLst['spacetoplus'])) {
    /* For use in URLs
     * Usage [var.thedate;ope=iqx;spacetoplus]    */
    $Value=preg_replace('/[ ]/','+',$Value);
  }
}

}  // End of class clsTbsPlugInIQX

?>